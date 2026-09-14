import { NextResponse } from "next/server"

import { requireAdmin, requireUser } from "@/lib/auth/session"
import { cloudinary, CLOUDINARY_FOLDERS } from "@/lib/cloudinary/config"

export async function POST(request: Request) {
  const user = await requireUser()
  const body = (await request.json()) as { publicId?: string; owner?: "user" | "admin" }
  const publicId = body.publicId?.trim()
  if (!publicId) return NextResponse.json({ error: "missing_public_id" }, { status: 400 })
  if (body.owner === "user") {
    if (!publicId.startsWith(`${CLOUDINARY_FOLDERS.users}/${user.id}/`)) return NextResponse.json({ error: "forbidden" }, { status: 403 })
  } else {
    await requireAdmin()
  }
  await cloudinary.uploader.destroy(publicId, { resource_type: "image", invalidate: true })
  return NextResponse.json({ deleted: true })
}
