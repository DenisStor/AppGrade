import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, variant) => {
        const itemId = `${product.id}-${variant.id}`
        const { items } = get()
        const existing = items.find(i => i.id === itemId)

        if (existing) {
          set({
            items: items.map(i =>
              i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i
            )
          })
        } else {
          set({
            items: [...items, {
              id: itemId,
              productId: product.id,
              variantId: variant.id,
              quantity: 1,
              attributes: variant.attributes || {},
              color: variant.color,
              memory: variant.memory,
              price: variant.price,
              name: product.name,
              image: variant.images?.[0]
            }]
          })
        }
      },

      removeItem: (itemId) => set({
        items: get().items.filter(i => i.id !== itemId)
      }),

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }
        set({
          items: get().items.map(i =>
            i.id === itemId ? { ...i, quantity } : i
          )
        })
      },

      clearCart: () => set({ items: [] }),

      isInCart: (productId, variantId) =>
        get().items.some(i => i.productId === productId && i.variantId === variantId),

      getTotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      getCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: 'cart',
      version: 2,
      migrate: (persisted, version) => {
        if (version < 2) {
          const items = (persisted.items || []).map(item => {
            if (item.attributes && Object.keys(item.attributes).length > 0) return item
            const attributes = {}
            if (item.color) {
              attributes.color = item.color
            }
            if (item.memory) {
              attributes.memory = { id: String(item.memory), name: `${item.memory} ГБ` }
            }
            if (item.sim) {
              attributes.sim = { id: item.sim, name: item.sim }
            }
            return { ...item, attributes }
          })
          return { ...persisted, items }
        }
        return persisted
      },
    }
  )
)
