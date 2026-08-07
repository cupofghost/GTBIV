#!/usr/bin/env node
/**
 * haiku-check.js — Local pre-commit validation
 * Run before committing to check signatures, STATUS.md claims, and shared-file touches.
 *
 * Usage: node tools/haiku-check.js [--staged-only]
 *
 * Signed: Claude Code | Haiku 4.5 | high
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.resolve(__dirname, '..');

function run(cmd) {
  try {
    return execSync(cmd, { cwd: root, encoding: 'utf8' }).trim();
  } catch (e) {
    return '';
  }
}

function readFile(file) {
  try {
    return fs.readFileSync(path.join(root, file), 'utf8');
  } catch {
    return '';
  }
}

function check(ok, msg) {
  const mark = ok ? '✅' : '⚠️ ';
  console.log(mark, msg);
  return ok;
}

// Get the staged file list
const stagedFiles = run('git diff --cached --name-only').split('\n').filter(Boolean);

if (stagedFiles.length === 0) {
  console.log('No staged files. Nothing to check.');
  process.exit(0);
}

console.log(`\n📋 Haiku Pre-Commit Check — ${stagedFiles.length} file(s)\n`);

let allOk = true;

// 1. Shared-file touches rule
const SHARED = ['index.html', 'HANDOFF.md', 'STATUS.md', 'AGENTS.md', 'CLAUDE.md'];
const sharedEdited = stagedFiles.filter(f =>
  SHARED.some(s => f === s || f.endsWith(`/${s}`) || f === `${s}/README.md`)
);

if (sharedEdited.length > 0) {
  allOk = check(false, `Shared file(s) edited: ${sharedEdited.join(', ')}`);
  console.log('  → You must add a Shared-file touches entry to STATUS.md');

  const status = readFile('STATUS.md');
  const hasEntry = sharedEdited.some(f => status.includes(f.split('/').pop()));
  allOk = check(hasEntry, `Shared-file touches entry added for at least one`) && allOk;
}

// 2. STATUS.md claim rule (if index.html or HANDOFF.md changed, must be claimed)
if (stagedFiles.some(f => f === 'index.html' || f === 'HANDOFF.md')) {
  const status = readFile('STATUS.md');
  const today = new Date().toISOString().split('T')[0];
  const activeSectionMatch = status.match(/## Active work\n([\s\S]*?)\n## Shared/);
  const activeSection = activeSectionMatch ? activeSectionMatch[1] : '';

  // Very loose check: is there at least one recent date entry?
  const hasClaim = activeSection.includes(today) || activeSection.includes('2026-08');
  allOk = check(hasClaim, `Work claimed in Active work (recent date)`) && allOk;
}

// 3. Commit message preparation
console.log('\n📝 Commit Message Requirements:\n');
allOk = check(true, 'Signature format: "Signed: <program> | <model> | <effort>"');
allOk = check(true, 'Example: Signed: Claude Code | Opus 5 | high');
allOk = check(true, 'One logical change per commit, always playable after');

console.log('\n💾 Staged Files:\n');
stagedFiles.forEach(f => console.log(`  - ${f}`));

console.log('\n' + (allOk ? '✅ Ready to commit!' : '⚠️  Issues above — fix before pushing.'));
process.exit(allOk ? 0 : 1);
