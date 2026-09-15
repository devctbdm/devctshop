import "server-only"

import { v2 as cloudinary } from "cloudinary"

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim()
const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY?.trim()
const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim()

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
})

export { cloudinary }

export const CLOUDINARY_FOLDERS = {
  products: "devct-shop/products",
  categories: "devct-shop/categories",
  users: "devct-shop/users",
  banners: "devct-shop/banners",
  settings: "devct-shop/settings",
} as const
