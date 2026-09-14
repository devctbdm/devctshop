import Link from "next/link"

import { Button } from "@/components/ui/button"
import { CircleSlash2Icon } from "lucide-react"

export const metadata = {
  title: "Payment cancelled — Devct Shop",
}

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <CircleSlash2Icon className="size-7" />
      </span>
      <h1 className="mt-5 font-heading text-2xl font-semibold">Payment cancelled</h1>
      <p className="mt-2 text-muted-foreground">No payment was taken. Your cart is still available if you want to try again.</p>
      <div className="mt-6 flex gap-2">
        <Button render={<Link href="/cart" />}>Return to cart</Button>
        <Button variant="outline" render={<Link href="/products" />}>Browse products</Button>
      </div>
    </div>
  )
}
