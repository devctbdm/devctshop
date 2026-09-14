import type { MetadataRoute } from "next"

import { categories, products } from "@/lib/products"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://devct.shop"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
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
    ...products.filter((product) => product.published).map((product) => ({
      url: `${siteUrl}/products/${product.slug}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ]
}
