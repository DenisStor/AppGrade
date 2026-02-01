import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // { id, productId, variantId, quantity, color, memory, sim, price, name, image }

      addItem: (product, variant, sim = null) => {
        const itemId = sim
          ? `${product.id}-${variant.id}-${sim}`
          : `${product.id}-${variant.id}`
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
              color: variant.color,
              memory: variant.memory,
              sim,
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
    { name: 'cart' }
  )
)
