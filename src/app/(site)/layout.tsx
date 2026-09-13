import { auth } from "@/lib/auth/auth"
import { findUserById, toPublicUser } from "@/lib/auth/users"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { TooltipProvider } from "@/components/ui/tooltip"

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  const id = session?.user?.id
  let user = null
  if (id) {
    const row = await findUserById(id)
    if (row && row.isActive) user = toPublicUser(row)
  }

  return (
    <TooltipProvider delay={300}>
      <div className="flex min-h-dvh flex-col">
        <SiteHeader
          user={
            user
              ? {
                  name: user.fullName,
                  email: user.email,
                  image: user.avatarUrl,
                  role: user.role,
                }
              : null
          }
        />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </TooltipProvider>
  )
}
