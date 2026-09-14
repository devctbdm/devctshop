import "server-only"

import { GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

import { r2Bucket, r2Client } from "@/lib/r2/config"

export function getR2DownloadUrl(key: string, fileName: string) {
  return getSignedUrl(r2Client(), new GetObjectCommand({ Bucket: r2Bucket(), Key: key, ResponseContentDisposition: `attachment; filename="${fileName.replace(/[^a-zA-Z0-9._-]/g, "-")}"` }), { expiresIn: 300 })
}
