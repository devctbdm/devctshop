"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { requireAdmin } from "@/lib/auth/session"
import { defaultGeneralSettings, saveGeneralSettings } from "@/lib/settings"

const optionalUrl = z.string().trim().url().optional().or(z.literal(""))
const settingsSchema = z.object({
  shopName: z.string().trim().min(2).max(120),
  tagline: z.string().trim().min(2).max(180),
  siteDescription: z.string().trim().min(10).max(500),
  contactEmail: z.string().trim().email().max(255).optional().or(z.literal("")),
  contactPhone: z.string().trim().max(40).optional().default(""),
  address: z.string().trim().max(500).optional().default(""),
  footerDescription: z.string().trim().min(10).max(500),
  copyrightText: z.string().trim().min(2).max(180),
  facebookUrl: optionalUrl,
  githubUrl: optionalUrl,
  youtubeUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  defaultCurrency: z.enum(["USD", "BDT"]),
  supportedCurrencies: z.string().transform((value) => value.split(",").filter((item): item is "USD" | "BDT" => item === "USD" || item === "BDT")).pipe(z.array(z.enum(["USD", "BDT"])).min(1)),
  usdToBdtRate: z.coerce.number().positive().finite(),
})

export async function updateGeneralSettingsAction(formData: FormData) {
  await requireAdmin()
  const parsed = settingsSchema.parse(Object.fromEntries(formData.entries()))
  await saveGeneralSettings({ ...defaultGeneralSettings, ...parsed })
  revalidatePath("/admin/settings")
  revalidatePath("/")
  revalidatePath("/products")
  return { ok: true }
}
