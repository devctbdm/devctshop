import Link from "next/link"
import {
  DownloadIcon,
  HeartIcon,
  LayoutDashboardIcon,
  ListOrderedIcon,
  Settings2Icon,
  UserRoundIcon,
} from "lucide-react"

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboardIcon },
  { href: "/dashboard/orders", label: "My orders", icon: ListOrderedIcon },
  { href: "/dashboard/downloads", label: "My downloads", icon: DownloadIcon },
  { href: "/dashboard/wishlist", label: "Wishlist", icon: HeartIcon },
  { href: "/account", label: "Profile", icon: UserRoundIcon },
  { href: "/account/settings", label: "Account settings", icon: Settings2Icon },
]

export function CustomerNav({ active }: { active?: string }) {
  return (
    <nav className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
      {links.map((link) => {
        const Icon = link.icon
        const selected = active === link.href
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${selected ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          >
            <Icon className="size-4" />
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
