import Link from "next/link"
import { BoxesIcon, PlusIcon } from "lucide-react"
import { AdminHeader } from "@/components/admin/admin-header"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { products } from "@/lib/products"

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  const rows = q ? products.filter((product) => `${product.name} ${product.category}`.toLowerCase().includes(q.toLowerCase())) : products
  return <div className="mx-auto max-w-7xl"><AdminHeader title="Products" description="Review the public catalog and product presentation." search={q} /><div className="mb-5 flex justify-end"><Button variant="outline" disabled><PlusIcon className="size-4" />Add product</Button></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{rows.map((product) => <div key={product.slug} className="relative"><ProductCard product={product} /><div className="absolute top-3 right-3"><Button size="sm" variant="secondary" render={<Link href={`/products/${product.slug}`} />}>View</Button></div></div>)}</div>{!rows.length ? <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed text-center"><BoxesIcon className="size-7 text-muted-foreground" /><p className="mt-3 font-medium">No products found</p><p className="mt-1 text-sm text-muted-foreground">Try a different search.</p></div> : null}</div>
}
