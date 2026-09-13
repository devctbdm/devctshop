import { redirect } from "next/navigation"

import { auth } from "@/lib/auth/auth"
import { verifyEmailToken } from "@/lib/auth/tokens"

export const metadata = { title: "Verify email" }

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const get = (k: string) => {
    const v = params[k]
    return Array.isArray(v) ? v[0] : v
  }

  const token = get("token") ?? ""
  const email = get("email") ?? ""
  const ok = await verifyEmailToken(token, email)

  if (!ok) {
    redirect("/auth/login?error=verify")
  }

  const session = await auth()
  redirect(session ? "/account?verified=1" : "/auth/login?verified=1")
}
