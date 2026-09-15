import type { MetadataRoute } from "next"

import { getActiveCategories, getPublishedDatabaseProducts } from "@/lib/catalog"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://devct.shop"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const [categories, products] = await Promise.all([getActiveCategories(), getPublishedDatabaseProducts()])
  return [
    { url: siteUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/products`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/categories`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...categories.map((category) => ({
      url: `${siteUrl}/categories/${category.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...products.map(({ product }) => ({
      url: `${siteUrl}/products/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ]
}
