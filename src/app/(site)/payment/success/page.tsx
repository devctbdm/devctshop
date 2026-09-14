import Link from "next/link"

import { Button } from "@/components/ui/button"
import { CheckCircle2Icon } from "lucide-react"

export const metadata = {
  title: "Payment successful — Devct Shop",
}

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const order = Array.isArray(params.order) ? params.order[0] : params.order

  return (
    <div className="mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
        <CheckCircle2Icon className="size-7" />
      </span>
      <h1 className="mt-5 font-heading text-2xl font-semibold">Payment confirmed</h1>
      <p className="mt-2 text-muted-foreground">
        Your digital products are now available in your account.
        {order ? <> Order <span className="font-medium text-foreground">{order}</span>.</> : null}
      </p>
      <div className="mt-6 flex gap-2">
        <Button render={<Link href="/account" />}>View account</Button>
        <Button variant="outline" render={<Link href="/products" />}>Keep browsing</Button>
      </div>
    </div>
  )
}
