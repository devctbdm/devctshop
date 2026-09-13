"use client"

import * as React from "react"

import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { MenuIcon, SearchIcon } from "lucide-react"

const navigation = [
  { title: "Templates", href: "#templates" },
  { title: "UI Kits", href: "#categories" },
  { title: "Source Code", href: "#featured" },
  { title: "Pricing", href: "#pricing" },
]

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      {navigation.map((item) => (
        <a
          key={item.title}
          href={item.href}
          onClick={onNavigate}
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {item.title}
        </a>
      ))}
    </>
  )
}

export function SiteHeader() {
  const [open, setOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
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
          <Button variant="ghost" size="sm" className="hidden md:inline-flex">
            Sign in
          </Button>
          <Button size="sm" className="hidden md:inline-flex">
            Get started
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
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
                <Logo />
              </SheetHeader>
              <nav className="flex flex-col gap-4 px-4 py-4">
                <NavLinks onNavigate={() => setOpen(false)} />
              </nav>
              <div className="mt-auto flex flex-col gap-2 border-t p-4">
                <Button variant="outline">Sign in</Button>
                <Button>Get started</Button>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-muted-foreground">
                    Appearance
                  </span>
                  <ThemeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
