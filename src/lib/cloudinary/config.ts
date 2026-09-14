import "server-only"

import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
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
