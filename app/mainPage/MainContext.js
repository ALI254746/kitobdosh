"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const MainContext = createContext();

export const MainProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check local storage or system preference on mount
    const savedTheme = localStorage.getItem("mainTheme");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    // Save preference
    localStorage.setItem("mainTheme", darkMode ? "dark" : "light");
    // Apply class to body or html if needed, though usually we handle it in components
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <MainContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </MainContext.Provider>
  );
};

export const useMain = () => useContext(MainContext);
