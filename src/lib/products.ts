export type Product = {
  slug: string
  name: string
  tagline: string
  description: string
  category: string
  categorySlug: string
  price: number
  productType?: "FREE" | "PAID"
  salePrice?: number
  gallery: string[]
  technologies: string[]
  features: string[]
  requirements: string[]
  license: { label: string; includes: string[] }
  version: string
  rating: number
  reviews: number
  sales: number
  featured?: boolean
  isNew?: boolean
  badge?: string
  published: boolean
  updatedAt: string
}

export type SortKey = "featured" | "newest" | "price-asc" | "price-desc" | "rating" | "bestsellers"
export const sortOptions: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "bestsellers", label: "Best sellers" },
  { value: "rating", label: "Top rated" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
]

export type CatalogQuery = { search?: string; category?: string; sort?: SortKey; page?: number; perPage?: number }
export type CatalogResult = { items: Product[]; total: number; page: number; perPage: number; totalPages: number; hasPrev: boolean; hasNext: boolean }

export function formatPrice(value: number) { return `$${value.toLocaleString("en-US")}` }
export function discountPercent(product: Product) { if (product.salePrice == null || product.price <= 0) return null; const percent = Math.round(((product.price - product.salePrice) / product.price) * 100); return percent > 0 ? percent : null }

export function buildQueryString(params: Record<string, string | number | undefined | null>) {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) if (value !== undefined && value !== null && value !== "") query.set(key, String(value))
  const result = query.toString()
  return result ? `?${result}` : ""
}

export function withParam(params: Record<string, string | number | undefined | null>, key: string, value: string | number | undefined | null) {
  const next = { ...params }
  if (value === undefined || value === null || value === "") delete next[key]
  else next[key] = value
  return next
}
