#!/usr/bin/env node
'use strict';
// GTB IV fast syntax check — validates the inline game and all project JS.
// Run before the slow Playwright suite to catch typos immediately.
// Exit code: 0 = clean, 1 = syntax error.

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const INDEX_PATH = path.join(ROOT, 'index.html');

const RESET = '\x1b[0m', GREEN = '\x1b[32m', RED = '\x1b[31m', YELLOW = '\x1b[33m';

function main() {
  const t0 = Date.now();

  console.log(`${YELLOW}●${RESET} GTB IV syntax check\n`);

  // Read index.html and extract the script body
  let html;
  try {
    html = fs.readFileSync(INDEX_PATH, 'utf8');
  } catch (e) {
    console.error(`${RED}✗${RESET} Failed to read index.html: ${e.message}`);
    process.exit(1);
  }

  // Extract the main <script> block (the one with the game logic, not <script src>)
  const scriptMatch = html.match(/<script>\s*'use strict';([\s\S]*?)<\/script>/);
  if (!scriptMatch) {
    console.error(`${RED}✗${RESET} Could not find main <script> block in index.html`);
    process.exit(1);
  }

  const scriptBody = scriptMatch[1];

  // Parse the main inline game body without executing it.
  try {
    new Function(scriptBody);
  } catch (e) {
    const elapsed = Date.now() - t0;
    console.error(`${RED}✗${RESET} Syntax error in index.html (${elapsed}ms):`);
    console.error(`\n  ${e.message}\n`);

    // Try to pinpoint the line by counting newlines up to the error
    if (e.stack) {
      const match = e.stack.match(/line (\d+)/i);
      if (match) {
        const lineNum = parseInt(match[1], 10);
        const lines = scriptBody.split('\n');
        if (lineNum > 0 && lineNum <= lines.length) {
          const line = lines[lineNum - 1];
          console.error(`  Line ${lineNum}: ${line.substring(0, 80)}${line.length > 80 ? '…' : ''}`);
          console.error('');
        }
      }
    }

    process.exit(1);
  }

  // Also parse every external/project JavaScript file. This catches breakage in
  // js/person.js and js/npc-types.js, which the old inline-only check missed.
  const jsFiles = [];
  function collect(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) collect(full);
      else if (entry.isFile() && entry.name.endsWith('.js')) jsFiles.push(full);
    }
  }
  collect(ROOT);

  for (const file of jsFiles) {
    const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
    if (result.status !== 0) {
      console.error(`${RED}✗${RESET} Syntax error in ${path.relative(ROOT, file)}:`);
      console.error(result.stderr || result.stdout);
      process.exit(1);
    }
  }

  const elapsed = Date.now() - t0;
  console.log(`${GREEN}✓${RESET} Syntax OK — inline game + ${jsFiles.length} JavaScript files parsed in ${elapsed}ms\n`);
}

main();
