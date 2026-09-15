import Link from "next/link"
import {
  BarChart3Icon,
  DownloadIcon,
  ExternalLinkIcon,
  PackageIcon,
  PlusIcon,
  ShoppingCartIcon,
  UsersIcon,
} from "lucide-react"

import { AdminHeader } from "@/components/admin/admin-header"
import { AdminStatCard } from "@/components/admin/admin-stat-card"
import { DashboardRevenueChart } from "@/components/admin/dashboard-revenue-chart"
import { CustomerEmpty } from "@/components/customer-empty"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAdminAnalytics, type AnalyticsRange } from "@/lib/admin-analytics"
import { formatPrice } from "@/lib/products"

const ranges: { value: AnalyticsRange; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "year", label: "This year" },
]

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>
}) {
  const params = await searchParams
  const range = ranges.some((item) => item.value === params.range)
    ? (params.range as AnalyticsRange)
    : "30d"
  const data = await getAdminAnalytics(range)

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-col gap-4 border-b pb-5 lg:flex-row lg:items-end lg:justify-between">
        <AdminHeader
          title="Dashboard"
          description="Welcome back. Here&apos;s what&apos;s happening with your store today."
        />
        <div className="flex flex-wrap gap-2">
          {ranges.map((item) => (
            <Link
              key={item.value}
              href={`/admin?range=${item.value}`}
              className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${range === item.value ? "border-primary bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Revenue" value={formatPrice(data.summary.revenue / 100)} hint={changeText(data.summary.revenue, data.previous.revenue)} icon={<BarChart3Icon className="size-4" />} />
        <AdminStatCard label="Orders" value={String(data.summary.orders)} hint={changeText(data.summary.orders, data.previous.orders)} icon={<ShoppingCartIcon className="size-4" />} />
        <AdminStatCard label="Products sold" value={String(data.summary.productsSold)} hint="Paid order items" icon={<PackageIcon className="size-4" />} />
        <AdminStatCard label="Customers" value={String(data.summary.customers)} hint={`${data.newCustomers} new in period`} icon={<UsersIcon className="size-4" />} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
        <Card>
          <CardHeader className="flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Revenue overview</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">Paid revenue during the selected period.</p>
            </div>
            <Button nativeButton={false} variant="ghost" size="sm" render={<Link href={`/admin/analytics?range=${range}`} />}>
              Detailed analytics <ExternalLinkIcon className="size-3.5" />
            </Button>
          </CardHeader>
          <CardContent>
            {data.revenueSeries.length ? <DashboardRevenueChart data={data.revenueSeries} /> : <CustomerEmpty title="No sales yet" description="Your revenue performance will appear here after the first completed purchase." action={{ label: "View products", href: "/admin/products" }} />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Quick actions</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-2">
            <QuickAction href="/admin/products/new" label="Add product" icon={<PlusIcon className="size-4" />} />
            <QuickAction href="/admin/categories/new" label="Add category" icon={<PlusIcon className="size-4" />} />
            <QuickAction href="/admin/orders" label="View orders" icon={<ShoppingCartIcon className="size-4" />} />
            <QuickAction href="/admin/products" label="View products" icon={<PackageIcon className="size-4" />} />
            <QuickAction href="/admin/analytics" label="View analytics" icon={<BarChart3Icon className="size-4" />} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader className="flex-row items-center justify-between"><CardTitle>Top products</CardTitle><Button nativeButton={false} variant="ghost" size="sm" render={<Link href="/admin/products" />}>View all</Button></CardHeader>
          <CardContent>{data.topProducts.length ? <div className="divide-y">{data.topProducts.map((product, index) => <div key={product.name} className="flex items-center gap-3 py-3"><span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold">{index + 1}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{product.name}</p><p className="text-xs text-muted-foreground">{product.sales} sales · {product.downloads} downloads</p></div><span className="font-heading text-sm font-semibold">{formatPrice(product.revenue / 100)}</span></div>)}</div> : <Empty text="No product sales in this period." />}</CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between"><CardTitle>Recent orders</CardTitle><Button nativeButton={false} variant="ghost" size="sm" render={<Link href="/admin/orders" />}>View all</Button></CardHeader>
          <CardContent>{data.recentOrders.length ? <div className="divide-y">{data.recentOrders.slice(0, 5).map(({ order, email, product }) => <Link key={order.id} href={`/admin/orders/${order.orderNumber}`} className="flex items-center justify-between gap-3 py-3 hover:bg-muted/30"><div className="min-w-0"><p className="text-sm font-medium">{order.orderNumber}</p><p className="truncate text-xs text-muted-foreground">{email ?? order.billingEmail} · {product ?? "Digital product"}</p></div><div className="text-right"><p className="text-sm font-semibold">{formatPrice(order.totalCents / 100)}</p><p className="text-xs capitalize text-muted-foreground">{order.status}</p></div></Link>)}</div> : <Empty text="No recent orders." />}</CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><DownloadIcon className="size-4" />Digital downloads</CardTitle></CardHeader><CardContent><p className="font-heading text-3xl font-semibold">{data.downloads}</p><p className="mt-1 text-sm text-muted-foreground">Downloads in the selected period</p><Button nativeButton={false} variant="ghost" size="sm" className="mt-3 -ml-2" render={<Link href="/admin/downloads" />}>View downloads</Button></CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><UsersIcon className="size-4" />Customer activity</CardTitle></CardHeader><CardContent><div className="flex items-end justify-between gap-4"><div><p className="text-sm text-muted-foreground">Customers in period</p><p className="font-heading text-3xl font-semibold">{data.summary.customers}</p></div><div className="text-right"><p className="text-sm text-muted-foreground">New customers</p><p className="font-heading text-xl font-semibold">{data.newCustomers}</p></div></div><Button nativeButton={false} variant="ghost" size="sm" className="mt-3 -ml-2" render={<Link href="/admin/customers" />}>View customers</Button></CardContent></Card>
      </div>

      <Card className="mt-6"><CardHeader><CardTitle>Store status</CardTitle></CardHeader><CardContent className="grid gap-3 text-sm sm:grid-cols-3"><Status label="Admin access" value="Protected" /><Status label="Data source" value="Database-backed" /><Status label="Store model" value="Digital products" /></CardContent></Card>
    </div>
  )
}

function changeText(current: number, previous: number) { if (!previous) return "No previous-period comparison"; const change = ((current - previous) / previous) * 100; return `${change >= 0 ? "+" : ""}${change.toFixed(1)}% vs previous period` }
function QuickAction({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) { return <Button nativeButton={false} variant="outline" className="w-full justify-start" render={<Link href={href} />}>{icon}{label}</Button> }
function Status({ label, value }: { label: string; value: string }) { return <div className="flex items-center justify-between rounded-lg border bg-muted/20 px-3 py-2.5"><span className="text-muted-foreground">{label}</span><span className="inline-flex items-center gap-1.5 font-medium"><span className="size-1.5 rounded-full bg-emerald-500" />{value}</span></div> }
function Empty({ text }: { text: string }) { return <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">{text}</div> }
