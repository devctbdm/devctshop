"use client"

import * as React from "react"
import { CldUploadWidget } from "next-cloudinary"
import { ImagePlusIcon, LoaderIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { CloudinaryAsset } from "@/components/cloudinary/cloudinary-image-preview"

function toAsset(info: Record<string, unknown>): CloudinaryAsset | null {
  if (typeof info.public_id !== "string" || typeof info.secure_url !== "string") return null
  return { publicId: info.public_id, secureUrl: info.secure_url, width: Number(info.width) || 800, height: Number(info.height) || 600, format: typeof info.format === "string" ? info.format : "" }
}

export function CloudinaryUploadButton({ folder, multiple = false, onUpload, label = "Upload image", disabled }: { folder: string; multiple?: boolean; onUpload: (assets: CloudinaryAsset[]) => void; label?: string; disabled?: boolean }) {
  const [error, setError] = React.useState<string | null>(null)
  return <div className="space-y-2"><CldUploadWidget signatureEndpoint="/api/cloudinary/sign" options={{ folder, multiple, maxFiles: multiple ? 12 : 1, resourceType: "image", clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "avif"], maxFileSize: 10_000_000 }} onSuccess={(result) => { const info = result.info; const assets = Array.isArray(info) ? info.map((item) => toAsset(item as Record<string, unknown>)).filter((item): item is CloudinaryAsset => Boolean(item)) : [toAsset(info as Record<string, unknown>)].filter((item): item is CloudinaryAsset => Boolean(item)); if (assets.length) { setError(null); onUpload(assets) } }} onError={(event) => setError(typeof event === "string" ? event : "Upload failed. Check the file type and size.")}>
    {({ open, isLoading }) => <Button type="button" variant="outline" onClick={() => open()} disabled={disabled || isLoading}><span>{isLoading ? <LoaderIcon className="size-4 animate-spin" /> : <ImagePlusIcon className="size-4" />}</span>{isLoading ? "Preparing upload…" : label}</Button>}
  </CldUploadWidget>{error ? <p role="alert" className="text-xs text-destructive">{error}</p> : null}</div>
}
