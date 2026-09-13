"use client"

import * as React from "react"
import { signIn } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { GoogleIcon } from "@/components/auth/google-icon"
import { LoaderIcon } from "lucide-react"

export function GoogleButton({
  redirectTo = "/",
}: {
  redirectTo?: string
}) {
  const [pending, setPending] = React.useState(false)

  const handle = async () => {
    setPending(true)
    try {
      await signIn("google", { redirectTo })
    } finally {
      setPending(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="w-full"
      onClick={handle}
      disabled={pending}
    >
      {pending ? (
        <LoaderIcon className="animate-spin" />
      ) : (
        <GoogleIcon />
      )}
      Continue with Google
    </Button>
  )
}
