"use client"

import * as React from "react"
import { CheckIcon, ShoppingCartIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useCartStore, type CartItem } from "@/stores/cart-store"

export function AddToCartButton({
  item,
  size = "default",
  className,
}: {
  item: CartItem
  size?: "default" | "sm" | "lg"
  className?: string
}) {
  const addItem = useCartStore((state) => state.addItem)
  const inCart = useCartStore((state) => state.items.some((current) => current.slug === item.slug))
  const [hydrated, setHydrated] = React.useState(false)
  const [owned, setOwned] = React.useState(false)

  React.useEffect(() => {
    const unsubscribe = useCartStore.persist.onFinishHydration(() => setHydrated(true))
    void useCartStore.persist.rehydrate()
    return unsubscribe
  }, [])

  React.useEffect(() => {
    let active = true
    fetch(`/api/purchases/check?slug=${encodeURIComponent(item.slug)}`)
      .then((response) => (response.ok ? response.json() : { owned: false }))
      .then((result: { owned?: boolean }) => {
        if (active) setOwned(Boolean(result.owned))
      })
      .catch(() => undefined)
    return () => {
      active = false
    }
  }, [item.slug])

  if (owned) {
    return (
      <Button type="button" size={size} variant="secondary" className={className} disabled>
        <CheckIcon className="size-4" />
        Purchased
      </Button>
    )
  }

  return (
    <Button
      type="button"
      variant={hydrated && inCart ? "secondary" : "outline"}
      size={size}
      className={className}
      onClick={() => addItem(item)}
      aria-pressed={hydrated && inCart}
    >
      {hydrated && inCart ? <CheckIcon className="size-4" /> : <ShoppingCartIcon className="size-4" />}
      {hydrated && inCart ? "In cart" : "Add to cart"}
    </Button>
  )
}
