import { NextResponse } from "next/server"

import { auth } from "@/lib/auth/auth"
import { findUserById } from "@/lib/auth/users"
import { issueVerificationEmail } from "@/lib/auth/tokens"

export async function POST() {
  const session = await auth()
  const id = session?.user?.id
  if (!id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const user = await findUserById(id)
  if (!user || !user.isActive) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  if (user.isEmailVerified) {
    return NextResponse.json({ ok: true, alreadyVerified: true })
  }

  await issueVerificationEmail(user)
  return NextResponse.json({ ok: true })
}
