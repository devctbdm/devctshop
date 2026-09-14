import { randomUUID } from "node:crypto"

import { PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { NextResponse } from "next/server"

import { requireAdmin } from "@/lib/auth/session"
import { isAllowedSourceCodeFile, r2Bucket, r2Client } from "@/lib/r2/config"

const MAX_FILE_SIZE = 500 * 1024 * 1024

export async function POST(request: Request) {
  await requireAdmin()
  let body: { productId?: string; version?: string; fileName?: string; contentType?: string; size?: number }
  try { body = await request.json() } catch { return NextResponse.json({ error: "invalid_request" }, { status: 400 }) }

  const productId = body.productId?.trim()
  const version = body.version?.trim().replace(/[^a-zA-Z0-9._-]/g, "-")
  const fileName = body.fileName?.trim() ?? ""
  const contentType = body.contentType?.trim() || "application/zip"
  const size = Number(body.size)

  if (!productId || !version || !fileName || !Number.isFinite(size) || size <= 0 || size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "invalid_file_metadata" }, { status: 400 })
  }
  if (!isAllowedSourceCodeFile(contentType, fileName)) {
    return NextResponse.json({ error: "only_zip_source_files_are_allowed" }, { status: 415 })
  }

  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "-")
  const key = `devct-shop/products/${productId}/${version}/${randomUUID()}-${safeName}`
  const command = new PutObjectCommand({ Bucket: r2Bucket(), Key: key, ContentType: "application/zip", ContentLength: size, Metadata: { originalName: fileName, version } })
  const uploadUrl = await getSignedUrl(r2Client(), command, { expiresIn: 600 })
  return NextResponse.json({ uploadUrl, key, fileName, version, sizeBytes: size, mimeType: "application/zip", expiresIn: 600 })
}
