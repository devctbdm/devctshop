import Link from "next/link"
import { ShieldCheckIcon } from "lucide-react"

import { Logo } from "@/components/logo"
import { requireAdmin } from "@/lib/auth/session"

export const metadata = { title: "Admin" }

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Server-side authorization: unauthenticated users are redirected to login;
  // authenticated non-admins hit `forbidden()` and see the 403 page.
  const user = await requireAdmin()

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <Logo />
            <span className="flex items-center gap-1 rounded-full border bg-muted/50 px-2 py-0.5 text-xs font-medium text-muted-foreground">
              <ShieldCheckIcon className="size-3" />
              Admin
            </span>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link
              href="/"
              className="font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              View site
            </Link>
            <span className="hidden text-muted-foreground sm:inline">
              {user.email}
            </span>
          </nav>
        </div>
      </header>
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">{children}</div>
      </main>
    </div>
  )
}
