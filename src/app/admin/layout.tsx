import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { requireAdmin } from "@/lib/auth/session"

export const metadata = { title: "Admin", robots: { index: false, follow: false } }

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Server-side authorization: unauthenticated users are redirected to login;
  // authenticated non-admins hit `forbidden()` and see the 403 page.
  const user = await requireAdmin()

  return <AdminSidebar user={user}>{children}</AdminSidebar>
}
