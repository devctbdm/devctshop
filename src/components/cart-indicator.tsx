"use client";

import Link from "next/link";
import * as React from "react";
import { ArrowRightIcon, ShoppingCartIcon, Trash2Icon } from "lucide-react";

import { ProductCover } from "@/components/product-cover";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatPrice } from "@/lib/products";
import { useCartStore } from "@/stores/cart-store";

export function CartIndicator() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const [hydrated, setHydrated] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();

  React.useEffect(() => {
    const unsubscribe = useCartStore.persist.onFinishHydration(() =>
      setHydrated(true),
    );
    void useCartStore.persist.rehydrate();
    return unsubscribe;
  }, []);

  const count = hydrated ? items.length : 0;
  const subtotal = items.reduce(
    (sum, item) => sum + (item.salePrice ?? item.price),
    0,
  );
  const checkoutHref = `/checkout?items=${encodeURIComponent(JSON.stringify(items.map((item) => ({ slug: item.slug }))))}`;

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      showSwipeHandle={isMobile}
      swipeDirection={isMobile ? "down" : "right"}
    >
      <DrawerTrigger
        nativeButton={true}
        render={
          <button
            type="button"
            className="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-transparent text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 size-8 hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50"
            aria-label={
              count ? `Cart, ${count} item${count === 1 ? "" : "s"}` : "Cart"
            }
          >
            <ShoppingCartIcon />
            {count ? (
              <span className="absolute top-0.5 right-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[0.6rem] font-semibold text-primary-foreground">
                {count > 9 ? "9+" : count}
              </span>
            ) : null}
          </button>
        }
      />
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Your cart</DrawerTitle>
          <DrawerDescription>
            {count
              ? `${count} digital product${count === 1 ? "" : "s"} ready for checkout.`
              : "Your cart is currently empty."}
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length ? (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.slug}
                  className="flex gap-3 rounded-lg border bg-card p-2.5"
                >
                  <ProductCover
                    seed={item.slug}
                    className="size-16 shrink-0 rounded-md"
                  />
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={() => setOpen(false)}
                      className="line-clamp-2 text-sm font-medium hover:underline"
                    >
                      {item.name}
                    </Link>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className="font-heading text-sm font-semibold">
                        {formatPrice(item.salePrice ?? item.price)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItem(item.slug)}
                        className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2Icon className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-48 flex-col items-center justify-center text-center">
              <ShoppingCartIcon className="size-7 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium">
                No products in your cart
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Add a template or UI kit to get started.
              </p>
            </div>
          )}
        </div>

        <DrawerFooter>
          {items.length ? (
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-heading text-lg font-semibold">
                {formatPrice(subtotal)}
              </span>
            </div>
          ) : null}
          <DrawerClose
            nativeButton={false}
            render={
              <Link
                href={checkoutHref}
                className="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 h-9 gap-1.5 px-2.5 bg-primary text-primary-foreground hover:bg-primary/80 w-full"
              >
                Continue to checkout <ArrowRightIcon className="size-4" />
              </Link>
            }
          />
          <DrawerClose
            nativeButton={false}
            render={
              <Link
                href="/cart"
                className="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-input bg-background text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 h-9 gap-1.5 px-2.5 hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50 w-full"
              >
                View full cart
              </Link>
            }
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
