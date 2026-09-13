import Link from "next/link"

import { Logo } from "@/components/logo"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex h-16 items-center justify-between border-b px-4 sm:px-6 lg:px-8">
        <Logo />
        <Link
          href="/"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Back to home
        </Link>
      </header>
      <main className="flex flex-1 items-start justify-center px-4 py-10 sm:items-center sm:py-16">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  )
}
