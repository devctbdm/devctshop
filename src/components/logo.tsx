import Link from "next/link"

import { cn } from "@/lib/utils"

import { TerminalIcon } from "lucide-react"

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2", className)}
      aria-label="Devct Shop home"
    >
      <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <TerminalIcon className="size-4" />
      </span>
      <span className="font-heading text-[15px] font-semibold tracking-tight">
        Devct <span className="text-muted-foreground">Shop</span>
      </span>
    </Link>
  )
}
