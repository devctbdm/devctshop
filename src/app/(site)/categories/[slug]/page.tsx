import Link from "next/link"
import { notFound } from "next/navigation"
import { ProductGrid } from "@/components/product-grid"
import { getCategoryBySlugFromDb } from "@/lib/catalog"
import { type CatalogQuery, type SortKey } from "@/lib/products"
import { ArrowRightIcon, BlocksIcon } from "lucide-react"

const sortValues: SortKey[] = ["featured", "newest", "bestsellers", "rating", "price-asc", "price-desc"]
type Props = { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }

export async function generateMetadata({ params }: Props) { const category = await getCategoryBySlugFromDb((await params).slug); return category ? { title: `${category.name} — Devct Shop`, description: category.description ?? `Explore ${category.name}.` } : { title: "Category not found — Devct Shop" } }

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const category = await getCategoryBySlugFromDb(slug)
  if (!category) notFound()
  const raw = await searchParams
  const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value
  const sort = first(raw.sort) as SortKey | undefined
  const page = Number.parseInt(first(raw.page) ?? "1", 10)
  const query: CatalogQuery = { category: slug, search: first(raw.search), sort: sort && sortValues.includes(sort) ? sort : "featured", page: Number.isFinite(page) && page > 0 ? page : 1 }
  return <div className="bg-background"><div className="border-b bg-muted/30"><div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8"><Link href="/categories" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"><ArrowRightIcon className="size-4 -scale-x-100" />All categories</Link><div className="flex items-center gap-4"><span className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground"><BlocksIcon className="size-6" /></span><div><h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">{category.name}</h1><p className="mt-1 text-muted-foreground">{category.description}</p></div></div></div></div><ProductGrid query={query} lockCategory /></div>
}
