import type { Product } from "./products"

export type Review = {
  id: string
  author: string
  rating: number
  title: string
  body: string
  date: string
  helpful: number
}

const FIRST = [
  "Aiden", "Maya", "Liam", "Sofia", "Noah", "Elena", "Marcus", "Priya",
  "Diego", "Hannah", "Kenji", "Nadia", "Omar", "Clara", "Felix", "Iris",
]
const LAST = [
  "Chen", "Okafor", "Silva", "Novak", "Haddad", "Kim", "Rossi", "Meyer",
  "Costa", "Ahmed", "Larsson", "Patel", "Nguyen", "Weber", "Diaz", "Ito",
]

const BODIES = [
  "Shipped a client project with this in a few days. The structure is clean, the docs are accurate, and I barely had to touch the setup to make it mine.",
  "Code quality is excellent. Naming is consistent and the folder layout actually scales — I added new features without fighting the template.",
  "Great value. It saved me at least a week of scaffolding. The only thing I changed was the color tokens, which was easy.",
  "Bought it on a recommendation and it did not disappoint. Well documented, accessible, and it works on the latest framework versions.",
  "Solid foundation. There is a little to learn at first, but once you read through the included notes everything clicks. Worth every cent.",
  "I have used several templates like this and this is one of the best organized. The components are reusable and the defaults are sensible.",
  "Clean, fast, and production-ready. I deployed it with minimal changes and it just works. Updates have been responsive too.",
]

function hash(input: string): number {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

function pick<T>(arr: T[], seed: number, salt: number): T {
  return arr[(seed + salt * 2654435761) % arr.length]
}

function clampRating(rating: number, variance: number): number {
  const v = rating + variance
  return Math.max(3, Math.min(5, Math.round(v * 2) / 2))
}

const DATES = [
  "2026-05-14", "2026-04-28", "2026-04-02", "2026-03-19", "2026-02-27",
  "2026-02-10", "2026-01-22", "2026-01-08",
]

export function getSampleReviews(product: Product, count = 4): Review[] {
  const seed = hash(product.slug)
  const reviews: Review[] = []

  for (let i = 0; i < count; i++) {
    const author = `${pick(FIRST, seed, i)} ${pick(LAST, seed, i + 13)}`
    // Keep ratings clustered around the product rating, mostly 4.5–5.
    const variance = (i % 2 === 0 ? 0.3 : -0.4) + (i % 3 === 0 ? 0.2 : 0)
    const rating = clampRating(product.rating, variance)
    reviews.push({
      id: `${product.slug}-${i}`,
      author,
      rating,
      title: i % 2 === 0 ? "Great starter" : "Saved me a lot of time",
      body: pick(BODIES, seed, i + 5),
      date: pick(DATES, seed, i + 3),
      helpful: (seed % 23) + i * 2 + 1,
    })
  }

  return reviews
}
