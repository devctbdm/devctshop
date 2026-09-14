import "server-only"

import { count, desc, eq, ilike, sql } from "drizzle-orm"
import { db } from "@/db"
import { downloads, orders, payments, reviews, users } from "@/db/schema"

export async function getAdminMetrics() {
  const [[revenue], [orderCount], [userCount], [downloadCount], [reviewCount]] = await Promise.all([
    db.select({ value: sql<number>`coalesce(sum(${orders.totalCents}), 0)` }).from(orders).where(eq(orders.status, "paid")),
    db.select({ value: count() }).from(orders),
    db.select({ value: count() }).from(users),
    db.select({ value: count() }).from(downloads),
    db.select({ value: count() }).from(reviews),
  ])
  return { revenueCents: Number(revenue.value), orders: Number(orderCount.value), users: Number(userCount.value), downloads: Number(downloadCount.value), reviews: Number(reviewCount.value) }
}

export async function getAdminOrders(search?: string) {
  return db.select({ order: orders, paymentStatus: payments.status }).from(orders).leftJoin(payments, eq(payments.orderId, orders.id)).where(search ? ilike(orders.orderNumber, `%${search}%`) : undefined).orderBy(desc(orders.createdAt)).limit(100)
}

export async function getAdminUsers(search?: string) {
  return db.select().from(users).where(search ? ilike(users.email, `%${search}%`) : undefined).orderBy(desc(users.createdAt)).limit(100)
}

export async function getAdminPayments(search?: string) {
  return db.select({ payment: payments, orderNumber: orders.orderNumber, email: users.email }).from(payments).innerJoin(orders, eq(payments.orderId, orders.id)).leftJoin(users, eq(payments.userId, users.id)).where(search ? ilike(payments.transactionId, `%${search}%`) : undefined).orderBy(desc(payments.createdAt)).limit(100)
}

export async function getAdminDownloads(search?: string) {
  return db.select({ download: downloads, email: users.email, orderNumber: orders.orderNumber }).from(downloads).leftJoin(users, eq(downloads.userId, users.id)).leftJoin(orders, eq(downloads.orderId, orders.id)).where(search ? ilike(downloads.productSlug, `%${search}%`) : undefined).orderBy(desc(downloads.createdAt)).limit(100)
}

export async function getAdminReviews(search?: string) {
  return db.select({ review: reviews, email: users.email }).from(reviews).innerJoin(users, eq(reviews.userId, users.id)).where(search ? ilike(reviews.title, `%${search}%`) : undefined).orderBy(desc(reviews.createdAt)).limit(100)
}
