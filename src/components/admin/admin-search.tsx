"use client"

import { usePathname, useRouter } from "next/navigation"
import { SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"

export function AdminSearch({ value = "" }: { value?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  return <div className="relative w-full sm:w-64"><SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" /><Input defaultValue={value} placeholder="Search…" className="pl-8" onKeyDown={(event) => { if (event.key === "Enter") { const next = new URLSearchParams(); const value = event.currentTarget.value.trim(); if (value) next.set("q", value); router.push(`${pathname}${next.toString() ? `?${next}` : ""}`) } }} /></div>
}
