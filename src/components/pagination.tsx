import { buildQueryString, withParam, type CatalogQuery } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";

type PaginationProps = {
  params: CatalogQuery;
  totalPages: number;
  page: number;
};

export function Pagination({ params, totalPages, page }: PaginationProps) {
  if (totalPages <= 1) return null;

  const base: Record<string, string | number | undefined> = {
    search: params.search,
    category: params.category,
    sort: params.sort,
  };
  const hrefFor = (p: number) =>
    buildQueryString(withParam(base, "page", p > 1 ? p : undefined));

  const pages: number[] = [];
  for (
    let i = Math.max(1, page - 1);
    i <= Math.min(totalPages, page + 1);
    i++
  ) {
    pages.push(i);
  }

  return (
    <nav
      className="mt-8 flex items-center justify-center gap-1.5"
      aria-label="Pagination"
    >
      {page > 2 ? (
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          nativeButton={false}
          render={<Link href={hrefFor(1)} />}
          aria-label="First page"
        >
          <ChevronLeftIcon className="size-3.5" />
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          disabled={page <= 1}
          aria-label="First page"
        >
          <ChevronLeftIcon className="size-3.5" />
        </Button>
      )}

      {page > 1 ? (
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          nativeButton={false}
          render={<Link href={hrefFor(page - 1)} />}
        >
          <ChevronLeftIcon className="size-3.5" />
          <span>Prev</span>
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          disabled={page <= 1}
        >
          <ChevronLeftIcon className="size-3.5" />
          <span>Prev</span>
        </Button>
      )}

      {pages.map((p) =>
        p === page ? (
          <Button
            key={p}
            variant="default"
            size="sm"
            className="min-w-8"
            aria-current="page"
          >
            {p}
          </Button>
        ) : (
          <Button
            key={p}
            variant="outline"
            size="sm"
            className="min-w-8"
            nativeButton={false}
            render={<Link href={hrefFor(p)} />}
          >
            {p}
          </Button>
        ),
      )}

      {page < totalPages ? (
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          nativeButton={false}
          render={<Link href={hrefFor(page + 1)} />}
        >
          <span>Next</span>
          <ChevronRightIcon className="size-3.5" />
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          disabled={page >= totalPages}
        >
          <span>Next</span>
          <ChevronRightIcon className="size-3.5" />
        </Button>
      )}

      {page < totalPages - 1 ? (
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          nativeButton={false}
          render={<Link href={hrefFor(totalPages)} />}
          aria-label="Last page"
        >
          <ChevronRightIcon className="size-3.5" />
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          disabled={page >= totalPages}
          aria-label="Last page"
        >
          <ChevronRightIcon className="size-3.5" />
        </Button>
      )}
    </nav>
  );
}
