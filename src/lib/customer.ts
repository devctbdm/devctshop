import "server-only"

import { and, desc, eq } from "drizzle-orm"

import { db } from "@/db"
import { downloads, orderItems, orders, payments, wishlist } from "@/db/schema"
import { getDatabaseProductBySlug } from "@/lib/catalog"

export async function getCustomerOrders(userId: string) {
  return db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      status: orders.status,
      subtotalCents: orders.subtotalCents,
      discountCents: orders.discountCents,
      totalCents: orders.totalCents,
      currency: orders.currency,
      createdAt: orders.createdAt,
      paidAt: orders.paidAt,
      paymentStatus: payments.status,
    })
    .from(orders)
    .leftJoin(payments, eq(payments.orderId, orders.id))
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt))
}

export async function getCustomerOrder(userId: string, orderNumber: string) {
  const [order] = await db
    .select({ order: orders, payment: payments })
    .from(orders)
    .leftJoin(payments, eq(payments.orderId, orders.id))
    .where(and(eq(orders.userId, userId), eq(orders.orderNumber, orderNumber)))
    .limit(1)
  if (!order) return null

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.order.id))
  return { ...order, items }
}

export async function getCustomerDownloads(userId: string) {
  const rows = await db
    .select()
    .from(downloads)
    .where(eq(downloads.userId, userId))
    .orderBy(desc(downloads.createdAt))

  return Promise.all(rows.map(async (download) => ({ ...download, product: await getDatabaseProductBySlug(download.productSlug) })))
}

export async function getCustomerWishlist(userId: string) {
  const rows = await db
    .select()
    .from(wishlist)
    .where(eq(wishlist.userId, userId))
    .orderBy(desc(wishlist.createdAt))

  const mapped = await Promise.all(rows.map(async (item) => ({ ...item, product: item.productSlug ? await getDatabaseProductBySlug(item.productSlug) : undefined })))
  return mapped
    .filter((item) => item.product)
}
