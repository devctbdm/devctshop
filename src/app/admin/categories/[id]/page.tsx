import Link from "next/link"
import { notFound } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminCategoryForm } from "@/components/admin/admin-category-form"
import { getAdminCategory } from "@/lib/admin"
import { Button } from "@/components/ui/button"

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const category = await getAdminCategory(id); if (!category) notFound(); return <div className="mx-auto max-w-3xl"><Button variant="ghost" size="sm" className="mb-3" render={<Link href="/admin/categories" />}>Back to categories</Button><AdminHeader title={`Edit ${category.name}`} description="Update category details and visibility." /><AdminCategoryForm category={category} /></div> }
