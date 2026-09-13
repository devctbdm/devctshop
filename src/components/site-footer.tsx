import Link from "next/link"

import { Logo } from "@/components/logo"
import { Code2Icon, GlobeIcon, MessageCircleIcon } from "lucide-react"

const footerLinks = [
  {
    title: "Marketplace",
    links: [
      { title: "Templates", href: "#templates" },
      { title: "UI Kits", href: "#categories" },
      { title: "Source Code", href: "#featured" },
      { title: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { title: "About", href: "#" },
      { title: "Blog", href: "#" },
      { title: "Careers", href: "#" },
      { title: "Contact", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { title: "Documentation", href: "#" },
      { title: "Support", href: "#" },
      { title: "Licenses", href: "#" },
      { title: "Terms", href: "#" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Premium templates, UI kits, and source code for developers who
              ship fast.
            </p>
          </div>
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold">{column.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Devct Shop. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            <a
              href="#"
              className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Open source"
            >
              <Code2Icon className="size-4" />
            </a>
            <a
              href="#"
              className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Community"
            >
              <MessageCircleIcon className="size-4" />
            </a>
            <a
              href="#"
              className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Website"
            >
              <GlobeIcon className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
