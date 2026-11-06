import User from '../model/user.js';
import { dbConnect } from './db.Connect.js';

export function normalizeGoogleEmail(value) {
  if (typeof value !== 'string') return '';
  const email = value.trim().toLowerCase();
  if (email.length < 6 || email.length > 200 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return '';
  return email;
}

function safeHttps(value) {
  if (typeof value !== 'string' || value.length > 500) return '';
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.toString() : '';
  } catch {
    return '';
  }
}

export async function ensureGoogleUser(profile) {
  const email = normalizeGoogleEmail(profile?.email);
  if (!email) {
    const error = new Error('Google email yo‘q');
    error.code = 'GOOGLE_EMAIL_REQUIRED';
    throw error;
  }
  await dbConnect();
  const existing = await User.findOne({ email });
  if (existing) return existing;
  try {
    return await User.create({
      email,
      fullName: typeof profile?.name === 'string' ? profile.name.trim().slice(0, 120) : '',
      avatar: safeHttps(profile?.image),
      role: 'user',
    });
  } catch (error) {
    if (error?.code === 11000) {
      const again = await User.findOne({ email });
      if (again) return again;
    }
    throw error;
  }
}

// true: allow. false: AccessDenied. throw Error('Configuration'): database/provider setup failure.
export async function resolveGoogleSignIn(account, profile, ensure = ensureGoogleUser) {
  if (account?.provider !== 'google') return true;
  if (!normalizeGoogleEmail(profile?.email)) return false;
  try {
    await ensure(profile);
    return true;
  } catch (error) {
    if (error?.code === 'GOOGLE_EMAIL_REQUIRED') return false;
    throw new Error('Configuration');
  }
}
