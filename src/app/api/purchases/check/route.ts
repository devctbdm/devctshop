import { NextResponse } from "next/server"

import { auth } from "@/lib/auth/auth"
import { getOwnedProductSlugs } from "@/lib/orders"

export async function GET(request: Request) {
  const session = await auth()
  const slug = new URL(request.url).searchParams.get("slug")
  const userId = session?.user?.id

  if (!userId || !slug) return NextResponse.json({ owned: false })

  const owned = await getOwnedProductSlugs(userId, [slug])
  return NextResponse.json({ owned: owned.has(slug) })
}
