import { requireUser } from "@/lib/auth/session"
import { CustomerNav } from "@/components/customer-nav"

export async function CustomerShell({
  children,
  active,
  title,
  description,
}: {
  children: React.ReactNode
  active?: string
  title: string
  description?: string
}) {
  const user = await requireUser()
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-medium text-muted-foreground">Welcome back, {user.fullName.split(" ")[0]}</p>
        <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight">{title}</h1>
        {description ? <p className="mt-2 text-muted-foreground">{description}</p> : null}
      </div>
      <div className="grid gap-8 lg:grid-cols-[210px_1fr] lg:items-start">
        <CustomerNav active={active} />
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  )
}
