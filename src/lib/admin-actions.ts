"use server"

import { and, eq, ne } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

import { db } from "@/db"
import { categories, productFiles, productImages, products, users } from "@/db/schema"
import { requireAdmin } from "@/lib/auth/session"

const textList = z.string().optional().default("").transform((value) => value.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean))
const productSchema = z.object({
  name: z.string().trim().min(2).max(160),
  slug: z.string().trim().min(2).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  categoryId: z.string().uuid(),
  tagline: z.string().trim().max(200).optional().default(""),
  description: z.string().trim().min(10),
  price: z.coerce.number().finite().nonnegative(),
  salePrice: z.coerce.number().finite().nonnegative().optional(),
  productType: z.enum(["FREE", "PAID"]).default("PAID"),
  version: z.string().trim().min(1).max(30),
  license: z.string().trim().min(2).max(80),
  thumbnailUrl: z.string().trim().url().optional().or(z.literal("")),
  demoUrl: z.string().trim().url().optional().or(z.literal("")),
  images: textList,
  technologies: textList,
  features: textList,
  requirements: textList,
  tags: textList,
})

function productData(formData: FormData) {
  const parsed = productSchema.parse(Object.fromEntries(formData.entries()))
  if (parsed.productType === "PAID" && parsed.price <= 0) throw new Error("Paid products must have a price greater than zero.")
  if (parsed.salePrice !== undefined && parsed.salePrice > 0 && parsed.salePrice >= parsed.price) {
    throw new Error("Sale price must be lower than the regular price.")
  }
  return {
    name: parsed.name,
    slug: parsed.slug,
    categoryId: parsed.categoryId,
    tagline: parsed.tagline || null,
    description: parsed.description,
    priceCents: Math.round(parsed.price * 100),
    salePriceCents: parsed.salePrice && parsed.salePrice > 0 ? Math.round(parsed.salePrice * 100) : null,
    productType: parsed.productType,
    version: parsed.version,
    license: parsed.license,
    thumbnailUrl: parsed.thumbnailUrl || null,
    demoUrl: parsed.demoUrl || null,
    imageUrls: parsed.images,
    techStack: parsed.technologies,
    features: parsed.features,
    requirements: parsed.requirements,
    tags: parsed.tags,
    updatedAt: new Date(),
  }
}

type Asset = { publicId: string; secureUrl: string; width: number; height: number; format: string }
type DigitalFile = { name: string; path: string; sizeBytes: number; mimeType: string }
function assetsFromForm(value: FormDataEntryValue | null): Asset[] {
  if (typeof value !== "string" || !value) return []
  try {
    const parsed = JSON.parse(value) as unknown
    return Array.isArray(parsed) ? parsed.filter((item): item is Asset => typeof item === "object" && item !== null && typeof (item as Asset).publicId === "string" && typeof (item as Asset).secureUrl === "string") : []
  } catch { return [] }
}

function filesFromForm(value: FormDataEntryValue | null): DigitalFile[] {
  if (typeof value !== "string" || !value) return []
  try {
    const parsed = JSON.parse(value) as unknown
    return Array.isArray(parsed) ? parsed.filter((item): item is DigitalFile => typeof item === "object" && item !== null && typeof (item as DigitalFile).name === "string" && typeof (item as DigitalFile).path === "string" && Number.isFinite((item as DigitalFile).sizeBytes)) : []
  } catch { return [] }
}

export async function createProductAction(formData: FormData) {
  await requireAdmin()
  const data = productData(formData)
  const id = z.string().uuid().parse(formData.get("id"))
  const [product] = await db.insert(products).values({ ...data, id }).returning({ id: products.id })
  const assets = assetsFromForm(formData.get("galleryAssets"))
  if (assets.length) await db.insert(productImages).values(assets.map((asset, position) => ({ productId: product.id, publicId: asset.publicId, secureUrl: asset.secureUrl, width: asset.width, height: asset.height, format: asset.format, position })))
  const files = filesFromForm(formData.get("digitalFiles"))
  if (files.length) await db.insert(productFiles).values(files.map((file) => ({ productId: product.id, name: file.name, path: file.path, version: data.version, sizeBytes: file.sizeBytes, mimeType: file.mimeType })))
  revalidatePath("/admin/products")
  revalidatePath("/products")
  redirect("/admin/products?created=1")
}

