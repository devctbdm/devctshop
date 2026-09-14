"use client"

import * as React from "react"
import { CloudinaryImagePreview, type CloudinaryAsset } from "@/components/cloudinary/cloudinary-image-preview"
import { CloudinaryUploadButton } from "@/components/cloudinary/cloudinary-upload-button"
import { CLOUDINARY_FOLDERS } from "@/lib/cloudinary/client-folders"

export function CloudinaryImageUpload({ value, onChange, folder = CLOUDINARY_FOLDERS.products, label = "Upload image" }: { value?: CloudinaryAsset | null; onChange: (asset: CloudinaryAsset | null) => void; folder?: string; label?: string }) {
  return <div className="space-y-3">{value ? <CloudinaryImagePreview asset={value} onRemove={() => onChange(null)} /> : <div className="flex aspect-video items-center justify-center rounded-lg border border-dashed bg-muted/20 text-center text-sm text-muted-foreground">No image selected</div>}<CloudinaryUploadButton folder={folder} label={value ? "Replace image" : label} onUpload={(assets) => onChange(assets[0] ?? null)} /></div>
}
