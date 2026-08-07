#!/usr/bin/env node
/**
 * haiku-overseer.js — Autonomous coordination & compliance checking
 *
 * Post-commit scanning: validate signatures, track backlog/code sync, flag consolidation triggers.
 * Can also be run standalone to audit main or prepare a consolidation.
 *
 * Usage:
 *   node tools/haiku-overseer.js                 # Scan the last 5 commits on current branch
 *   node tools/haiku-overseer.js --scan=main     # Audit the last 20 commits on main
 *   node tools/haiku-overseer.js --consolidation-check  # Dry-run consolidation triggers
 *
 * Signed: Claude Code | Haiku 4.5 | high
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.resolve(__dirname, '..');

function run(cmd, silent = false) {
  try {
    return execSync(cmd, { cwd: root, encoding: 'utf8', stdio: silent ? 'pipe' : 'inherit' }).trim();
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

const args = process.argv.slice(2);
const scanBranch = args.find(a => a.startsWith('--scan='))?.split('=')[1] || '';
const checkConsolidation = args.includes('--consolidation-check');

console.log('\n🧠 Haiku Overseer — Compliance & Coordination Check\n');

// ============ SCAN COMMITS FOR SIGNATURES ============

if (!checkConsolidation) {
  const branch = scanBranch || run('git rev-parse --abbrev-ref HEAD', true);
  const limit = scanBranch ? 20 : 5;
  const range = branch ? `${branch}~${limit}..${branch}` : `HEAD~${limit}..HEAD`;

  console.log(`📜 Scanning ${limit} recent commits on ${branch || 'current branch'}...\n`);

  const logOutput = run(`git log ${range} --pretty="%H|%s|%b" --no-merges`, true);
  const commits = logOutput
    .split('\n\n')
    .filter(Boolean)
    .map(entry => {
      const lines = entry.split('\n');
      const [hash, subject] = lines[0].split('|');
      const body = lines.slice(1).join('\n');
      return { hash: hash.substring(0, 7), subject, body };
    });

  let signedCount = 0;
  let unsignedCount = 0;

  commits.forEach(c => {
    const fullBody = `${c.subject}\n${c.body}`;
    const hasSig = fullBody.match(/Signed:\s*\S+\s*\|\s*\S+\s*\|\s*\w+/i);

    if (hasSig) {
      signedCount++;
      console.log(`✅ ${c.hash} — ${c.subject.substring(0, 50)}`);
    } else {
      unsignedCount++;
      console.log(`⚠️  ${c.hash} — UNSIGNED: ${c.subject.substring(0, 50)}`);
    }
  });

  console.log(`\n📊 Summary: ${signedCount} signed, ${unsignedCount} unsigned\n`);
}

// ============ W1: BACKLOG ↔ CODE SYNC ============

console.log('🔄 W1 Check: Backlog ↔ Code Sync\n');

const handoff = readFile('HANDOFF.md');
const code = readFile('index.html');

// Extract backlog cards (looks for ## Task titles and DONE/OPEN markers)
const cardMatches = handoff.matchAll(/#### ([A-Z0-9]+)\s*—\s*(.+?)\n.*?\*\*Status:\s*(DONE|implemented|OPEN|PARTIAL|DEFERRED)/gis);
const cards = Array.from(cardMatches).map(m => ({
  id: m[1],
  title: m[2],
  status: m[3].toUpperCase()
}));

const syncIssues = [];

cards.forEach(card => {
  // Look for key functions in the code
  const keywordPatterns = {
    'F1': ['queueSave', 'restoreSave'],
    'F2': ['G.menuPaused', 'pauseMenu'],
    'F3': ['QUALITY_TIERS', 'setQualityMode'],
    'F4': ['musicGain', 'musicVODuck'],
    'J1': ['haptic', 'navigator.vibrate'],
    'J2': ['HIT_STOP', 'triggerHitStop'],
    'J3': ['updateCamera', 'cameraCollide'],
    'P1': ['missionTier', 'startMission'],
    'P2': ['addMoney', 'updateStory'],
    'FB3': ['spawnCoach', 'updateCoachMission', 'hurtCoach'],
    'FB4': ['updateTurboBowl', 'startTurboBowl', 'endTurboBowlRun'],
    'U2': ['controlsCard', 'openControlsCard'],
    'R1': ['disposeMesh', 'GPU RESOURCE CLEANUP'],
    'R2': ['spawnTraffic', 'pooling']
  };

  const patterns = keywordPatterns[card.id];
  if (!patterns) return; // No pattern defined for this card

  const found = patterns.filter(p => code.includes(p));
  const allFound = found.length === patterns.length;

  if (card.status === 'DONE' && !allFound) {
    syncIssues.push(`❌ ${card.id} marked DONE but missing: ${patterns.filter(p => !code.includes(p)).join(', ')}`);
  } else if (card.status === 'OPEN' && allFound) {
    syncIssues.push(`⚠️  ${card.id} appears implemented but still marked OPEN`);
  } else if (allFound) {
    console.log(`✅ ${card.id} — code matches status (${card.status})`);
  }
});

if (syncIssues.length > 0) {
  console.log('\nBacklog Drift Issues:');
  syncIssues.forEach(issue => console.log(issue));
} else {
  console.log('✅ No backlog/code drift detected.');
}

// ============ CONSOLIDATION TRIGGERS ============

if (checkConsolidation) {
  console.log('\n🔍 Consolidation Trigger Check\n');

  const status = readFile('STATUS.md');

  // Extract sections
  const activeMatch = status.match(/## Active work\n([\s\S]*?)\n## Shared/);
  const activeSection = activeMatch ? activeMatch[1] : '';
  const activeRows = (activeSection.match(/\|.*\|.*\|.*\|/g) || []).length;

  const sharedMatch = status.match(/## Shared-file touches\n([\s\S]*?)\n## Known/);
  const sharedSection = sharedMatch ? sharedMatch[1] : '';

  const knownMatch = status.match(/## Known issues\n([\s\S]*?)\n(## Archive|$)/);
  const knownSection = knownMatch ? knownMatch[1] : '';

  const lastConsolidation = status.match(/Last consolidation:\s*(\d{4}-\d{2}-\d{2})/);
  const lastDate = lastConsolidation ? new Date(lastConsolidation[1]) : new Date(2020, 0, 1);
  const today = new Date();
  const daysSince = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

  const triggers = [];

  if (activeRows >= 8) {
    triggers.push(`✓ ${activeRows} active entries (threshold: 8)`);
  }

  const sharedFileMatches = sharedSection.match(/- `[\w.]+`/g) || [];
  if (sharedFileMatches.length >= 2) {
    triggers.push(`✓ Multiple shared files touched (${sharedFileMatches.length})`);
  }

  const oldIssues = (knownSection.match(/— \d{4}-\d{2}-\d{2}/g) || []).filter(d => {
    const issueDate = new Date(d.split(' ')[1]);
    return (today - issueDate) / (1000 * 60 * 60 * 24) > 14;
  });
  if (oldIssues.length > 0) {
    triggers.push(`✓ ${oldIssues.length} issues >2 weeks old`);
  }

  console.log(`Last consolidation: ${lastDate.toISOString().split('T')[0]} (${daysSince} days ago)`);
  console.log(`Active work entries: ${activeRows}`);
  console.log(`Shared-file touches: ${sharedFileMatches.length}`);
  console.log(`Known issues >2 weeks: ${oldIssues.length}\n`);

  if (triggers.length === 0) {
    console.log('✅ No consolidation needed yet.');
  } else {
    console.log('🔴 Consolidation recommended:\n');
    triggers.forEach(t => console.log(`  ${t}`));
  }
}

console.log('\n');
