"use client";

import { createContext, useContext } from "react";

const AdminContext = createContext({
    appearance: 'light',
    setAppearance: () => {},
    fontFamily: 'Inter',
    setFontFamily: () => {},
    sidebarOpen: false,
    setSidebarOpen: () => {},
    darkMode: false,
    setDarkMode: () => {}
});

export function useAdmin() {
  return useContext(AdminContext);
}

export default AdminContext;
