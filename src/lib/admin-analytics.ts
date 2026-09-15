import "server-only"

import { and, desc, eq, gte, lt, sql } from "drizzle-orm"
import { db } from "@/db"
import { downloads, orderItems, orders, users } from "@/db/schema"

export type AnalyticsRange = "today" | "yesterday" | "7d" | "30d" | "90d" | "year"

function rangeBounds(range: AnalyticsRange) {
  const end = new Date()
  const start = new Date(end)
  if (range === "today") start.setHours(0, 0, 0, 0)
  else if (range === "yesterday") { start.setDate(start.getDate() - 1); start.setHours(0, 0, 0, 0); end.setDate(end.getDate() - 1); end.setHours(23, 59, 59, 999) }
  else if (range === "year") { start.setMonth(0, 1); start.setHours(0, 0, 0, 0) }
  else { const days = range === "7d" ? 7 : range === "90d" ? 90 : 30; start.setDate(start.getDate() - days); start.setHours(0, 0, 0, 0) }
  return { start, end }
}

export async function getAdminAnalytics(range: AnalyticsRange = "30d") {
  const { start, end } = rangeBounds(range)
  const periodMs = end.getTime() - start.getTime()
  const previousStart = new Date(start.getTime() - periodMs)
  const paidFilter = and(eq(orders.status, "paid"), gte(orders.createdAt, start), lt(orders.createdAt, end))
  const previousPaidFilter = and(eq(orders.status, "paid"), gte(orders.createdAt, previousStart), lt(orders.createdAt, start))
  const [[summary], [productsSold], [previous], [downloadSummary], [customerSummary], revenueSeries, orderSeries, topProducts, recentOrders] = await Promise.all([
    db.select({ revenue: sql<number>`coalesce(sum(${orders.totalCents}), 0)`, orders: sql<number>`count(*)`, customers: sql<number>`count(distinct ${orders.userId})` }).from(orders).where(paidFilter),
    db.select({ value: sql<number>`coalesce(sum(${orderItems.quantity}), 0)` }).from(orderItems).innerJoin(orders, eq(orderItems.orderId, orders.id)).where(paidFilter),
    db.select({ revenue: sql<number>`coalesce(sum(${orders.totalCents}), 0)`, orders: sql<number>`count(*)` }).from(orders).where(previousPaidFilter),
    db.select({ total: sql<number>`count(*)` }).from(downloads).where(and(gte(downloads.createdAt, start), lt(downloads.createdAt, end))),
    db.select({ total: sql<number>`count(*)` }).from(users).where(and(gte(users.createdAt, start), lt(users.createdAt, end))),
    db.select({ date: sql<string>`to_char(date_trunc('day', ${orders.createdAt}), 'YYYY-MM-DD')`, revenue: sql<number>`coalesce(sum(${orders.totalCents}), 0)`, }).from(orders).where(paidFilter).groupBy(sql`date_trunc('day', ${orders.createdAt})`).orderBy(sql`date_trunc('day', ${orders.createdAt})`),
    db.select({ date: sql<string>`to_char(date_trunc('day', ${orders.createdAt}), 'YYYY-MM-DD')`, orders: sql<number>`count(*)` }).from(orders).where(and(gte(orders.createdAt, start), lt(orders.createdAt, end))).groupBy(sql`date_trunc('day', ${orders.createdAt})`).orderBy(sql`date_trunc('day', ${orders.createdAt})`),
    db.select({ name: orderItems.productName, sales: sql<number>`sum(${orderItems.quantity})`, revenue: sql<number>`sum(${orderItems.totalCents})`, downloads: sql<number>`count(${downloads.id})` }).from(orderItems).innerJoin(orders, eq(orderItems.orderId, orders.id)).leftJoin(downloads, eq(downloads.orderId, orders.id)).where(and(eq(orders.status, "paid"), gte(orders.createdAt, start), lt(orders.createdAt, end))).groupBy(orderItems.productName).orderBy(desc(sql`sum(${orderItems.quantity})`)).limit(5),
    db.select({ order: orders, email: users.email, product: orderItems.productName }).from(orders).leftJoin(users, eq(orders.userId, users.id)).leftJoin(orderItems, eq(orderItems.orderId, orders.id)).orderBy(desc(orders.createdAt)).limit(8),
  ])
  return { range, start, end, summary: { revenue: Number(summary.revenue), orders: Number(summary.orders), customers: Number(summary.customers), productsSold: Number(productsSold.value) }, previous: { revenue: Number(previous.revenue), orders: Number(previous.orders) }, downloads: Number(downloadSummary.total), newCustomers: Number(customerSummary.total), revenueSeries: revenueSeries.map((item) => ({ date: item.date, revenue: Number(item.revenue) })), orderSeries: orderSeries.map((item) => ({ date: item.date, orders: Number(item.orders) })), topProducts: topProducts.map((item) => ({ name: item.name, sales: Number(item.sales), revenue: Number(item.revenue), downloads: Number(item.downloads) })), recentOrders }
}
