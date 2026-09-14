import { CartPageContent } from "@/components/cart-page-content"

export const metadata = {
  title: "Cart — Devct Shop",
  description: "Review your digital products before checkout.",
}

export default function CartPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Your cart</h1>
        <p className="mt-2 text-muted-foreground">Review your digital products before checkout.</p>
      </div>
      <CartPageContent />
    </div>
  )
}
