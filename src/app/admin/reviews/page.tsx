import { AdminHeader } from "@/components/admin/admin-header"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ConfirmAction } from "@/components/admin/confirm-action"
import { getAdminReviews } from "@/lib/admin"

export default async function AdminReviewsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  const rows = await getAdminReviews(q)
  return <div className="mx-auto max-w-7xl"><AdminHeader title="Reviews" description="Review customer feedback before publishing moderation actions." search={q} /><div className="rounded-xl border bg-card"><Table><TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Rating</TableHead><TableHead>Customer</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader><TableBody>{rows.map(({ review, email }) => <TableRow key={review.id}><TableCell className="font-medium">{review.title ?? "Untitled review"}</TableCell><TableCell>{review.rating}/5</TableCell><TableCell>{email}</TableCell><TableCell className="text-muted-foreground">{review.createdAt.toLocaleDateString()}</TableCell><TableCell className="text-right"><ConfirmAction label="Moderate" title="Moderate review" description="Review moderation actions will be connected here." /></TableCell></TableRow>)}</TableBody></Table>{!rows.length ? <p className="p-10 text-center text-sm text-muted-foreground">No reviews found.</p> : null}</div></div>
}
