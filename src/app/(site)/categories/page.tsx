import Link from "next/link"

import { ProductCover } from "@/components/product-cover"
import { getCategoriesWithCounts, getFeaturedProducts } from "@/lib/products"
import { ArrowRightIcon } from "lucide-react"

export const metadata = {
  title: "Categories — Devct Shop",
  description:
    "Browse digital products by category: Next.js templates, React templates, admin dashboards, UI kits, full-stack projects and website source code.",
}

export default function CategoriesPage() {
  const categoryList = getCategoriesWithCounts()
  const featured = getFeaturedProducts(3)

  return (
    <div className="bg-background">
      <div className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Categories
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Everything is organized the way developers think — by what you are
            building, not by buzzwords.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categoryList.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group flex flex-col gap-3 overflow-hidden rounded-xl border bg-card shadow-2xs transition-all hover:border-foreground/20 hover:shadow-md dark:hover:border-white/20"
            >
              <div className="flex aspect-[16/7] items-center">
                <ProductCover seed={category.slug} className="size-full" />
              </div>
              <div className="flex items-center justify-between gap-3 p-4">
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <category.icon className="size-5" />
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold">{category.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {category.description}
                    </span>
                  </div>
                </div>
                <span className="flex flex-col items-end gap-0.5">
                  <span className="font-heading text-lg font-semibold">
                    {category.count}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {category.count === 1 ? "product" : "products"}
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 border-t pt-10">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
              Trending this week
            </h2>
            <Link
              href="/products"
              className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              View all
              <ArrowRightIcon className="size-4" />
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product) => (
              <TrendingRow key={product.slug} slug={product.slug} name={product.name} category={product.category} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function TrendingRow({
  slug,
  name,
  category,
}: {
  slug: string
  name: string
  category: string
}) {
  return (
    <Link
      href={`/products/${slug}`}
      className="group flex items-center gap-4 rounded-xl border bg-card p-3 transition-all hover:border-foreground/20 hover:shadow-md dark:hover:border-white/20"
    >
      <ProductCover
        seed={slug}
        className="size-16 shrink-0 rounded-lg"
      />
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate font-heading text-sm font-semibold group-hover:underline underline-offset-4">
          {name}
        </span>
        <span className="truncate text-sm text-muted-foreground">{category}</span>
      </div>
    </Link>
  )
}