export async function updateProductAction(formData: FormData) {
  await requireAdmin()
  const id = z.string().uuid().parse(formData.get("id"))
  const data = productData(formData)
  await db.update(products).set(data).where(eq(products.id, id))
  const assets = assetsFromForm(formData.get("galleryAssets"))
  await db.delete(productImages).where(eq(productImages.productId, id))
  if (assets.length) await db.insert(productImages).values(assets.map((asset, position) => ({ productId: id, publicId: asset.publicId, secureUrl: asset.secureUrl, width: asset.width, height: asset.height, format: asset.format, position })))
  await db.delete(productFiles).where(eq(productFiles.productId, id))
  const files = filesFromForm(formData.get("digitalFiles"))
  if (files.length) await db.insert(productFiles).values(files.map((file) => ({ productId: id, name: file.name, path: file.path, version: data.version, sizeBytes: file.sizeBytes, mimeType: file.mimeType, updatedAt: new Date() })))
  revalidatePath("/admin/products")
  revalidatePath("/products")
  redirect(`/admin/products/${id}?updated=1`)
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin()
  const id = z.string().uuid().parse(formData.get("id"))
  await db.delete(products).where(eq(products.id, id))
  revalidatePath("/admin/products")
  redirect("/admin/products?deleted=1")
}

export async function toggleProductAction(formData: FormData) {
  await requireAdmin()
  const id = z.string().uuid().parse(formData.get("id"))
  const field = z.enum(["isPublished", "featured"]).parse(formData.get("field"))
  const value = formData.get("value") === "true"
  await db.update(products).set({ [field]: value, updatedAt: new Date() }).where(eq(products.id, id))
  revalidatePath("/admin/products")
  revalidatePath("/products")
}

const categorySchema = z.object({
  name: z.string().trim().min(2).max(100),
  slug: z.string().trim().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().max(240).optional().default(""),
  icon: z.string().trim().max(60).optional().default("Blocks"),
  position: z.coerce.number().int().min(0).max(9999).default(0),
  imageUrl: z.string().trim().url().optional().or(z.literal("")),
  imagePublicId: z.string().trim().max(255).optional().or(z.literal("")),
  imageWidth: z.coerce.number().int().positive().optional(),
  imageHeight: z.coerce.number().int().positive().optional(),
  imageFormat: z.string().trim().max(20).optional().or(z.literal("")),
})

export async function createCategoryAction(formData: FormData) {
  await requireAdmin()
  const data = categorySchema.parse(Object.fromEntries(formData.entries()))
  await db.insert(categories).values({ ...data, description: data.description || null, imageUrl: data.imageUrl || null, imagePublicId: data.imagePublicId || null, imageWidth: data.imageWidth ?? null, imageHeight: data.imageHeight ?? null, imageFormat: data.imageFormat || null })
  revalidatePath("/admin/categories")
  revalidatePath("/categories")
  redirect("/admin/categories?created=1")
}

export async function updateCategoryAction(formData: FormData) {
  await requireAdmin()
  const id = z.string().uuid().parse(formData.get("id"))
  const data = categorySchema.parse(Object.fromEntries(formData.entries()))
  await db.update(categories).set({ ...data, description: data.description || null, imageUrl: data.imageUrl || null, imagePublicId: data.imagePublicId || null, imageWidth: data.imageWidth ?? null, imageHeight: data.imageHeight ?? null, imageFormat: data.imageFormat || null, updatedAt: new Date() }).where(eq(categories.id, id))
  revalidatePath("/admin/categories")
  revalidatePath("/categories")
  redirect(`/admin/categories/${id}?updated=1`)
}

export async function deleteCategoryAction(formData: FormData) {
  await requireAdmin()
  const id = z.string().uuid().parse(formData.get("id"))
  await db.delete(categories).where(eq(categories.id, id))
  revalidatePath("/admin/categories")
  redirect("/admin/categories?deleted=1")
}

export async function toggleCategoryAction(formData: FormData) {
  await requireAdmin()
  const id = z.string().uuid().parse(formData.get("id"))
  const isActive = formData.get("value") === "true"
  await db.update(categories).set({ isActive, updatedAt: new Date() }).where(eq(categories.id, id))
  revalidatePath("/admin/categories")
  revalidatePath("/categories")
}

export async function updateUserStatusAction(formData: FormData) {
  const admin = await requireAdmin()
  const id = z.string().uuid().parse(formData.get("id"))
  if (id === admin.id) throw new Error("You cannot disable your own account.")
  const isActive = formData.get("value") === "true"
  await db.update(users).set({ isActive, updatedAt: new Date() }).where(eq(users.id, id))
  revalidatePath("/admin/customers")
}

export async function updateUserRoleAction(formData: FormData) {
  const admin = await requireAdmin()
  const id = z.string().uuid().parse(formData.get("id"))
  if (id === admin.id) throw new Error("You cannot change your own admin role.")
  const role = z.enum(["USER", "ADMIN"]).parse(formData.get("role"))
  await db.update(users).set({ role, updatedAt: new Date() }).where(and(eq(users.id, id), ne(users.id, admin.id)))
  revalidatePath("/admin/customers")
}
