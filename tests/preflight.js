#!/usr/bin/env node
'use strict';
// Fast pre-flight tier (W3): the sub-10s "did I break it" gate to run BEFORE
// the full Playwright suite. Two stages, cheapest first:
//   1. syntax-check.js — browser-free parse of all project script (~0.5s).
//   2. a single headless boot — load the game once, reach gameplay, and assert
//      zero console/page errors. One browser launch, one page, no per-case
//      churn, so it's a fraction of `node run.js`.
// Exit 0 only if both stages pass. `node run.js` also runs stage 1 inline, so
// this is the standalone "quick confidence" entry point.
const { checkSyntax } = require('./syntax-check');
const { startServer, resolvePlaywright, launchBrowser, openGamePage, closeGamePage } = require('./helpers');

const RESET = '\x1b[0m', GREEN = '\x1b[32m', RED = '\x1b[31m', DIM = '\x1b[2m';
const path = require('path');
const ROOT = path.join(__dirname, '..');

async function main() {
  const t0 = Date.now();

  // Stage 1 — syntax (no browser). Fail here before paying for Chromium.
  const { units, problems } = checkSyntax();
  if (problems.length) {
    console.log(`${RED}✗ preflight: syntax${RESET}`);
    problems.forEach(p => console.log(`  ${p}`));
    process.exit(1);
  }
  console.log(`  ${GREEN}✓${RESET} syntax ${DIM}(${units.length} unit(s))${RESET}`);

  // Stage 2 — single boot smoke.
  const { server, baseUrl } = await startServer(ROOT);
  const browser = await launchBrowser(resolvePlaywright());
  let ctx, ok = true;
  try {
    ctx = await openGamePage(browser, baseUrl, { query: '?dev=1&skipintro=1' });
    const started = await ctx.page.evaluate(() => typeof G !== 'undefined' && G.started === true);
    if (!started) { ok = false; console.log(`  ${RED}✗${RESET} boot: never reached gameplay (G.started !== true)`); }
    if (ctx.errors.length) {
      ok = false;
      console.log(`  ${RED}✗${RESET} boot: ${ctx.errors.length} console/page error(s):`);
      ctx.errors.forEach(e => console.log(`      ${e}`));
    }
    if (ok) console.log(`  ${GREEN}✓${RESET} boot ${DIM}(clean, zero console errors)${RESET}`);
  } catch (e) {
    ok = false;
    console.log(`  ${RED}✗${RESET} boot threw: ${e.message}`);
  } finally {
    if (ctx) await closeGamePage(ctx);
    await browser.close();
    server.close();
  }

  const totalS = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`\npreflight ${ok ? GREEN + 'PASS' : RED + 'FAIL'}${RESET} (${totalS}s)`);
  process.exit(ok ? 0 : 1);
}

main().catch(e => { console.error('Preflight crashed:', e); process.exit(1); });
