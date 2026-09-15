import Link from "next/link"
import { notFound } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminCouponForm } from "@/components/admin/admin-coupon-form"
import { getAdminCoupon } from "@/lib/admin"
import { Button } from "@/components/ui/button"

export default async function EditCouponPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const coupon = await getAdminCoupon(id); if (!coupon) notFound(); return <div className="mx-auto max-w-4xl"><Button nativeButton={false} variant="ghost" size="sm" className="mb-3" render={<Link href="/admin/coupons" />}>Back to coupons</Button><AdminHeader title={`Edit ${coupon.code}`} description="Update discount rules and coupon availability." /><AdminCouponForm coupon={coupon} /></div> }
