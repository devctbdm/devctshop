import { and, eq, type SQL } from "drizzle-orm"
import type { Adapter, AdapterAccount, AdapterUser } from "next-auth/adapters"

import { db } from "@/db"
import { accounts, users } from "@/db/schema"
import { createCustomer } from "./users"

export type AuthUser = AdapterUser & {
  passwordHash?: string | null
  role: "USER" | "ADMIN"
  isEmailVerified: boolean
  isActive: boolean
}

type DBUser = typeof users.$inferSelect

function toAdapterUser(user: DBUser): AdapterUser {
  return {
    id: user.id,
    name: user.fullName,
    email: user.email,
    image: user.avatarUrl ?? null,
    emailVerified: user.isEmailVerified ? new Date() : null,
  }
}

export function toAuthUser(user: DBUser): AuthUser {
  return {
    ...toAdapterUser(user),
    passwordHash: user.passwordHash,
    role: user.role as "USER" | "ADMIN",
    isEmailVerified: user.isEmailVerified,
    isActive: user.isActive,
  }
}

function toAccount(
  account: typeof accounts.$inferSelect
): AdapterAccount {
  return {
    id: account.id,
    userId: account.userId,
    type: account.type.toLowerCase() as AdapterAccount["type"],
    provider: account.provider,
    providerAccountId: account.providerAccountId,
    refresh_token: str(account.refresh_token),
    access_token: str(account.access_token),
    expires_at: num(account.expires_at),
    token_type: str(account.token_type) as AdapterAccount["token_type"],
    scope: str(account.scope),
    id_token: str(account.id_token),
    session_state: str(account.session_state),
  } as AdapterAccount
}

function str(value: unknown): string | null {
  return typeof value === "string" ? value : null
}

function num(value: unknown): number | null {
  return typeof value === "number" ? value : null
}

async function findUserBy(
  where: (table: typeof users) => SQL
): Promise<DBUser | null> {
  const rows = await db.select().from(users).where(where(users)).limit(1)
  return rows[0] ?? null
}

export const drizzleAdapter: Adapter = {
  async createUser(user: AdapterUser) {
    const row = await createCustomer({
      email: user.email,
      fullName: user.name ?? "",
      avatarUrl: user.image ?? null,
      passwordHash: null,
    })
    // OAuth sign-ups arrive with a verified email from the provider.
    if (user.emailVerified) {
      const [updated] = await db
        .update(users)
        .set({ isEmailVerified: true, updatedAt: new Date() })
        .where(eq(users.id, row.id))
        .returning()
      return toAuthUser(updated)
    }
    return toAuthUser(row)
  },

  async getUser(id: string) {
    const row = await findUserBy((t) => eq(t.id, id))
    return row ? toAuthUser(row) : null
  },

  async getUserByEmail(email: string) {
    const row = await findUserBy((t) => eq(t.email, email))
    return row ? toAuthUser(row) : null
  },

  async getUserByAccount({ provider, providerAccountId }) {
    const account = await db
      .select({ userId: accounts.userId })
      .from(accounts)
      .where(
        and(
          eq(accounts.provider, provider),
          eq(accounts.providerAccountId, providerAccountId)
        )
      )
      .limit(1)

    if (!account[0]) return null

    const row = await findUserBy((t) => eq(t.id, account[0].userId))
    return row ? toAuthUser(row) : null
  },

  async updateUser(user) {
    const data: Partial<typeof users.$inferInsert> = {
      updatedAt: new Date(),
    }
    if (user.name !== undefined) data.fullName = user.name ?? ""
    if (user.email !== undefined) data.email = user.email
    if (user.image !== undefined) data.avatarUrl = user.image ?? null
    if (user.emailVerified !== undefined)
      data.isEmailVerified = Boolean(user.emailVerified)

    const [row] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, user.id))
      .returning()

    return toAuthUser(row)
  },

  async linkAccount(account: AdapterAccount) {
    await db.insert(accounts).values({
      userId: account.userId,
      type: account.type,
      provider: account.provider,
      providerAccountId: account.providerAccountId,
      refresh_token: str(account.refresh_token),
      access_token: str(account.access_token),
      expires_at: num(account.expires_at),
      token_type: str(account.token_type),
      scope: str(account.scope),
      id_token: str(account.id_token),
      session_state: str(account.session_state),
    })
  },

  async getAccount(providerAccountId: string, provider: string) {
    const [account] = await db
      .select()
      .from(accounts)
      .where(
        and(
          eq(accounts.provider, provider),
          eq(accounts.providerAccountId, providerAccountId)
        )
      )
      .limit(1)

    return account ? toAccount(account) : null
  },
}
