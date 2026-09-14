import {
  AtomIcon,
  BlocksIcon,
  LayoutGridIcon,
  PaletteIcon,
  ServerIcon,
  ZapIcon,
  type LucideIcon,
} from "lucide-react"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Category = {
  slug: string
  name: string
  description: string
  icon: LucideIcon
}

export type ProductLicense = {
  label: string
  includes: string[]
}

export type Product = {
  slug: string
  name: string
  tagline: string
  description: string
  category: string
  categorySlug: string
  price: number
  productType?: "FREE" | "PAID"
  salePrice?: number
  gallery: string[]
  technologies: string[]
  features: string[]
  requirements: string[]
  license: ProductLicense
  version: string
  rating: number
  reviews: number
  sales: number
  featured?: boolean
  isNew?: boolean
  badge?: string
  published: boolean
  updatedAt: string
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export const categories: Category[] = [
  {
    slug: "nextjs",
    name: "Next.js Templates",
    description: "Production-ready App Router starters",
    icon: ZapIcon,
  },
  {
    slug: "react",
    name: "React Templates",
    description: "Component-driven React foundations",
    icon: AtomIcon,
  },
  {
    slug: "dashboards",
    name: "Admin Dashboards",
    description: "Data-dense dashboards out of the box",
    icon: LayoutGridIcon,
  },
  {
    slug: "ui-kits",
    name: "UI Kits",
    description: "Complete design systems with tokens",
    icon: PaletteIcon,
  },
  {
    slug: "fullstack",
    name: "Full-Stack Projects",
    description: "SaaS kits, storefronts & source code",
    icon: ServerIcon,
  },
  {
    slug: "source-code",
    name: "Website Source Code",
    description: "Marketing, portfolio & SaaS sites",
    icon: BlocksIcon,
  },
]

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug)
}

// ---------------------------------------------------------------------------
// Catalog
// ---------------------------------------------------------------------------

const COMMERCE_LICENSE: ProductLicense = {
  label: "Commercial License",
  includes: [
    "Use in unlimited client & private projects",
    "Full source code, no obfuscation",
    "Lifelong updates & priority support",
    "Resale of the theme itself is not permitted",
  ],
}

const personalLicense: ProductLicense = {
  label: "Personal + Commercial",
  includes: [
    "One developer seat",
    "Use in client & personal projects",
    "12 months of updates",
  ],
}

