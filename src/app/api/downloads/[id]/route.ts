import { and, eq } from "drizzle-orm"
import { NextResponse } from "next/server"

import { db } from "@/db"
import { downloads, productFiles } from "@/db/schema"
import { auth } from "@/lib/auth/auth"
import { getR2DownloadUrl } from "@/lib/r2/signed-url"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const { id } = await params
  const [download] = await db
    .select()
    .from(downloads)
    .where(and(eq(downloads.id, id), eq(downloads.userId, userId)))
    .limit(1)

  if (!download) return NextResponse.json({ error: "download_not_found" }, { status: 404 })

  if (!download.productFileId) {
    return NextResponse.json(
      { error: "file_not_configured", message: "The product file is being prepared." },
      { status: 404 },
    )
  }

  const forwarded = request.headers.get("x-forwarded-for")
  await db
    .update(downloads)
    .set({
      downloadCount: download.downloadCount + 1,
      ipAddr: forwarded?.split(",")[0]?.trim() ?? null,
      userAgent: request.headers.get("user-agent"),
    })
    .where(and(eq(downloads.id, id), eq(downloads.userId, userId)))

  const [file] = await db
    .select()
    .from(productFiles)
    .where(eq(productFiles.id, download.productFileId))
    .limit(1)
  if (!file) return NextResponse.json({ error: "file_not_found" }, { status: 404 })

  const fileUrl = await getR2DownloadUrl(file.path, file.name)
  return NextResponse.redirect(fileUrl)
}
