import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent } from "@/components/ui/card"
import { categories, getCategoryProducts } from "@/lib/products"

export default function AdminCategoriesPage() {
  return <div className="mx-auto max-w-7xl"><AdminHeader title="Categories" description="Review catalog organization and category coverage." /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{categories.map((category) => { const Icon = category.icon; return <Card key={category.slug}><CardContent className="flex items-start gap-4"><span className="flex size-10 items-center justify-center rounded-lg bg-muted"><Icon className="size-5" /></span><div className="min-w-0 flex-1"><p className="font-medium">{category.name}</p><p className="mt-1 text-sm text-muted-foreground">{getCategoryProducts(category.slug).length} catalog products</p><Link href={`/categories/${category.slug}`} className="mt-3 inline-flex items-center gap-1 text-sm font-medium hover:underline">View category<ArrowRightIcon className="size-4" /></Link></div></CardContent></Card> })}</div></div>
}
