"use server"

import { and, eq, ne } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

import { db } from "@/db"
import { categories, products, users } from "@/db/schema"
import { requireAdmin } from "@/lib/auth/session"

const textList = z.string().optional().default("").transform((value) => value.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean))
const productSchema = z.object({
  name: z.string().trim().min(2).max(160),
  slug: z.string().trim().min(2).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  categoryId: z.string().uuid(),
  tagline: z.string().trim().max(200).optional().default(""),
  description: z.string().trim().min(10),
  price: z.coerce.number().finite().positive(),
  salePrice: z.coerce.number().finite().nonnegative().optional(),
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

export async function createProductAction(formData: FormData) {
  await requireAdmin()
  const data = productData(formData)
  await db.insert(products).values(data)
  revalidatePath("/admin/products")
  revalidatePath("/products")
  redirect("/admin/products?created=1")
}

export async function updateProductAction(formData: FormData) {
  await requireAdmin()
  const id = z.string().uuid().parse(formData.get("id"))
  const data = productData(formData)
  await db.update(products).set(data).where(eq(products.id, id))
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
})

export async function createCategoryAction(formData: FormData) {
  await requireAdmin()
  const data = categorySchema.parse(Object.fromEntries(formData.entries()))
  await db.insert(categories).values({ ...data, description: data.description || null })
  revalidatePath("/admin/categories")
  revalidatePath("/categories")
  redirect("/admin/categories?created=1")
}

export async function updateCategoryAction(formData: FormData) {
  await requireAdmin()
  const id = z.string().uuid().parse(formData.get("id"))
  const data = categorySchema.parse(Object.fromEntries(formData.entries()))
  await db.update(categories).set({ ...data, description: data.description || null, updatedAt: new Date() }).where(eq(categories.id, id))
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
