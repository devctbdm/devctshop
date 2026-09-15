import { StarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type RatingStarsProps = {
  rating: number;
  className?: string;
  size?: "sm" | "md";
};

export function RatingStars({
  rating,
  className,
  size = "md",
}: RatingStarsProps) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  const starClass = size === "sm" ? "size-3.5" : "size-4";

  return (
    <span
      className={cn("relative inline-flex", className)}
      role="img"
      aria-label={`Rated ${rating.toFixed(1)} out of 5`}
    >
      <span className="flex gap-0.5 text-muted-foreground/25" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon key={i} className={cn(starClass, "fill-current")} />
        ))}
      </span>
      <span
        className="absolute inset-0 flex gap-0.5 overflow-hidden text-amber-400"
        style={{ width: `${pct}%` }}
        aria-hidden
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon
            key={i}
            className={cn(starClass, "shrink-0 fill-current")}
          />
        ))}
      </span>
    </span>
  );
}
