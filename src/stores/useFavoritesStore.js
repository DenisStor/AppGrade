import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId) => {
        const { items } = get()
        if (!items.includes(productId)) {
          set({ items: [...items, productId] })
        }
      },

      removeItem: (productId) => {
        const { items } = get()
        set({ items: items.filter((id) => id !== productId) })
      },

      toggleItem: (productId) => {
        const { items } = get()
        if (items.includes(productId)) {
          set({ items: items.filter((id) => id !== productId) })
        } else {
          set({ items: [...items, productId] })
        }
      },

      isFavorite: (productId) => get().items.includes(productId),

      clearItems: () => set({ items: [] }),
    }),
    {
      name: 'favorites',
      version: 1,
      migrate: (persisted, version) => {
        if (version === 0) {
          return { ...persisted, items: persisted.items || [] }
        }
        return persisted
      },
    }
  )
)
