import { RegisterForm } from "@/components/auth/register-form"

export const metadata = { title: "Create account" }

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const sent = params["sent"] === "1" ||
    (Array.isArray(params["sent"]) && params["sent"][0] === "1")

  return <RegisterForm sent={sent} />
}
