"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  buildQueryString,
  categories,
  sortOptions,
  type CatalogQuery,
} from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon, XIcon } from "lucide-react";

export function ProductFilters({
  search,
  category,
  sort,
  lockCategory = false,
}: {
  search?: string;
  category?: string;
  sort?: string;
  lockCategory?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const active = Boolean(search || category || sort);

  function apply(next: Partial<CatalogQuery>) {
    const params: Record<string, string | undefined> = {
      search: next.search ?? search,
      category: next.category ?? category,
      sort: (next.sort ?? sort) as string | undefined,
    };
    const qs = buildQueryString(params);
    router.replace(`${pathname}${qs}`, { scroll: false });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative w-full sm:w-72">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search ?? ""}
          onChange={(e) => apply({ search: e.target.value })}
          placeholder="Search products…"
          aria-label="Search products"
          className="pl-8"
        />
        {search ? (
          <button
            type="button"
            onClick={() => apply({ search: undefined })}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Clear search"
          >
            <XIcon className="size-3.5" />
          </button>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {lockCategory ? (
          <span className="inline-flex h-8 items-center rounded-lg border border-border bg-muted px-2.5 text-sm text-muted-foreground">
            Category
          </span>
        ) : (
          <>
            <label className="sr-only" htmlFor="filter-category">
              Category
            </label>
            <select
              id="filter-category"
              value={category ?? ""}
              onChange={(e) =>
                apply({ category: e.target.value || undefined, page: 1 })
              }
              className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </>
        )}

        <label className="sr-only" htmlFor="filter-sort">
          Sort by
        </label>
        <select
          id="filter-sort"
          value={sort ?? "featured"}
          onChange={(e) =>
            apply({ sort: e.target.value as CatalogQuery["sort"], page: 1 })
          }
          className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {active ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.replace(pathname, { scroll: false })}
          >
            <XIcon className="size-3.5" />
            Clear
          </Button>
        ) : null}
      </div>
    </div>
  );
}
