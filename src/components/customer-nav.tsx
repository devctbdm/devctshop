"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DownloadIcon,
  HeartIcon,
  LayoutDashboardIcon,
  ListOrderedIcon,
  Settings2Icon,
  UserRoundIcon,
} from "lucide-react";

const links = [
  { href: "/account", label: "Overview", icon: LayoutDashboardIcon },
  { href: "/account/orders", label: "My orders", icon: ListOrderedIcon },
  { href: "/account/downloads", label: "My downloads", icon: DownloadIcon },
  { href: "/account/wishlist", label: "Wishlist", icon: HeartIcon },
  { href: "/account/profile", label: "Profile", icon: UserRoundIcon },
  { href: "/account/settings", label: "Account settings", icon: Settings2Icon },
];

export function CustomerNav({ active }: { active?: string }) {
  const pathname = usePathname();
  const currentPath = pathname || active || "/account";

  return (
    <nav
      className="-mx-1 flex overflow-x-auto border-b border-border px-1 pb-px"
      aria-label="Account navigation"
    >
      {links.map((link) => {
        const Icon = link.icon;
        const selected =
          currentPath === link.href ||
          (link.href !== "/account" &&
            link.href !== "/account/profile" &&
            currentPath.startsWith(`${link.href}/`));
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={selected ? "page" : undefined}
            className={`relative inline-flex min-h-10 shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-3 text-sm font-medium transition-colors ${selected ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"}`}
          >
            <Icon className="size-3.5" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
