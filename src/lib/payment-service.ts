import "server-only"

import { and, eq, sql } from "drizzle-orm"

import { db } from "@/db"
import { coupons, downloads, orderItems, orders, payments } from "@/db/schema"
import { validateSslcommerzPayment } from "@/lib/sslcommerz"
import { getDatabaseProductBySlug } from "@/lib/catalog"

type GatewayData = Record<string, string | undefined>

function amountMatches(value: string | undefined, cents: number) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && Math.round(parsed * 100) === cents
}

export async function findOrderPayment(orderNumber: string) {
  const [row] = await db
    .select({ order: orders, payment: payments })
    .from(orders)
    .leftJoin(payments, eq(payments.orderId, orders.id))
    .where(eq(orders.orderNumber, orderNumber))
    .limit(1)
  return row ?? null
}

export async function recordPaymentAttempt({
  orderId,
  userId,
  amountCents,
  currency = "USD",
  sessionKey,
  rawResponse,
}: {
  orderId: string
  userId: string
  amountCents: number
  currency?: "USD" | "BDT"
  sessionKey?: string
  rawResponse?: GatewayData
}) {
  const [payment] = await db
    .insert(payments)
    .values({
      orderId,
      userId,
      gateway: "sslcommerz",
      status: "pending",
      amountCents,
      currency,
      sessionKey: sessionKey ?? null,
      rawResponse: rawResponse ?? null,
    })
    .onConflictDoNothing({ target: payments.orderId })
    .returning()

  return payment ?? null
}

export async function updatePaymentSession(orderId: string, sessionKey: string) {
  await db
    .update(payments)
    .set({ sessionKey, updatedAt: new Date() })
    .where(and(eq(payments.orderId, orderId), eq(payments.status, "pending")))
}

export async function processSslcommerzPayment(data: GatewayData) {
  const orderNumber = data.tran_id
  if (!orderNumber) throw new Error("missing_transaction_id")

  const current = await findOrderPayment(orderNumber)
  if (!current) throw new Error("order_not_found")
  if (current.order.status === "paid") return { order: current.order, payment: current.payment, alreadyProcessed: true }
  if (!current.payment) throw new Error("payment_not_initialized")

  const validationId = data.val_id
  if (!validationId) throw new Error("missing_validation_id")

  const validated = await validateSslcommerzPayment(validationId)
  const valid =
    (validated.status === "VALID" || validated.status === "VALIDATED") &&
    validated.tran_id === orderNumber &&
    validated.currency_type === current.order.currency &&
    amountMatches(validated.currency_amount, current.order.totalCents) &&
    amountMatches(data.currency_amount, current.order.totalCents)

  if (!valid) {
    await db
      .update(payments)
      .set({ status: "failed", validationId, transactionId: data.tran_id, rawResponse: validated, updatedAt: new Date() })
      .where(and(eq(payments.id, current.payment.id), eq(payments.status, "pending")))
    await db
      .update(orders)
      .set({ status: "failed", updatedAt: new Date() })
      .where(and(eq(orders.id, current.order.id), eq(orders.status, "pending")))
    throw new Error("payment_validation_failed")
  }

  return db.transaction(async (tx) => {
    const [locked] = await tx
      .select({ order: orders, payment: payments })
      .from(orders)
      .innerJoin(payments, eq(payments.orderId, orders.id))
      .where(eq(orders.id, current.order.id))
      .limit(1)

    if (!locked || locked.order.status === "paid") {
      return { order: locked?.order ?? current.order, payment: locked?.payment ?? current.payment, alreadyProcessed: true }
    }

    const now = new Date()
    const [payment] = await tx
      .update(payments)
      .set({
        status: "completed",
        transactionId: data.tran_id,
        validationId,
        bankTransactionId: data.bank_tran_id ?? null,
        rawResponse: validated,
        paidAt: now,
        updatedAt: now,
      })
      .where(and(eq(payments.id, locked.payment.id), eq(payments.status, "pending")))
      .returning()

    if (!payment) return { order: locked.order, payment: locked.payment, alreadyProcessed: true }

    const [order] = await tx
      .update(orders)
      .set({ status: "paid", paidAt: now, placedAt: now, updatedAt: now })
      .where(and(eq(orders.id, locked.order.id), eq(orders.status, "pending")))
      .returning()

    if (order?.couponId) {
      await tx
        .update(coupons)
        .set({ usageCount: sql`${coupons.usageCount} + 1`, updatedAt: now })
        .where(eq(coupons.id, order.couponId))
    }

    const items = await tx.select().from(orderItems).where(eq(orderItems.orderId, locked.order.id))
    if (order) {
      const versions = new Map<string, string>()
      await Promise.all(items.map(async (item) => {
        const product = await getDatabaseProductBySlug(item.productSlug ?? "")
        if (item.productSlug) versions.set(item.productSlug, product?.version ?? "1.0.0")
      }))
      await tx
        .insert(downloads)
        .values(items.map((item) => ({
          orderId: order.id,
          userId: order.userId,
          productSlug: item.productSlug ?? "",
          productVersion: versions.get(item.productSlug ?? "") ?? "1.0.0",
          productFileId: null,
        })))
        .onConflictDoNothing({
          target: [downloads.userId, downloads.orderId, downloads.productSlug],
        })
    }

    return { order: order ?? locked.order, payment, alreadyProcessed: false }
  })
}

export async function markPaymentOutcome(orderNumber: string, status: "failed" | "cancelled", data: GatewayData) {
  const current = await findOrderPayment(orderNumber)
  if (!current || current.order.status === "paid") return current

  await db.transaction(async (tx) => {
    if (current.payment) {
      await tx
        .update(payments)
        .set({ status, transactionId: data.tran_id ?? null, rawResponse: data, updatedAt: new Date() })
        .where(and(eq(payments.id, current.payment.id), eq(payments.status, "pending")))
    }
    await tx
      .update(orders)
      .set({ status, cancelledAt: status === "cancelled" ? new Date() : null, updatedAt: new Date() })
      .where(and(eq(orders.id, current.order.id), eq(orders.status, "pending")))
  })

  return findOrderPayment(orderNumber)
}
