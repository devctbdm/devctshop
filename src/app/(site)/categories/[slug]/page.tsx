import Link from "next/link"
import { notFound } from "next/navigation"

import { ProductGrid } from "@/components/product-grid"
import {
  getCategoryBySlug,
  type CatalogQuery,
  type SortKey,
} from "@/lib/products"
import { ArrowRightIcon } from "lucide-react"

const SORT_VALUES: SortKey[] = [
  "featured",
  "newest",
  "bestsellers",
  "rating",
  "price-asc",
  "price-desc",
]

type CategoryPageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function toQuery(
  raw: Record<string, string | string[] | undefined>,
  categorySlug: string
): CatalogQuery {
  const first = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v[0] : v
  const search = first(raw.search)
  const sortRaw = first(raw.sort) as SortKey | undefined
  const pageRaw = Number.parseInt(first(raw.page) ?? "1", 10)

  return {
    search: search && search.trim() ? search.trim() : undefined,
    category: categorySlug,
    sort: sortRaw && SORT_VALUES.includes(sortRaw) ? sortRaw : "featured",
    page: Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1,
  }
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) return { title: "Category not found — Devct Shop" }
  return {
    title: `${category.name} — Devct Shop`,
    description: category.description,
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) notFound()

  const query = toQuery(await searchParams, slug)
  const Icon = category.icon

  return (
    <div className="bg-background">
      <div className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <Link
            href="/categories"
            className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowRightIcon className="size-4 -scale-x-100" />
            All categories
          </Link>
          <div className="flex items-center gap-4">
            <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Icon className="size-6" />
            </span>
            <div>
              <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                {category.name}
              </h1>
              <p className="mt-1 text-muted-foreground">{category.description}</p>
            </div>
          </div>
        </div>
      </div>

      <ProductGrid query={query} lockCategory />
    </div>
  )
}
