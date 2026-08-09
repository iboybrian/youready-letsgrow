// Self-check for the booking handler's validation + send path.
// Run: node api/book.test.js

import assert from 'node:assert/strict';
import handler from './book.js';

// Minimal res stub: records status + JSON body.
function makeRes() {
  const res = {
    statusCode: null,
    body: null,
    headers: {},
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; },
  };
  return res;
}

const valid = { name: 'Lindsay', email: 'lindsay@example.com', message: 'Keynote in March?' };

async function call(body, method = 'POST') {
  const res = makeRes();
  await handler({ method, body }, res);
  return res;
}

// Capture what Resend was asked to send, without hitting the network.
// Stubbed at the fetch boundary — the SDK builds the instance internally, so
// there is nothing to inject, and this also exercises its response handling.
let sent = null;
let upstreamOk = true;

process.env.RESEND_API_KEY = 're_test_key'; // SDK rejects keys without the re_ prefix
process.env.BOOKING_TO_EMAIL = 'vision@visionbuildaz.com';

globalThis.fetch = async (url, options) => {
  sent = JSON.parse(options.body);
  const body = upstreamOk
    ? { id: 'test-id' }
    : { name: 'application_error', message: 'upstream down' };
  return new Response(JSON.stringify(body), {
    status: upstreamOk ? 200 : 500,
    headers: { 'Content-Type': 'application/json' },
  });
};

// --- method guard ---
let res = await call(valid, 'GET');
assert.equal(res.statusCode, 405, 'GET is rejected');
assert.equal(res.headers.Allow, 'POST');

// --- required fields ---
for (const missing of ['name', 'email', 'message']) {
  const body = { ...valid, [missing]: '' };
  res = await call(body);
  assert.equal(res.statusCode, 400, `missing ${missing} is rejected`);
}

// Whitespace-only counts as missing.
res = await call({ ...valid, name: '   ' });
assert.equal(res.statusCode, 400, 'whitespace-only name is rejected');

// Non-string input must not crash the handler.
res = await call({ ...valid, name: { evil: true } });
assert.equal(res.statusCode, 400, 'non-string name is rejected, not thrown');

// --- email shape ---
for (const bad of ['nope', 'no@domain', 'a b@c.com', '@example.com']) {
  res = await call({ ...valid, email: bad });
  assert.equal(res.statusCode, 400, `rejects email "${bad}"`);
}

// --- honeypot ---
sent = null;
res = await call({ ...valid, website: 'http://spam.example' });
assert.equal(res.statusCode, 200, 'honeypot returns 200 so bots learn nothing');
assert.equal(sent, null, 'honeypot sends no email');

// --- missing config fails closed ---
const savedKey = process.env.RESEND_API_KEY;
delete process.env.RESEND_API_KEY;
res = await call(valid);
assert.equal(res.statusCode, 500, 'missing API key fails closed');
process.env.RESEND_API_KEY = savedKey;

// --- happy path ---
sent = null;
res = await call({ ...valid, organization: 'Acme Corp', eventDate: '2026-03-14' });
assert.equal(res.statusCode, 200, 'valid inquiry succeeds');
assert.equal(sent.to[0], 'vision@visionbuildaz.com', 'routes to the configured inbox');
assert.equal(sent.reply_to, valid.email, 'reply goes to the inquirer'); // SDK maps replyTo -> reply_to
assert.match(sent.subject, /Lindsay \(Acme Corp\)/, 'subject carries name + org');
assert.match(sent.text, /Keynote in March\?/, 'message body is included');
assert.match(sent.text, /2026-03-14/, 'event date is included');

// Optional fields render as an em dash rather than "undefined".
sent = null;
await call(valid);
assert.match(sent.text, /Organization: —/, 'empty organization renders as a dash');

// --- length caps ---
sent = null;
await call({ ...valid, message: 'x'.repeat(9000) });
// Longest run, not the first — "example.com" in the email contributes a stray x.
const longestRun = Math.max(...sent.text.match(/x+/g).map(s => s.length));
assert.equal(longestRun, 4000, 'message is capped at 4000 chars');

// --- send failure surfaces as 502 ---
upstreamOk = false;
res = await call(valid);
assert.equal(res.statusCode, 502, 'a failed send returns 502, not a false success');
upstreamOk = true;

console.log('book.js: all checks passed');
