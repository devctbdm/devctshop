import { NextResponse } from "next/server"

import { auth } from "@/lib/auth/auth"
import { calculateOrder } from "@/lib/orders"

export async function POST(request: Request) {
  const session = await auth()
  let body: { items?: { slug?: string }[]; couponCode?: string }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 })
  }

  const lines = Array.isArray(body.items)
    ? body.items.filter((item): item is { slug: string } => typeof item?.slug === "string")
    : []
  const quote = await calculateOrder(lines, session?.user?.id, body.couponCode)

  return NextResponse.json({
    subtotalCents: quote.subtotalCents,
    discountCents: quote.discountCents,
    totalCents: quote.totalCents,
    couponCode: quote.couponCode,
    couponError: quote.couponError,
    ownedSlugs: quote.ownedSlugs,
    itemSlugs: quote.items.map((item) => item.slug),
  })
}
