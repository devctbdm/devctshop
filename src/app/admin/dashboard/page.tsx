import { redirect } from "next/navigation"

import { requireAdmin } from "@/lib/auth/session"

export default async function LegacyAdminDashboardPage() {
  await requireAdmin()
  redirect("/admin")
}
