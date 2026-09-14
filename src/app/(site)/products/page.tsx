import { ProductGrid } from "@/components/product-grid"
import { type CatalogQuery, type SortKey } from "@/lib/products"

const SORT_VALUES: SortKey[] = [
  "featured",
  "newest",
  "bestsellers",
  "rating",
  "price-asc",
  "price-desc",
]

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function toQuery(raw: Record<string, string | string[] | undefined>): CatalogQuery {
  const first = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v[0] : v
  const search = first(raw.search)
  const category = first(raw.category)
  const sortRaw = first(raw.sort) as SortKey | undefined
  const pageRaw = Number.parseInt(first(raw.page) ?? "1", 10)

  return {
    search: search && search.trim() ? search.trim() : undefined,
    category: category || undefined,
    sort: sortRaw && SORT_VALUES.includes(sortRaw) ? sortRaw : "featured",
    page: Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1,
  }
}

export async function generateMetadata({
  searchParams,
}: PageProps) {
  const q = toQuery(await searchParams)
  const title = q.search
    ? `Products — "${q.search}"`
    : "All products"
  return {
    title: `${title} — Devct Shop`,
    description:
      "Browse production-ready Next.js templates, React starters, admin dashboards, UI kits and full-stack source code.",
  }
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const query = toQuery(await searchParams)

  return (
    <div className="bg-background">
      <div className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            All products
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Production-ready digital products for developers. Filter by
            category, search, and sort to find the right starting point.
          </p>
        </div>
      </div>
      <ProductGrid query={query} />
    </div>
  )
}
