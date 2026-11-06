// Explicit test-process preload, never imported by application code.
if (!/^mongodb:\/\/127\.0\.0\.1:\d+\//.test(process.env.MONGO_URI || '') || !/^kitobdosh_test/.test(process.env.MONGO_DB_NAME || '')) throw new Error('Provider mocks are local test-only');
const fs = require('fs'); const { randomBytes } = require('crypto');
const local = host => ['127.0.0.1', 'localhost', '::1', '[::1]'].includes(host);
const mockEmail = payload => {
 const code = payload.html?.match(/>\s*(\d{6})\s*</)?.[1];
 fs.writeFileSync(process.env.MOCK_OTP_PATH, JSON.stringify({ email: payload.to, code }), { mode: 0o600 });
 fs.appendFileSync(process.env.MOCK_AUDIT_PATH, JSON.stringify({ provider: 'resend', mocked: true })+'\n');
 return { id: 'demo-mail' };
};
// Mandatory no-egress boundary; independent of SDK module bundling or mocks.
const nativeFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {
 const url = new URL(typeof input === 'string' || input instanceof URL ? input : input.url);
 if (url.hostname === 'api.resend.com' && url.pathname === '/emails') {
   const data = mockEmail(JSON.parse(init?.body || '{}'));
   return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
 }
 if (!local(url.hostname)) throw new Error('Test blocked external fetch');
 return nativeFetch(input, init);
};
for (const protocol of ['http', 'https']) {
 const mod = require(protocol);
 for (const method of ['request','get']) {
  const original = mod[method];
  mod[method] = function(input, ...args) {
   const host = typeof input === 'string' || input instanceof URL ? new URL(input).hostname : input.hostname || input.host || 'localhost';
   if (!local(host)) throw new Error('Test blocked external HTTP');
   return original.call(this, input, ...args);
  };
 }
}
const net = require('net'); const connect = net.Socket.prototype.connect;
net.Socket.prototype.connect = function(...args) {
 const options = Array.isArray(args[0]) ? args[0][0] : args[0];
 const host = typeof options === 'object' ? options.host || 'localhost' : typeof args[1] === 'string' ? args[1] : 'localhost';
 if (!local(host)) throw new Error('Test blocked external socket');
 return connect.apply(this, args);
};
const cloud = require('cloudinary').v2;
cloud.uploader.upload_stream = (options, callback) => ({ end() {
 fs.appendFileSync(process.env.MOCK_AUDIT_PATH, JSON.stringify({ provider: 'cloudinary', type: options.type || 'upload' })+'\n');
 callback(null, { public_id: 'demo/'+randomBytes(12).toString('hex'), format: 'png', secure_url: 'https://example.invalid/demo.png' });
} });
cloud.uploader.destroy = async () => ({ result: 'ok' });
require('resend').Resend = class { constructor() { this.emails = { send: async payload => ({ data: mockEmail(payload), error: null }) }; } };
