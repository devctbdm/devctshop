import { AdminHeader } from "@/components/admin/admin-header"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getAdminPayments } from "@/lib/admin"
import { formatPrice } from "@/lib/products"

export default async function AdminPaymentsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  const rows = await getAdminPayments(q)
  return <div className="mx-auto max-w-7xl"><AdminHeader title="Payments" description="Monitor gateway transactions and validation status." search={q} /><div className="rounded-xl border bg-card"><Table><TableHeader><TableRow><TableHead>Transaction</TableHead><TableHead>Order</TableHead><TableHead>Customer</TableHead><TableHead>Status</TableHead><TableHead>Amount</TableHead><TableHead>Date</TableHead></TableRow></TableHeader><TableBody>{rows.map(({ payment, orderNumber, email }) => <TableRow key={payment.id}><TableCell className="max-w-40 truncate font-mono text-xs">{payment.transactionId ?? "Pending"}</TableCell><TableCell>{orderNumber}</TableCell><TableCell>{email ?? "—"}</TableCell><TableCell className="capitalize">{payment.status}</TableCell><TableCell>{formatPrice(payment.amountCents / 100)}</TableCell><TableCell className="text-muted-foreground">{payment.createdAt.toLocaleDateString()}</TableCell></TableRow>)}</TableBody></Table>{!rows.length ? <p className="p-10 text-center text-sm text-muted-foreground">No payments found.</p> : null}</div></div>
}
