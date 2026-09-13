import { cn } from "@/lib/utils"

export function AuthDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn("flex items-center gap-3", className)}
      role="separator"
      aria-label="or"
    >
      <span className="h-px flex-1 bg-border" />
      <span className="text-xs font-medium text-muted-foreground">or</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  )
}
