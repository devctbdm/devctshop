"use client"

export default function SiteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <h1 className="font-heading text-2xl font-semibold">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted-foreground">We couldn&apos;t load this page. Your account and purchases are safe.</p>
      <button type="button" onClick={reset} className="mt-5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">Try again</button>
    </div>
  )
}
