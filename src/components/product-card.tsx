import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import type { Product } from "@/lib/products"
import { StarIcon } from "lucide-react"

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="group gap-0 overflow-hidden py-0 transition-all hover:border-foreground/20 hover:shadow-md dark:hover:border-white/20">
      <div className="relative flex aspect-[16/10] items-center justify-center border-b bg-muted/40 transition-colors group-hover:bg-muted/60">
        <div className="flex flex-col gap-2">
          <div className="h-2 w-24 rounded-full bg-border" />
          <div className="h-2 w-32 rounded-full bg-border/70" />
          <div className="h-2 w-16 rounded-full bg-border/50" />
        </div>
        {product.badge ? (
          <Badge
            variant={product.badge === "New" ? "default" : "secondary"}
            className="absolute top-3 left-3 shadow-2xs"
          >
            {product.badge}
          </Badge>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 px-4 pt-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{product.category}</span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <StarIcon className="size-3 fill-amber-400 text-amber-400" />
            {product.rating.toFixed(1)}
            <span className="text-muted-foreground/70">
              ({product.reviews})
            </span>
          </span>
        </div>
        <h3 className="font-heading text-sm font-semibold leading-snug">
          {product.name}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {product.description}
        </p>
      </div>
      <div className="mt-auto flex items-center justify-between border-t px-4 py-3">
        <span className="font-heading text-base font-semibold">
          ${product.price}
        </span>
        <span className="text-sm font-medium text-foreground/70 transition-colors group-hover:text-foreground">
          View product
        </span>
      </div>
    </Card>
  )
}
