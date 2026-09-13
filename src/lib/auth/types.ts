import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: "USER" | "ADMIN"
      fullName: string
      isEmailVerified: boolean
    } & DefaultSession["user"]
  }
}
