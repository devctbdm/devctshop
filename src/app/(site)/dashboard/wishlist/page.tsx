import { CustomerEmpty } from "@/components/customer-empty"
import { CustomerShell } from "@/components/customer-shell"
import { WishlistGrid } from "@/components/wishlist-grid"
import { getCustomerWishlist } from "@/lib/customer"
import { requireUser } from "@/lib/auth/session"

export default async function WishlistPage() {
  const user = await requireUser()
  const wishlist = await getCustomerWishlist(user.id)
  return <CustomerShell active="/dashboard/wishlist" title="Wishlist" description="Keep track of products you want to build with later.">{wishlist.length ? <WishlistGrid items={wishlist.map((item) => ({ slug: item.product!.slug, name: item.product!.name, price: item.product!.price, salePrice: item.product!.salePrice }))} /> : <CustomerEmpty title="Your wishlist is empty" description="Save products while browsing to keep them close at hand." action={{ label: "Explore products", href: "/products" }} />}</CustomerShell>
}
