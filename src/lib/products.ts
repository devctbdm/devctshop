import {
  BlocksIcon,
  LayoutGridIcon,
  MonitorSmartphoneIcon,
  PaletteIcon,
  ServerIcon,
  ZapIcon,
  type LucideIcon,
} from "lucide-react"

export type Category = {
  name: string
  description: string
  icon: LucideIcon
}

export type Product = {
  name: string
  description: string
  category: string
  price: number
  rating: number
  reviews: number
  badge?: string
}

export const categories: Category[] = [
  {
    name: "Next.js Templates",
    description: "Production-ready App Router starters",
    icon: ZapIcon,
  },
  {
    name: "React Templates",
    description: "Component-driven React foundations",
    icon: MonitorSmartphoneIcon,
  },
  {
    name: "Admin Dashboards",
    description: "Data-dense dashboards out of the box",
    icon: LayoutGridIcon,
  },
  {
    name: "UI Kits",
    description: "Complete design systems with tokens",
    icon: PaletteIcon,
  },
  {
    name: "Full-Stack Projects",
    description: "End-to-end apps with auth and payments",
    icon: ServerIcon,
  },
  {
    name: "Website Source Code",
    description: "Marketing sites and storefronts",
    icon: BlocksIcon,
  },
]

export const featuredProducts: Product[] = [
  {
    name: "Lumen Dashboard",
    description:
      "A complete Next.js 16 admin dashboard with Drizzle, auth, and billing flows.",
    category: "Admin Dashboards",
    price: 149,
    rating: 4.9,
    reviews: 212,
    badge: "Best seller",
  },
  {
    name: "Nova SaaS Starter",
    description:
      "Full-stack SaaS boilerplate with multi-tenant auth, teams, and Stripe.",
    category: "Full-Stack Projects",
    price: 249,
    rating: 4.8,
    reviews: 168,
  },
  {
    name: "Prism UI Kit",
    description:
      "120+ accessible components with dark mode and design tokens included.",
    category: "UI Kits",
    price: 89,
    rating: 5.0,
    reviews: 340,
    badge: "New",
  },
  {
    name: "Atlas Storefront",
    description:
      "A fast headless commerce storefront template built on the App Router.",
    category: "Next.js Templates",
    price: 199,
    rating: 4.7,
    reviews: 95,
  },
]
