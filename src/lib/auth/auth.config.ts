import type { NextAuthConfig } from "next-auth"
import bcrypt from "bcryptjs"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"

import { drizzleAdapter, toAuthUser } from "./adapter"
import { findUserByEmail } from "./users"

// AUTH_SECRET is required in production (NextAuth enforces it at request time).
// We intentionally do not throw at import so the app can build and the site
// layout can call auth() during static generation.
const SECRET = process.env.AUTH_SECRET

export const authConfig: NextAuthConfig = {
  adapter: drizzleAdapter,
  session: { strategy: "jwt" },
  ...(SECRET ? { secret: SECRET } : {}),
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user }) {
      // Authoritatively block disabled/unknown accounts for every provider by
      // resolving the user from the database.
      const email = (user as { email?: string | null }).email
      if (!email) return false
      const dbUser = await findUserByEmail(email)
      if (!dbUser || !dbUser.isActive) return false
      return true
    },

    async jwt({ token, user, trigger }) {
      // On sign-in, the full user row (including role) is provided.
      if (user) {
        token.id = user.id
        token.role = (user as { role?: "USER" | "ADMIN" }).role ?? "USER"
        token.fullName = user.name ?? ""
        token.isEmailVerified = Boolean(
          (user as { isEmailVerified?: boolean }).isEmailVerified
        )
        token.email = user.email ?? token.email
        token.picture = user.image ?? token.picture
        return token
      }

      // Periodically refresh from the DB (on the update-age trigger) so the
      // session reflects role/verification changes. Authoritative admin checks
      // always re-query the DB directly (see requireAdmin), so this only keeps
      // the UI in sync and does not gate access.
      if (trigger === "update" && typeof token.email === "string") {
        const dbUser = await findUserByEmail(token.email)
        if (dbUser) {
          const mapped = toAuthUser(dbUser)
          token.id = mapped.id
          token.role = mapped.role
          token.fullName = mapped.name ?? ""
          token.isEmailVerified = mapped.isEmailVerified
        }
      }

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? ""
        session.user.role = (token.role as "USER" | "ADMIN") ?? "USER"
        session.user.fullName =
          (token.fullName as string) ?? session.user.name ?? ""
        session.user.isEmailVerified = Boolean(token.isEmailVerified)
      }
      return session
    },
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email
        const password = credentials?.password
        if (typeof email !== "string" || typeof password !== "string") {
          return null
        }
        const normalized = email.trim().toLowerCase()
        if (!normalized || !password) return null

        const user = await findUserByEmail(normalized)
        if (!user || !user.passwordHash || !user.isActive) return null

        const valid = await bcrypt.compare(password, user.passwordHash)
        if (!valid) return null

        return toAuthUser(user)
      },
    }),
  ],
}
