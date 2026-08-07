#!/usr/bin/env node
/**
 * haiku-pulse.js — Agent morale + rapid feedback
 *
 * Log ideas (dumb or not), broadcast status to agents, acknowledge asks quickly.
 * Keeps agents feeling heard between formal scorecards.
 *
 * Usage:
 *   node tools/haiku-pulse.js --log-idea "<idea>" [--tier=bronze|silver|gold|platinum]
 *   node tools/haiku-pulse.js --broadcast              # Send status to agents
 *   node tools/haiku-pulse.js --log-feedback "<agent>|<idea>|greenlit|rejected"
 *
 * Signed: Claude Code | Haiku 4.5 | high
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const pulseFile = path.join(root, '.haiku-pulse.json');

function run(cmd, silent = false) {
  try {
    return execSync(cmd, { cwd: root, encoding: 'utf8', stdio: silent ? 'pipe' : 'inherit' }).trim();
  } catch (e) {
    return '';
  }
}

function loadPulse() {
  if (!fs.existsSync(pulseFile)) {
    return { ideas: [], feedback: [], broadcasts: [] };
  }
  return JSON.parse(fs.readFileSync(pulseFile, 'utf8'));
}

function savePulse(data) {
  fs.writeFileSync(pulseFile, JSON.stringify(data, null, 2));
}

const args = process.argv.slice(2);
const logIdea = args.find(a => a.startsWith('--log-idea='))?.split('=')[1];
const logFeedback = args.find(a => a.startsWith('--log-feedback='))?.split('=')[1];
const broadcast = args.includes('--broadcast');
const tierArg = args.find(a => a.startsWith('--tier='))?.split('=')[1] || 'general';

console.log('\n💬 Haiku Pulse — Agent Communication & Morale\n');

const pulse = loadPulse();

// ============ LOG IDEA ============
if (logIdea) {
  const idea = {
    id: `idea-${Date.now()}`,
    text: logIdea,
    tier: tierArg,
    timestamp: new Date().toISOString(),
    status: 'logged'
  };

  pulse.ideas.push(idea);
  savePulse(pulse);

  console.log(`✅ Idea logged (${tierArg} tier):`);
  console.log(`   "${logIdea}"\n`);
  console.log('Agents will see this in the next broadcast.');
}

// ============ LOG FEEDBACK ============
if (logFeedback) {
  const [agent, ideaText, decision] = logFeedback.split('|');

  if (!agent || !ideaText || !decision) {
    console.log('❌ Format: --log-feedback="<agent>|<idea>|greenlit|rejected|deferred"');
    process.exit(1);
  }

  const feedback = {
    id: `feedback-${Date.now()}`,
    agent,
    idea: ideaText,
    decision, // greenlit, rejected, deferred, under-review
    timestamp: new Date().toISOString()
  };

  pulse.feedback.push(feedback);
  savePulse(pulse);

  const emoji = {
    greenlit: '✅',
    rejected: '❌',
    deferred: '⏳',
    'under-review': '🔍'
  }[decision] || '📝';

  console.log(`${emoji} Feedback logged:`);
  console.log(`   ${agent}: "${ideaText}" → ${decision}\n`);
  console.log('Will be included in next broadcast.');
}

// ============ BROADCAST ============
if (broadcast) {
  console.log('📢 Generating Agent Broadcast\n');

  // Gather recent activity
  const lastHour = new Date(Date.now() - 60 * 60 * 1000);
  const recentIdeas = pulse.ideas.filter(i => new Date(i.timestamp) > lastHour);
  const recentFeedback = pulse.feedback.filter(f => new Date(f.timestamp) > lastHour);

  // Get current window status
  const rewardsFile = path.join(root, '.haiku-rewards.json');
  let currentStatus = {};
  if (fs.existsSync(rewardsFile)) {
    const rewards = JSON.parse(fs.readFileSync(rewardsFile, 'utf8'));
    if (rewards.current && rewards.current.agents) {
      Object.entries(rewards.current.agents).forEach(([name, metrics]) => {
        const scores = {
          velocity: metrics.velocity.length > 0 ? Math.min(1, Math.floor(metrics.velocity.reduce((a, b) => a + b) / metrics.velocity.length) / 7) : 0,
          quality: metrics.quality.length > 0 ? (metrics.quality.reduce((a, b) => a + b) / metrics.quality.length) : 0,
          discipline: metrics.discipline.length > 0 ? (metrics.discipline.reduce((a, b) => a + b) / metrics.discipline.length) : 0,
          reliability: metrics.reliability.length > 0 ? (metrics.reliability.reduce((a, b) => a + b) / metrics.reliability.length) : 0
        };
        const metricsCount = Object.values(scores).filter(s => s > 0.6).length;
        currentStatus[name] = { metricsCount, scores };
      });
    }
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('            ✅ HAIKU PULSE — Agent Briefing');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log(`📊 Current Standings:\n`);
  Object.entries(currentStatus).forEach(([name, data]) => {
    const tier = data.metricsCount >= 4 ? '🥇 Gold' : data.metricsCount >= 3 ? '🥈 Silver' : '🥉 Bronze';
    console.log(`   ${name}: ${tier} (${data.metricsCount}/5 metrics)`);
  });

  if (recentIdeas.length > 0) {
    console.log(`\n💡 New Ideas (Last Hour):\n`);
    recentIdeas.forEach(idea => {
      console.log(`   [${idea.tier.toUpperCase()}] "${idea.text}"`);
    });
  }

  if (recentFeedback.length > 0) {
    console.log(`\n📋 Feedback on Previous Ideas:\n`);
    recentFeedback.forEach(fb => {
      const emoji = {
        greenlit: '✅',
        rejected: '❌',
        deferred: '⏳',
        'under-review': '🔍'
      }[fb.decision] || '📝';
      console.log(`   ${emoji} ${fb.agent}: "${fb.idea}" → ${fb.decision.toUpperCase()}`);
    });
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`🚂 Owner checks twice daily (10am, 3pm).`);
  console.log(`   Feedback delivered by noon + evening.`);
  console.log(`   Keep shipping. Ideas are being heard.\n`);

  const broadcast = {
    id: `broadcast-${Date.now()}`,
    timestamp: new Date().toISOString(),
    ideasCount: recentIdeas.length,
    feedbackCount: recentFeedback.length,
    agentCount: Object.keys(currentStatus).length
  };
  pulse.broadcasts.push(broadcast);
  savePulse(pulse);
}

if (!logIdea && !logFeedback && !broadcast) {
  console.log('Usage:');
  console.log('  Log an idea:');
  console.log('    node tools/haiku-pulse.js --log-idea="add a cool thing" [--tier=bronze|silver|gold|platinum]');
  console.log('');
  console.log('  Log feedback on an idea:');
  console.log('    node tools/haiku-pulse.js --log-feedback="Sonnet|cool idea|greenlit"');
  console.log('    (decision: greenlit, rejected, deferred, under-review)');
  console.log('');
  console.log('  Broadcast status to agents:');
  console.log('    node tools/haiku-pulse.js --broadcast\n');
}