export const products: Product[] = [
  {
    slug: "atlas-storefront",
    name: "Atlas Storefront",
    tagline: "A fast headless commerce storefront on the App Router.",
    description:
      "Atlas is a complete, production-ready storefront template. It ships with a server-driven product catalog, cart, checkout flow, order history, and a fully accessible design system. Built on the App Router with streaming and partial pre-rendering, it stays fast even at catalog scale. Swap the demo data source for your own API and you are live.",
    category: "Next.js Templates",
    categorySlug: "nextjs",
    price: 199,
    productType: "PAID",
    salePrice: 149,
    gallery: ["Preview", "Shop", "Product", "Cart"],
    technologies: ["Next.js 16", "TypeScript", "Tailwind CSS", "shadcn/ui", "Zustand"],
    features: [
      "Server-driven catalog with streaming SSR",
      "Persistent cart with optimistic UI",
      "Stripe-ready checkout flow (payment not wired)",
      "Filterable, searchable product grid",
      "Complete, tokenized design system",
      "Light & dark mode out of the box",
    ],
    requirements: ["Node.js 20+", "pnpm 9+ (or npm/yarn)", "A product data source (REST or DB)"],
    license: COMMERCE_LICENSE,
    version: "2.4.0",
    rating: 4.8,
    reviews: 95,
    sales: 1840,
    featured: true,
    badge: "Best seller",
    published: true,
    updatedAt: "2026-05-18",
  },
  {
    slug: "lumen-dashboard",
    name: "Lumen Dashboard",
    tagline: "A complete Next.js 16 admin dashboard with auth & billing flows.",
    description:
      "Lumen is a full admin application, not just a UI. It includes authentication, role-based access, a billing and usage area, data tables with server-side pagination, and a charting layer. Every screen is built with real patterns so you can replace the demo data and keep the structure.",
    category: "Admin Dashboards",
    categorySlug: "dashboards",
    price: 149,
    gallery: ["Overview", "Analytics", "Billing", "Settings"],
    technologies: ["Next.js 16", "TypeScript", "Drizzle ORM", "Tailwind CSS", "Recharts"],
    features: [
      "Auth + role-based access control",
      "Data tables with server-side pagination",
      "Billing, invoices & usage views",
      "Responsive charts & KPI cards",
      "Command palette & global search",
      "Full light / dark theming",
    ],
    requirements: ["Node.js 20+", "pnpm 9+", "PostgreSQL or a compatible data source"],
    license: COMMERCE_LICENSE,
    version: "3.1.0",
    rating: 4.9,
    reviews: 212,
    sales: 2610,
    featured: true,
    badge: "Best seller",
    published: true,
    updatedAt: "2026-06-02",
  },
  {
    slug: "nova-saas-starter",
    name: "Nova SaaS Starter",
    tagline: "Full-stack SaaS boilerplate with multi-tenant auth, teams & billing.",
    description:
      "Nova is the fastest way to launch a SaaS. It comes with multi-tenant auth, team management, workspaces, a usage metering layer, and a billing area. The architecture is clean and documented so you can strip out what you do not need and ship a real product in days, not weeks.",
    category: "Full-Stack Projects",
    categorySlug: "fullstack",
    price: 249,
    gallery: ["Landing", "Onboarding", "Workspace", "Billing"],
    technologies: ["Next.js 16", "TypeScript", "Auth.js", "Drizzle ORM", "React Hook Form"],
    features: [
      "Multi-tenant auth & invitations",
      "Team & workspace management",
      "Usage metering foundation",
      "Billing area with plan tiers",
      "Onboarding & empty-state flows",
      "Documented, extensible architecture",
    ],
    requirements: ["Node.js 20+", "pnpm 9+", "PostgreSQL", "Object storage (optional)"],
    license: COMMERCE_LICENSE,
    version: "1.8.0",
    rating: 4.8,
    reviews: 168,
    sales: 1420,
    featured: true,
    published: true,
    updatedAt: "2026-04-27",
  },
  {
    slug: "prism-ui-kit",
    name: "Prism UI Kit",
    tagline: "120+ accessible components with dark mode and design tokens.",
    description:
      "Prism is a complete component library with a coherent design-token system. Every component is accessible, keyboard-navigable, and themeable. Includes forms, overlays, data display, navigation, and feedback patterns, plus a set of layout blocks to assemble real pages quickly.",
    category: "UI Kits",
    categorySlug: "ui-kits",
    price: 89,
    salePrice: 69,
    gallery: ["Components", "Forms", "Overlays", "Tokens"],
    technologies: ["React 19", "TypeScript", "Tailwind CSS", "Base UI"],
    features: [
      "120+ accessible, documented components",
      "Centralized design-token theming",
      "First-class dark mode",
      "Layout blocks & page skeletons",
      "Keyboard & screen-reader friendly",
      "Copy-paste, no runtime dependency",
    ],
    requirements: ["React 18+", "Tailwind CSS 4", "TypeScript (recommended)"],
    license: COMMERCE_LICENSE,
    version: "4.2.0",
    rating: 5.0,
    reviews: 340,
    sales: 2130,
    featured: true,
    badge: "New",
    isNew: true,
    published: true,
    updatedAt: "2026-06-11",
  },
  {
    slug: "flux-react-starter",
    name: "Flux React Starter",
    tagline: "A clean, fast React foundation for marketing & product sites.",
    description:
      "Flux is a lightweight React starter focused on speed and DX. It includes routing, server/client data patterns, a typed API client, and a set of marketing sections. Perfect for product sites, docs, and app front-ends that do not need the weight of a full meta-framework.",
    category: "React Templates",
    categorySlug: "react",
    price: 99,
    gallery: ["Home", "Pricing", "Docs", "404"],
    technologies: ["React 19", "TypeScript", "Vite", "React Router", "Tailwind CSS"],
    features: [
      "Typed API client & data hooks",
      "Marketing + docs page sections",
      "Route transitions & skeletons",
      "Configurable theming",
      "Performance-focused build setup",
      "Well-structured, documented code",
    ],
    requirements: ["Node.js 20+", "Vite 5+", "Any REST API"],
    license: personalLicense,
    version: "2.0.0",
    rating: 4.6,
    reviews: 74,
    sales: 640,
    published: true,
    updatedAt: "2026-03-19",
  },
  {
    slug: "forge-ecommerce",
    name: "Forge E-commerce",
    tagline: "A full-stack commerce app with cart, checkout & order history.",
    description:
      "Forge is a complete e-commerce application with a catalog, cart, a multi-step checkout, and customer order history. It is wired end-to-end with a relational data layer and a clean service architecture, so you can point it at your own store data and payment provider of choice.",
    category: "Full-Stack Projects",
    categorySlug: "fullstack",
    price: 299,
    gallery: ["Catalog", "Product", "Checkout", "Orders"],
    technologies: ["Next.js 16", "TypeScript", "Drizzle ORM", "Tailwind CSS", "Zod"],
    features: [
      "Full catalog with search & filters",
      "Multi-step checkout flow",
      "Customer orders & download history",
      "Relational data layer (Drizzle)",
      "Input validation with Zod",
      "Clean service-layer architecture",
    ],
    requirements: ["Node.js 20+", "pnpm 9+", "PostgreSQL", "A payment provider (to enable)"],
    license: COMMERCE_LICENSE,
    version: "1.3.0",
    rating: 4.7,
    reviews: 121,
    sales: 890,
    featured: true,
    published: true,
    updatedAt: "2026-05-30",
  },
  {
    slug: "vector-admin",
    name: "Vector Admin",
    tagline: "A dense, keyboard-first admin panel for internal tools.",
    description:
      "Vector is built for internal tools and back-offices. It pairs a collapsible sidebar with high-density data tables, inline editing, filters, and a global command palette. The focus is on speed and information density so teams can do their jobs without leaving the page.",
    category: "Admin Dashboards",
    categorySlug: "dashboards",
    price: 129,
    gallery: ["Table", "Form", "Detail", "Audit"],
    technologies: ["Next.js 16", "TypeScript", "TanStack Table", "Tailwind CSS", "Zod"],
    features: [
      "High-density data tables",
      "Inline editing & row actions",
      "Command palette & shortcuts",
      "Filtering, sorting & saved views",
      "Audit log & activity feed",
      "Collapsible, keyboard-first shell",
    ],
    requirements: ["Node.js 20+", "pnpm 9+", "Any data source"],
    license: COMMERCE_LICENSE,
    version: "2.2.0",
    rating: 4.7,
    reviews: 98,
    sales: 720,
    published: true,
    updatedAt: "2026-02-14",
  },
  {
    slug: "aurora-components",
    name: "Aurora Components",
    tagline: "A modern React component kit with motion & theming built in.",
    description:
      "Aurora is a component kit that balances polish with restraint. It includes a full set of interactive components with subtle, tasteful motion, a tokenized theme, and a consistent interaction model. Ideal for product UIs that need to feel premium without over-animating.",
    category: "UI Kits",
    categorySlug: "ui-kits",
    price: 79,
    gallery: ["Primitives", "Motion", "Theme", "Blocks"],
    technologies: ["React 19", "TypeScript", "Tailwind CSS", "Motion"],
    features: [
      "40+ interactive components",
      "Tasteful, reduced-motion-friendly animation",
      "Tokenized theme with presets",
      "Form & overlay patterns",
      "Copy-paste friendly",
      "Consistent focus & a11y model",
    ],
    requirements: ["React 18+", "Tailwind CSS 4"],
    license: personalLicense,
    version: "1.6.0",
    rating: 4.5,
    reviews: 61,
    sales: 430,
    isNew: true,
    badge: "New",
    published: true,
    updatedAt: "2026-06-05",
  },
  {
    slug: "summit-marketing",
    name: "Summit Marketing Site",
    tagline: "A conversion-focused marketing site template for SaaS & agencies.",
    description:
      "Summit is a marketing site template with the sections you actually need: hero, logos, features, product shots, testimonials, pricing, FAQ, and footer. It is SEO-minded, fast, and easy to customize with your brand. Great as a landing page or a full company site.",
    category: "Website Source Code",
    categorySlug: "source-code",
    price: 119,
    gallery: ["Hero", "Features", "Pricing", "FAQ"],
    technologies: ["Next.js 16", "TypeScript", "Tailwind CSS", "shadcn/ui"],
    features: [
      "All core marketing sections",
      "SEO-minded metadata & schema",
      "Responsive down to mobile",
      "Testimonials & logo sections",
      "Pricing & FAQ blocks",
      "Easy brand customization",
    ],
    requirements: ["Node.js 20+", "pnpm 9+"],
    license: COMMERCE_LICENSE,
    version: "2.1.0",
    rating: 4.8,
    reviews: 143,
    sales: 1560,
    featured: true,
    published: true,
    updatedAt: "2026-04-08",
  },
  {
    slug: "metrics-pro",
    name: "Metrics Pro",
    tagline: "An analytics dashboard with real-time charts & data views.",
    description:
      "Metrics Pro is an analytics-focused dashboard with KPI cards, a flexible charting layer, comparison views, and exportable tables. It is designed to connect to your metrics pipeline and present the numbers that matter with clarity and speed.",
    category: "Admin Dashboards",
    categorySlug: "dashboards",
    price: 159,
    salePrice: 119,
    gallery: ["Overview", "Funnels", "Cohorts", "Export"],
    technologies: ["Next.js 16", "TypeScript", "Recharts", "Tailwind CSS", "Zod"],
    features: [
      "KPI & comparison cards",
      "Flexible charting layer",
      "Funnels & cohort views",
      "Exportable data tables",
      "Date-range filtering",
      "Real-time-ready data hooks",
    ],
    requirements: ["Node.js 20+", "pnpm 9+", "A metrics data source"],
    license: COMMERCE_LICENSE,
    version: "1.9.0",
    rating: 4.6,
    reviews: 87,
    sales: 610,
    published: true,
    updatedAt: "2026-01-29",
  },
  {
    slug: "orbit-portfolio",
    name: "Orbit Portfolio",
    tagline: "A minimal, elegant portfolio template for designers & devs.",
    description:
      "Orbit is a minimal portfolio template with a clean case-study layout, a project grid, and a writing section. It is lightweight, fast, and easy to personalize, making it a strong choice for designers, developers, and studios who want a portfolio that gets out of the way.",
    category: "Website Source Code",
    categorySlug: "source-code",
    price: 59,
    gallery: ["Home", "Work", "Case Study", "About"],
    technologies: ["Next.js 16", "TypeScript", "Tailwind CSS"],
    features: [
      "Clean case-study layout",
      "Filterable project grid",
      "Writing / notes section",
      "Lightweight & fast",
      "Easy content model (MDX-ready)",
      "Strong typography defaults",
    ],
    requirements: ["Node.js 20+", "pnpm 9+"],
    license: personalLicense,
    version: "1.4.0",
    rating: 4.7,
    reviews: 58,
    sales: 380,
    isNew: true,
    badge: "New",
    published: true,
    updatedAt: "2026-06-01",
  },
  {
    slug: "relay-fullstack",
    name: "Relay Full-Stack Kit",
    tagline: "A batteries-included full-stack app with auth, files & webhooks.",
    description:
      "Relay is a batteries-included full-stack kit covering the pieces every app needs: auth, file uploads, webhooks, notifications, and a settings area. It is a solid base for internal tools, portals, and customer-facing products, with a clear structure to grow into.",
    category: "Full-Stack Projects",
    categorySlug: "fullstack",
    price: 229,
    gallery: ["Auth", "Files", "Webhooks", "Settings"],
    technologies: ["Next.js 16", "TypeScript", "Auth.js", "Drizzle ORM", "Zod"],
    features: [
      "Auth with social & email",
      "File upload & storage wiring",
      "Webhook ingestion patterns",
      "Notification center",
      "Settings & preferences area",
      "Documented, scalable structure",
    ],
    requirements: ["Node.js 20+", "pnpm 9+", "PostgreSQL", "Object storage"],
    license: COMMERCE_LICENSE,
    version: "1.2.0",
    rating: 4.5,
    reviews: 66,
    sales: 340,
    published: true,
    updatedAt: "2026-03-02",
  },
  {
    slug: "nucleus-design-system",
    name: "Nucleus Design System",
    tagline: "A scalable design system with tokens, docs & component API.",
    description:
      "Nucleus is a design system you can actually maintain. It provides a token pipeline, a component API, and living documentation so your team can build consistently and ship faster. Start from the starter and extend it into your own in-house system.",
    category: "UI Kits",
    categorySlug: "ui-kits",
    price: 139,
    gallery: ["Tokens", "Components", "Docs", "Patterns"],
    technologies: ["React 19", "TypeScript", "Tailwind CSS", "Storybook", "Base UI"],
    features: [
      "Token pipeline (color, type, space)",
      "Documented component API",
      "Living docs site (Storybook)",
      "Theming & variants system",
      "Accessibility built-in",
      "Contribution-friendly structure",
    ],
    requirements: ["React 18+", "Tailwind CSS 4", "Node.js 20+"],
    license: COMMERCE_LICENSE,
    version: "2.0.0",
    rating: 4.8,
    reviews: 112,
    sales: 520,
    featured: true,
    published: true,
    updatedAt: "2026-05-11",
  },
  {
    slug: "ledger-crm",
    name: "Ledger CRM",
    tagline: "A CRM & pipeline dashboard for small sales teams.",
    description:
      "Ledger is a lightweight CRM with a visual pipeline, contact records, deal stages, and an activity timeline. It gives small teams a fast way to track deals without the complexity of an enterprise suite, and it is easy to adapt to your own workflow.",
    category: "Admin Dashboards",
    categorySlug: "dashboards",
    price: 179,
    gallery: ["Pipeline", "Contacts", "Deal", "Activity"],
    technologies: ["Next.js 16", "TypeScript", "Drizzle ORM", "Tailwind CSS", "Zustand"],
    features: [
      "Drag-and-drop pipeline",
      "Contact & deal records",
      "Activity timeline & notes",
      "Stage-based filtering",
      "Simple reporting views",
      "Adaptable data model",
    ],
    requirements: ["Node.js 20+", "pnpm 9+", "PostgreSQL"],
    license: COMMERCE_LICENSE,
    version: "1.1.0",
    rating: 4.4,
    reviews: 49,
    sales: 280,
    published: true,
    updatedAt: "2026-02-21",
  },
  {
    slug: "vite-react-boilerplate",
    name: "Vite React Boilerplate",
    tagline: "A modern, zero-config React setup with tooling included.",
    description:
      "A modern, zero-config React boilerplate with sensible defaults: TypeScript, ESLint, Prettier, testing, and a clean folder structure. Use it to start a new React project without spending a day on setup.",
    category: "React Templates",
    categorySlug: "react",
    price: 49,
    gallery: ["Setup", "Code", "Tests", "CI"],
    technologies: ["React 19", "TypeScript", "Vite", "Vitest", "ESLint"],
    features: [
      "Zero-config toolchain",
      "TypeScript + strictness",
      "Testing setup (Vitest)",
      "ESLint + Prettier config",
      "CI-ready scripts",
      "Clean folder structure",
    ],
    requirements: ["Node.js 20+", "Vite 5+"],
    license: personalLicense,
    version: "3.0.0",
    rating: 4.6,
    reviews: 71,
    sales: 940,
    published: true,
    updatedAt: "2026-01-15",
  },
  {
    slug: "pulse-blog-starter",
    name: "Pulse Blog Starter",
    tagline: "A fast, MDX-powered blog & content platform starter.",
    description:
      "Pulse is a fast, MDX-powered content starter with articles, tags, an archive, and a reading experience that respects the reader. It is built for people who publish regularly and want a clean, fast home for their writing.",
    category: "Next.js Templates",
    categorySlug: "nextjs",
    price: 79,
    gallery: ["Feed", "Article", "Tags", "Archive"],
    technologies: ["Next.js 16", "MDX", "TypeScript", "Tailwind CSS"],
    features: [
      "MDX content model",
      "Tag & archive views",
      "Fast reading experience",
      "SEO & structured data",
      "RSS-ready",
      "Easy author workflow",
    ],
    requirements: ["Node.js 20+", "pnpm 9+"],
    license: personalLicense,
    version: "1.5.0",
    rating: 4.7,
    reviews: 63,
    sales: 450,
    isNew: true,
    badge: "New",
    published: true,
    updatedAt: "2026-06-08",
  },
  {
    slug: "horizon-saas-landing",
    name: "Horizon SaaS Landing",
    tagline: "A bold, high-converting SaaS landing page template.",
    description:
      "Horizon is a bold SaaS landing page template with a strong hero, product showcase, social proof, and clear call-to-actions. It is built to convert visitors and is easy to tailor to your product, pricing, and brand.",
    category: "Website Source Code",
    categorySlug: "source-code",
    price: 89,
    salePrice: 69,
    gallery: ["Hero", "Product", "Social Proof", "CTA"],
    technologies: ["Next.js 16", "TypeScript", "Tailwind CSS", "Motion"],
    features: [
      "Conversion-focused hero",
      "Product showcase sections",
      "Social proof & testimonials",
      "Clear CTA patterns",
      "Subtle, reduced-motion-friendly motion",
      "Easy brand theming",
    ],
    requirements: ["Node.js 20+", "pnpm 9+"],
    license: COMMERCE_LICENSE,
    version: "1.7.0",
    rating: 4.6,
    reviews: 82,
    sales: 760,
    published: true,
    updatedAt: "2026-03-27",
  },
  {
    slug: "orbit-react-mobile",
    name: "Orbit React Mobile",
    tagline: "A responsive React mobile-first app template.",
    description:
      "Orbit React Mobile is a mobile-first React app template with bottom navigation, a feed, and detail views. It feels native on small screens while remaining a normal web app, giving you a strong starting point for consumer or utility apps.",
    category: "React Templates",
    categorySlug: "react",
    price: 109,
    gallery: ["Feed", "Detail", "Profile", "Settings"],
    technologies: ["React 19", "TypeScript", "Vite", "React Router", "Tailwind CSS"],
    features: [
      "Mobile-first layout",
      "Bottom navigation & gestures",
      "Feed & detail views",
      "Offline-ready data hooks",
      "PWA-ready setup",
      "Native-feeling interactions",
    ],
    requirements: ["Node.js 20+", "Vite 5+", "Any API"],
    license: personalLicense,
    version: "1.2.0",
    rating: 4.5,
    reviews: 44,
    sales: 300,
    published: true,
    updatedAt: "2026-02-05",
  },
  {
    slug: "basecamp-landing",
    name: "Basecamp Landing",
    tagline: "A versatile, block-based landing page you can assemble fast.",
    description:
      "Basecamp Landing is a block-based landing page you can assemble and re-arrange. It includes a rich set of sections — hero, feature grid, comparison, integrations, testimonials, and CTA — so you can build a complete page in an afternoon.",
    category: "Website Source Code",
    categorySlug: "source-code",
    price: 69,
    gallery: ["Hero", "Blocks", "Integrations", "CTA"],
    technologies: ["Next.js 16", "TypeScript", "Tailwind CSS"],
    features: [
      "Rich section library",
      "Drag-free, easy re-arrange",
      "Comparison & feature grids",
      "Integrations & logos",
      "Strong responsive behavior",
      "Simple content model",
    ],
    requirements: ["Node.js 20+", "pnpm 9+"],
    license: personalLicense,
    version: "2.3.0",
    rating: 4.4,
    reviews: 39,
    sales: 250,
    published: true,
    updatedAt: "2026-01-09",
  },
]

