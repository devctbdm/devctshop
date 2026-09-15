import "server-only"

import { and, asc, desc, eq } from "drizzle-orm"
import { db } from "@/db"
import { categories, products } from "@/db/schema"
import type { Product } from "@/lib/products"

export type DbCategory = typeof categories.$inferSelect

export async function getActiveCategories() {
  return db.select().from(categories).where(eq(categories.isActive, true)).orderBy(asc(categories.position), asc(categories.name))
}

export async function getCategoryBySlugFromDb(slug: string) {
  const [category] = await db.select().from(categories).where(and(eq(categories.slug, slug), eq(categories.isActive, true))).limit(1)
  return category ?? null
}

export async function getAdminCategoryCounts() {
  const rows = await db.select({ category: categories, productCount: products.id }).from(categories).leftJoin(products, eq(products.categoryId, categories.id)).orderBy(asc(categories.position), asc(categories.name))
  const map = new Map<string, { category: DbCategory; count: number }>()
  for (const row of rows) {
    const current = map.get(row.category.id) ?? { category: row.category, count: 0 }
    if (row.productCount) current.count += 1
    map.set(row.category.id, current)
  }
  return [...map.values()]
}

export async function getPublishedDatabaseProducts() {
  return db.select({ product: products, category: categories }).from(products).innerJoin(categories, eq(products.categoryId, categories.id)).where(and(eq(products.isPublished, true), eq(categories.isActive, true))).orderBy(desc(products.createdAt))
}

export async function getDatabaseProductBySlug(slug: string) {
  const [row] = await db.select({ product: products, category: categories }).from(products).innerJoin(categories, eq(products.categoryId, categories.id)).where(and(eq(products.slug, slug), eq(products.isPublished, true), eq(categories.isActive, true))).limit(1)
  return row ? mapDbProduct(row) : null
}

export async function getRelatedDatabaseProducts(product: Product, limit = 4) {
  const rows = await getPublishedDatabaseProducts()
  const mapped = rows.map(mapDbProduct).filter((item) => item.slug !== product.slug)
  return mapped.sort((a, b) => {
    const aScore = Number(a.categorySlug === product.categorySlug) * 10 + a.technologies.filter((tech) => product.technologies.includes(tech)).length
    const bScore = Number(b.categorySlug === product.categorySlug) * 10 + b.technologies.filter((tech) => product.technologies.includes(tech)).length
    return bScore - aScore || b.sales - a.sales
  }).slice(0, limit)
}

export function mapDbProduct(row: Awaited<ReturnType<typeof getPublishedDatabaseProducts>>[number]): Product {
  const product = row.product
  return {
    slug: product.slug,
    name: product.name,
    tagline: product.tagline ?? "",
    description: product.description ?? "",
    category: row.category.name,
    categorySlug: row.category.slug,
    price: product.priceCents / 100,
    salePrice: product.salePriceCents ? product.salePriceCents / 100 : undefined,
    productType: product.productType as "FREE" | "PAID",
    gallery: product.imageUrls,
    technologies: product.techStack,
    features: product.features,
    requirements: product.requirements,
    license: { label: product.license, includes: [] },
    version: product.version,
    rating: Number(product.ratingAvg),
    reviews: product.ratingCount,
    sales: product.salesCount,
    featured: product.featured,
    published: product.isPublished,
    updatedAt: product.updatedAt.toISOString(),
  }
}
