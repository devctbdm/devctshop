"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

const labels: Record<string, string> = {
  products: "Products",
  categories: "Categories",
  orders: "Orders",
  customers: "Customers",
  users: "Users",
  payments: "Payments",
  downloads: "Downloads",
  reviews: "Reviews",
  coupons: "Coupons",
  analytics: "Analytics",
  settings: "Settings",
  general: "General",
  appearance: "Appearance",
  payment: "Payment",
  storage: "Storage",
  seo: "SEO",
  notifications: "Notifications",
  new: "new",
}

function currentLabel(segments: string[]) {
  const last = segments.at(-1)
  const parent = segments.at(-2)
  if (last === "new") return parent === "categories" ? "Add Category" : parent === "coupons" ? "Create Coupon" : "Add Product"
  if (last && ["id", "orderNumber"].includes(last)) return "Details"
  if (parent === "products" && last && !labels[last]) return "Edit Product"
  if (parent === "categories" && last && !labels[last]) return "Edit Category"
  if (parent === "coupons" && last && !labels[last]) return "Edit Coupon"
  if (parent === "orders" && last && !labels[last]) return "Order Details"
  if (parent === "users" && last && !labels[last]) return "User Details"
  return last ? labels[last] ?? "Details" : "Admin Console"
}

export function AdminBreadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.replace(/^\/admin\/?/, "").split("/").filter(Boolean)
  const isRoot = segments.length === 0
  const current = currentLabel(segments)
  const parentSegment = segments[0]
  const parentLabel = parentSegment ? labels[parentSegment] ?? parentSegment : null
  const parentHref = parentSegment ? `/admin/${parentSegment}` : "/admin"

  return <Breadcrumb><BreadcrumbList className="flex-nowrap overflow-x-auto whitespace-nowrap"><BreadcrumbItem>{isRoot ? <BreadcrumbPage>Admin Console</BreadcrumbPage> : <BreadcrumbLink render={<Link href="/admin" />}>Admin Console</BreadcrumbLink>}</BreadcrumbItem>{!isRoot ? <><BreadcrumbSeparator /><BreadcrumbItem>{segments.length === 1 ? <BreadcrumbPage>{current}</BreadcrumbPage> : <BreadcrumbLink render={<Link href={parentHref} />}>{parentLabel}</BreadcrumbLink>}</BreadcrumbItem>{segments.length > 1 ? <><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>{current}</BreadcrumbPage></BreadcrumbItem></> : null}</> : null}</BreadcrumbList></Breadcrumb>
}
