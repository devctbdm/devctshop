import Link from "next/link";

import { ProductCover } from "@/components/product-cover";
import { RatingStars } from "@/components/rating-stars";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { discountPercent, formatPrice, type Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const discount = discountPercent(product);
  const onSale = product.salePrice != null;
  const isFree =
    product.productType === "FREE" ||
    (product.productType === undefined && product.price === 0);

  return (
    <Card className="group gap-0 overflow-hidden py-0 transition-all hover:border-foreground/20 hover:shadow-md dark:hover:border-white/20">
      <Link
        href={`/products/${product.slug}`}
        className="flex flex-1 flex-col"
        aria-label={product.name}
      >
        <div className="relative aspect-16/10">
          <ProductCover seed={product.slug} className="size-full" />
          <div className="absolute top-3 left-3 flex gap-1.5">
            {onSale ? (
              <Badge className="bg-rose-500 text-white shadow-2xs hover:bg-rose-500">
                -{discount}%
              </Badge>
            ) : null}
            {product.badge ? (
              <Badge
                variant={product.badge === "New" ? "default" : "secondary"}
                className="shadow-2xs"
              >
                {product.badge}
              </Badge>
            ) : null}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2 px-4 pt-4">
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="text-muted-foreground">{product.category}</span>
            <span className="inline-flex items-center gap-1.5">
              <RatingStars rating={product.rating} size="sm" />
              <span className="text-muted-foreground/70">
                {product.rating.toFixed(1)}
              </span>
            </span>
          </div>
          <h3 className="font-heading text-sm font-semibold leading-snug line-clamp-1 group-hover:underline underline-offset-4">
            {product.name}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {product.tagline}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between border-t px-4 py-3">
          <span className="inline-flex items-baseline gap-2">
            {onSale && !isFree ? (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            ) : null}
            <span className="font-heading text-base font-semibold">
              {isFree
                ? "FREE"
                : formatPrice(product.salePrice ?? product.price)}
            </span>
          </span>
          <span className="text-sm font-medium text-foreground/70 transition-colors group-hover:text-foreground">
            View product
          </span>
        </div>
      </Link>
    </Card>
  );
}
