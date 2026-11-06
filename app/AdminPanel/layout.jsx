import { requireRole } from "@/lib/require-role";
import { redirect } from "next/navigation";
// app/AdminPanel/layout.jsx
import AdminLayout from "./AdminLayout";

export default async function Layout({ children }) {
  const denied = await requireRole();
  if (denied) redirect('/');
  return <AdminLayout>{children}</AdminLayout>;
}
