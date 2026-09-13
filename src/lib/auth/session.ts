import { headers } from "next/headers"
import { forbidden, redirect } from "next/navigation"

import { auth } from "./auth"
import { findUserById, toPublicUser, type PublicUser } from "./users"

export type AuthUser = PublicUser

/**
 * Returns the currently signed-in user, always re-read from the database so
 * the returned role is authoritative (never trusted from the session cookie).
 * Returns `null` when there is no session, or the user is missing/disabled.
 */
export async function getSessionUser(): Promise<PublicUser | null> {
  const session = await auth()
  const id = session?.user?.id
  if (!id) return null

  const row = await findUserById(id)
  if (!row || !row.isActive) return null

  return toPublicUser(row)
}

async function currentCallbackUrl(): Promise<string> {
  try {
    const h = await headers()
    const proto = h.get("x-forwarded-proto") ?? "http"
    const host = h.get("host") ?? "localhost:3000"
    const referer = h.get("referer")
    const raw = referer ?? `${proto}://${host}/`
    const url = new URL(raw)
    const path = url.pathname + url.search
    if (path.startsWith("/auth/")) return "/"
    return path
  } catch {
    return "/"
  }
}

/**
 * Require a signed-in user. Redirects to the login page (remembering where the
 * user was headed) when they are not authenticated.
 */
export async function requireUser(): Promise<PublicUser> {
  const user = await getSessionUser()
  if (!user) {
    const callbackUrl = await currentCallbackUrl()
    redirect(`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`)
  }
  return user
}

/**
 * Require an ADMIN user. Redirects unauthenticated users to login, and renders
 * the 403 page (forbidden) for authenticated non-admins. A normal USER can
 * never reach this code path successfully.
 */
export async function requireAdmin(): Promise<PublicUser> {
  const user = await requireUser()
  if (user.role !== "ADMIN") {
    forbidden()
  }
  return user
}
