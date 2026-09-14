import { ProfileForm } from "@/components/auth/profile-form"
import { getSessionUser } from "@/lib/auth/session"

export default async function AccountSettingsPage() {
  const user = await getSessionUser()
  if (!user) return null
  return <ProfileForm user={user} />
}
