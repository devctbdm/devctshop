import { siteUrl } from "./sender"

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function layout({
  heading,
  body,
  ctaHref,
  ctaLabel,
  note,
}: {
  heading: string
  body: string
  ctaHref?: string
  ctaLabel?: string
  note?: string
}): string {
  const cta =
    ctaHref && ctaLabel
      ? `<tr>
        <td align="center" style="padding:28px 0;">
          <a href="${ctaHref}" style="display:inline-block;background:#18181b;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 22px;border-radius:8px;">${escapeHtml(ctaLabel)}</a>
        </td>
      </tr>`
      : ""

  const noteHtml = note
    ? `<p style="color:#71717a;font-size:13px;line-height:1.6;">${note}</p>`
    : ""

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#fafafa;-webkit-font-smoothing:antialiased;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">
            <tr>
              <td align="center" style="padding-bottom:24px;">
                <a href="${siteUrl()}" style="text-decoration:none;font-size:16px;font-weight:700;color:#18181b;">Devct Shop</a>
              </td>
            </tr>
            <tr>
              <td style="background:#ffffff;border:1px solid #e4e4e7;border-radius:12px;padding:32px 28px;">
                <h1 style="margin:0 0 16px;font-size:20px;font-weight:700;color:#18181b;line-height:1.3;">${escapeHtml(heading)}</h1>
                <p style="margin:0;color:#3f3f46;font-size:15px;line-height:1.7;">${body}</p>
                ${cta}
                ${noteHtml}
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-top:24px;">
                <p style="margin:0;color:#a1a1aa;font-size:12px;line-height:1.6;">Devct Shop — premium templates, UI kits &amp; source code for developers.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

export function verificationEmail({
  name,
  url,
}: {
  name: string
  url: string
}): { subject: string; html: string } {
  return {
    subject: "Verify your email address",
    html: layout({
      heading: `Welcome, ${name}`,
      body: `Thanks for creating an account on Devct Shop. Please confirm your email address to finish setting up your account.`,
      ctaHref: url,
      ctaLabel: "Verify email address",
      note: `If you didn't create an account, you can safely ignore this email.`,
    }),
  }
}

export function passwordResetEmail({
  name,
  url,
  expiresMinutes,
}: {
  name: string
  url: string
  expiresMinutes: number
}): { subject: string; html: string } {
  return {
    subject: "Reset your Devct Shop password",
    html: layout({
      heading: `Reset your password`,
      body: `Hi ${name}, we received a request to reset the password for your Devct Shop account. Use the button below to choose a new password. This link expires in ${expiresMinutes} minutes.`,
      ctaHref: url,
      ctaLabel: "Choose a new password",
      note: `If you didn't request a password reset, you can ignore this email and your password will stay unchanged.`,
    }),
  }
}
