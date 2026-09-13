import {
  ArrowRightIcon,
  BadgeCheckIcon,
  CheckIcon,
  DownloadIcon,
  RocketIcon,
  ShieldCheckIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ProductCard } from "@/components/product-card"
import { categories, featuredProducts } from "@/lib/products"

const stats = [
  { value: "480+", label: "Products" },
  { value: "32k", label: "Downloads" },
  { value: "4.8/5", label: "Average rating" },
  { value: "24h", label: "Avg. support response" },
]

const valueProps = [
  {
    title: "Production-ready code",
    description:
      "Every product is built with TypeScript, tested, and documented. No half-finished scaffolds.",
    icon: BadgeCheckIcon,
  },
  {
    title: "Lifelong updates",
    description:
      "Buy once and receive every future update, including major framework version bumps.",
    icon: RocketIcon,
  },
  {
    title: "Secure checkout",
    description:
      "Instant delivery after payment with a commercial license for client and private projects.",
    icon: ShieldCheckIcon,
  },
  {
    title: "Instant download",
    description:
      "Get the full source code within seconds of purchase — no waiting, no friction.",
    icon: DownloadIcon,
  },
]

function Hero() {
  return (
    <section className="border-b">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-6 gap-1.5 px-3 py-1">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            New: Next.js 16 templates are live
          </Badge>
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl sm:leading-[1.1]">
            Premium digital products for developers who ship
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
            Production-ready website source code, Next.js templates, admin
            dashboards, and UI kits. Built in the open, updated for life.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" className="w-full sm:w-auto">
              Browse products
              <ArrowRightIcon className="size-4" data-icon="inline-end" />
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              View pricing
            </Button>
          </div>
          <div className="mt-14 grid grid-cols-2 gap-6 border-t pt-10 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <span className="font-heading text-2xl font-semibold tracking-tight">
                  {stat.value}
                </span>
                <span className="text-sm text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Categories() {
  return (
    <section id="categories" className="scroll-mt-16">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex flex-col gap-2">
          <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            Browse by category
          </h2>
          <p className="max-w-xl text-muted-foreground">
            Everything is organized the way developers think — by what you are
            building, not by buzzwords.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <a
              key={category.name}
              href="#featured"
              className="group flex items-start gap-4 rounded-xl border bg-card p-4 shadow-2xs transition-all hover:border-foreground/20 hover:shadow-md dark:hover:border-white/20"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <category.icon className="size-5" />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold">{category.name}</span>
                <span className="text-sm text-muted-foreground">
                  {category.description}
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturedProducts() {
  return (
    <section id="featured" className="scroll-mt-16 border-y bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
              Featured products
            </h2>
            <p className="max-w-xl text-muted-foreground">
              Hand-picked, battle-tested products our customers rely on in
              production.
            </p>
          </div>
          <Button variant="outline" className="w-fit shrink-0">
            View all products
            <ArrowRightIcon className="size-4" data-icon="inline-end" />
          </Button>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ValueProps() {
  return (
    <section id="templates" className="scroll-mt-16">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            Built to be trusted
          </h2>
          <p className="mt-3 text-muted-foreground">
            Devct Shop is a small team of developers who still care about the
            details. Here is what every purchase includes.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {valueProps.map((prop) => (
            <Card key={prop.title}>
              <CardHeader>
                <span className="mb-2 flex size-10 items-center justify-center rounded-lg bg-muted">
                  <prop.icon className="size-5" />
                </span>
                <CardTitle>{prop.title}</CardTitle>
                <CardDescription>{prop.description}</CardDescription>
              </CardHeader>
              <CardContent />
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function CtaBanner() {
  return (
    <section id="pricing" className="scroll-mt-16 border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            Start building with code you can trust
          </h2>
          <p className="text-muted-foreground">
            One-time pricing, commercial licenses, and updates for life. Find
            the right starting point for your next project.
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button size="lg" className="w-full sm:w-auto">
              Browse products
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Talk to support
            </Button>
          </div>
          <ul className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {["No subscriptions", "30-day money back", "Commercial license"].map(
              (item) => (
                <li key={item} className="inline-flex items-center gap-1.5">
                  <CheckIcon className="size-4 text-emerald-600 dark:text-emerald-400" />
                  {item}
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <ValueProps />
      <CtaBanner />
    </>
  )
}
