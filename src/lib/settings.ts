import "server-only"

import { eq } from "drizzle-orm"
import { db } from "@/db"
import { generalSettings } from "@/db/schema"

export const defaultGeneralSettings = {
  shopName: "Devct Shop",
  tagline: "Premium Digital Products for Developers",
  siteDescription: "Devct Shop is a digital marketplace for high-quality website source code, templates, UI kits, and ready-to-use development projects.",
  contactEmail: "",
  contactPhone: "",
  address: "",
  footerDescription: "Devct Shop is a digital marketplace for developers, offering high-quality website source code, templates, UI kits, and ready-to-use development projects.",
  copyrightText: "© 2026 Devct Shop. All rights reserved.",
  facebookUrl: "",
  githubUrl: "",
  youtubeUrl: "",
  linkedinUrl: "",
}

export async function getGeneralSettings() {
  const [settings] = await db.select().from(generalSettings).limit(1)
  return settings ?? { id: "defaults", ...defaultGeneralSettings, createdAt: new Date(), updatedAt: new Date() }
}

export async function saveGeneralSettings(values: typeof defaultGeneralSettings) {
  const [existing] = await db.select({ id: generalSettings.id }).from(generalSettings).limit(1)
  if (existing) {
    await db.update(generalSettings).set({ ...values, updatedAt: new Date() }).where(eq(generalSettings.id, existing.id))
  } else {
    await db.insert(generalSettings).values(values)
  }
}
