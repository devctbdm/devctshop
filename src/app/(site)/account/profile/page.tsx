import { AccountProfileForm } from "@/components/account/account-profile-form"
import { requireUser } from "@/lib/auth/session"

export default async function AccountProfilePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const user = await requireUser()
  const params = await searchParams
  const value = (key: string) => {
    const item = params[key]
    return Array.isArray(item) ? item[0] : item
  }
  const notice = value("verified") === "1" ? { kind: "success" as const, text: "Your email address is verified." } : value("updated") === "1" ? { kind: "success" as const, text: "Your profile was updated." } : null
  return <AccountProfileForm user={user} notice={notice} />
}
