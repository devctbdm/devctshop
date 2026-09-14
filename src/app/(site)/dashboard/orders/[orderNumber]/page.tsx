import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon, CheckCircle2Icon, Clock3Icon, CircleXIcon } from "lucide-react"

import { CustomerShell } from "@/components/customer-shell"
import { ProductCover } from "@/components/product-cover"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCustomerOrder } from "@/lib/customer"
import { requireUser } from "@/lib/auth/session"
import { formatPrice } from "@/lib/products"

export default async function OrderDetailsPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const user = await requireUser()
  const { orderNumber } = await params
  const result = await getCustomerOrder(user.id, orderNumber)
  if (!result) notFound()
  const { order, payment, items } = result
  return <CustomerShell active="/dashboard/orders" title={`Order ${order.orderNumber}`} description="Order details and purchased products."><Button variant="ghost" size="sm" className="-ml-2 mb-5" render={<Link href="/dashboard/orders" />}><ArrowLeftIcon className="size-4" />Back to orders</Button><div className="grid gap-6 lg:grid-cols-[1fr_280px]"><Card><CardHeader><CardTitle>Purchased products</CardTitle></CardHeader><CardContent className="divide-y">{items.map((item) => <div key={item.id} className="flex items-center gap-3 py-3 first:pt-0"><ProductCover seed={item.productSlug ?? item.productName} className="size-14 rounded-md" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{item.productName}</p><p className="text-xs text-muted-foreground">Quantity {item.quantity}</p></div><span className="text-sm font-medium">{formatPrice(item.totalCents / 100)}</span></div>)}</CardContent></Card><Card><CardHeader><CardTitle>Payment</CardTitle></CardHeader><CardContent className="space-y-3 text-sm"><Status status={order.status} /><div className="flex justify-between text-muted-foreground"><span>Total</span><span className="font-semibold text-foreground">{formatPrice(order.totalCents / 100)}</span></div><div className="flex justify-between text-muted-foreground"><span>Gateway</span><span className="uppercase text-foreground">{payment?.gateway ?? "—"}</span></div><div className="flex justify-between text-muted-foreground"><span>Transaction</span><span className="max-w-28 truncate text-foreground">{payment?.transactionId ?? "Pending"}</span></div></CardContent></Card></div></CustomerShell>
}

function Status({ status }: { status: string }) {
  if (status === "paid") return <p className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400"><CheckCircle2Icon className="size-4" /> Paid</p>
  if (status === "failed" || status === "cancelled") return <p className="flex items-center gap-2 text-destructive"><CircleXIcon className="size-4" /> <span className="capitalize">{status}</span></p>
  return <p className="flex items-center gap-2 text-muted-foreground"><Clock3Icon className="size-4" /> Pending</p>
}
