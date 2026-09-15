import "server-only"

import { eq } from "drizzle-orm"
import { db } from "@/db"
import { generalSettings } from "@/db/schema"

export const defaultGeneralSettings: {
  shopName: string
  tagline: string
  siteDescription: string
  contactEmail: string
  contactPhone: string
  address: string
  footerDescription: string
  copyrightText: string
  facebookUrl: string
  githubUrl: string
  youtubeUrl: string
  linkedinUrl: string
  defaultCurrency: "USD" | "BDT"
  supportedCurrencies: ("USD" | "BDT")[]
  usdToBdtRate: string | number
} = {
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
  defaultCurrency: "USD",
  supportedCurrencies: ["USD", "BDT"],
  usdToBdtRate: "120.00",
}

export async function getGeneralSettings() {
  const [settings] = await db.select().from(generalSettings).limit(1)
  return settings ?? { id: "defaults", ...defaultGeneralSettings, createdAt: new Date(), updatedAt: new Date() }
}

export async function saveGeneralSettings(values: typeof defaultGeneralSettings & { usdToBdtRate: string | number }) {
  const databaseValues = { ...values, usdToBdtRate: String(values.usdToBdtRate) }
  const [existing] = await db.select({ id: generalSettings.id }).from(generalSettings).limit(1)
  if (existing) {
    await db.update(generalSettings).set({ ...databaseValues, updatedAt: new Date() }).where(eq(generalSettings.id, existing.id))
  } else {
    await db.insert(generalSettings).values(databaseValues)
  }
}
