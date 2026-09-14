import { AdminHeader } from "@/components/admin/admin-header"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ConfirmAction } from "@/components/admin/confirm-action"
import { getAdminUsers } from "@/lib/admin"

export default async function AdminCustomersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  const rows = await getAdminUsers(q)
  return <div className="mx-auto max-w-7xl"><AdminHeader title="Customers" description="Manage registered users and access status." search={q} /><div className="rounded-xl border bg-card"><Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead><TableHead>Joined</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader><TableBody>{rows.map((user) => <TableRow key={user.id}><TableCell className="font-medium">{user.fullName}</TableCell><TableCell>{user.email}</TableCell><TableCell>{user.role}</TableCell><TableCell className="capitalize">{user.isActive ? "Active" : "Disabled"}</TableCell><TableCell className="text-muted-foreground">{user.createdAt.toLocaleDateString()}</TableCell><TableCell className="text-right"><ConfirmAction label="Manage" title={`Manage ${user.fullName}`} description="Customer actions will be connected to account management here." /></TableCell></TableRow>)}</TableBody></Table>{!rows.length ? <p className="p-10 text-center text-sm text-muted-foreground">No customers found.</p> : null}</div></div>
}
