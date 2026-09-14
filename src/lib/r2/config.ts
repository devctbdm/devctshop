import "server-only"

import { S3Client } from "@aws-sdk/client-s3"

function required(name: string) {
  const value = process.env[name]
  if (!value?.trim()) throw new Error(`${name} is not configured`)
  return value
}

export function r2Bucket() {
  return required("R2_BUCKET_NAME")
}

export function r2Client() {
  const accountId = required("R2_ACCOUNT_ID")
  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: required("R2_ACCESS_KEY_ID"),
      secretAccessKey: required("R2_SECRET_ACCESS_KEY"),
    },
  })
}

export function isAllowedSourceCodeFile(mimeType: string, fileName: string) {
  if (mimeType.trim().toLowerCase().startsWith("image/")) return false
  return fileName.toLowerCase().endsWith(".zip")
}
