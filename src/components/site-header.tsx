"use client";

import * as React from "react";

import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu, type HeaderUser } from "@/components/user-menu";
import { CartIndicator } from "@/components/cart-indicator";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { CurrencySelector } from "@/components/currency-selector";

const navigation = [
  { title: "Products", href: "/products" },
  { title: "Categories", href: "/categories" },
  { title: "Templates", href: "/categories/nextjs" },
  { title: "UI Kits", href: "/categories/ui-kits" },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      {navigation.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          onClick={onNavigate}
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {item.title}
        </Link>
      ))}
    </>
  );
}

export function SiteHeader({ user }: { user?: HeaderUser | null }) {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-6 md:flex">
            <NavLinks />
          </nav>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex"
            aria-label="Search products"
          >
            <SearchIcon />
          </Button>
          <ThemeToggle />
          <CurrencySelector />
          <CartIndicator />

          {user ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:inline-flex"
                nativeButton={false}
                render={<Link href="/account" />}
              >
                Account
              </Button>
              <UserMenu user={user} />
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:inline-flex"
                nativeButton={false}
                render={<Link href="/auth/login" />}
              >
                Sign in
              </Button>
              <Button
                size="sm"
                className="hidden md:inline-flex"
                nativeButton={false}
                render={<Link href="/auth/register" />}
              >
                Get started
              </Button>
            </>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              nativeButton={true}
              render={
                <button
                  className="md:hidden inline-flex items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 size-8 hover:bg-muted hover:text-foreground"
                  aria-label="Open menu"
                />
              }
            >
              <MenuIcon />
              <span className="sr-only">Open menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader className="border-b">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <div className="flex items-center justify-between">
                  <Logo />
                </div>
              </SheetHeader>
              <nav className="flex flex-col gap-4 px-4 py-4">
                <NavLinks onNavigate={() => setOpen(false)} />
              </nav>
              <div className="mt-auto flex flex-col gap-2 border-t p-4">
                {user ? (
                  <>
                    <Button
                      nativeButton={false}
                      render={<Link href="/account" />}
                      onClick={() => setOpen(false)}
                    >
                      Go to account
                    </Button>
                    {user.role === "ADMIN" ? (
                      <Button
                        variant="outline"
                        nativeButton={false}
                        render={<Link href="/admin" />}
                        onClick={() => setOpen(false)}
                      >
                        Admin area
                      </Button>
                    ) : null}
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      nativeButton={false}
                      render={<Link href="/auth/login" />}
                      onClick={() => setOpen(false)}
                    >
                      Sign in
                    </Button>
                    <Button
                      nativeButton={false}
                      render={<Link href="/auth/register" />}
                      onClick={() => setOpen(false)}
                    >
                      Get started
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
