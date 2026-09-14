import { NextResponse } from "next/server"

import { requireUser } from "@/lib/auth/session"
import { createPendingOrder } from "@/lib/orders"
import { initializeSslcommerzPayment } from "@/lib/sslcommerz"
import { recordPaymentAttempt, updatePaymentSession } from "@/lib/payment-service"

export async function POST(request: Request) {
  const user = await requireUser()
  let body: { items?: { slug?: string }[]; couponCode?: string }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 })
  }

  const lines = Array.isArray(body.items)
    ? body.items.filter((item): item is { slug: string } => typeof item?.slug === "string")
    : []

  try {
    const order = await createPendingOrder({
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      lines,
      couponCode: body.couponCode,
    })
    await recordPaymentAttempt({
      orderId: order.id,
      userId: user.id,
      amountCents: order.totalCents,
    })
    const session = await initializeSslcommerzPayment({
      orderNumber: order.orderNumber,
      amountCents: order.totalCents,
      email: user.email,
      name: user.fullName,
      productNames: order.calculation.items.map((item) => item.name),
    })

    if (session.sessionkey) await updatePaymentSession(order.id, session.sessionkey)

    return NextResponse.json({ redirectUrl: session.GatewayPageURL })
  } catch (error) {
    const message = error instanceof Error ? error.message : "payment_initialization_failed"
    const known = new Set(["empty_order", "invalid_coupon", "expired_coupon", "coupon_not_applicable"])
    return NextResponse.json({ error: known.has(message) ? message : "payment_initialization_failed" }, { status: 422 })
  }
}
