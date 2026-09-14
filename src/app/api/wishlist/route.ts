import { and, eq } from "drizzle-orm"
import { NextResponse } from "next/server"

import { db } from "@/db"
import { wishlist } from "@/db/schema"
import { auth } from "@/lib/auth/auth"
import { getProductBySlug } from "@/lib/products"

async function currentUser() {
  const session = await auth()
  return session?.user?.id ?? null
}

export async function POST(request: Request) {
  const userId = await currentUser()
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  const body = (await request.json()) as { slug?: string }
  const product = body.slug ? getProductBySlug(body.slug) : undefined
  if (!product) return NextResponse.json({ error: "product_not_found" }, { status: 404 })

  await db
    .insert(wishlist)
    .values({ userId, productSlug: product.slug })
    .onConflictDoNothing()
  return NextResponse.json({ saved: true })
}

export async function DELETE(request: Request) {
  const userId = await currentUser()
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  const slug = new URL(request.url).searchParams.get("slug")
  if (!slug) return NextResponse.json({ error: "missing_slug" }, { status: 400 })

  await db.delete(wishlist).where(and(eq(wishlist.userId, userId), eq(wishlist.productSlug, slug)))
  return NextResponse.json({ saved: false })
}
