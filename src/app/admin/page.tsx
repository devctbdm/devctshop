import Link from "next/link"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const modules = [
  {
    title: "Products",
    description: "List, create, and manage digital products.",
    href: "#",
    comingSoon: true,
  },
  {
    title: "Orders",
    description: "Review and manage customer orders.",
    href: "#",
    comingSoon: true,
  },
  {
    title: "Customers",
    description: "Browse and manage registered users.",
    href: "#",
    comingSoon: true,
  },
  {
    title: "Coupons",
    description: "Create and track discount coupons.",
    href: "#",
    comingSoon: true,
  },
]

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage Devct Shop. This area is protected — only administrators can
          access it.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {modules.map((m) => (
          <Card key={m.title} className="gap-3">
            <CardHeader>
              <CardTitle>{m.title}</CardTitle>
              <CardDescription>{m.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {m.comingSoon ? (
                <span className="inline-flex items-center rounded-full border bg-muted/50 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  Coming soon
                </span>
              ) : (
                <Link
                  href={m.href}
                  className="text-sm font-medium text-foreground transition-colors hover:underline"
                >
                  Open
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
