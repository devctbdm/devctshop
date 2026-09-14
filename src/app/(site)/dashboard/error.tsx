"use client"

export default function DashboardError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="mx-auto flex min-h-[45vh] max-w-xl flex-col items-center justify-center px-4 text-center"><h1 className="font-heading text-xl font-semibold">We couldn&apos;t load your account</h1><p className="mt-2 text-sm text-muted-foreground">Please try again. Your purchases remain safe.</p><button type="button" onClick={reset} className="mt-5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">Try again</button></div>
}
