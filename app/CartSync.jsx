'use client';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
import { setCartItems, selectCartItems } from '../lib/features/cart/cartSlice';

export default function CartSync() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const [loadedKey, setLoadedKey] = useState(null);
  const generation = useRef(0);
  const key = session?.user?.id ? `kitobdosh_cart:${session.user.id}` : 'kitobdosh_cart';
  useEffect(() => {
    if (status === 'loading') return;
    const current = ++generation.current;
    setLoadedKey(null);
    const load = async () => {
      let items = [];
      try {
        const saved = JSON.parse(localStorage.getItem(key) || '[]');
        if (Array.isArray(saved)) items = saved;
      } catch { /* Invalid local backup must not crash the page. */ }
      if (session?.user?.id) {
        try {
          const res = await fetch('/api/cart');
          const data = await res.json();
          if (res.ok && data.success && Array.isArray(data.cart)) items = data.cart;
        } catch { /* Preserve this user's local backup when sync is unavailable. */ }
      }
      if (current !== generation.current) return;
      dispatch(setCartItems(items));
      setLoadedKey(key);
    };
    load();
    return () => { generation.current++; };
  }, [key, status, session?.user?.id, dispatch]);
  useEffect(() => {
    if (loadedKey !== key) return;
    try { localStorage.setItem(key, JSON.stringify(cartItems)); } catch {}
  }, [cartItems, key, loadedKey]);
  return null;
}
