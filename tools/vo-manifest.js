#!/usr/bin/env node
'use strict';
// Generates js/turbo-vo.js from KIMI_TURBO_VO.md so the recorded-VO index and
// the voice-direction brief can never drift. The brief is the source of truth:
// it carries the line id, the spoken text and the committed filename for every
// one of Kimi's takes, and the mp3s were delivered against those exact paths.
//
//   node tools/vo-manifest.js            check for drift / missing files (exit 1 on either)
//   node tools/vo-manifest.js --write    regenerate js/turbo-vo.js
//
// Never hand-edit js/turbo-vo.js — same rule as the generated CODE MAP.

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const BRIEF = path.join(ROOT, 'KIMI_TURBO_VO.md');
const OUT = path.join(ROOT, 'js', 'turbo-vo.js');

// `| 12 | "...March." | `voice/turbo/.../file.mp3` |` — the brief's one table shape.
const ROW = /^\|\s*(\d+)\s*\|\s*(.+?)\s*\|\s*`([^`]+)`\s*\|\s*$/;
const HEADING = /^##\s+(\d+)\.\s+(.+?)\s*$/;

function parseBrief() {
  const lines = fs.readFileSync(BRIEF, 'utf8').split('\n');
  const out = [];
  let group = null;
  for (const line of lines) {
    const h = HEADING.exec(line);
    if (h) { group = { n: Number(h[1]), title: h[2] }; continue; }
    const m = ROW.exec(line);
    if (!m) continue;
    const [, id, rawText, src] = m;
    // The brief marks three alternate takes with a bold **[ALT]** suffix; the
    // flag belongs on the entry, not in the spoken text.
    const alt = /\*\*\[ALT\]\*\*/.test(rawText);
    const text = rawText.replace(/\*\*\[ALT\]\*\*/g, '').trim().replace(/^"|"$/g, '');
    out.push({
      id: Number(id),
      // The folder the take was delivered into is the pool key the game indexes
      // by (`vestry`, `deb_arrears`, `idle_arrears`, …).
      pool: path.basename(path.dirname(src)),
      section: group ? group.n : 0,
      title: group ? group.title : '',
      text,
      src,
      alt,
    });
  }
  return out;
}

function validate(entries) {
  const problems = [];
  const seen = new Map();
  for (const e of entries) {
    if (seen.has(e.id)) problems.push(`duplicate line id ${e.id} (${e.src})`);
    seen.set(e.id, e);
    if (!fs.existsSync(path.join(ROOT, e.src))) problems.push(`missing audio for #${e.id}: ${e.src}`);
    if (!/^voice\/turbo\/(story|cutscenes)\//.test(e.src)) problems.push(`#${e.id} sits outside voice/turbo: ${e.src}`);
    if (!e.text) problems.push(`#${e.id} has no spoken text`);
  }
  return problems;
}

function render(entries) {
  const pools = new Map();
  for (const e of entries) {
    if (!pools.has(e.pool)) pools.set(e.pool, []);
    pools.get(e.pool).push(e);
  }
  const body = [...pools.entries()].map(([pool, arr]) => {
    const head = `  // §${arr[0].section} ${arr[0].title} — ${arr.length} line${arr.length === 1 ? '' : 's'} (#${arr[0].id}–#${arr[arr.length - 1].id})`;
    const rows = arr.map(e =>
      `    {id:${e.id}, src:${JSON.stringify(e.src)}, text:${JSON.stringify(e.text)}${e.alt ? ', alt:true' : ''}},`);
    return `${head}\n  ${JSON.stringify(pool)}:[\n${rows.join('\n')}\n  ],`;
  }).join('\n');

  return `'use strict';
// GENERATED FILE — do not edit. Regenerate with \`node tools/vo-manifest.js --write\`.
// Source of truth: KIMI_TURBO_VO.md (the voice-direction brief Kimi recorded against).
//
// Every recorded Turbo take from the ${entries.length}-line batch, indexed by the folder it
// was delivered into. Landing the audio and wiring a scene are separate jobs:
// this file is the index, so a pool that has no scene yet is staged here rather
// than lost. \`TURBO_VO.wired\` (below, hand-maintained) records which pools the
// shipped game actually plays.
const TURBO_VO = {
${body}
};

// Pools the shipped game plays today. Everything else in TURBO_VO is recorded
// and staged against chapters that are not implemented yet (SCRIPT.md) — add a
// pool here as its scene lands so the coverage number stays honest.
TURBO_VO.wired = ['bus_pass'];

// Look a take up by its brief id (#1–#241), or pull a whole pool.
TURBO_VO.line = id => {
  for (const k of Object.keys(TURBO_VO)) {
    if (!Array.isArray(TURBO_VO[k])) continue;
    const hit = TURBO_VO[k].find(l => l.id === id);
    if (hit) return hit;
  }
  return null;
};
TURBO_VO.pools = () => Object.keys(TURBO_VO).filter(k => Array.isArray(TURBO_VO[k]) && k !== 'wired');
TURBO_VO.count = () => TURBO_VO.pools().reduce((n, k) => n + TURBO_VO[k].length, 0);

if (typeof window !== 'undefined') window.TURBO_VO = TURBO_VO;
if (typeof module !== 'undefined' && module.exports) module.exports = TURBO_VO;
`;
}

function main() {
  const write = process.argv.includes('--write');
  const entries = parseBrief();
  const problems = validate(entries);
  if (problems.length) {
    console.error(`vo-manifest: ${problems.length} problem(s) in the VO batch:`);
    problems.slice(0, 20).forEach(p => console.error('  ' + p));
    if (problems.length > 20) console.error(`  …and ${problems.length - 20} more`);
    process.exit(1);
  }
  const next = render(entries);
  const prev = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (write) {
    // Keep the hand-maintained `wired` list across regenerations — it is the one
    // line in the generated file that a human owns.
    const keep = /^TURBO_VO\.wired\s*=.*$/m.exec(prev);
    const merged = keep ? next.replace(/^TURBO_VO\.wired\s*=.*$/m, keep[0]) : next;
    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    fs.writeFileSync(OUT, merged);
    console.log(`vo-manifest: wrote js/turbo-vo.js — ${entries.length} lines across ${new Set(entries.map(e => e.pool)).size} pools`);
    return;
  }
  if (!prev) { console.error('vo-manifest: js/turbo-vo.js is missing — run with --write'); process.exit(1); }
  const keep = /^TURBO_VO\.wired\s*=.*$/m.exec(prev);
  const expected = keep ? next.replace(/^TURBO_VO\.wired\s*=.*$/m, keep[0]) : next;
  if (prev !== expected) {
    console.error('vo-manifest: js/turbo-vo.js is stale — run `node tools/vo-manifest.js --write`');
    process.exit(1);
  }
  console.log(`vo-manifest: js/turbo-vo.js is current — ${entries.length} lines, every mp3 present`);
}

main();
