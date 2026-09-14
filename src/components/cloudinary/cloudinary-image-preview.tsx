"use client"

import { CldImage } from "next-cloudinary"
import { XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export type CloudinaryAsset = {
  publicId: string
  secureUrl: string
  width: number
  height: number
  format: string
}

export function CloudinaryImagePreview({ asset, onRemove, label = "Uploaded image" }: { asset: CloudinaryAsset; onRemove?: () => void; label?: string }) {
  return <div className="group relative overflow-hidden rounded-lg border bg-muted/20"><CldImage src={asset.publicId || asset.secureUrl} width={asset.width || 800} height={asset.height || 600} alt={label} className="aspect-video h-full w-full object-cover" sizes="(max-width: 640px) 100vw, 320px" crop="fill" gravity="auto" format="auto" quality="auto" />{onRemove ? <Button type="button" size="icon-sm" variant="destructive" className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100" onClick={onRemove} aria-label={`Remove ${label}`}><XIcon className="size-3.5" /></Button> : null}</div>
}
