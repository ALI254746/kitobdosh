"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const { data: session } = useSession();
    const [favorites, setFavorites] = useState([]); // Array of book IDs
    const [loading, setLoading] = useState(false);

    // Fetch favorites on mount
    useEffect(() => {
        if (!session?.user?.id) {
            setFavorites([]);
            return;
        }

        const fetchFavorites = async () => {
            try {
                const res = await fetch('/api/user/favorites');
                const data = await res.json();
                if (data.success) {
                    // Extract only IDs if populated
                    setFavorites(data.favorites.map(f => typeof f === 'object' ? f._id : f));
                }
            } catch (error) {
                console.error("Fetch Favorites Error:", error);
            }
        };

        fetchFavorites();
    }, [session]);

    const toggleFavorite = async (bookId) => {
        if (!session?.user?.id) {
            toast.error("Iltimos, avval tizimga kiring");
            return;
        }

        const isFavorited = favorites.includes(bookId);
        
        // Optimistic Update
        setFavorites(prev => 
            isFavorited 
                ? prev.filter(id => id !== bookId)
                : [...prev, bookId]
        );

        try {
            const res = await fetch('/api/user/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookId })
            });
            const data = await res.json();
            
            if (!data.success) {
                // Rollback if failed
                setFavorites(prev => 
                    isFavorited ? [...prev, bookId] : prev.filter(id => id !== bookId)
                );
                toast.error("Xatolik yuz berdi, iltimos qayta urinib ko'ring ✨");
            } else {
                if (data.isFavorite) {
                    toast.success("Ushbu mo'jiza endi qalbingizga yaqinroq ❤️");
                } else {
                    toast.error("Kitob sekingina sevimlilardan uzoqlashdi... 💔");
                }
            }
        } catch (error) {
            // Rollback
            setFavorites(prev => 
                isFavorited ? [...prev, bookId] : prev.filter(id => id !== bookId)
            );
            console.error("Toggle Favorite Error:", error);
        }
    };

    const isFavorite = (bookId) => favorites.includes(bookId);

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, loading }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => useContext(FavoritesContext);
