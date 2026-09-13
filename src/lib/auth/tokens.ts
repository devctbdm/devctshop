import { randomBytes } from "node:crypto"
import { and, eq, isNull } from "drizzle-orm"

import { db } from "@/db"
import {
  passwordResetTokens,
  users,
  verificationTokens,
} from "@/db/schema"
import { emailEnabled, sendEmail } from "@/lib/email/sender"
import { passwordResetEmail, verificationEmail } from "@/lib/email/templates"

import type { UserRow } from "./users"

export const VERIFICATION_TOKEN_TTL_MINUTES = 60
export const RESET_TOKEN_TTL_MINUTES = 30

function generateToken(): string {
  return randomBytes(32).toString("hex")
}

export function origin(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_URL ??
    "http://localhost:3000"
  )
}

/**
 * Create a single-use email verification token for the user and (when email is
 * enabled) send the verification email. Returns the absolute verify URL.
 */
export async function issueVerificationEmail(user: UserRow): Promise<string> {
  const token = generateToken()
  const expiresAt = new Date(Date.now() + VERIFICATION_TOKEN_TTL_MINUTES * 60_000)

  await db.insert(verificationTokens).values({
    userId: user.id,
    email: user.email,
    token,
    expiresAt,
  })

  const url = `${origin()}/auth/verify-email?token=${token}&email=${encodeURIComponent(user.email)}`

  if (emailEnabled()) {
    await sendEmail({
      to: user.email,
      ...verificationEmail({ name: user.fullName, url }),
    })
  }

  return url
}

/**
 * Consume a verification token if it is valid and unexpired. Marks the user's
 * email as verified. Returns `true` on success.
 */
export async function verifyEmailToken(
  token: string,
  email: string
): Promise<boolean> {
  if (!token || !email) return false

  const [existing] = await db
    .select()
    .from(verificationTokens)
    .where(eq(verificationTokens.token, token))
    .limit(1)

  if (
    !existing ||
    existing.email.toLowerCase() !== email.trim().toLowerCase() ||
    existing.expiresAt < new Date()
  ) {
    return false
  }

  await db.transaction(async (tx) => {
    await tx
      .delete(verificationTokens)
      .where(eq(verificationTokens.token, token))
    await tx
      .update(users)
      .set({ isEmailVerified: true, updatedAt: new Date() })
      .where(eq(users.id, existing.userId))
  })

  return true
}

/**
 * Create a single-use password reset token and (when enabled) send the reset
 * email.
 */
export async function issuePasswordResetEmail(user: UserRow): Promise<void> {
  const token = generateToken()
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MINUTES * 60_000)

  // Replace any outstanding reset tokens for this user.
  await db
    .delete(passwordResetTokens)
    .where(
      and(
        eq(passwordResetTokens.userId, user.id),
        isNull(passwordResetTokens.usedAt)
      )
    )

  await db.insert(passwordResetTokens).values({
    userId: user.id,
    email: user.email,
    token,
    expiresAt,
  })

  const url = `${origin()}/auth/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`

  if (emailEnabled()) {
    await sendEmail({
      to: user.email,
      ...passwordResetEmail({
        name: user.fullName,
        url,
        expiresMinutes: RESET_TOKEN_TTL_MINUTES,
      }),
    })
  }
}
