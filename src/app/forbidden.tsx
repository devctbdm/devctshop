import Link from "next/link"

import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { ShieldAlertIcon } from "lucide-react"

export default function Forbidden() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex h-16 items-center border-b px-4 sm:px-6 lg:px-8">
        <Logo />
      </header>
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="flex max-w-sm flex-col items-center gap-4 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
            <ShieldAlertIcon className="size-7 text-destructive" />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="font-heading text-2xl font-semibold tracking-tight">
              403 — Access denied
            </h1>
            <p className="text-sm text-muted-foreground">
              You don&apos;t have permission to view this page. If you believe this
              is a mistake, contact an administrator.
            </p>
          </div>
          <div className="flex gap-2">
            <Button render={<Link href="/" />}>Back to home</Button>
            <Button variant="outline" render={<Link href="/account" />}>
              My account
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
