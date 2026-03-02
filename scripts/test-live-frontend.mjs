#!/usr/bin/env node
/**
 * Live frontend smoke tests for bond-yield-calculator.
 * Fetches the app at FRONTEND_URL and checks for key content and structure.
 * Use: pnpm test:live:frontend   or   node scripts/test-live-frontend.mjs
 * For HTTPS: NODE_TLS_REJECT_UNAUTHORIZED=0 FRONTEND_URL=https://localhost:4000 pnpm test:live:frontend
 */

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4000';

let passed = 0;
let failed = 0;

function ok(name, condition, detail = '') {
  if (condition) {
    passed++;
    console.log(`  ✓ ${name}${detail ? ` (${detail})` : ''}`);
  } else {
    failed++;
    console.log(`  ✗ ${name}${detail ? ` - ${detail}` : ''}`);
  }
}

console.log('\n--- Live frontend tests ---');
console.log(`URL: ${FRONTEND_URL}\n`);

let html = '';
try {
  const res = await fetch(FRONTEND_URL, {
    redirect: 'follow',
    headers: { Accept: 'text/html' },
  });
  ok('page loads', res.ok, `status ${res.status}`);
  if (!res.ok) {
    console.log('  (skip content checks - page did not load)\n');
    process.exit(1);
  }
  html = await res.text();
} catch (e) {
  failed++;
  console.log(`  ✗ fetch failed - ${e.message}`);
  console.log('  Tip: Use NODE_TLS_REJECT_UNAUTHORIZED=0 for HTTPS with self-signed certs.\n');
  process.exit(1);
}

// Initial HTML structure (app content is in the JS bundle and rendered client-side)
console.log('Structure checks');
ok('has root div', /id="root"/i.test(html) || /id='root'/i.test(html));
ok('has app script', /<script/i.test(html) && (/src=/.test(html) || /type="module"/i.test(html)));
ok('non-empty HTML', html.length > 100);

console.log('\n--- Summary ---');
console.log(`Passed: ${passed}, Failed: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
