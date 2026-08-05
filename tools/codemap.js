#!/usr/bin/env node
'use strict';
// Regenerate index.html's // CODE MAP block from the real section banners.
//
// Why this exists: the map's line ranges go stale the moment anyone inserts
// code, and STATUS.md's Shared-file touches has said since #31 that it "is
// mechanical to regenerate from the section banners; don't hand-edit the
// numbers" — but until now there was nothing to run, so every structural
// session re-derived 60 ranges by hand. That is the single most repeated
// mechanical cost in this repo. It is now one command.
//
//   node tools/codemap.js            # --check: report drift, exit 1 if any
//   node tools/codemap.js --write    # rewrite the block in place
//
// What counts as a section: a banner at column 0 of the form
//   // ================= TITLE =================
// with at least 9 '=' on each side (one banner in the file closes with 9
// rather than 17), excluding the "END ..." markers, which are not sections.
//
// Rows the file hand-maintains are preserved verbatim: any row whose title has
// no banner of its own (HELPERS & GLOBAL STATE, and the nested "└" entries such
// as RADIO TOWERS) is carried through untouched, as is the trailing annotation
// after the size on rows that have one (": queueSave, restoreSave, ...").
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TARGET = path.join(ROOT, 'index.html');
const BANNER = /^\/\/ ={9,} (.+?) ={9,}$/;
const RULE = '// ' + '═'.repeat(77);
const COL = 52;              // column the "(" lands on, matching the existing block

function build(lines) {
  const banners = [];
  lines.forEach((l, i) => {
    const m = l.match(BANNER);
    if (m && !/^END /.test(m[1])) banners.push({ title: m[1], line: i + 1 });
  });
  const span = Object.fromEntries(banners.map((b, i) => [b.title, {
    line: b.line,
    end: banners[i + 1] ? banners[i + 1].line - 1 : lines.length,
  }]));

  const start = lines.findIndex(l => l.startsWith('// CODE MAP —'));
  const first = lines.indexOf(RULE, start);
  const last = lines.indexOf(RULE, first + 1);
  if (start < 0 || first < 0 || last < 0) throw new Error('CODE MAP block not found in index.html');

  const rows = [];
  const seen = new Set();
  for (const row of lines.slice(first + 1, last)) {
    const m = row.match(/^\/\/(\s+└)?\s+(.+?)\s{2,}\((.*)\)\s*$/);
    if (!m) throw new Error('unparsed CODE MAP row: ' + row);
    const title = m[2].trim(), nested = !!m[1], body = m[3];
    const info = span[title];
    if (!info) { rows.push(row); continue; }   // hand-kept row with no banner — leave alone
    seen.add(title);
    const c = body.indexOf(':');
    const ann = c >= 0 ? body.slice(c) : '';
    const range = title === 'START / RESIZE' ? `${info.line}–end` : `${info.line}–${info.end}`;
    rows.push(fmt(title, nested, `${range}, ~${info.end - info.line + 1} lines${ann}`));
  }
  // a banner the map doesn't list yet slots in after the banner above it
  const added = banners.filter(b => !seen.has(b.title));
  for (const b of added) {
    const prev = banners[banners.indexOf(b) - 1];
    const at = prev ? rows.findIndex(r => r.includes(' ' + prev.title + ' ')) : -1;
    const line = fmt(b.title, false, `${b.line}–${span[b.title].end}, ~${span[b.title].end - b.line + 1} lines`);
    if (at < 0) rows.push(line); else rows.splice(at + 1, 0, line);
  }
  return { rows, first, last, added: added.map(b => b.title), sections: banners.length };
}

function fmt(title, nested, body) {
  const label = (nested ? '//   └ ' : '// ') + title;
  return label + ' '.repeat(Math.max(1, COL - label.length)) + '(' + body + ')';
}

function main() {
  const write = process.argv.includes('--write');
  const lines = fs.readFileSync(TARGET, 'utf8').split('\n');
  const { rows, first, last, added, sections } = build(lines);
  const current = lines.slice(first + 1, last);
  const drift = current.length !== rows.length || current.some((l, i) => l !== rows[i]);

  if (!drift) {
    console.log(`CODE MAP up to date — ${sections} sections.`);
    return;
  }
  if (!write) {
    console.error(`CODE MAP is stale — ${sections} sections in index.html.`);
    for (let i = 0; i < Math.max(current.length, rows.length); i++) {
      if (current[i] !== rows[i]) {
        if (current[i] !== undefined) console.error('  -' + current[i]);
        if (rows[i] !== undefined) console.error('  +' + rows[i]);
      }
    }
    console.error('\nRun: node tools/codemap.js --write');
    process.exit(1);
  }
  lines.splice(first + 1, last - first - 1, ...rows);
  fs.writeFileSync(TARGET, lines.join('\n'));
  console.log(`CODE MAP rewritten — ${sections} sections${added.length ? '; added [' + added + ']' : ''}.`);
}

main();
