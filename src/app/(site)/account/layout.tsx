import { requireUser } from "@/lib/auth/session"
import { CustomerNav } from "@/components/customer-nav"

export const metadata = { title: "Account", robots: { index: false, follow: false } }

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireUser()

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-8">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight">Account</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>
      <div className="grid gap-8 lg:grid-cols-[210px_1fr] lg:items-start">
        <CustomerNav active="/account" />
        <main className="min-w-0 max-w-2xl">{children}</main>
      </div>
    </div>
  )
}
