import { DownloadIcon } from "lucide-react"

import { CustomerEmpty } from "@/components/customer-empty"
import { CustomerShell } from "@/components/customer-shell"
import { ProductCover } from "@/components/product-cover"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getCustomerDownloads } from "@/lib/customer"
import { requireUser } from "@/lib/auth/session"

export default async function DownloadsPage() {
  const user = await requireUser()
  const downloads = await getCustomerDownloads(user.id)
  return <CustomerShell active="/dashboard/downloads" title="My downloads" description="Secure access to the digital products you have purchased.">{downloads.length ? <div className="space-y-3">{downloads.map((download) => <Card key={download.id}><CardContent className="flex flex-wrap items-center gap-4"><ProductCover seed={download.productSlug} className="size-16 rounded-lg" /><div className="min-w-0 flex-1"><p className="font-medium">{download.product?.name ?? download.productSlug}</p><p className="mt-1 text-sm text-muted-foreground">Version {download.productVersion} · {download.downloadCount} download{download.downloadCount === 1 ? "" : "s"}</p><p className="text-xs text-muted-foreground">Granted {download.createdAt.toLocaleDateString()}</p></div><Button size="sm" render={<a href={`/api/downloads/${download.id}`} />}><DownloadIcon className="size-4" />Download</Button></CardContent></Card>)}</div> : <CustomerEmpty title="No downloads yet" description="Downloads become available after a successful payment." action={{ label: "Browse products", href: "/products" }} />}</CustomerShell>
}
