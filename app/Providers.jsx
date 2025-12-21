"use client";

import { FavoritesProvider } from "./FavoritesContext";
import { CartProvider } from "./CartContext";
import { Toaster } from "react-hot-toast";
import StoreProvider from "./StoreProvider";
import CartSync from "./CartSync";
import AuthSync from "./AuthSync";
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }) {
  return (
    <StoreProvider>
      <SessionProvider>
        <AuthSync />
        <CartSync />
        <CartProvider>
          <FavoritesProvider>
            {children}
            <Toaster 
              position="top-center"
              reverseOrder={false}
              gutter={8}
              toastOptions={{
                duration: 3000,
                style: {
                  background: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  color: '#1f2937',
                  padding: '16px 24px',
                  borderRadius: '24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  maxWidth: '350px',
                  margin: '20px 16px 0 16px',
                },
                success: {
                  iconTheme: {
                    primary: '#52C6DA',
                    secondary: '#fff',
                  },
                },
                error: {
                  style: {
                    background: 'rgba(254, 242, 242, 0.9)',
                    color: '#991b1b',
                    border: '1px solid rgba(248, 113, 113, 0.2)',
                  },
                  iconTheme: {
                    primary: '#f87171',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </FavoritesProvider>
        </CartProvider>
      </SessionProvider>
    </StoreProvider>
  );
}
