import "server-only"

import { eq } from "drizzle-orm"
import { db } from "@/db"
import { userPreferences } from "@/db/schema"

export async function getUserPreferences(userId: string) {
  const [preferences] = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId)).limit(1)
  return preferences ?? { userId, orderNotifications: true, downloadNotifications: true, productUpdates: true, emailNotifications: true, updatedAt: new Date() }
}
