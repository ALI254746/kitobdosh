import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeGoogleEmail, resolveGoogleSignIn } from '../lib/google-account.mjs';

test('google email is trimmed and lowercased, empty values are rejected', () => {
  assert.equal(normalizeGoogleEmail('  Demo.User@Example.invalid '), 'demo.user@example.invalid');
  assert.equal(normalizeGoogleEmail('not-an-email'), '');
  assert.equal(normalizeGoogleEmail(null), '');
});

test('password sign-in does not touch the google user store', async () => {
  let calls = 0;
  const allowed = await resolveGoogleSignIn({ provider: 'credentials' }, { email: 'demo@example.invalid' }, async () => { calls += 1; });
  assert.equal(allowed, true);
  assert.equal(calls, 0);
});

test('google sign-in without an email is denied and does not write', async () => {
  let calls = 0;
  const allowed = await resolveGoogleSignIn({ provider: 'google' }, { name: 'Demo' }, async () => { calls += 1; });
  assert.equal(allowed, false);
  assert.equal(calls, 0);
});

test('the same google email is stored once and can sign in again', async () => {
  const users = new Map();
  const ensure = async (profile) => {
    const email = normalizeGoogleEmail(profile.email);
    if (!users.has(email)) users.set(email, { email, name: profile.name || '' });
    return users.get(email);
  };
  assert.equal(await resolveGoogleSignIn({ provider: 'google' }, { email: 'Demo.User@Example.invalid', name: 'Demo' }, ensure), true);
  assert.equal(await resolveGoogleSignIn({ provider: 'google' }, { email: 'demo.user@example.invalid' }, ensure), true);
  assert.deepEqual([...users.keys()], ['demo.user@example.invalid']);
});

test('a database failure is a configuration error, not a permission denial', async () => {
  await assert.rejects(
    () => resolveGoogleSignIn({ provider: 'google' }, { email: 'demo@example.invalid' }, async () => { throw new Error('Ma’lumotlar bazasiga ulanib bo‘lmadi'); }),
    (error) => error.message === 'Configuration'
  );
});
