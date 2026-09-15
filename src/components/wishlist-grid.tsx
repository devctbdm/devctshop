"use client";

import * as React from "react";
import Link from "next/link";
import { HeartOffIcon } from "lucide-react";

import { ProductCover } from "@/components/product-cover";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/products";

export function WishlistGrid({
  items,
}: {
  items: { slug: string; name: string; price: number; salePrice?: number }[];
}) {
  const [visible, setVisible] = React.useState(items);
  async function remove(slug: string) {
    await fetch(`/api/wishlist?slug=${encodeURIComponent(slug)}`, {
      method: "DELETE",
    });
    setVisible((current) => current.filter((item) => item.slug !== slug));
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {visible.map((item) => (
        <div key={item.slug} className="rounded-xl border bg-card p-3">
          <div className="flex gap-3">
            <ProductCover seed={item.slug} className="size-20 rounded-lg" />
            <div className="min-w-0 flex-1">
              <Link
                href={`/products/${item.slug}`}
                className="line-clamp-2 text-sm font-semibold hover:underline"
              >
                {item.name}
              </Link>
              <p className="mt-2 font-heading font-semibold">
                {formatPrice(item.salePrice ?? item.price)}
              </p>
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <Button variant="ghost" size="sm" onClick={() => remove(item.slug)}>
              <HeartOffIcon className="size-4" />
              Remove
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
