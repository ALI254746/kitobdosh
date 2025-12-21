'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSession } from 'next-auth/react';
import { setUser } from '../lib/features/auth/authSlice';

export default function AuthSync() {
  const { data: session } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    if (session?.user) {
      dispatch(setUser(session.user));
    } else {
      dispatch(setUser(null));
    }
  }, [session, dispatch]);

  return null;
}