// ---------------------------------------------------------------------------
// Lookups
// ---------------------------------------------------------------------------

export const featuredProducts: Product[] = products.filter((p) => p.featured)

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getFeaturedProducts(limit = 4): Product[] {
  return featuredProducts.slice(0, limit)
}

export function getBestSellers(limit = 8): Product[] {
  return [...products]
    .filter((p) => p.published)
    .sort((a, b) => b.sales - a.sales)
    .slice(0, limit)
}

export function getNewProducts(limit = 4): Product[] {
  return products
    .filter((p) => p.published && p.isNew)
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    .slice(0, limit)
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const sameCategory = products.filter(
    (p) => p.slug !== product.slug && p.categorySlug === product.categorySlug
  )
  const others = products.filter(
    (p) => p.slug !== product.slug && p.categorySlug !== product.categorySlug
  ).sort((a, b) => {
    const aShared = a.technologies.filter((t) => product.technologies.includes(t)).length
    const bShared = b.technologies.filter((t) => product.technologies.includes(t)).length
    return bShared - aShared
  })
  return [...sameCategory, ...others].slice(0, limit)
}

export function getCategoryProducts(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug)
}

export function getCategoriesWithCounts(): (Category & { count: number })[] {
  return categories.map((c) => ({ ...c, count: getCategoryProducts(c.slug).length }))
}

