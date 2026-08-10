#!/usr/bin/env node
/**
 * haiku-rewards.js — Multi-agent performance tracking & autonomy rewards
 *
 * Tracks metrics: velocity, efficiency, quality, discipline, reliability.
 * Agents hitting thresholds earn autonomy windows to generate their own prompts.
 *
 * Usage:
 *   node tools/haiku-rewards.js --start-window <name>     # Begin tracking a 5-hour window
 *   node tools/haiku-rewards.js --log <agent> <metric> <value>
 *   node tools/haiku-rewards.js --status                  # Show live standings
 *   node tools/haiku-rewards.js --end-window              # Publish scorecard & unlock rewards
 *
 * Signed: Claude Code | Haiku 4.5 | high
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const rewardsFile = path.join(root, '.haiku-rewards.json');

function run(cmd, silent = false) {
  try {
    return execSync(cmd, { cwd: root, encoding: 'utf8', stdio: silent ? 'pipe' : 'inherit' }).trim();
  } catch (e) {
    return '';
  }
}

function loadRewards() {
  if (!fs.existsSync(rewardsFile)) {
    return { windows: [], current: null, agents: {} };
  }
  return JSON.parse(fs.readFileSync(rewardsFile, 'utf8'));
}

function saveRewards(data) {
  fs.writeFileSync(rewardsFile, JSON.stringify(data, null, 2));
}

const args = process.argv.slice(2);
const startWindow = args.find(a => a.startsWith('--start-window='))?.split('=')[1];
const logMetric = args.find(a => a.startsWith('--log='))?.split('=')[1];
const showStatus = args.includes('--status');
const endWindow = args.includes('--end-window');

console.log('\n🏆 Haiku Rewards — Agent Performance & Autonomy System\n');

const rewards = loadRewards();

// ============ START WINDOW ============
if (startWindow) {
  const windowId = `window-${new Date().toISOString().split('T')[0]}-${startWindow}`;
  console.log(`🚀 Starting window: ${windowId}`);
  console.log('Metrics: velocity, efficiency, quality, discipline, reliability');
  console.log('Reward tiers: Bronze (3/5), Silver (4/5), Gold (5/5), Platinum (5/5 + mentor)\n');

  rewards.current = {
    id: windowId,
    start: new Date().toISOString(),
    end: null,
    agents: {
      'Claude Code': { velocity: [], efficiency: [], quality: [], discipline: [], reliability: [] },
      'Kimi K3': { velocity: [], efficiency: [], quality: [], discipline: [], reliability: [] },
      'Codex GPT-5': { velocity: [], efficiency: [], quality: [], discipline: [], reliability: [] },
      'Sonnet 5': { velocity: [], efficiency: [], quality: [], discipline: [], reliability: [] },
      'Opus 5': { velocity: [], efficiency: [], quality: [], discipline: [], reliability: [] }
    }
  };
  saveRewards(rewards);
  console.log(`Window active. Log metrics with: node tools/haiku-rewards.js --log="<agent>|velocity|8"`);
}

// ============ LOG METRIC ============
if (logMetric) {
  if (!rewards.current) {
    console.log('❌ No active window. Start one with --start-window=<name>');
    process.exit(1);
  }

  const [agent, metric, value] = logMetric.split('|');
  if (!rewards.current.agents[agent]) {
    console.log(`❌ Unknown agent: ${agent}`);
    process.exit(1);
  }

  if (!rewards.current.agents[agent][metric]) {
    console.log(`❌ Unknown metric: ${metric}`);
    process.exit(1);
  }

  rewards.current.agents[agent][metric].push(parseFloat(value));
  saveRewards(rewards);
  console.log(`✅ ${agent} / ${metric} += ${value}`);
}

// ============ STATUS ============
if (showStatus) {
  if (!rewards.current) {
    console.log('No active window.');
    process.exit(0);
  }

  console.log(`Window: ${rewards.current.id}`);
  console.log('Thresholds: velocity ≥7/10, efficiency ≥0.4 tokens/feature, quality ≥95%, discipline ≥95%, reliability ≥95%\n');

  const agents = Object.entries(rewards.current.agents);
  const standings = agents.map(([name, metrics]) => {
    const scores = {
      velocity: metrics.velocity.length > 0 ? Math.min(10, Math.floor(metrics.velocity.reduce((a, b) => a + b) / metrics.velocity.length)) : 0,
      efficiency: metrics.efficiency.length > 0 ? (1 - Math.min(1, metrics.efficiency.reduce((a, b) => a + b) / metrics.efficiency.length)) : 0,
      quality: metrics.quality.length > 0 ? (metrics.quality.reduce((a, b) => a + b) / metrics.quality.length) : 0,
      discipline: metrics.discipline.length > 0 ? (metrics.discipline.reduce((a, b) => a + b) / metrics.discipline.length) : 0,
      reliability: metrics.reliability.length > 0 ? (metrics.reliability.reduce((a, b) => a + b) / metrics.reliability.length) : 0
    };

    const metricsCount = Object.values(scores).filter(s => s > 0.6).length;
    const tier = metricsCount >= 5 ? '💎 Platinum' : metricsCount >= 4 ? '🥇 Gold' : metricsCount >= 3 ? '🥈 Silver' : metricsCount >= 2 ? '🥉 Bronze' : '⚪ Unranked';

    return { name, scores, metricsCount, tier };
  });

  standings.sort((a, b) => b.metricsCount - a.metricsCount);

  standings.forEach(({ name, scores, metricsCount, tier }) => {
    console.log(`${tier} ${name} (${metricsCount}/5 metrics)`);
    Object.entries(scores).forEach(([m, v]) => {
      const bar = '█'.repeat(Math.floor(v * 10)) + '░'.repeat(10 - Math.floor(v * 10));
      console.log(`  ${m}: [${bar}] ${(v * 100).toFixed(0)}%`);
    });
    console.log();
  });

  console.log('Legend: ⚪ Unranked (0-1 metrics) | 🥉 Bronze (3/5) | 🥈 Silver (4/5) | 🥇 Gold (5/5) | 💎 Platinum (5/5 + mentored)');
}

// ============ END WINDOW ============
if (endWindow) {
  if (!rewards.current) {
    console.log('❌ No active window to close.');
    process.exit(1);
  }

  console.log(`📊 Window Scorecard: ${rewards.current.id}\n`);

  const agents = Object.entries(rewards.current.agents);
  const unlocked = [];

  agents.forEach(([name, metrics]) => {
    const scores = {
      velocity: metrics.velocity.length > 0 ? Math.min(1, Math.floor(metrics.velocity.reduce((a, b) => a + b) / metrics.velocity.length) / 7) : 0,
      efficiency: metrics.efficiency.length > 0 ? Math.max(0, 1 - (metrics.efficiency.reduce((a, b) => a + b) / metrics.efficiency.length)) : 0,
      quality: metrics.quality.length > 0 ? (metrics.quality.reduce((a, b) => a + b) / metrics.quality.length) : 0,
      discipline: metrics.discipline.length > 0 ? (metrics.discipline.reduce((a, b) => a + b) / metrics.discipline.length) : 0,
      reliability: metrics.reliability.length > 0 ? (metrics.reliability.reduce((a, b) => a + b) / metrics.reliability.length) : 0
    };

    const metricsCount = Object.values(scores).filter(s => s > 0.6).length;
    const tier = metricsCount >= 5 ? 'Platinum' : metricsCount >= 4 ? 'Gold' : metricsCount >= 3 ? 'Silver' : metricsCount >= 2 ? 'Bronze' : 'Unranked';
    const autonomyHours = tier === 'Platinum' ? 'Unrestricted' : tier === 'Gold' ? 2 : tier === 'Silver' ? 1 : tier === 'Bronze' ? 0.5 : 0;

    console.log(`${name}: ${tier} — Autonomy: ${autonomyHours === 'Unrestricted' ? '∞' : autonomyHours + 'h'}`);
    if (autonomyHours > 0) {
      unlocked.push({ name, tier, autonomyHours });
    }
  });

  if (unlocked.length > 0) {
    console.log('\n🎁 Autonomy Unlocked:\n');
    unlocked.forEach(({ name, tier, autonomyHours }) => {
      console.log(`${name} (${tier}): Can generate own prompt. You run it anywhere.`);
    });
  } else {
    console.log('\nNo rewards earned this window. Next one.');
  }

  rewards.current.end = new Date().toISOString();
  rewards.windows.push(rewards.current);
  rewards.current = null;
  saveRewards(rewards);

  console.log('\n✅ Window closed. Ready for next sprint.\n');
}

if (!startWindow && !logMetric && !showStatus && !endWindow) {
  console.log('Usage:');
  console.log('  node tools/haiku-rewards.js --start-window=<name>');
  console.log('  node tools/haiku-rewards.js --log="<agent>|<metric>|<value>"');
  console.log('  node tools/haiku-rewards.js --status');
  console.log('  node tools/haiku-rewards.js --end-window\n');
}
