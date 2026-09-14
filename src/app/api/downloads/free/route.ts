import { and, eq } from "drizzle-orm"
import { NextResponse } from "next/server"

import { db } from "@/db"
import { downloads, orderItems, orders, productFiles, products } from "@/db/schema"
import { requireUser } from "@/lib/auth/session"

export async function POST(request: Request) {
  const user = await requireUser()
  const body = (await request.json()) as { slug?: string }
  if (!body.slug) return NextResponse.json({ error: "missing_product" }, { status: 400 })

  const [product] = await db.select().from(products).where(eq(products.slug, body.slug)).limit(1)
  if (!product || product.productType !== "FREE") return NextResponse.json({ error: "free_product_required" }, { status: 403 })
  const [file] = await db.select().from(productFiles).where(eq(productFiles.productId, product.id)).orderBy(productFiles.createdAt).limit(1)
  if (!file) return NextResponse.json({ error: "file_not_configured" }, { status: 404 })

  const [existing] = await db.select({ id: downloads.id }).from(downloads).where(and(eq(downloads.userId, user.id), eq(downloads.productSlug, product.slug))).limit(1)
  if (existing) return NextResponse.json({ downloadId: existing.id })

  const [order] = await db.insert(orders).values({ orderNumber: `FREE-${crypto.randomUUID().replaceAll("-", "").slice(0, 12).toUpperCase()}`, userId: user.id, status: "paid", subtotalCents: 0, discountCents: 0, totalCents: 0, billingEmail: user.email, billingName: user.fullName, paidAt: new Date(), placedAt: new Date() }).returning({ id: orders.id })
  await db.insert(orderItems).values({ orderId: order.id, productId: product.id, productName: product.name, productSlug: product.slug, quantity: 1, unitPriceCents: 0, discountCents: 0, totalCents: 0 })
  const [download] = await db.insert(downloads).values({ orderId: order.id, userId: user.id, productSlug: product.slug, productVersion: file.version, productFileId: file.id }).returning({ id: downloads.id })
  return NextResponse.json({ downloadId: download.id })
}
