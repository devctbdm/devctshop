import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product-filters"
import { Pagination } from "@/components/pagination"
import { queryCatalog, type CatalogQuery } from "@/lib/products"

type ProductGridProps = {
  query: CatalogQuery
  lockCategory?: boolean
}

export function ProductGrid({ query, lockCategory = false }: ProductGridProps) {
  const result = queryCatalog(query)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="flex flex-col gap-4 border-b pb-4 lg:flex-row lg:items-center lg:justify-between">
        <ProductFilters
          search={query.search}
          category={query.category}
          sort={query.sort}
          lockCategory={lockCategory}
        />
        <p className="text-sm text-muted-foreground" role="status">
          {result.total === 0
            ? "No products found"
            : `${result.total} ${result.total === 1 ? "product" : "products"}`}
        </p>
      </div>

      {result.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
          <p className="font-heading text-lg font-semibold">No products found</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Try a different search term or category, or clear the filters to
            see the full catalog.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {result.items.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}

      <Pagination
        params={query}
        page={result.page}
        totalPages={result.totalPages}
      />
    </div>
  )
}
