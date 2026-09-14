import { TicketPercentIcon } from "lucide-react"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AdminCouponsPage() {
  return <div className="mx-auto max-w-7xl"><AdminHeader title="Coupons" description="Manage promotions and discount codes." /><Card><CardContent className="flex min-h-56 flex-col items-center justify-center text-center"><span className="flex size-11 items-center justify-center rounded-xl bg-muted"><TicketPercentIcon className="size-5 text-muted-foreground" /></span><h2 className="mt-4 font-heading text-lg font-semibold">Coupon management is ready for data</h2><p className="mt-1 max-w-md text-sm text-muted-foreground">The coupon schema and checkout validation are already connected. Add coupon CRUD here when promotions are ready to be managed from the console.</p><Button className="mt-4" variant="outline" disabled>Create coupon</Button></CardContent></Card></div>
}
