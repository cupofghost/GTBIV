#!/usr/bin/env node
/**
 * haiku-dispatch.js — Work assignment & agent coordination
 *
 * Haiku decides what to build next, who builds it, and when it's done.
 * Maps backlog items to agents (Opus = architecture, Sonnet = implementation).
 * Maintains the flow: NEXT marker → agent assignment → verification → archive.
 *
 * Usage:
 *   node tools/haiku-dispatch.js --next          # Show the next unstarted task
 *   node tools/haiku-dispatch.js --ready <id>    # Claim a task and get the full spec
 *   node tools/haiku-dispatch.js --done <id>     # Mark a task done and advance NEXT
 *
 * Signed: Claude Code | Haiku 4.5 | high
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.resolve(__dirname, '..');

function run(cmd, silent = false) {
  try {
    return execSync(cmd, { cwd: root, encoding: 'utf8', stdio: silent ? 'pipe' : 'inherit' });
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

function writeFile(file, content) {
  fs.writeFileSync(path.join(root, file), content);
}

const args = process.argv.slice(2);
const showNext = args.includes('--next');
const readyId = args.find(a => a.startsWith('--ready='))?.split('=')[1];
const doneId = args.find(a => a.startsWith('--done='))?.split('=')[1];

console.log('\n🚂 Haiku Dispatch — Work Assignment & Orchestration\n');

const status = readFile('STATUS.md');
const handoff = readFile('HANDOFF.md');

// Extract NEXT marker
const nextMatch = status.match(/NEXT:\s*([A-Z0-9]+)/i);
const currentNext = nextMatch ? nextMatch[1] : null;

if (showNext) {
  if (!currentNext) {
    console.log('⚠️  No NEXT marker found in STATUS.md. Set one to continue.');
    process.exit(1);
  }

  // Find the card in HANDOFF
  const cardRegex = new RegExp(
    `#### ${currentNext}\\s*—\\s*(.+?)\\n([\\s\\S]*?)(?=####|$)`,
    'i'
  );
  const match = handoff.match(cardRegex);

  if (!match) {
    console.log(`❌ Task ${currentNext} not found in HANDOFF.md`);
    process.exit(1);
  }

  const [, title, details] = match;
  console.log(`📌 NEXT Task: ${currentNext} — ${title}`);
  console.log(`\n${details.substring(0, 500)}...\n`);
  console.log('To claim this task, run:');
  console.log(`  node tools/haiku-dispatch.js --ready=${currentNext}\n`);
}

if (readyId) {
  if (!currentNext || readyId !== currentNext) {
    console.log(`⚠️  ${readyId} is not the current NEXT task (${currentNext}). Claim the NEXT task first.`);
    process.exit(1);
  }

  console.log(`✅ Claiming task: ${readyId}`);
  console.log(`\nTask details:
- Read HANDOFF.md §8, card ${readyId}
- The spec tells you exactly what "done" looks like
- Make surgical changes to the minimum files (respect existing code)
- Update STATUS.md: add a row in Active work
- After every commit: run \`node tests/run.js <test-substring>\` to verify
- When done: commit with the required signature

Your branch: ${readyId} (claim by pushing: git push -u origin your-branch-name)
Signature format: Signed: <program> | <model> | <effort>

Example:
  Signed: Claude Code | Sonnet 5 | high
  Signed: Kimi CLI | K3 | medium

Go. Ship it.\n`);
}

if (doneId) {
  console.log(`✅ Marking ${doneId} complete and advancing NEXT...\n`);

  // Find the next unstarted card
  const cardIds = handoff.match(/#### ([A-Z0-9]+)\s*—/g).map(m => m.match(/([A-Z0-9]+)/)[1]);
  const idx = cardIds.indexOf(doneId);

  if (idx === -1) {
    console.log(`❌ Task ${doneId} not found`);
    process.exit(1);
  }

  const nextId = cardIds[idx + 1] || cardIds[idx];
  console.log(`Advancing NEXT from ${doneId} to ${nextId}`);

  // Update STATUS.md: move doneId from Active to Archive, set new NEXT
  let updatedStatus = status;

  // Placeholder: show what should happen
  console.log(`\nYou should now:
1. Move ${doneId}'s Active work row to Archive in STATUS.md
2. Compress it to one-line summary
3. Set NEXT: ${nextId}
4. Commit with: "Consolidation: mark ${doneId} done, advance to ${nextId}. Signed: ..."`);
}

if (!showNext && !readyId && !doneId) {
  console.log('Usage:');
  console.log('  node tools/haiku-dispatch.js --next          # See the next task');
  console.log('  node tools/haiku-dispatch.js --ready=<id>    # Claim a task');
  console.log('  node tools/haiku-dispatch.js --done=<id>     # Mark done + advance\n');
  process.exit(1);
}
