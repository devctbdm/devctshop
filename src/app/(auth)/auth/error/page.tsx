import { AuthCard } from "@/components/auth/auth-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = { title: "Sign in" }

const messages: Record<string, { title: string; body: string }> = {
  CredentialsSignin: {
    title: "Sign-in failed",
    body: "The email or password you entered is incorrect. Please try again.",
  },
  OAuthAccountNotLinked: {
    title: "Account not linked",
    body: "This Google account isn't linked to a Devct Shop account yet.",
  },
  Signin: {
    title: "Sign-in failed",
    body: "We couldn't sign you in. Please try again.",
  },
  default: {
    title: "Something went wrong",
    body: "We couldn't complete that action. Please try again.",
  },
}

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const raw = params["error"]
  const code = Array.isArray(raw) ? raw[0] : raw ?? "default"
  const { title, body } =
    messages[code as keyof typeof messages] ?? messages.default

  return (
    <AuthCard title={title} description={body}>
      <div className="flex flex-col gap-2">
        <Button size="lg" className="w-full" render={<Link href="/auth/login" />}>
          Try signing in again
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="w-full"
          render={<Link href="/" />}
        >
          Back to home
        </Button>
      </div>
    </AuthCard>
  )
}
