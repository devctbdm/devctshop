"use client"

import Link from "next/link"
import * as React from "react"
import { ArrowRightIcon, MinusIcon, PlusIcon, Trash2Icon } from "lucide-react"

import { ProductCover } from "@/components/product-cover"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/products"
import { useCartStore } from "@/stores/cart-store"

export function CartPageContent() {
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const clear = useCartStore((state) => state.clear)
  const [hydrated, setHydrated] = React.useState(false)
  const [couponCode, setCouponCode] = React.useState("")

  React.useEffect(() => {
    const unsubscribe = useCartStore.persist.onFinishHydration(() => setHydrated(true))
    void useCartStore.persist.rehydrate()
    return unsubscribe
  }, [])

  const subtotal = items.reduce((sum, item) => sum + (item.salePrice ?? item.price), 0)
  const checkoutItems = encodeURIComponent(JSON.stringify(items.map((item) => ({ slug: item.slug }))))
  const checkoutHref = `/checkout?items=${checkoutItems}${couponCode.trim() ? `&coupon=${encodeURIComponent(couponCode.trim())}` : ""}`

  if (!hydrated) return <div className="min-h-[40vh]" aria-busy="true" />

  if (!items.length) {
    return (
      <div className="flex min-h-[45vh] flex-col items-center justify-center gap-4 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <span className="text-2xl">0</span>
        </div>
        <div>
          <h2 className="font-heading text-xl font-semibold">Your cart is empty</h2>
          <p className="mt-1 text-sm text-muted-foreground">Find a production-ready starting point for your next project.</p>
        </div>
        <Button render={<Link href="/products" />}>Browse products</Button>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.slug} className="flex gap-4 rounded-xl border bg-card p-3 sm:p-4">
            <ProductCover seed={item.slug} className="size-24 shrink-0 rounded-lg sm:size-32" />
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link href={`/products/${item.slug}`} className="font-heading text-sm font-semibold hover:underline sm:text-base">
                    {item.name}
                  </Link>
                  <p className="mt-1 text-xs text-muted-foreground">Digital product · instant download</p>
                </div>
                <button type="button" onClick={() => removeItem(item.slug)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive" aria-label={`Remove ${item.name}`}>
                  <Trash2Icon className="size-4" />
                </button>
              </div>
              <div className="mt-auto flex items-end justify-between gap-3 pt-3">
                <div className="inline-flex items-center rounded-md border">
                  <span className="px-2 py-1 text-xs text-muted-foreground">Qty</span>
                  <button type="button" disabled aria-label="Digital products have quantity one" className="border-l px-2 py-1 text-muted-foreground opacity-50"><MinusIcon className="size-3" /></button>
                  <span className="px-2 text-sm">1</span>
                  <button type="button" disabled aria-label="Digital products have quantity one" className="border-l px-2 py-1 text-muted-foreground opacity-50"><PlusIcon className="size-3" /></button>
                </div>
                <span className="font-heading text-base font-semibold">{formatPrice(item.salePrice ?? item.price)}</span>
              </div>
            </div>
          </div>
        ))}
        <button type="button" onClick={clear} className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">Clear cart</button>
      </div>

      <aside className="rounded-xl border bg-card p-5 lg:sticky lg:top-20">
        <h2 className="font-heading text-lg font-semibold">Order summary</h2>
        <div className="mt-5 flex items-center justify-between text-sm text-muted-foreground">
          <span>Subtotal</span><span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
          <span>Discount</span><span>$0</span>
        </div>
        <div className="mt-4 border-t pt-4 flex items-center justify-between">
          <span className="font-heading font-semibold">Total</span><span className="font-heading text-xl font-semibold">{formatPrice(subtotal)}</span>
        </div>
        <label className="mt-5 block text-sm font-medium" htmlFor="cart-coupon">Coupon code</label>
        <input id="cart-coupon" value={couponCode} onChange={(event) => setCouponCode(event.target.value)} placeholder="Optional" className="mt-2 h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50" />
        <Button className="mt-4 w-full" size="lg" render={<Link href={checkoutHref} />}>
          Continue to checkout <ArrowRightIcon className="size-4" />
        </Button>
        <p className="mt-3 text-center text-xs text-muted-foreground">No shipping address needed. Digital delivery only.</p>
      </aside>
    </div>
  )
}
