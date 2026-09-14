"use client"

import Link from "next/link"
import * as React from "react"
import { ArrowLeftIcon, ArrowRightIcon, CheckCircle2Icon, LockKeyholeIcon, TagIcon } from "lucide-react"

import { ProductCover } from "@/components/product-cover"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/products"
import type { Product } from "@/lib/products"

type Quote = {
  subtotalCents: number
  discountCents: number
  totalCents: number
  couponCode: string | null
  couponError?: string
  ownedSlugs: string[]
  itemSlugs: string[]
}

export function CheckoutContent({
  items,
  initialQuote,
  orderNumber,
}: {
  items: Product[]
  initialQuote: Quote
  orderNumber?: string
}) {
  const [couponCode, setCouponCode] = React.useState(initialQuote.couponCode ?? "")
  const [quote, setQuote] = React.useState(initialQuote)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function refreshQuote() {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/checkout/quote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ items: items.map((item) => ({ slug: item.slug })), couponCode }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? "Unable to calculate your order.")
      setQuote(result)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to calculate your order.")
    } finally {
      setLoading(false)
    }
  }

  async function startPayment() {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/payments/sslcommerz/initiate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ items: items.map((item) => ({ slug: item.slug })), couponCode }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? "Unable to create your order.")
      if (!result.redirectUrl) throw new Error("Payment gateway did not return a redirect URL.")
      window.location.href = result.redirectUrl
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to create your order.")
      setLoading(false)
    }
  }

  if (orderNumber) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2Icon className="size-7" />
        </span>
        <h1 className="mt-5 font-heading text-2xl font-semibold">Order created</h1>
        <p className="mt-2 text-muted-foreground">Order <span className="font-medium text-foreground">{orderNumber}</span> is pending payment. Payment integration will be connected next.</p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button render={<Link href="/products" />}>Continue browsing</Button>
          <Button variant="outline" render={<Link href="/account" />}>View account</Button>
        </div>
      </div>
    )
  }

  const productMap = new Map(items.map((item) => [item.slug, item]))
  const visibleItems = quote.itemSlugs.map((slug) => productMap.get(slug)).filter((item): item is Product => Boolean(item))

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
      <div>
        <Button variant="ghost" size="sm" className="-ml-2 mb-5 gap-1.5 text-muted-foreground" render={<Link href="/cart" />}>
          <ArrowLeftIcon className="size-4" /> Back to cart
        </Button>
        <div className="rounded-xl border bg-card p-5 sm:p-6">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">Checkout</h1>
          <p className="mt-1 text-sm text-muted-foreground">Review your order. No shipping address is needed for digital products.</p>
          <div className="mt-6 divide-y">
            {visibleItems.map((item) => (
              <div key={item.slug} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <ProductCover seed={item.slug} className="size-14 shrink-0 rounded-md" />
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{item.name}</p><p className="text-xs text-muted-foreground">Digital license · instant delivery</p></div>
                <span className="text-sm font-medium">{formatPrice(item.salePrice ?? item.price)}</span>
              </div>
            ))}
          </div>
          {quote.ownedSlugs.length ? <p className="mt-5 rounded-lg bg-amber-500/10 p-3 text-sm text-amber-800 dark:text-amber-200">Already-owned products were removed from this order.</p> : null}
        </div>
      </div>

      <aside className="rounded-xl border bg-card p-5 lg:sticky lg:top-20">
        <h2 className="font-heading text-lg font-semibold">Order summary</h2>
        <div className="mt-5 space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatPrice(quote.subtotalCents / 100)}</span></div>
          <div className="flex justify-between text-muted-foreground"><span>Discount</span><span>-{formatPrice(quote.discountCents / 100)}</span></div>
          <div className="mt-3 flex justify-between border-t pt-3 font-heading font-semibold"><span>Total</span><span className="text-xl">{formatPrice(quote.totalCents / 100)}</span></div>
        </div>
        <div className="mt-5 flex gap-2">
          <div className="relative flex-1"><TagIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" /><input value={couponCode} onChange={(event) => setCouponCode(event.target.value)} placeholder="Coupon code" className="h-9 w-full rounded-lg border border-input bg-transparent pl-8 pr-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50" /></div>
          <Button type="button" variant="outline" size="sm" onClick={refreshQuote} disabled={loading}>Apply</Button>
        </div>
        {quote.couponError ? <p className="mt-2 text-xs text-destructive">{quote.couponError === "invalid_coupon" ? "That coupon code is not valid." : quote.couponError === "coupon_not_applicable" ? "This coupon does not apply to this order." : "This coupon has expired or is unavailable."}</p> : null}
        {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
        <Button className="mt-5 w-full" size="lg" onClick={startPayment} disabled={loading || !visibleItems.length}>
          <LockKeyholeIcon className="size-4" /> {loading ? "Connecting…" : "Pay securely"} <ArrowRightIcon className="size-4" />
        </Button>
        <p className="mt-3 text-center text-xs text-muted-foreground">Secure order creation. Payment will be added later.</p>
      </aside>
    </div>
  )
}
