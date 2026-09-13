import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export const metadata = { title: "Forgot password" }

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const sent = params["sent"] === "1" ||
    (Array.isArray(params["sent"]) && params["sent"][0] === "1")
  return <ForgotPasswordForm sent={sent} />
}
