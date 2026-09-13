import { Resend } from "resend"

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

export function emailEnabled(): boolean {
  return Boolean(
    process.env.EMAIL_ENABLED === "true" &&
      process.env.RESEND_API_KEY &&
      process.env.RESEND_FROM
  )
}

export function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_URL ??
    "http://localhost:3000"
  )
}

export interface SendEmailResult {
  ok: boolean
  error?: string
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}): Promise<SendEmailResult> {
  if (!resend) {
    console.warn("[email] Resend not configured; skipping email send.")
    return { ok: false, error: "email_not_configured" }
  }

  const from = process.env.RESEND_FROM ?? "Devct Shop <no-reply@devct.shop>"

  try {
    const { error } = await resend.emails.send({ from, to, subject, html })
    if (error) {
      console.error("[email] send failed:", error)
      return { ok: false, error: error.message }
    }
    return { ok: true }
  } catch (error) {
    console.error("[email] send error:", error)
    return {
      ok: false,
      error: error instanceof Error ? error.message : "unknown_error",
    }
  }
}
