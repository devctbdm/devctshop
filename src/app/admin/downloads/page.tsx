import { AdminHeader } from "@/components/admin/admin-header"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getAdminDownloads } from "@/lib/admin"

export default async function AdminDownloadsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  const rows = await getAdminDownloads(q)
  return <div className="mx-auto max-w-7xl"><AdminHeader title="Downloads" description="Audit product access and download activity." search={q} /><div className="rounded-xl border bg-card"><Table><TableHeader><TableRow><TableHead>Product</TableHead><TableHead>Version</TableHead><TableHead>Customer</TableHead><TableHead>Order</TableHead><TableHead>Count</TableHead><TableHead>Date</TableHead></TableRow></TableHeader><TableBody>{rows.map(({ download, email, orderNumber }) => <TableRow key={download.id}><TableCell className="font-medium">{download.productSlug}</TableCell><TableCell>{download.productVersion}</TableCell><TableCell>{email ?? "—"}</TableCell><TableCell>{orderNumber ?? "—"}</TableCell><TableCell>{download.downloadCount}</TableCell><TableCell className="text-muted-foreground">{download.createdAt.toLocaleDateString()}</TableCell></TableRow>)}</TableBody></Table>{!rows.length ? <p className="p-10 text-center text-sm text-muted-foreground">No downloads found.</p> : null}</div></div>
}
