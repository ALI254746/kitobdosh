import { cartItemTotal } from '../../order-input.mjs';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'failed'
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.items = action.payload;
    },
    addItem: (state, action) => {
      const { product, type = 'buy', rentDays = 1 } = action.payload;
      const cartId = `${product._id}-${type}`;
      
      const existingItem = state.items.find((item) => item.cartId === cartId);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          ...product,
          cartId,
          type,
          quantity: 1,
          rentDays: type === 'rent' ? rentDays : 0,
        });
      }
    },
    removeItem: (state, action) => {
      const cartId = action.payload;
      state.items = state.items.filter((item) => item.cartId !== cartId);
    },
    updateQuantity: (state, action) => {
      const { cartId, delta } = action.payload;
      const item = state.items.find((i) => i.cartId === cartId);
      if (item) {
        item.quantity = Math.max(1, item.quantity + delta);
      }
    },
    updateRentDays: (state, action) => {
      const { cartId, rentDays } = action.payload;
      const item = state.items.find((i) => i.cartId === cartId);
      if (item) {
        item.rentDays = rentDays;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { setCartItems, addItem, removeItem, updateQuantity, updateRentDays, clearCart } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => {
  return state.cart.items.reduce((total, item) => {
    return total + cartItemTotal(item);
  }, 0);
};

export default cartSlice.reducer;
