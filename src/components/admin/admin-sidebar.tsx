"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3Icon,
  BoxesIcon,
  CreditCardIcon,
  DownloadIcon,
  FolderTreeIcon,
  GaugeIcon,
  LayoutDashboardIcon,
  MessageSquareIcon,
  Settings2Icon,
  ShoppingCartIcon,
  TicketPercentIcon,
  UsersIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { AdminBreadcrumbs } from "@/components/admin/admin-breadcrumbs";

const sections = [
  {
    label: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboardIcon }],
  },
  {
    label: "Commerce",
    items: [
      { href: "/admin/products", label: "Products", icon: BoxesIcon },
      { href: "/admin/categories", label: "Categories", icon: FolderTreeIcon },
      { href: "/admin/orders", label: "Orders", icon: ShoppingCartIcon },
      { href: "/admin/customers", label: "Customers", icon: UsersIcon },
      { href: "/admin/payments", label: "Payments", icon: CreditCardIcon },
      { href: "/admin/downloads", label: "Downloads", icon: DownloadIcon },
    ],
  },
  {
    label: "Engagement",
    items: [
      { href: "/admin/reviews", label: "Reviews", icon: MessageSquareIcon },
      { href: "/admin/coupons", label: "Coupons", icon: TicketPercentIcon },
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3Icon },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/settings", label: "Settings", icon: Settings2Icon },
    ],
  },
];

export function AdminSidebar({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { fullName: string; email: string };
}) {
  const pathname = usePathname();
  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                nativeButton={false}
                render={<Link href="/admin" />}
              >
                <span className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GaugeIcon className="size-4" />
                </span>
                <span className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Devct Shop</span>
                  <span className="truncate text-xs text-sidebar-foreground/60">
                    Admin console
                  </span>
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          {sections.map((section) => (
            <SidebarGroup key={section.label}>
              <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
              <SidebarMenu>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active =
                    pathname === item.href ||
                    (item.href !== "/admin" &&
                      pathname.startsWith(`${item.href}/`));
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        tooltip={item.label}
                        isActive={active}
                        nativeButton={false}
                        render={<Link href={item.href} />}
                      >
                        <Icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarFooter>
          <SidebarSeparator />
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                nativeButton={false}
                render={<Link href="/account" />}
              >
                <span className="flex size-8 items-center justify-center rounded-full bg-sidebar-accent font-semibold text-sidebar-accent-foreground">
                  {user.fullName.slice(0, 1).toUpperCase()}
                </span>
                <span className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.fullName}</span>
                  <span className="truncate text-xs text-sidebar-foreground/60">
                    {user.email}
                  </span>
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-3 border-b bg-background px-4">
          <SidebarTrigger />
          <div className="h-4 w-px bg-border" />
          <AdminBreadcrumbs />
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
