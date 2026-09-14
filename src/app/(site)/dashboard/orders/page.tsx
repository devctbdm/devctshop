import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { CustomerEmpty } from "@/components/customer-empty"
import { CustomerShell } from "@/components/customer-shell"
import { Card, CardContent } from "@/components/ui/card"
import { getCustomerOrders } from "@/lib/customer"
import { requireUser } from "@/lib/auth/session"
import { formatPrice } from "@/lib/products"

export default async function OrdersPage() {
  const user = await requireUser()
  const orders = await getCustomerOrders(user.id)
  return <CustomerShell active="/dashboard/orders" title="My orders" description="Track your orders and access purchase details.">{orders.length ? <div className="space-y-3">{orders.map((order) => <Card key={order.id}><CardContent className="flex flex-wrap items-center justify-between gap-4"><div><p className="font-medium">{order.orderNumber}</p><p className="mt-1 text-sm text-muted-foreground">{order.createdAt.toLocaleDateString()} · <span className="capitalize">{order.status}</span></p></div><div className="flex items-center gap-4"><span className="font-heading font-semibold">{formatPrice(order.totalCents / 100)}</span><Link href={`/dashboard/orders/${order.orderNumber}`} className="inline-flex items-center gap-1 text-sm font-medium hover:underline">Details<ArrowRightIcon className="size-4" /></Link></div></CardContent></Card>)}</div> : <CustomerEmpty title="No orders yet" description="Purchase a template, UI kit, or source project to see it here." action={{ label: "Browse products", href: "/products" }} />}</CustomerShell>
}
