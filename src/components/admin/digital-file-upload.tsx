"use client"

import * as React from "react"
import { FileArchiveIcon, LoaderIcon, Trash2Icon, UploadCloudIcon } from "lucide-react"


export type DigitalFileAsset = {
  name: string
  path: string
  sizeBytes: number
  mimeType: string
}

const MAX_SIZE = 500 * 1024 * 1024
const allowedExtensions = new Set(["zip", "pdf", "txt", "md", "json", "csv", "tar", "gz", "7z"])

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function DigitalFileUpload({ initial = [], productId, version }: { initial?: DigitalFileAsset[]; productId?: string; version: string }) {
  const [files, setFiles] = React.useState(initial)
  const [uploading, setUploading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function upload(selected: FileList | null) {
    if (!selected?.length) return
    setUploading(true)
    setError(null)
    try {
      const next: DigitalFileAsset[] = []
      for (const file of Array.from(selected)) {
        const extension = file.name.toLowerCase().split(".").pop() ?? ""
        if (!allowedExtensions.has(extension)) throw new Error(`${file.name}: unsupported file type.`)
        if (file.size <= 0 || file.size > MAX_SIZE) throw new Error(`${file.name}: maximum size is 500 MB.`)

        const response = await fetch("/api/admin/files/presign", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ productId, version, fileName: file.name, contentType: file.type || "application/zip", size: file.size }),
        })
        const result = await response.json()
        if (!response.ok) throw new Error(result.error ?? `Could not prepare ${file.name}.`)

        const uploadResponse = await fetch(result.uploadUrl, {
          method: "PUT",
          headers: { "content-type": file.type || "application/octet-stream" },
          body: file,
        })
        if (!uploadResponse.ok) throw new Error(`${file.name}: upload failed.`)
        next.push({ name: file.name, path: result.key, sizeBytes: file.size, mimeType: file.type || "application/octet-stream" })
      }
      setFiles((current) => [...current, ...next])
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "File upload failed.")
    } finally {
      setUploading(false)
    }
  }

  return <div className="space-y-3 sm:col-span-2"><div className="rounded-xl border border-dashed bg-muted/20 p-5"><label className="flex cursor-pointer flex-col items-center justify-center gap-2 text-center"><span className="flex size-10 items-center justify-center rounded-lg bg-background shadow-sm"><UploadCloudIcon className="size-5 text-muted-foreground" /></span><span className="text-sm font-medium">Upload source-code ZIP</span><span className="text-xs text-muted-foreground">Private Cloudflare R2 storage · ZIP only · up to 500 MB</span><input type="file" multiple accept=".zip" className="sr-only" onChange={(event) => { void upload(event.target.files); event.currentTarget.value = "" }} disabled={uploading} /></label>{uploading ? <p className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground"><LoaderIcon className="size-3.5 animate-spin" />Uploading to private R2 storage…</p> : null}{error ? <p role="alert" className="mt-3 text-center text-xs text-destructive">{error}</p> : null}</div><div className="space-y-2">{files.map((file, index) => <div key={`${file.path}-${index}`} className="flex items-center gap-3 rounded-lg border bg-card p-3"><span className="flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground"><FileArchiveIcon className="size-4" /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{file.name}</p><p className="text-xs text-muted-foreground">{formatBytes(file.sizeBytes)} · private R2 file</p></div><button type="button" onClick={() => setFiles((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive" aria-label={`Remove ${file.name}`}><Trash2Icon className="size-4" /></button></div>)}</div><input type="hidden" name="digitalFiles" value={JSON.stringify(files)} /></div>
}
