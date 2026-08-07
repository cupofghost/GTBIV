#!/usr/bin/env node
/**
 * haiku-web.js — Browser-based sprint control panel
 *
 * One command to start the dashboard:
 *   node tools/haiku-web.js
 *
 * Then open http://localhost:8899 in your browser.
 * All sprint controls: standings, ideas, feedback, broadcasts.
 *
 * Signed: Claude Code | Haiku 4.5 | high
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { execSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const port = 8899;

function run(cmd, silent = false) {
  try {
    return execSync(cmd, { cwd: root, encoding: 'utf8', stdio: silent ? 'pipe' : 'inherit' }).trim();
  } catch (e) {
    return '';
  }
}

function readJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
  } catch {
    return null;
  }
}

function writeJSON(file, data) {
  fs.writeFileSync(path.join(root, file), JSON.stringify(data, null, 2));
}

const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sprint Control Panel</title>
  <style>
    :root {
      --bg: #fafaf8;
      --text: #1a1a18;
      --border: #e8e8e5;
      --accent: #ff3ea0;
      --done: #00d9ff;
      --code-bg: #2a2a28;
    }
    @media (prefers-color-scheme: dark) {
      :root:not([data-theme="light"]) {
        --bg: #0f0f0d;
        --text: #f5f5f2;
        --border: #2a2a28;
        --code-bg: #1a1a18;
      }
    }
    * { box-sizing: border-box; }
    body { margin: 0; padding: 1.5rem; background: var(--bg); color: var(--text); font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
    .container { max-width: 900px; margin: 0 auto; }
    header { margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border); }
    h1 { margin: 0; font-size: 1.8rem; }
    .subtitle { color: #8b8b88; font-size: 0.9rem; margin: 0.5rem 0 0 0; }
    .tabs { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border); }
    .tab { padding: 0.75rem 1rem; border: none; background: none; cursor: pointer; font-size: 0.95rem; color: #8b8b88; transition: all 0.15s; border-bottom: 2px solid transparent; }
    .tab.active { color: var(--text); border-bottom-color: var(--accent); font-weight: 600; }
    .tab:hover { color: var(--text); }
    .section { display: none; }
    .section.active { display: block; }
    .panel { background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 4px; padding: 1.5rem; margin-bottom: 1.5rem; }
    .stat-row { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid var(--border); }
    .stat-row:last-child { border-bottom: none; }
    .stat-value { font-weight: 600; color: var(--accent); }
    .form-group { margin-bottom: 1rem; }
    label { display: block; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; color: #8b8b88; }
    input, textarea, select { width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: 4px; background: var(--code-bg); color: var(--text); font-family: inherit; font-size: 0.95rem; }
    input:focus, textarea:focus, select:focus { outline: none; border-color: var(--accent); }
    button { padding: 0.75rem 1.5rem; background: var(--accent); color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600; transition: opacity 0.15s; }
    button:hover { opacity: 0.9; }
    button:active { opacity: 0.8; }
    .success { background: var(--done); }
    .message { padding: 1rem; border-radius: 4px; margin-bottom: 1rem; }
    .message.success { background: rgba(0, 217, 255, 0.1); color: var(--done); }
    .message.error { background: rgba(255, 62, 160, 0.1); color: var(--accent); }
    .tier { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600; background: rgba(255, 62, 160, 0.1); color: var(--accent); }
    .tier.silver { background: rgba(0, 217, 255, 0.1); color: var(--done); }
    .idea-item { padding: 1rem; background: rgba(255, 62, 160, 0.05); border-left: 3px solid var(--accent); margin-bottom: 0.75rem; border-radius: 4px; }
    .idea-text { font-weight: 500; margin-bottom: 0.5rem; }
    .idea-meta { font-size: 0.85rem; color: #8b8b88; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>🚂 Sprint Control Panel</h1>
      <p class="subtitle">No terminal needed. Log ideas, check standings, broadcast to agents.</p>
    </header>

    <div class="tabs">
      <button class="tab active" onclick="switchTab('standings')">Standings</button>
      <button class="tab" onclick="switchTab('ideas')">Log Idea</button>
      <button class="tab" onclick="switchTab('feedback')">Give Feedback</button>
      <button class="tab" onclick="switchTab('broadcast')">Broadcast</button>
    </div>

    <!-- STANDINGS -->
    <div id="standings" class="section active">
      <div class="panel">
        <h2 style="margin-top: 0;">Current Sprint Status</h2>
        <div id="standings-content">Loading...</div>
      </div>
    </div>

    <!-- LOG IDEA -->
    <div id="ideas" class="section">
      <div class="panel">
        <h2 style="margin-top: 0;">Log an Idea</h2>
        <div id="idea-message"></div>
        <div class="form-group">
          <label>Your Idea (dumb or not)</label>
          <textarea id="idea-text" placeholder="What cool thing do you want to see?" rows="3"></textarea>
        </div>
        <div class="form-group">
          <label>Tier (optional)</label>
          <select id="idea-tier">
            <option value="general">General</option>
            <option value="bronze">Bronze</option>
            <option value="silver">Silver</option>
            <option value="gold">Gold</option>
            <option value="platinum">Platinum</option>
          </select>
        </div>
        <button onclick="logIdea()">Log Idea</button>
      </div>
      <div class="panel">
        <h3>Recent Ideas</h3>
        <div id="recent-ideas">Loading...</div>
      </div>
    </div>

    <!-- FEEDBACK -->
    <div id="feedback" class="section">
      <div class="panel">
        <h2 style="margin-top: 0;">Give Feedback on an Idea</h2>
        <div id="feedback-message"></div>
        <div class="form-group">
          <label>Agent Name</label>
          <input id="feedback-agent" placeholder="e.g., Sonnet, Opus, Kimi">
        </div>
        <div class="form-group">
          <label>Idea</label>
          <textarea id="feedback-idea" placeholder="What idea are you giving feedback on?" rows="2"></textarea>
        </div>
        <div class="form-group">
          <label>Decision</label>
          <select id="feedback-decision">
            <option value="greenlit">✅ Greenlit (ship it)</option>
            <option value="deferred">⏳ Deferred (next sprint)</option>
            <option value="rejected">❌ Rejected (won't do)</option>
            <option value="under-review">🔍 Under Review</option>
          </select>
        </div>
        <button onclick="giveFeedback()">Log Feedback</button>
      </div>
    </div>

    <!-- BROADCAST -->
    <div id="broadcast" class="section">
      <div class="panel">
        <h2 style="margin-top: 0;">Broadcast to Agents</h2>
        <p style="color: #8b8b88; margin-top: 0;">Agents will see: current standings, recent ideas, and feedback on ideas.</p>
        <button onclick="broadcast()" style="font-size: 1.1rem; padding: 1rem 2rem;">📢 Send Broadcast Now</button>
        <div id="broadcast-message" style="margin-top: 1.5rem;"></div>
      </div>
    </div>
  </div>

  <script>
    function switchTab(tab) {
      document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.getElementById(tab).classList.add('active');
      event.target.classList.add('active');
    }

    async function fetchAPI(endpoint, method = 'GET', body = null) {
      const opts = { method };
      if (body) opts.body = JSON.stringify(body);
      const res = await fetch(endpoint, opts);
      return res.json();
    }

    async function updateStandings() {
      const data = await fetchAPI('/api/standings');
      const html = data.agents.length > 0
        ? data.agents.map(a => \`
            <div class="stat-row">
              <div><strong>\${a.name}</strong></div>
              <div><span class="tier\${a.tier === 'silver' || a.tier === 'gold' ? ' silver' : ''}">\${a.tier.toUpperCase()} (\${a.metrics}/5)</span></div>
            </div>
          \`).join('')
        : '<div style="color: #8b8b88;">No active sprint data yet.</div>';
      document.getElementById('standings-content').innerHTML = html;
    }

    async function logIdea() {
      const text = document.getElementById('idea-text').value.trim();
      const tier = document.getElementById('idea-tier').value;
      if (!text) {
        showMessage('idea-message', 'Enter an idea first', 'error');
        return;
      }
      const result = await fetchAPI('/api/idea', 'POST', { text, tier });
      showMessage('idea-message', '✅ Idea logged! Agents see it on next broadcast.', 'success');
      document.getElementById('idea-text').value = '';
      await updateRecentIdeas();
    }

    async function updateRecentIdeas() {
      const data = await fetchAPI('/api/recent-ideas');
      const html = data.ideas.length > 0
        ? data.ideas.map(i => \`
            <div class="idea-item">
              <div class="idea-text">"\${i.text}"</div>
              <div class="idea-meta"><span class="tier">\${i.tier.toUpperCase()}</span> • logged \${new Date(i.timestamp).toLocaleTimeString()}</div>
            </div>
          \`).join('')
        : '<div style="color: #8b8b88;">No ideas logged yet.</div>';
      document.getElementById('recent-ideas').innerHTML = html;
    }

    async function giveFeedback() {
      const agent = document.getElementById('feedback-agent').value.trim();
      const idea = document.getElementById('feedback-idea').value.trim();
      const decision = document.getElementById('feedback-decision').value;
      if (!agent || !idea) {
        showMessage('feedback-message', 'Enter agent name and idea', 'error');
        return;
      }
      await fetchAPI('/api/feedback', 'POST', { agent, idea, decision });
      showMessage('feedback-message', '✅ Feedback logged!', 'success');
      document.getElementById('feedback-agent').value = '';
      document.getElementById('feedback-idea').value = '';
    }

    async function broadcast() {
      const result = await fetchAPI('/api/broadcast', 'POST');
      const msg = document.getElementById('broadcast-message');
      msg.innerHTML = \`
        <div class="message success">
          <strong>✅ Broadcast sent to agents!</strong><br>
          They see current standings, recent ideas, and feedback.<br>
          <br>
          <strong>Next broadcast:</strong> check back in a few hours.
        </div>
      \`;
    }

    function showMessage(id, text, type) {
      const el = document.getElementById(id);
      el.innerHTML = \`<div class="message \${type}">\${text}</div>\`;
      setTimeout(() => { el.innerHTML = ''; }, 3000);
    }

    // Initial load
    updateStandings();
    updateRecentIdeas();
  </script>
</body>
</html>`;

// ============ HTTP SERVER ============

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // === API ROUTES ===

  if (pathname === '/api/standings') {
    const rewards = readJSON('.haiku-rewards.json') || { current: null };
    const agents = [];
    if (rewards.current && rewards.current.agents) {
      Object.entries(rewards.current.agents).forEach(([name, metrics]) => {
        const metricsCount = Object.keys(metrics).filter(k => metrics[k].length > 0).length;
        const tier = metricsCount >= 4 ? 'gold' : metricsCount >= 3 ? 'silver' : 'bronze';
        agents.push({ name, tier, metrics: metricsCount });
      });
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ agents }));
  }

  else if (pathname === '/api/idea' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const { text, tier } = JSON.parse(body);
      const pulse = readJSON('.haiku-pulse.json') || { ideas: [], feedback: [], broadcasts: [] };
      pulse.ideas.push({
        id: `idea-${Date.now()}`,
        text,
        tier,
        timestamp: new Date().toISOString(),
        status: 'logged'
      });
      writeJSON('.haiku-pulse.json', pulse);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));
    });
  }

  else if (pathname === '/api/recent-ideas') {
    const pulse = readJSON('.haiku-pulse.json') || { ideas: [] };
    const recent = pulse.ideas.slice(-5).reverse();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ideas: recent }));
  }

  else if (pathname === '/api/feedback' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const { agent, idea, decision } = JSON.parse(body);
      const pulse = readJSON('.haiku-pulse.json') || { ideas: [], feedback: [], broadcasts: [] };
      pulse.feedback.push({
        id: `feedback-${Date.now()}`,
        agent,
        idea,
        decision,
        timestamp: new Date().toISOString()
      });
      writeJSON('.haiku-pulse.json', pulse);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));
    });
  }

  else if (pathname === '/api/broadcast' && req.method === 'POST') {
    // Run the actual broadcast (calls haiku-pulse.js --broadcast)
    run('node tools/haiku-pulse.js --broadcast', true);
    const pulse = readJSON('.haiku-pulse.json') || { broadcasts: [] };
    pulse.broadcasts.push({
      id: `broadcast-${Date.now()}`,
      timestamp: new Date().toISOString()
    });
    writeJSON('.haiku-pulse.json', pulse);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
  }

  // === HTML ===

  else if (pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(htmlTemplate);
  }

  else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(port, () => {
  console.log('\n🚂 Sprint Control Panel\n');
  console.log(`📊 Open your browser: http://localhost:${port}`);
  console.log(`\n✅ Running. Keep this terminal open during your sprint.\n`);
});
