import { eq } from "drizzle-orm"

import { db } from "@/db"
import { users } from "@/db/schema"

export type UserRow = typeof users.$inferSelect

export type PublicUser = {
  id: string
  fullName: string
  email: string
  role: "USER" | "ADMIN"
  isEmailVerified: boolean
  avatarUrl: string | null
  isActive: boolean
  createdAt: Date
}

export async function findUserByEmail(email: string): Promise<UserRow | null> {
  const [row] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.trim().toLowerCase()))
    .limit(1)
  return row ?? null
}

export async function findUserById(id: string): Promise<UserRow | null> {
  const [row] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1)
  return row ?? null
}

export function toPublicUser(row: UserRow): PublicUser {
  return {
    id: row.id,
    fullName: row.fullName,
    email: row.email,
    role: row.role as "USER" | "ADMIN",
    isEmailVerified: row.isEmailVerified,
    avatarUrl: row.avatarUrl,
    isActive: row.isActive,
    createdAt: row.createdAt,
  }
}

export async function createCustomer(data: {
  email: string
  fullName: string
  passwordHash?: string | null
  avatarUrl?: string | null
}): Promise<UserRow> {
  const [row] = await db
    .insert(users)
    .values({
      email: data.email.trim().toLowerCase(),
      fullName: data.fullName,
      passwordHash: data.passwordHash ?? null,
      avatarUrl: data.avatarUrl ?? null,
      role: "USER",
      isEmailVerified: false,
    })
    .returning()
  return row
}
