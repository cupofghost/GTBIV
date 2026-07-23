#!/usr/bin/env node
'use strict';
// Fast, browser-free syntax gate (W3). Compiles index.html's inline <script>
// and its local (non-vendored) <script src> files with the SAME classic-script
// parse model the browser uses, so a typo fails in well under a second without
// launching Chromium. Compile-only: nothing here ever runs the game code, so a
// clean pass means "it parses", not "it behaves" — the Playwright suite still
// owns behaviour. Exit 0 if everything parses, 1 (with locations) otherwise.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const RESET = '\x1b[0m', GREEN = '\x1b[32m', RED = '\x1b[31m', DIM = '\x1b[2m';

// Vendored/minified deps we don't author — huge and known-good, so skip them.
const SKIP_SRC = new Set(['three.min.js']);

const lineOf = (str, index) => str.slice(0, index).split('\n').length;

// Returns { units: [{label}], problems: [string] }. Pure — no process.exit —
// so run.js can call it as a pre-flight before spinning up server + browser.
function checkSyntax() {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const units = [];   // {label, code, filename, lineOffset} | {label, missing:true}

  // Inline <script>…</script> (the game code). The opening tag here has no
  // attributes, which is exactly how we tell it apart from <script src=…>.
  const inlineRe = /<script>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = inlineRe.exec(html)) !== null) {
    const bodyStart = m.index + m[0].indexOf('>') + 1;
    const startLine = lineOf(html, bodyStart);
    units.push({
      label: `index.html inline <script> (opens at line ${startLine})`,
      code: m[1], filename: 'index.html', lineOffset: startLine - 1,
    });
  }

  // Local <script src="…"> project files (skip remote + vendored).
  const srcRe = /<script\s+[^>]*\bsrc=["']([^"']+)["'][^>]*><\/script>/g;
  while ((m = srcRe.exec(html)) !== null) {
    const src = m[1];
    if (/^https?:\/\//.test(src) || SKIP_SRC.has(src)) continue;
    const p = path.join(ROOT, src);
    if (!fs.existsSync(p)) { units.push({ label: src, missing: true }); continue; }
    units.push({ label: src, code: fs.readFileSync(p, 'utf8'), filename: src, lineOffset: 0 });
  }

  const problems = [];
  for (const u of units) {
    if (u.missing) {
      problems.push(`${u.label}: referenced by <script src> but the file is missing`);
      continue;
    }
    try {
      // Constructing a Script compiles (pre-parses every function body, so a
      // typo nested deep still surfaces) without ever executing it.
      new vm.Script(u.code, { filename: u.filename, lineOffset: u.lineOffset });
    } catch (e) {
      // The stack's head is "<filename>:<line>" (lineOffset already applied),
      // followed by a two-line code frame pointing at the token — far more
      // useful than the bare message, which carries no location.
      const head = e.stack.split('\n');
      const loc = head[0] && head[0].includes(':') ? head[0].trim() : null;
      const frame = head.slice(1, 3).filter(l => l.trim()).map(l => '    ' + l).join('\n');
      problems.push(`${u.label}: ${e.message}` +
        (loc ? `\n    at ${loc}` : '') + (frame ? `\n${frame}` : ''));
    }
  }
  return { units, problems };
}

if (require.main === module) {
  const { units, problems } = checkSyntax();
  if (problems.length) {
    console.log(`${RED}✗ syntax check failed${RESET}`);
    problems.forEach(p => console.log(`  ${p}`));
    process.exit(1);
  }
  console.log(`${GREEN}✓ syntax OK${RESET} ${DIM}(${units.length} script unit(s) parsed)${RESET}`);
  process.exit(0);
}

module.exports = { checkSyntax };
