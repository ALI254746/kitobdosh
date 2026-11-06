"use client";

import React, { createContext, useContext } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { 
  addItem, 
  removeItem, 
  updateQuantity as updateItemQty, 
  updateRentDays as updateItemRentDays,
  clearCart as clearAll, 
  selectCartItems, 
  selectCartTotal 
} from "../lib/features/cart/cartSlice";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const totalPrice = useSelector(selectCartTotal);

  // Updates are local immediately; synchronization failures are visible.
  const syncCart = async (url, options) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error('sync');
    } catch {
      toast.error("Savatcha shu qurilmada saqlandi. Server bilan sinxronlash hozir ishlamayapti.", { id: 'cart-sync' });
    }
  };
  const apiAddItem = item => syncCart('/api/cart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ item }) });
  const apiRemoveItem = cartId => syncCart(`/api/cart?cartId=${encodeURIComponent(cartId)}`, { method: 'DELETE' });

  const addToCart = (product, type = "buy", rentDays = 1) => {
    const cartId = `${product._id}-${type}`;
    const existingItem = cartItems.find(i => i.cartId === cartId);
    
    dispatch(addItem({ product, type, rentDays }));
    
    // Sync with server if logged in
    if (session?.user) {
      if (existingItem) {
        apiAddItem({ ...existingItem, quantity: existingItem.quantity + 1 });
      } else {
        apiAddItem({ ...product, cartId, type, quantity: 1, rentDays: type === "rent" ? rentDays : 0 });
      }
    }

    toast.success(existingItem ? "Yana bir nusxa bilim sari qadam! 📚" : "Kitob sayohati savatchangizdan boshlanadi! ✨");
  };

  const removeFromCart = (cartId) => {
    dispatch(removeItem(cartId));
    if (session?.user) apiRemoveItem(cartId);
    toast.error("Kitob sekingina savatchani tark etdi... 🕊️");
  };

  const updateQuantity = (cartId, delta) => {
    const item = cartItems.find(i => i.cartId === cartId);
    if (!item) return;

    dispatch(updateItemQty({ cartId, delta }));

    if (session?.user) {
      const newQuantity = Math.max(1, item.quantity + delta);
      if (item.quantity !== newQuantity) {
        apiAddItem({ ...item, quantity: newQuantity });
      }
    }
  };

  const updateRentDays = (cartId, rentDays) => {
    const item = cartItems.find(i => i.cartId === cartId);
    if (!item) return;

    dispatch(updateItemRentDays({ cartId, rentDays }));

    if (session?.user) {
      apiAddItem({ ...item, rentDays });
    }
  };

  const clearCart = () => {
    dispatch(clearAll());
    if (session?.user) {
      syncCart('/api/cart?clearAll=true', { method: 'DELETE' });
    }
    toast.success("Yangi bilimlarga joy ochildi! 🧹💎");
  };

  const getTotalPrice = () => totalPrice;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateRentDays,
        clearCart,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