// ---------------------------------------------------------------------------
// Querying: search, filter, sort, paginate
// ---------------------------------------------------------------------------

export type SortKey =
  | "featured"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "bestsellers"

export const sortOptions: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "bestsellers", label: "Best sellers" },
  { value: "rating", label: "Top rated" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
]

export type CatalogQuery = {
  search?: string
  category?: string
  sort?: SortKey
  page?: number
  perPage?: number
}

export type CatalogResult = {
  items: Product[]
  total: number
  page: number
  perPage: number
  totalPages: number
  hasPrev: boolean
  hasNext: boolean
}

const PER_PAGE = 9

function effectivePrice(p: Product): number {
  return p.salePrice ?? p.price
}

function matchesSearch(p: Product, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const haystack = [
    p.name,
    p.tagline,
    p.description,
    p.category,
    ...p.technologies,
    ...p.features,
  ]
    .join(" ")
    .toLowerCase()
  return q.split(/\s+/).every((term) => haystack.includes(term))
}

export function queryCatalog(query: CatalogQuery = {}): CatalogResult {
  const { search, category, sort = "featured", page = 1, perPage = PER_PAGE } = query

  let list = products.filter((p) => p.published)

  if (category) list = list.filter((p) => p.categorySlug === category)
  if (search) list = list.filter((p) => matchesSearch(p, search))

  const sorted = [...list].sort((a, b) => {
    switch (sort) {
      case "newest":
        return a.updatedAt < b.updatedAt ? 1 : -1
      case "price-asc":
        return effectivePrice(a) - effectivePrice(b)
      case "price-desc":
        return effectivePrice(b) - effectivePrice(a)
      case "rating":
        return b.rating - a.rating || b.reviews - a.reviews
      case "bestsellers":
        return b.sales - a.sales
      case "featured":
      default:
        return Number(b.featured) - Number(a.featured) || b.sales - a.sales
    }
  })

  const total = sorted.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * perPage
  const items = sorted.slice(start, start + perPage)

  return {
    items,
    total,
    page: safePage,
    perPage,
    totalPages,
    hasPrev: safePage > 1,
    hasNext: safePage < totalPages,
  }
}

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

export function formatPrice(value: number): string {
  return `$${value.toLocaleString("en-US")}`
}

export function discountPercent(p: Product): number | null {
  if (p.salePrice == null) return null
  const pct = Math.round(((p.price - p.salePrice) / p.price) * 100)
  return pct > 0 ? pct : null
}

// ---------------------------------------------------------------------------
// URL helpers for filters / pagination
// ---------------------------------------------------------------------------

export function buildQueryString(
  params: Record<string, string | number | undefined | null>
): string {
  const usp = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue
    usp.set(key, String(value))
  }
  const s = usp.toString()
  return s ? `?${s}` : ""
}

export function withParam(
  params: Record<string, string | number | undefined | null>,
  key: string,
  value: string | number | undefined | null
): Record<string, string | number | undefined | null> {
  const next = { ...params }
  if (value === undefined || value === null || value === "") {
    delete next[key]
  } else {
    next[key] = value
  }
  return next
}
