import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminOrder } from "@/lib/admin";
import { formatPrice } from "@/lib/products";

export default async function AdminOrderDetailsPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const result = await getAdminOrder(orderNumber);
  if (!result) notFound();
  const { order, payment, items, customer } = result;
  return (
    <div className="mx-auto max-w-6xl">
      <Button
        variant="ghost"
        size="sm"
        className="mb-3"
        nativeButton={false}
        render={<Link href="/admin/orders" />}
      >
        Back to orders
      </Button>
      <AdminHeader
        title={`Order ${order.orderNumber}`}
        description="Payment status and purchased products."
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <Card>
          <CardHeader>
            <CardTitle>Purchased products</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 py-3 first:pt-0"
              >
                <div>
                  <p className="text-sm font-medium">{item.productName}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.productSlug ?? "No slug"} · Quantity {item.quantity}
                  </p>
                </div>
                <span className="font-medium">
                  {formatPrice(item.totalCents / 100)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Info label="Status" value={order.status} />
              <Info
                label="Payment"
                value={payment?.status ?? "Not initialized"}
              />
              <Info label="Total" value={formatPrice(order.totalCents / 100)} />
              <Info label="Created" value={order.createdAt.toLocaleString()} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-medium">
                {customer?.fullName ?? order.billingName ?? "Guest"}
              </p>
              <p className="text-muted-foreground">
                {customer?.email ?? order.billingEmail}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="capitalize text-right font-medium">{value}</span>
    </div>
  );
}
