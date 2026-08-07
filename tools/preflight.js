#!/usr/bin/env node
'use strict';
// Who else is working in this repo right now, and are we about to collide?
//
// Run this BEFORE writing code, every session. It exists because more than one
// Claude/Codex account now works on this game at the same time, and the two
// things that make that safe are already in the repo — they were just manual:
//
//   · DISPATCH/OP2_FINISH/README.md: "The claim commit is the lock. A branch
//     that exists on `origin` is taken."  A claim is only a lock if it is
//     PUSHED, because a local STATUS.md row is invisible to the other account.
//   · AGENTS.md §1.3: the STATUS.md Active-work row says which area you own.
//
// This reads both off `origin` and prints the board. It does not enforce
// anything — it makes the collision visible while it is still cheap.
//
//   node tools/preflight.js
//   node tools/preflight.js --days 14
//   node tools/preflight.js --touching "index.html §WEAPONS, tests/"
//
// Exit code is 1 if --touching overlaps somebody else's live claim, so it can
// gate a script. Plain runs always exit 0.
const { execSync } = require('child_process');

const A = process.argv.slice(2);
const flag = (n, d) => { const i = A.indexOf(n); return i >= 0 && A[i + 1] ? A[i + 1] : d; };
const DAYS = parseInt(flag('--days', '5'), 10);
const TOUCHING = flag('--touching', '');

const C = { dim: '\x1b[2m', red: '\x1b[31m', yellow: '\x1b[33m', green: '\x1b[32m',
            bold: '\x1b[1m', off: '\x1b[0m' };
const sh = (cmd, fallback = '') => {
  try { return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); }
  catch { return fallback; }
};

// The Active-work table is `| date | area | task | signature |`.
function claimRows(ref) {
  const md = sh(`git show ${ref}:STATUS.md`);
  if (!md) return [];
  const out = [];
  for (const line of md.split('\n')) {
    if (!/^\|/.test(line) || /^\|\s*-+/.test(line) || /^\|\s*Date\s*\|/.test(line)) continue;
    const cells = line.split('|').slice(1, -1).map(s => s.trim());
    if (cells.length < 3) continue;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(cells[0])) continue;    // Active work rows start with a date
    out.push({ date: cells[0], area: cells[1], task: cells[2] });
  }
  return out;
}

// Compare an area cell against what you say you're touching. Deliberately
// loose — it should over-warn rather than miss a real collision.
function overlaps(area, touching) {
  const norm = s => s.toLowerCase().replace(/[`*]/g, '');
  const terms = touching.split(/[,;]/).map(t => norm(t).trim()).filter(t => t.length > 2);
  const hay = norm(area);
  return terms.filter(t => hay.includes(t) || t.split(/\s+/).some(w => w.length > 3 && hay.includes(w)));
}

function main() {
  process.stdout.write(`${C.dim}fetching origin…${C.off}\n`);
  sh('git fetch origin --prune --quiet');

  const mine = sh('git rev-parse --abbrev-ref HEAD');
  const cutoff = Date.now() - DAYS * 864e5;
  const baseRows = new Set(claimRows('origin/main').map(r => r.date + r.area));

  const refs = sh("git for-each-ref --format='%(refname:short)|%(committerdate:iso-strict)' refs/remotes/origin/")
    .split('\n').filter(Boolean)
    .map(l => { const [ref, date] = l.split('|'); return { ref, date: new Date(date) }; })
    .filter(r => r.ref !== 'origin/main' && !r.ref.endsWith('/HEAD'))
    .filter(r => r.date.getTime() >= cutoff)
    .filter(r => sh(`git rev-list --count origin/main..${r.ref}`, '0') !== '0')
    .sort((a, b) => b.date - a.date);

  console.log(`\n${C.bold}Live branches${C.off} ${C.dim}(unmerged, touched in the last ${DAYS} days)${C.off}`);
  if (!refs.length) console.log(`  ${C.dim}none — you have the repo to yourself${C.off}`);

  let clash = false;
  for (const { ref, date } of refs) {
    const short = ref.replace(/^origin\//, '');
    const isMine = short === mine;
    const age = Math.round((Date.now() - date.getTime()) / 36e5);
    const ageStr = age < 24 ? `${age}h ago` : `${Math.round(age / 24)}d ago`;
    const label = isMine ? `${C.green}${short}${C.off} ${C.dim}(you)${C.off}` : `${C.bold}${short}${C.off}`;
    console.log(`\n  ${label}  ${C.dim}${ageStr}${C.off}`);

    const fresh = claimRows(ref).filter(r => !baseRows.has(r.date + r.area));
    if (!fresh.length) { console.log(`    ${C.dim}no STATUS.md claim row — area unknown${C.off}`); continue; }
    // Only open claims can bite you. On someone else's branch the finished rows
    // are just history, so collapse them to a count instead of a wall of text.
    const open = fresh.filter(r => !/\bDONE\b/.test(r.task));
    const shown = isMine ? fresh : open;
    if (!shown.length) {
      console.log(`    ${C.dim}${fresh.length} claim row(s), all marked done${C.off}`);
      continue;
    }
    for (const r of shown) {
      const done = /\bDONE\b/.test(r.task);
      console.log(`    ${done ? C.dim + '[done]' + C.off : C.yellow + '[open]' + C.off} ${r.area}`);
      if (!isMine && !done && TOUCHING) {
        const hits = overlaps(r.area, TOUCHING);
        if (hits.length) {
          clash = true;
          console.log(`      ${C.red}⚠ overlaps what you plan to touch: ${hits.join(', ')}${C.off}`);
        }
      }
    }
  }

  // Is your own branch name already taken by somebody else's work?
  const remoteMine = sh(`git rev-parse origin/${mine}`);
  const localMine = sh('git rev-parse HEAD');
  if (remoteMine && remoteMine !== localMine) {
    const behind = sh(`git rev-list --count HEAD..origin/${mine}`, '0');
    if (behind !== '0') {
      clash = true;
      console.log(`\n  ${C.red}⚠ origin/${mine} has ${behind} commit(s) you don't — another session is on your branch name.${C.off}`);
      console.log(`    ${C.dim}Pull before you push, or move to a branch name nobody else has.${C.off}`);
    }
  }

  const behindMain = sh('git rev-list --count HEAD..origin/main', '0');
  console.log(`\n${C.bold}main${C.off}  ${behindMain === '0'
    ? `${C.green}unchanged since you branched${C.off}`
    : `${C.yellow}${behindMain} commit(s) ahead of you — merge before you open a PR${C.off}`}`);

  if (TOUCHING && !clash) console.log(`\n${C.green}No overlap with anyone's open claim.${C.off}`);
  if (clash) {
    console.log(`\n${C.red}Collision risk.${C.off} Pick a different area, or coordinate before writing code.`);
    console.log(`${C.dim}See AGENTS.md §2a for the shared anchors in index.html that conflict even when git merges cleanly.${C.off}`);
  }
  console.log('');
  process.exit(clash ? 1 : 0);
}

main();
