"use client"

import * as React from "react"
import { CloudinaryImagePreview, type CloudinaryAsset } from "@/components/cloudinary/cloudinary-image-preview"
import { CloudinaryUploadButton } from "@/components/cloudinary/cloudinary-upload-button"
import { CLOUDINARY_FOLDERS } from "@/lib/cloudinary/client-folders"

export function CloudinaryMultipleImageUpload({ value, onChange, folder = CLOUDINARY_FOLDERS.products }: { value: CloudinaryAsset[]; onChange: (assets: CloudinaryAsset[]) => void; folder?: string }) {
  const removeAt = (index: number) => onChange(value.filter((_, itemIndex) => itemIndex !== index))
  return <div className="space-y-3"><div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{value.map((asset, index) => <CloudinaryImagePreview key={`${asset.publicId}-${index}`} asset={asset} label={`Gallery image ${index + 1}`} onRemove={() => removeAt(index)} />)}</div><CloudinaryUploadButton folder={folder} multiple onUpload={(assets) => onChange([...value, ...assets].slice(0, 12))} label="Add gallery images" /></div>
}
