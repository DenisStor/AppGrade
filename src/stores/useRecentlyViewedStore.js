import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const MAX_ITEMS = 10

export const useRecentlyViewedStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId) => {
        const { items } = get()
        const filtered = items.filter((id) => id !== productId)
        const updated = [productId, ...filtered].slice(0, MAX_ITEMS)
        set({ items: updated })
      },

      clearItems: () => set({ items: [] }),
    }),
    {
      name: 'recently-viewed',
    }
  )
)
