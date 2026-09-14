import "server-only"

import { and, eq, inArray } from "drizzle-orm"

import { db } from "@/db"
import { coupons, orderItems, orders } from "@/db/schema"
import { getProductBySlug, type Product } from "@/lib/products"

export type OrderLineInput = { slug: string }

export type OrderCalculation = {
  items: Product[]
  ownedSlugs: string[]
  subtotalCents: number
  discountCents: number
  totalCents: number
  couponId: string | null
  couponCode: string | null
  couponError?: "invalid_coupon" | "expired_coupon" | "coupon_not_applicable"
}

function cents(value: number) {
  return Math.round(value * 100)
}

function productPrice(product: Product) {
  return cents(product.salePrice ?? product.price)
}

export async function getOwnedProductSlugs(userId: string, slugs: string[]) {
  if (!slugs.length) return new Set<string>()

  const rows = await db
    .select({ slug: orderItems.productSlug })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .where(
      and(
        eq(orders.userId, userId),
        eq(orders.status, "paid"),
        inArray(orderItems.productSlug, slugs),
      ),
    )

  return new Set(rows.map((row) => row.slug).filter((slug): slug is string => Boolean(slug)))
}

async function findCoupon(code: string) {
  const [coupon] = await db
    .select()
    .from(coupons)
    .where(eq(coupons.code, code.trim().toUpperCase()))
    .limit(1)

  return coupon ?? null
}

export async function calculateOrder(
  lineInputs: OrderLineInput[],
  userId?: string,
  couponCode?: string,
): Promise<OrderCalculation> {
  const uniqueSlugs = [...new Set(lineInputs.map((line) => line.slug))]
  const products = uniqueSlugs
    .map((slug) => getProductBySlug(slug))
    .filter((product): product is Product => Boolean(product && product.published))

  const owned = userId ? await getOwnedProductSlugs(userId, products.map((product) => product.slug)) : new Set<string>()
  const items = products.filter((product) => !owned.has(product.slug))
  const ownedSlugs = products.filter((product) => owned.has(product.slug)).map((product) => product.slug)
  const subtotalCents = items.reduce((sum, product) => sum + productPrice(product), 0)

  if (!couponCode?.trim()) {
    return {
      items,
      ownedSlugs,
      subtotalCents,
      discountCents: 0,
      totalCents: subtotalCents,
      couponId: null,
      couponCode: null,
    }
  }

  const coupon = await findCoupon(couponCode)
  if (!coupon) {
    return {
      items,
      ownedSlugs,
      subtotalCents,
      discountCents: 0,
      totalCents: subtotalCents,
      couponId: null,
      couponCode: null,
      couponError: "invalid_coupon",
    }
  }

  const now = new Date()
  if (
    coupon.status !== "active" ||
    coupon.validFrom > now ||
    (coupon.validUntil && coupon.validUntil < now) ||
    (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit)
  ) {
    return {
      items,
      ownedSlugs,
      subtotalCents,
      discountCents: 0,
      totalCents: subtotalCents,
      couponId: null,
      couponCode: null,
      couponError: "expired_coupon",
    }
  }

  if (subtotalCents < coupon.minOrderCents) {
    return {
      items,
      ownedSlugs,
      subtotalCents,
      discountCents: 0,
      totalCents: subtotalCents,
      couponId: null,
      couponCode: null,
      couponError: "coupon_not_applicable",
    }
  }

  const rawDiscount =
    coupon.discountType === "percent"
      ? Math.floor((subtotalCents * coupon.discountValue) / 100)
      : coupon.discountValue
  const discountCents = Math.min(
    subtotalCents,
    coupon.maxDiscountCents ? Math.min(rawDiscount, coupon.maxDiscountCents) : rawDiscount,
  )

  return {
    items,
    ownedSlugs,
    subtotalCents,
    discountCents,
    totalCents: subtotalCents - discountCents,
    couponId: coupon.id,
    couponCode: coupon.code,
  }
}

function orderNumber() {
  const suffix = crypto.randomUUID().replaceAll("-", "").slice(0, 10).toUpperCase()
  return `DEV-${suffix}`
}

export async function createPendingOrder({
  userId,
  email,
  fullName,
  lines,
  couponCode,
}: {
  userId: string
  email: string
  fullName: string
  lines: OrderLineInput[]
  couponCode?: string
}) {
  const calculation = await calculateOrder(lines, userId, couponCode)
  if (calculation.couponError) throw new Error(calculation.couponError)
  if (!calculation.items.length) throw new Error("empty_order")

  return db.transaction(async (tx) => {
    const [order] = await tx
      .insert(orders)
      .values({
        orderNumber: orderNumber(),
        userId,
        status: "pending",
        subtotalCents: calculation.subtotalCents,
        discountCents: calculation.discountCents,
        couponId: calculation.couponId,
        totalCents: calculation.totalCents,
        billingEmail: email,
        billingName: fullName,
      })
      .returning({ id: orders.id, orderNumber: orders.orderNumber, totalCents: orders.totalCents })

    await tx.insert(orderItems).values(
      calculation.items.map((product) => {
        const unitPriceCents = productPrice(product)
        return {
          orderId: order.id,
          productId: null,
          productName: product.name,
          productSlug: product.slug,
          quantity: 1,
          unitPriceCents,
          discountCents: 0,
          totalCents: unitPriceCents,
        }
      }),
    )

    return { ...order, calculation }
  })
}

export async function findPendingOrder(userId: string, orderNumber: string) {
  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.userId, userId), eq(orders.orderNumber, orderNumber), eq(orders.status, "pending")))
    .limit(1)
  return order ?? null
}
