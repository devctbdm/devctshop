import { requireUser } from "@/lib/auth/session"
import { calculateOrder, findPendingOrder } from "@/lib/orders"
import { CheckoutContent } from "@/components/checkout-content"

type CheckoutPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export const metadata = {
  title: "Checkout — Devct Shop",
  description: "Complete your digital product order.",
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const user = await requireUser()
  const params = await searchParams
  const orderNumber = first(params.order)

  if (orderNumber) {
    const order = await findPendingOrder(user.id, orderNumber)
    if (order) return <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8"><CheckoutContent items={[]} initialQuote={{ subtotalCents: order.subtotalCents, discountCents: order.discountCents, totalCents: order.totalCents, couponCode: null, ownedSlugs: [], itemSlugs: [] }} orderNumber={order.orderNumber} /></div>
  }

  let items: { slug: string }[] = []
  try {
    const parsed = JSON.parse(first(params.items) ?? "[]")
    items = Array.isArray(parsed) ? parsed.filter((item): item is { slug: string } => typeof item?.slug === "string") : []
  } catch {
    items = []
  }

  const quote = await calculateOrder(items, user.id, first(params.coupon))
  const products = quote.items

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <CheckoutContent
        items={products}
        initialQuote={{
          subtotalCents: quote.subtotalCents,
          discountCents: quote.discountCents,
          totalCents: quote.totalCents,
          couponCode: quote.couponCode,
          couponError: quote.couponError,
          ownedSlugs: quote.ownedSlugs,
          itemSlugs: products.map((product) => product.slug),
        }}
      />
    </div>
  )
}
