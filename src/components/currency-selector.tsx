"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { CURRENCIES, type Currency } from "@/lib/currency"

export function CurrencySelector() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currency = React.useSyncExternalStore(
    (callback) => {
      window.addEventListener("devct-currency-change", callback)
      return () => window.removeEventListener("devct-currency-change", callback)
    },
    () => {
      const saved = window.localStorage.getItem("devct-currency")
      return saved === "BDT" ? "BDT" : "USD"
    },
    () => "USD",
  ) as Currency

  function change(value: Currency) {
    window.localStorage.setItem("devct-currency", value)
    window.dispatchEvent(new Event("devct-currency-change"))
    const params = new URLSearchParams(searchParams.toString())
    params.set("currency", value)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return <select aria-label="Currency" value={currency} onChange={(event) => change(event.target.value as Currency)} className="h-8 rounded-lg border border-input bg-background px-2 text-xs font-medium text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"><option value="USD">USD {CURRENCIES.USD.symbol}</option><option value="BDT">BDT {CURRENCIES.BDT.symbol}</option></select>
}
