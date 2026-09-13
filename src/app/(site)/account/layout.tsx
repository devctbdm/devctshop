import { requireUser } from "@/lib/auth/session"

export const metadata = { title: "Account" }

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireUser()

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8 flex items-center gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Account
          </h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>
      {children}
    </div>
  )
}
