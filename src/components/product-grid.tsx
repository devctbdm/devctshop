import { ProductCard } from "@/components/product-card";
import { ProductFilters } from "@/components/product-filters";
import { Pagination } from "@/components/pagination";
import { type CatalogQuery } from "@/lib/products";
import { getPublishedDatabaseProducts, mapDbProduct } from "@/lib/catalog";
import { getActiveCategories } from "@/lib/catalog";

type ProductGridProps = {
  query: CatalogQuery;
  lockCategory?: boolean;
};

export async function ProductGrid({ query, lockCategory = false }: ProductGridProps) {
  const databaseProducts = await getPublishedDatabaseProducts();
  const categories = await getActiveCategories();
  const result = queryDatabaseCatalog(databaseProducts.map(mapDbProduct), query);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="flex flex-col gap-4 border-b pb-4 lg:flex-row lg:items-center lg:justify-between">
        <ProductFilters
          search={query.search}
          category={query.category}
          sort={query.sort}
          lockCategory={lockCategory}
          categories={categories}
        />
        <p className="text-sm text-muted-foreground" role="status">
          {result.total === 0
            ? "No products found"
            : `${result.total} ${result.total === 1 ? "product" : "products"}`}
        </p>
      </div>

      {result.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
          <p className="font-heading text-lg font-semibold">
            No products found
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Try a different search term or category, or clear the filters to see
            the full catalog.
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
  );
}

function queryDatabaseCatalog(products: import("@/lib/products").Product[], query: CatalogQuery) {
  const filtered = products.filter((product) => (!query.category || product.categorySlug === query.category) && (!query.search || `${product.name} ${product.category} ${product.tagline} ${product.technologies.join(" ")}`.toLowerCase().includes(query.search.toLowerCase())))
  const sorted = [...filtered].sort((a, b) => query.sort === "price-asc" ? (a.salePrice ?? a.price) - (b.salePrice ?? b.price) : query.sort === "price-desc" ? (b.salePrice ?? b.price) - (a.salePrice ?? a.price) : query.sort === "rating" ? b.rating - a.rating : b.sales - a.sales)
  const perPage = 9
  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage))
  const page = Math.min(Math.max(1, query.page ?? 1), totalPages)
  return { items: sorted.slice((page - 1) * perPage, page * perPage), total: sorted.length, page, perPage, totalPages, hasPrev: page > 1, hasNext: page < totalPages }
}
