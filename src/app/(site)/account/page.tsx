import Link from "next/link"
import { ArrowRightIcon, DownloadIcon, HeartIcon, ListOrderedIcon } from "lucide-react"

import { CustomerEmpty } from "@/components/customer-empty"
import { AdminStatCard } from "@/components/admin/admin-stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getCustomerDownloads, getCustomerOrders } from "@/lib/customer"
import { formatPrice } from "@/lib/products"
import { requireUser } from "@/lib/auth/session"

export default async function AccountOverviewPage() {
  const user = await requireUser()
  const [orders, downloads] = await Promise.all([getCustomerOrders(user.id), getCustomerDownloads(user.id)])
  const spent = orders.filter((order) => order.status === "paid").reduce((sum, order) => sum + order.totalCents, 0)
  return <div className="space-y-6"><div className="grid gap-4 sm:grid-cols-3"><AdminStatCard label="Orders" value={String(orders.length)} icon={<ListOrderedIcon className="size-4" />} /><AdminStatCard label="Downloads" value={String(downloads.length)} icon={<DownloadIcon className="size-4" />} /><AdminStatCard label="Total spent" value={formatPrice(spent / 100)} icon={<HeartIcon className="size-4" />} /></div><Card><CardHeader className="flex-row items-center justify-between"><CardTitle>Recent orders</CardTitle><Button nativeButton={false} variant="ghost" size="sm" render={<Link href="/account/orders" />}>View all<ArrowRightIcon className="size-4" /></Button></CardHeader><CardContent>{orders.length ? <div className="divide-y">{orders.slice(0, 4).map((order) => <Link key={order.id} href={`/account/orders/${order.orderNumber}`} className="flex items-center justify-between gap-4 py-3 transition-colors hover:bg-muted/30"><div><p className="text-sm font-medium">{order.orderNumber}</p><p className="text-xs text-muted-foreground">{order.createdAt.toLocaleDateString()}</p></div><div className="text-right"><p className="text-sm font-semibold">{formatPrice(order.totalCents / 100)}</p><p className="text-xs capitalize text-muted-foreground">{order.status}</p></div></Link>)}</div> : <CustomerEmpty title="No orders yet" description="Your purchased digital products will appear here." action={{ label: "Browse products", href: "/products" }} />}</CardContent></Card></div>
}
