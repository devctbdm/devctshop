"use client"

import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  CheckIcon,
  DownloadIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  ZapIcon,
} from "lucide-react"
import { discountPercent, formatPrice, type Product } from "@/lib/products"

export function PurchaseCard({ product }: { product: Product }) {
  const [cart, setCart] = React.useState(false)
  const discount = discountPercent(product)
  const onSale = product.salePrice != null
  const price = product.salePrice ?? product.price

  function add() {
    setCart(true)
  }
  function buy() {
    setCart(true)
  }

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-end justify-between">
        <div className="flex items-baseline gap-2.5">
          {onSale ? (
            <span className="text-lg text-muted-foreground line-through">
              {formatPrice(product.price)}
            </span>
          ) : null}
          <span className="font-heading text-3xl font-semibold tracking-tight">
            {formatPrice(price)}
          </span>
          {discount ? (
            <Badge className="bg-rose-500 text-white hover:bg-rose-500">
              Save {discount}%
            </Badge>
          ) : null}
        </div>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        One-time purchase. Includes {product.license.label.toLowerCase()}.
      </p>

      <div className="mt-5 flex flex-col gap-2.5">
        <Button size="lg" onClick={buy} className="w-full">
          <ZapIcon className="size-4" data-icon="inline-start" />
          Buy now
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={add}
          className="w-full"
          aria-pressed={cart}
        >
          {cart ? (
            <CheckIcon className="size-4" data-icon="inline-start" />
          ) : (
            <ShoppingCartIcon className="size-4" data-icon="inline-start" />
          )}
          {cart ? "Added to cart" : "Add to cart"}
        </Button>
      </div>

      <Separator className="my-5" />

      <ul className="space-y-2.5 text-sm text-muted-foreground">
        <li className="flex items-center gap-2.5">
          <DownloadIcon className="size-4 text-foreground/70" />
          Instant download after purchase
        </li>
        <li className="flex items-center gap-2.5">
          <ShieldCheckIcon className="size-4 text-foreground/70" />
          {product.license.label} included
        </li>
        <li className="flex items-center gap-2.5">
          <CheckIcon className="size-4 text-foreground/70" />
          Lifetime updates for the major version
        </li>
      </ul>
    </div>
  )
}
