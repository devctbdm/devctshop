import { buildQueryString, withParam, type CatalogQuery } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

type PaginationProps = {
  params: CatalogQuery
  totalPages: number
  page: number
}

export function Pagination({ params, totalPages, page }: PaginationProps) {
  if (totalPages <= 1) return null

  const base: Record<string, string | number | undefined> = {
    search: params.search,
    category: params.category,
    sort: params.sort,
  }
  const hrefFor = (p: number) =>
    buildQueryString(withParam(base, "page", p > 1 ? p : undefined))

  const pages: number[] = []
  for (let i = Math.max(1, page - 1); i <= Math.min(totalPages, page + 1); i++) {
    pages.push(i)
  }

  return (
    <nav className="mt-8 flex items-center justify-center gap-1.5" aria-label="Pagination">
      <Button
        variant="outline"
        size="sm"
        className="gap-1"
        render={page > 2 ? <a href={hrefFor(1)} /> : undefined}
        disabled={page <= 1}
        aria-label="First page"
      >
        <ChevronLeftIcon className="size-3.5" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="gap-1"
        render={page > 1 ? <a href={hrefFor(page - 1)} /> : undefined}
        disabled={page <= 1}
      >
        <ChevronLeftIcon className="size-3.5" />
        <span>Prev</span>
      </Button>

      {pages.map((p) => (
        <Button
          key={p}
          variant={p === page ? "default" : "outline"}
          size="sm"
          className="min-w-8"
          render={p === page ? undefined : <a href={hrefFor(p)} />}
          aria-current={p === page ? "page" : undefined}
        >
          {p}
        </Button>
      ))}

      <Button
        variant="outline"
        size="sm"
        className="gap-1"
        render={page < totalPages ? <a href={hrefFor(page + 1)} /> : undefined}
        disabled={page >= totalPages}
      >
        <span>Next</span>
        <ChevronRightIcon className="size-3.5" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="gap-1"
        render={page < totalPages - 1 ? <a href={hrefFor(totalPages)} /> : undefined}
        disabled={page >= totalPages}
        aria-label="Last page"
      >
        <ChevronRightIcon className="size-3.5" />
      </Button>
    </nav>
  )
}
