import { ProfileForm } from "@/components/auth/profile-form"
import { getSessionUser } from "@/lib/auth/session"

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const user = await getSessionUser()
  if (!user) return null
  const params = await searchParams
  const get = (k: string) => {
    const v = params[k]
    return Array.isArray(v) ? v[0] : v
  }
  const notice =
    get("verified") === "1"
      ? { kind: "success" as const, text: "Your email address is verified." }
      : get("updated") === "1"
        ? { kind: "success" as const, text: "Your profile was updated." }
        : null

  return <ProfileForm user={user} notice={notice} />
}
