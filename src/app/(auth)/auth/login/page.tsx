import { LoginForm } from "@/components/auth/login-form"

export const metadata = { title: "Sign in" }

type Notice = { kind: "success" | "error" | "info"; text: string } | null

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const get = (k: string) => {
    const v = params[k]
    return Array.isArray(v) ? v[0] : v
  }

  const callbackUrl = get("callbackUrl") || undefined
  let notice: Notice = null
  if (get("reset") === "1") {
    notice = {
      kind: "success",
      text: "Your password was updated. Sign in with your new password.",
    }
  } else if (get("verified") === "1") {
    notice = { kind: "success", text: "Your email is verified. You're all set." }
  } else if (get("error") === "verify") {
    notice = {
      kind: "error",
      text: "That verification link is invalid or has expired.",
    }
  }

  return <LoginForm callbackUrl={callbackUrl} notice={notice} />
}
