"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export type CartItem = {
  slug: string
  name: string
  price: number
  salePrice?: number
}

type CartStore = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (slug: string) => void
  clear: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) =>
          state.items.some((current) => current.slug === item.slug)
            ? state
            : { items: [...state.items, item] },
        ),
      removeItem: (slug) =>
        set((state) => ({
          items: state.items.filter((item) => item.slug !== slug),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "devct-shop-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      version: 1,
    },
  ),
)
