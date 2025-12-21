'use client';

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
import { setCartItems, selectCartItems } from '../lib/features/cart/cartSlice';

export default function CartSync() {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const isInitialLoad = useRef(true);

  // 1. Initial Load from Server or LocalStorage
  useEffect(() => {
    const loadCart = async () => {
      if (session?.user) {
        try {
          const res = await fetch('/api/cart');
          const data = await res.json();
          if (data.success) {
            dispatch(setCartItems(data.cart));
          }
        } catch (error) {
          console.error("Failed to load cart from server", error);
        }
      } else {
        const savedCart = localStorage.getItem("kitobdosh_cart");
        if (savedCart) {
          try {
            dispatch(setCartItems(JSON.parse(savedCart)));
          } catch (e) {
            console.error("Failed to parse cart from localStorage", e);
          }
        }
      }
      isInitialLoad.current = false;
    };
    loadCart();
  }, [session, dispatch]);

  // 2. Sync with LocalStorage (only if not logged in)
  useEffect(() => {
    if (!isInitialLoad.current && !session?.user) {
      localStorage.setItem("kitobdosh_cart", JSON.stringify(cartItems));
    }
  }, [cartItems, session]);

  return null; // This component handles side effects only
}
