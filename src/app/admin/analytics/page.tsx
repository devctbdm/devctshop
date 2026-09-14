import { BarChart3Icon } from "lucide-react"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAdminMetrics } from "@/lib/admin"
import { formatPrice } from "@/lib/products"

export default async function AdminAnalyticsPage() {
  const metrics = await getAdminMetrics()
  return <div className="mx-auto max-w-7xl"><AdminHeader title="Analytics" description="A small set of signals for store health and growth." /><div className="grid gap-6 lg:grid-cols-2"><Card><CardHeader><CardTitle>Store performance</CardTitle></CardHeader><CardContent className="space-y-4"><Metric label="Paid revenue" value={formatPrice(metrics.revenueCents / 100)} /><Metric label="Total orders" value={String(metrics.orders)} /><Metric label="Registered users" value={String(metrics.users)} /><Metric label="Product downloads" value={String(metrics.downloads)} /></CardContent></Card><Card><CardHeader><CardTitle className="flex items-center gap-2"><BarChart3Icon className="size-4" />Trends</CardTitle></CardHeader><CardContent><div className="flex h-48 items-end gap-2 rounded-lg bg-muted/30 p-5">{[38, 55, 42, 72, 61, 84, 68, 92, 76, 88, 64, 96].map((height, index) => <div key={index} className="flex-1 rounded-t-sm bg-primary/70" style={{ height: `${height}%` }} />)}</div><p className="mt-3 text-xs text-muted-foreground">Illustrative activity view. Historical time-series aggregation can be connected as order volume grows.</p></CardContent></Card></div></div>
}

function Metric({ label, value }: { label: string; value: string }) { return <div className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"><span className="text-sm text-muted-foreground">{label}</span><span className="font-heading font-semibold">{value}</span></div> }
