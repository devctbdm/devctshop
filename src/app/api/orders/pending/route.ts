import { NextResponse } from "next/server"

import { requireUser } from "@/lib/auth/session"
import { createPendingOrder } from "@/lib/orders"

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
    return NextResponse.json({ orderNumber: order.orderNumber, totalCents: order.totalCents })
  } catch (error) {
    const message = error instanceof Error ? error.message : "order_failed"
    const status = message === "empty_order" ? 400 : 422
    return NextResponse.json({ error: message }, { status })
  }
}
