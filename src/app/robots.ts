import type { MetadataRoute } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://devct.shop"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: ["/"], disallow: ["/admin", "/account", "/dashboard", "/checkout", "/cart", "/api/"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
