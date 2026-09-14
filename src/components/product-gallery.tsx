"use client"

import * as React from "react"

import { ProductCover } from "@/components/product-cover"
import { cn } from "@/lib/utils"

export function ProductGallery({
  slug,
  frames,
}: {
  slug: string
  frames: string[]
}) {
  const [active, setActive] = React.useState(0)

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl border">
        <ProductCover
          seed={`${slug}#${active + 1}`}
          label={frames[active]}
          className="size-full"
        />
      </div>
      <div className="grid grid-cols-4 gap-3">
        {frames.map((frame, i) => (
          <button
            key={frame}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              "relative aspect-[16/10] overflow-hidden rounded-lg border transition-all",
              i === active
                ? "border-foreground/40 ring-2 ring-ring/50"
                : "border-border opacity-80 hover:opacity-100"
            )}
            aria-label={`View ${frame}`}
            aria-pressed={i === active}
          >
            <ProductCover seed={`${slug}#${i + 1}`} className="size-full" />
            <span className="absolute inset-x-0 bottom-0 bg-black/40 px-1.5 py-0.5 text-center text-[0.65rem] font-medium text-white">
              {frame}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
