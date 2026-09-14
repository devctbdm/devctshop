import { RatingStars } from "@/components/rating-stars"
import { getSampleReviews, type Review } from "@/lib/reviews"
import type { Product } from "@/lib/products"

export function ReviewsList({ product }: { product: Product }) {
  const reviews: Review[] = getSampleReviews(product, 4)

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {reviews.map((review) => (
        <article
          key={review.id}
          className="flex flex-col gap-3 rounded-xl border bg-card p-5"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                {review.author
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </span>
              <span className="text-sm font-medium">{review.author}</span>
            </span>
            <RatingStars rating={review.rating} size="sm" />
          </div>
          <h4 className="font-heading text-sm font-semibold">{review.title}</h4>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {review.body}
          </p>
          <p className="mt-auto text-xs text-muted-foreground/70">
            {review.date}
          </p>
        </article>
      ))}
    </div>
  )
}
