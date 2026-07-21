#!/usr/bin/env node
'use strict';
// GTB IV test runner. No framework — discovers tests/cases/*.test.js, runs
// each case in its own page/context (shared browser), and fails the process
// (exit code 1) if any case throws, asserts false, or the page logs a
// console/page error. Run: node tests/run.js [filter]
// `filter` is an optional substring match against test filenames.
const fs = require('fs');
const path = require('path');
const { startServer, resolvePlaywright, launchBrowser, openGamePage, closeGamePage } = require('./helpers');

const ROOT = path.join(__dirname, '..');
const CASES_DIR = path.join(__dirname, 'cases');
const RESET = '\x1b[0m', GREEN = '\x1b[32m', RED = '\x1b[31m', DIM = '\x1b[2m';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'Assertion failed');
}
function assertEqual(actual, expected, msg) {
  if (actual !== expected) {
    throw new Error(`${msg ? msg + ' — ' : ''}expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

async function main() {
  const filter = process.argv[2];
  const files = fs.readdirSync(CASES_DIR)
    .filter(f => f.endsWith('.test.js'))
    .filter(f => !filter || f.includes(filter))
    .sort();

  if (!files.length) {
    console.error(`No test files matched${filter ? ` filter "${filter}"` : ''} in tests/cases/`);
    process.exit(1);
  }

  console.log(`GTB IV test suite — ${files.length} file(s)\n`);

  const { server, baseUrl } = await startServer(ROOT);
  const playwright = resolvePlaywright();
  const browser = await launchBrowser(playwright);

  let pass = 0, fail = 0;
  const failures = [];
  const t0 = Date.now();

  for (const file of files) {
    const mod = require(path.join(CASES_DIR, file));
    const cases = Array.isArray(mod) ? mod : (mod.cases || [mod]);

    for (const c of cases) {
      const label = `${file} › ${c.name}`;
      const started = Date.now();
      let ctx;
      try {
        ctx = await openGamePage(browser, baseUrl, { query: c.query, start: c.start });
        await c.run(ctx.page, { assert, assertEqual });
        if (ctx.errors.length) {
          throw new Error('Unexpected console/page error(s):\n      ' + ctx.errors.join('\n      '));
        }
        console.log(`  ${GREEN}✓${RESET} ${label} ${DIM}(${Date.now() - started}ms)${RESET}`);
        pass++;
      } catch (e) {
        console.log(`  ${RED}✗${RESET} ${label} ${DIM}(${Date.now() - started}ms)${RESET}`);
        console.log(`      ${e.message}`);
        fail++;
        failures.push(label);
      } finally {
        if (ctx) await closeGamePage(ctx);
      }
    }
  }

  await browser.close();
  server.close();

  const totalS = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`\n${pass} passed, ${fail} failed (${totalS}s)`);
  if (fail) console.log(`\nFailed: ${failures.join(', ')}`);
  process.exit(fail ? 1 : 0);
}

main().catch(e => {
  console.error('Test runner crashed:', e);
  process.exit(1);
});
