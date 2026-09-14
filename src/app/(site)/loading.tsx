export default function SiteLoading() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8" aria-busy="true">
      <div className="h-8 w-56 animate-pulse rounded-lg bg-muted" />
      <div className="h-4 w-full max-w-xl animate-pulse rounded bg-muted" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-72 animate-pulse rounded-xl bg-muted" />)}
      </div>
    </div>
  )
}
