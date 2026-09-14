import Link from "next/link"
import { ArrowRightIcon, DownloadIcon, HeartIcon, ListOrderedIcon } from "lucide-react"

import { CustomerShell } from "@/components/customer-shell"
import { CustomerEmpty } from "@/components/customer-empty"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getCustomerDownloads, getCustomerOrders } from "@/lib/customer"
import { formatPrice } from "@/lib/products"
import { requireUser } from "@/lib/auth/session"

export default async function DashboardPage() {
  const user = await requireUser()
  const [orders, downloads] = await Promise.all([getCustomerOrders(user.id), getCustomerDownloads(user.id)])
  const paidOrders = orders.filter((order) => order.status === "paid")
  const spent = paidOrders.reduce((sum, order) => sum + order.totalCents, 0)

  return (
    <CustomerShell active="/dashboard" title="Overview" description="Your purchases, downloads, and account activity in one place.">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Orders" value={String(orders.length)} icon={<ListOrderedIcon className="size-4" />} />
        <StatCard label="Downloads" value={String(downloads.length)} icon={<DownloadIcon className="size-4" />} />
        <StatCard label="Total spent" value={formatPrice(spent / 100)} icon={<HeartIcon className="size-4" />} />
      </div>
      <Card className="mt-6">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Recent orders</CardTitle>
          <Button variant="ghost" size="sm" render={<Link href="/dashboard/orders" />}>View all<ArrowRightIcon className="size-4" /></Button>
        </CardHeader>
        <CardContent>
          {orders.length ? <div className="divide-y">{orders.slice(0, 4).map((order) => <OrderRow key={order.id} order={order} />)}</div> : <CustomerEmpty title="No orders yet" description="Your purchased digital products will appear here." action={{ label: "Browse products", href: "/products" }} />}
        </CardContent>
      </Card>
    </CustomerShell>
  )
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return <Card><CardContent className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-1 font-heading text-2xl font-semibold">{value}</p></div><span className="flex size-9 items-center justify-center rounded-lg bg-muted">{icon}</span></CardContent></Card>
}

function OrderRow({ order }: { order: Awaited<ReturnType<typeof getCustomerOrders>>[number] }) {
  return <Link href={`/dashboard/orders/${order.orderNumber}`} className="flex items-center justify-between gap-4 py-3 transition-colors hover:bg-muted/30"><div><p className="text-sm font-medium">{order.orderNumber}</p><p className="text-xs text-muted-foreground">{order.createdAt.toLocaleDateString()}</p></div><div className="text-right"><p className="text-sm font-semibold">{formatPrice(order.totalCents / 100)}</p><p className="text-xs capitalize text-muted-foreground">{order.status}</p></div></Link>
}
