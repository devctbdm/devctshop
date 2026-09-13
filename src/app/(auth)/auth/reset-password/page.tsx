import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export const metadata = { title: "Choose a new password" }

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const get = (k: string) => {
    const v = params[k]
    return Array.isArray(v) ? v[0] : v
  }
  return (
    <ResetPasswordForm
      token={get("token") ?? ""}
      email={get("email") ?? ""}
    />
  )
}
