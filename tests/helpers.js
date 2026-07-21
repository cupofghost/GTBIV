'use strict';
// Shared plumbing for the GTB IV test suite. Deliberately dependency-light:
// a bare Node http server (no express) and raw Playwright (no test runner
// framework) so this stays easy to run from any agent/sandbox without
// touching the game's own zero-build deploy.
const http = require('http');
const fs = require('fs');
const path = require('path');

const MIME = {
  '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.mp3': 'audio/mpeg', '.svg': 'image/svg+xml',
};

// Serves the repo root as static files on an OS-assigned free port, so
// tests never fight over a fixed port (8099 etc.) with a dev's own server.
function startServer(rootDir) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent(req.url.split('?')[0]);
      const filePath = path.join(rootDir, urlPath === '/' ? '/index.html' : urlPath);
      if (!filePath.startsWith(rootDir)) { res.writeHead(403); res.end(); return; }
      fs.readFile(filePath, (err, data) => {
        if (err) { res.writeHead(404); res.end('Not found'); return; }
        res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
        res.end(data);
      });
    });
    server.listen(0, '127.0.0.1', () => {
      resolve({ server, baseUrl: `http://127.0.0.1:${server.address().port}` });
    });
  });
}

// Playwright isn't a project dependency (the game itself stays zero-build —
// see HANDOFF.md's golden rules). Try normal module resolution first (covers
// `npm install` in tests/, or a global install), then fall back to the path
// used by this project's Claude Code sandbox.
function resolvePlaywright() {
  const candidates = ['playwright', '/opt/node22/lib/node_modules/playwright'];
  let lastErr;
  for (const c of candidates) {
    try { return require(c); } catch (e) { lastErr = e; }
  }
  throw new Error(
    'Could not load the "playwright" package.\n' +
    '  Try: npm install        (from tests/, installs the devDependency)\n' +
    '  Or:  npm install -g playwright\n' +
    'Original error: ' + lastErr.message
  );
}

// Launches Chromium, self-healing around sandboxes where the installed
// playwright's expected browser revision folder name doesn't match what's
// actually on disk under PLAYWRIGHT_BROWSERS_PATH (seen in this project's
// dev sandbox: playwright looked for .../chromium/..., the real folder was
// .../chromium-1194/...).
async function launchBrowser(playwright) {
  try {
    return await playwright.chromium.launch();
  } catch (e) {
    const base = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
    if (fs.existsSync(base)) {
      const dirs = fs.readdirSync(base).filter(d => d.startsWith('chromium-') && !d.includes('headless_shell'));
      for (const d of dirs) {
        const exe = path.join(base, d, 'chrome-linux', 'chrome');
        if (fs.existsSync(exe)) return await playwright.chromium.launch({ executablePath: exe });
      }
    }
    throw e;
  }
}

// Opens the game in a fresh context (phone-landscape viewport, matching
// HANDOFF.md's testing convention) and wires up console/page error capture.
// By default also clicks Start and waits for G.started, since that's what
// almost every test wants — pass start:false to stay on the title screen.
async function openGamePage(browser, baseUrl, { query = '?dev=1&skipintro=1', start = true } = {}) {
  const context = await browser.newContext({ viewport: { width: 800, height: 390 } });
  const page = await context.newPage();
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));

  await page.goto(`${baseUrl}/index.html${query}`, { waitUntil: 'load' });
  await page.waitForTimeout(800); // let city/audio/dev-panel init settle

  if (start) {
    await page.evaluate(() => { const b = document.getElementById('startBtn'); if (b) b.click(); });
    for (let i = 0; i < 20; i++) {
      const started = await page.evaluate(() => typeof G !== 'undefined' && G.started === true);
      if (started) break;
      await page.waitForTimeout(150);
    }
  }
  return { context, page, errors };
}

async function closeGamePage({ context }) {
  await context.close();
}

// Drives a cutscene to completion by stepping updateCutscene() with a fixed
// simulated dt instead of waiting on real wall-clock time. Headless/off-
// screen Chromium throttles requestAnimationFrame hard (observed ~3-4fps in
// the dev sandbox), so page.waitForTimeout can't be trusted to cover a
// cutscene's real duration without making every test slow and flaky.
async function playCutsceneToEnd(page, id, { dt = 0.02, maxIters = 4000, anchor = null } = {}) {
  return page.evaluate(({ id, dt, maxIters, anchor }) => {
    const a = anchor || { x: player.x, z: player.z };
    playCutscene(id, a.x, a.z);
    let n = 0;
    while (activeCutscene && n < maxIters) { updateCutscene(dt); n++; }
    return { completed: !activeCutscene, iterations: n };
  }, { id, dt, maxIters, anchor });
}

module.exports = {
  startServer, resolvePlaywright, launchBrowser,
  openGamePage, closeGamePage, playCutsceneToEnd,
};
