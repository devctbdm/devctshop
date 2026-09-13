import { Logo } from "@/components/logo"

interface AuthCardProps {
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export function AuthCard({
  title,
  description,
  children,
  footer,
}: AuthCardProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <Logo />
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-xl font-semibold tracking-tight">
            {title}
          </h1>
          {description ? (
            <p className="max-w-xs text-sm text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      <div className="rounded-xl border bg-card p-5 shadow-2xs sm:p-6">
        {children}
      </div>
      {footer ? (
        <div className="text-center text-sm text-muted-foreground">
          {footer}
        </div>
      ) : null}
    </div>
  )
}
