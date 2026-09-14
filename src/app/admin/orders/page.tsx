import { AdminHeader } from "@/components/admin/admin-header"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ConfirmAction } from "@/components/admin/confirm-action"
import { getAdminOrders } from "@/lib/admin"
import { formatPrice } from "@/lib/products"

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  const rows = await getAdminOrders(q)
  return <div className="mx-auto max-w-7xl"><AdminHeader title="Orders" description="Review customer orders and payment states." search={q} /><div className="rounded-xl border bg-card"><Table><TableHeader><TableRow><TableHead>Order</TableHead><TableHead>Status</TableHead><TableHead>Payment</TableHead><TableHead>Total</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader><TableBody>{rows.map(({ order, paymentStatus }) => <TableRow key={order.id}><TableCell className="font-medium">{order.orderNumber}</TableCell><TableCell className="capitalize">{order.status}</TableCell><TableCell className="capitalize text-muted-foreground">{paymentStatus ?? "—"}</TableCell><TableCell>{formatPrice(order.totalCents / 100)}</TableCell><TableCell className="text-muted-foreground">{order.createdAt.toLocaleDateString()}</TableCell><TableCell className="text-right"><ConfirmAction label="Review" title={`Review ${order.orderNumber}`} description="Order actions will be connected to the order workflow here." /></TableCell></TableRow>)}</TableBody></Table>{!rows.length ? <p className="p-10 text-center text-sm text-muted-foreground">No orders found.</p> : null}</div></div>
}
