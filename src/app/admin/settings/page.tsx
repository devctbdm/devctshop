import { Settings2Icon } from "lucide-react"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminSettingsPage() {
  return <div className="mx-auto max-w-3xl"><AdminHeader title="Settings" description="Operational settings for the admin console." /><Card><CardHeader><CardTitle className="flex items-center gap-2"><Settings2Icon className="size-4" />Store configuration</CardTitle></CardHeader><CardContent className="space-y-4 text-sm"><Setting label="Payment gateway" value="SSLCommerz" /><Setting label="Currency" value="USD" /><Setting label="Delivery model" value="Digital only" /><Setting label="Admin authorization" value="Database role" /></CardContent></Card></div>
}

function Setting({ label, value }: { label: string; value: string }) { return <div className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"><span className="text-muted-foreground">{label}</span><span className="font-medium">{value}</span></div> }
