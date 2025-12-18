"use client";

import { createContext, useContext } from "react";

const AdminContext = createContext();

export function useAdmin() {
  return useContext(AdminContext);
}

export default AdminContext;
