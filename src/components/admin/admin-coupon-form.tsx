"use client"

import * as React from "react"
import Link from "next/link"

import { createCouponAction, updateCouponAction } from "@/lib/admin-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type Coupon = { id: string; code: string; description: string | null; discountType: "percent" | "fixed"; discountValue: number; maxDiscountCents: number | null; minOrderCents: number; usageLimit: number | null; perUserLimit: number; status: "active" | "scheduled" | "expired" | "disabled"; validFrom: Date; validUntil: Date | null }

export function AdminCouponForm({ coupon }: { coupon?: Coupon }) {
  const action = coupon ? updateCouponAction : createCouponAction
  const [error, setError] = React.useState<string | null>(null)
  const [serverError, setServerError] = React.useState<string | null>(null)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    setServerError(null)
    const formData = new FormData(event.currentTarget)
    const minimumOrder = Number(formData.get("minOrderCents"))
    if (!Number.isInteger(minimumOrder) || minimumOrder < 1) {
      event.preventDefault()
      setError("Minimum order must be at least 1 cent.")
      return
    }
    setError(null)
  }

  return <form action={async (formData) => { const result = await action(formData); if (result?.error) setServerError("Please correct the coupon fields before submitting.") }} onSubmit={handleSubmit} className="space-y-6"><input type="hidden" name="id" value={coupon?.id ?? ""} /><div className="grid gap-5 rounded-xl border bg-card p-5 sm:grid-cols-2"><Field name="code" label="Coupon code" required defaultValue={coupon?.code} placeholder="LAUNCH20" /><div className="flex flex-col gap-1.5"><Label htmlFor="status">Status</Label><select id="status" name="status" defaultValue={coupon?.status ?? "active"} className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm"><option value="active">Active</option><option value="scheduled">Scheduled</option><option value="disabled">Disabled</option><option value="expired">Expired</option></select></div><div className="flex flex-col gap-1.5"><Label htmlFor="discountType">Discount type</Label><select id="discountType" name="discountType" defaultValue={coupon?.discountType ?? "percent"} className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm"><option value="percent">Percentage</option><option value="fixed">Fixed amount</option></select></div><Field name="discountValue" label="Discount value" required type="number" min="1" defaultValue={coupon ? coupon.discountType === "fixed" ? coupon.discountValue / 100 : coupon.discountValue : undefined} /><Field name="maxDiscountCents" label="Max discount (cents, optional)" type="number" min="1" defaultValue={coupon?.maxDiscountCents ?? undefined} /><Field name="minOrderCents" label="Minimum order (cents)" type="number" min="1" defaultValue={coupon?.minOrderCents ?? 1} /><Field name="usageLimit" label="Total usage limit" type="number" min="1" defaultValue={coupon?.usageLimit ?? undefined} /><Field name="perUserLimit" label="Per-user limit" type="number" min="1" defaultValue={coupon?.perUserLimit ?? 1} /><Field name="validFrom" label="Valid from" required type="datetime-local" defaultValue={toLocalDateTime(coupon?.validFrom)} /><Field name="validUntil" label="Valid until" type="datetime-local" defaultValue={toLocalDateTime(coupon?.validUntil ?? undefined)} /><div className="flex flex-col gap-1.5 sm:col-span-2"><Label htmlFor="description">Description</Label><Textarea id="description" name="description" defaultValue={coupon?.description ?? ""} rows={3} /></div>{error || serverError ? <p role="alert" className="text-sm text-destructive sm:col-span-2">{error ?? serverError}</p> : null}</div><div className="flex justify-end gap-2"><Button nativeButton={false} variant="outline" render={<Link href="/admin/coupons" />}>Cancel</Button><Button type="submit">{coupon ? "Save changes" : "Create coupon"}</Button></div></form>
}

function toLocalDateTime(value?: Date) { return value ? new Date(value.getTime() - value.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : "" }
function Field({ name, label, required, defaultValue, type = "text", min, placeholder }: { name: string; label: string; required?: boolean; defaultValue?: string | number; type?: string; min?: string | number; placeholder?: string }) { return <div className="flex flex-col gap-1.5"><Label htmlFor={name}>{label}</Label><Input id={name} name={name} required={required} defaultValue={defaultValue} type={type} min={min} placeholder={placeholder} /></div> }
