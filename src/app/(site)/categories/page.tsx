import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { ProductCover } from "@/components/product-cover"
import { getAdminCategoryCounts } from "@/lib/catalog"

export const metadata = { title: "Categories — Devct Shop", description: "Browse digital products by category." }

export default async function CategoriesPage() {
  const categoryList = await getAdminCategoryCounts()
  return <div className="bg-background"><div className="border-b"><div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8"><h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">Categories</h1><p className="mt-3 max-w-xl text-muted-foreground">Browse real product categories managed from the Devct Shop admin.</p></div></div><div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">{categoryList.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{categoryList.map(({ category, count }) => <Link key={category.id} href={`/categories/${category.slug}`} className="group flex flex-col gap-3 overflow-hidden rounded-xl border bg-card shadow-2xs transition-all hover:border-foreground/20 hover:shadow-md"><ProductCover seed={category.slug} className="aspect-[16/7]" /><div className="flex items-center justify-between gap-3 p-4"><div><p className="text-sm font-semibold">{category.name}</p><p className="mt-1 text-sm text-muted-foreground">{category.description ?? "Explore this collection."}</p></div><span className="text-xs text-muted-foreground">{count} {count === 1 ? "product" : "products"}</span></div></Link>)}</div> : <div className="rounded-xl border border-dashed p-12 text-center text-sm text-muted-foreground">No active categories are available yet.</div>}<div className="mt-10 border-t pt-8"><Link href="/products" className="inline-flex items-center gap-1 text-sm font-medium hover:underline">Browse all products<ArrowRightIcon className="size-4" /></Link></div></div></div>
}
