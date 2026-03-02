#!/usr/bin/env node
/**
 * Live API tests for bond-yield-calculator backend.
 * Run against https://localhost:5000/api (or set API_BASE_URL).
 * Use: pnpm test:live:api   or   node scripts/test-live-api.mjs
 * For HTTPS with self-signed certs: NODE_TLS_REJECT_UNAUTHORIZED=0 pnpm test:live:api
 */

const API_BASE = process.env.API_BASE_URL || 'http://localhost:5000/api';

const https = await import('https');
const http = await import('http');
const agent = API_BASE.startsWith('https')
  ? new https.Agent({ rejectUnauthorized: process.env.NODE_TLS_REJECT_UNAUTHORIZED !== '0' })
  : undefined;

function url(path) {
  const base = new URL(API_BASE);
  const p = path.startsWith('/') ? path : `/${path}`;
  base.pathname = base.pathname.replace(/\/?$/, '') + p;
  return base.toString();
}

async function request(method, path, body = null) {
  const urlStr = url(path);
  const opts = {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    agent,
  };
  const parsed = new URL(urlStr);
  const lib = parsed.protocol === 'https:' ? await import('https') : await import('http');
  return new Promise((resolve, reject) => {
    const req = lib.request(urlStr, opts, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            body: data ? JSON.parse(data) : null,
            raw: data,
          });
        } catch {
          resolve({ status: res.statusCode, body: null, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

const get = (path) => request('GET', path);
const post = (path, body) => request('POST', path, body);

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

console.log('\n--- Live API tests ---');
console.log(`Base URL: ${API_BASE}\n`);

// --- GET / ---
console.log('GET /');
try {
  const r = await get('/');
  ok('returns 200', r.status === 200);
  ok('returns Hello World!', r.raw === 'Hello World!' || r.body === 'Hello World!');
} catch (e) {
  failed += 2;
  console.log('  ✗ request failed:', e.message);
}
console.log('');

// --- Common cases: POST /calculate ---
const commonCases = [
  {
    name: 'Valid discount bond',
    body: { faceValue: 1000, marketPrice: 950, annualCouponRate: 0.05, yearsToMaturity: 2, couponFrequency: 1 },
    expect: { indicator: 'Discount', status: 201 },
  },
  {
    name: 'Valid premium bond',
    body: { faceValue: 1000, marketPrice: 1050, annualCouponRate: 0.08, yearsToMaturity: 3, couponFrequency: 2 },
    expect: { indicator: 'Premium', status: 201 },
  },
  {
    name: 'Valid par bond',
    body: { faceValue: 1000, marketPrice: 1000, annualCouponRate: 0.05, yearsToMaturity: 1, couponFrequency: 1 },
    expect: { indicator: 'Par', status: 201 },
  },
  {
    name: 'Coupon frequency 4',
    body: { faceValue: 5000, marketPrice: 4800, annualCouponRate: 0.06, yearsToMaturity: 5, couponFrequency: 4 },
    expect: { status: 201 },
  },
  {
    name: 'Coupon frequency 12',
    body: { faceValue: 10000, marketPrice: 9900, annualCouponRate: 0.04, yearsToMaturity: 1, couponFrequency: 12 },
    expect: { status: 201 },
  },
];

console.log('POST /calculate — common cases');
for (const t of commonCases) {
  try {
    const r = await post('/calculate', t.body);
    ok(t.name, r.status === (t.expect.status ?? 201));
    if (t.expect.indicator) ok(`${t.name} indicator`, r.body?.indicator === t.expect.indicator);
    if (r.status === 201) {
      ok(`${t.name} response shape`, !!r.body?.currentYield && !!r.body?.yieldToMaturity && Array.isArray(r.body?.cashflowSchedule));
    }
  } catch (e) {
    failed++;
    console.log(`  ✗ ${t.name} - ${e.message}`);
  }
}
console.log('');

// --- Edge cases: validation ---
const edgeCases = [
  {
    name: 'Invalid coupon frequency (3)',
    body: { faceValue: 1000, marketPrice: 950, annualCouponRate: 0.05, yearsToMaturity: 2, couponFrequency: 3 },
    expectStatus: 400,
    expectMessage: 'Coupon frequency',
  },
  {
    name: 'Negative face value',
    body: { faceValue: -100, marketPrice: 950, annualCouponRate: 0.05, yearsToMaturity: 2, couponFrequency: 1 },
    expectStatus: 400,
  },
  {
    name: 'Zero market price',
    body: { faceValue: 1000, marketPrice: 0, annualCouponRate: 0.05, yearsToMaturity: 2, couponFrequency: 1 },
    expectStatus: 400,
  },
  {
    name: 'Face value over max (1e9 + 1)',
    body: { faceValue: 1e9 + 1, marketPrice: 950, annualCouponRate: 0.05, yearsToMaturity: 2, couponFrequency: 1 },
    expectStatus: 400,
    expectMessage: 'Face value',
  },
  {
    name: 'Annual coupon rate over 100',
    body: { faceValue: 1000, marketPrice: 950, annualCouponRate: 101, yearsToMaturity: 2, couponFrequency: 1 },
    expectStatus: 400,
    expectMessage: 'Annual coupon rate',
  },
  {
    name: 'Years to maturity over 100',
    body: { faceValue: 1000, marketPrice: 950, annualCouponRate: 0.05, yearsToMaturity: 101, couponFrequency: 1 },
    expectStatus: 400,
    expectMessage: 'Years to maturity',
  },
  {
    name: 'Boundary: face value 1e9',
    body: { faceValue: 1e9, marketPrice: 0.99e9, annualCouponRate: 0.01, yearsToMaturity: 1, couponFrequency: 1 },
    expectStatus: 201,
  },
  {
    name: 'Boundary: years to maturity 100',
    body: { faceValue: 1000, marketPrice: 1000, annualCouponRate: 0.05, yearsToMaturity: 100, couponFrequency: 1 },
    expectStatus: 201,
  },
];

console.log('POST /calculate — edge cases (validation)');
for (const t of edgeCases) {
  try {
    const r = await post('/calculate', t.body);
    ok(t.name, r.status === t.expectStatus, `got ${r.status}`);
    if (t.expectStatus === 400 && t.expectMessage) {
      const msg = Array.isArray(r.body?.message) ? r.body.message.join(' ') : (r.body?.message || r.raw || '');
      ok(`${t.name} message`, msg.includes(t.expectMessage));
    }
  } catch (e) {
    failed++;
    console.log(`  ✗ ${t.name} - ${e.message}`);
  }
}
console.log('');

// --- Edge: missing/wrong types ---
console.log('POST /calculate — missing/invalid fields');
try {
  const r = await post('/calculate', {});
  ok('Empty body returns 400', r.status === 400);
} catch (e) {
  failed++;
  console.log('  ✗ Empty body -', e.message);
}
try {
  const r = await post('/calculate', { faceValue: 'not a number', marketPrice: 950, annualCouponRate: 0.05, yearsToMaturity: 2, couponFrequency: 1 });
  ok('Invalid type (faceValue string) returns 400', r.status === 400);
} catch (e) {
  failed++;
  console.log('  ✗ Invalid type -', e.message);
}
console.log('');

console.log('--- Summary ---');
console.log(`Passed: ${passed}, Failed: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
