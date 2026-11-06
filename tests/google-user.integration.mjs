import mongoose from 'mongoose';
import assert from 'node:assert/strict';
import { ensureGoogleUser } from '../lib/google-account.mjs';

const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME;
if (!/^mongodb:\/\/127\.0\.0\.1:\d+/.test(uri || '') || !/^kitobdosh_test/.test(dbName || '')) {
  console.error('Local kitobdosh_test database required');
  process.exit(1);
}

await mongoose.connect(uri, { dbName, serverSelectionTimeoutMS: 5000 });
const email = 'google-demo@example.invalid';
try {
  await mongoose.connection.db.collection('users').deleteMany({ email });
  const created = await ensureGoogleUser({ email: 'Google-Demo@Example.invalid', name: 'Demo Google', image: 'javascript:alert(1)' });
  assert.equal(created.email, email);
  assert.equal(created.role, 'user');
  assert.equal(created.password, undefined);
  assert.equal(created.avatar, '');
  const again = await ensureGoogleUser({ email, name: 'Demo Google' });
  assert.equal(String(again._id), String(created._id));
  assert.equal(await mongoose.connection.db.collection('users').countDocuments({ email }), 1);
  console.log('PASS google user create, reuse, unsafe avatar dropped, no password stored');
} finally {
  await mongoose.connection.db.collection('users').deleteMany({ email });
  await mongoose.disconnect();
}
