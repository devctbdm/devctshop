import Link from "next/link";

import { Logo } from "@/components/logo";
import { Code2Icon, GlobeIcon, MessageCircleIcon } from "lucide-react";
import { getGeneralSettings } from "@/lib/settings";

const footerLinks = [
  {
    title: "Marketplace",
    links: [
      { title: "All products", href: "/products" },
      { title: "Categories", href: "/categories" },
      { title: "Next.js Templates", href: "/categories/nextjs" },
      { title: "UI Kits", href: "/categories/ui-kits" },
    ],
  },
  {
    title: "Company",
    links: [
      { title: "About", href: "/" },
      { title: "Blog", href: "/" },
      { title: "Careers", href: "/" },
      { title: "Contact", href: "mailto:hello@devct.shop" },
    ],
  },
  {
    title: "Resources",
    links: [
      { title: "Documentation", href: "/" },
      { title: "Support", href: "mailto:support@devct.shop" },
      { title: "Licenses", href: "/" },
      { title: "Terms", href: "/" },
    ],
  },
];

export async function SiteFooter() {
  const settings = await getGeneralSettings();
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{settings.footerDescription}</p>
            <div className="mt-4 space-y-1 text-sm text-muted-foreground">{settings.contactEmail ? <a className="block hover:text-foreground" href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a> : null}{settings.contactPhone ? <a className="block hover:text-foreground" href={`tel:${settings.contactPhone}`}>{settings.contactPhone}</a> : null}{settings.address ? <span className="block">{settings.address}</span> : null}</div>
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
             {settings.copyrightText}
          </p>
          <div className="flex items-center gap-1">
            <a
              href={settings.githubUrl || "#"}
              className={`${settings.githubUrl ? "" : "hidden"} flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground`}
              aria-label="Open source"
            >
              <Code2Icon className="size-4" />
            </a>
            <a
              href={settings.facebookUrl || "#"}
              className={`${settings.facebookUrl ? "" : "hidden"} flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground`}
              aria-label="Community"
            >
              <MessageCircleIcon className="size-4" />
            </a>
            <a
              href={settings.youtubeUrl || settings.linkedinUrl || "#"}
              className={`${settings.youtubeUrl || settings.linkedinUrl ? "" : "hidden"} flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground`}
              aria-label="Website"
            >
              <GlobeIcon className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
