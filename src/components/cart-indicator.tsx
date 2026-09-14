"use client"

import Link from "next/link"
import * as React from "react"
import { ShoppingCartIcon } from "lucide-react"

import { useCartStore } from "@/stores/cart-store"

export function CartIndicator() {
  const items = useCartStore((state) => state.items)
  const [hydrated, setHydrated] = React.useState(false)

  React.useEffect(() => {
    const unsubscribe = useCartStore.persist.onFinishHydration(() => setHydrated(true))
    void useCartStore.persist.rehydrate()
    return unsubscribe
  }, [])

  const count = hydrated ? items.length : 0

  return (
    <Link
      href="/cart"
      aria-label={count ? `Cart, ${count} item${count === 1 ? "" : "s"}` : "Cart"}
      className="relative flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <ShoppingCartIcon className="size-4" />
      {count ? (
        <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[0.6rem] font-semibold text-primary-foreground">
          {count > 9 ? "9+" : count}
        </span>
      ) : null}
    </Link>
  )
}
