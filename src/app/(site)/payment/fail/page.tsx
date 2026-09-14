import Link from "next/link"

import { Button } from "@/components/ui/button"
import { CircleXIcon } from "lucide-react"

export const metadata = {
  title: "Payment failed — Devct Shop",
}

export default function PaymentFailPage() {
  return (
    <div className="mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <CircleXIcon className="size-7" />
      </span>
      <h1 className="mt-5 font-heading text-2xl font-semibold">Payment was not completed</h1>
      <p className="mt-2 text-muted-foreground">Your order was not marked as paid. You can return to checkout and try again.</p>
      <div className="mt-6 flex gap-2">
        <Button render={<Link href="/cart" />}>Return to cart</Button>
        <Button variant="outline" render={<Link href="/products" />}>Browse products</Button>
      </div>
    </div>
  )
}
