import { AdminSearch } from "@/components/admin/admin-search"

export function AdminHeader({ title, description, search }: { title: string; description?: string; search?: string }) {
  return <div className="mb-6 flex flex-col gap-4 border-b pb-5 lg:flex-row lg:items-end lg:justify-between"><div><h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>{description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}</div>{search !== undefined ? <AdminSearch value={search} /> : null}</div>
}
