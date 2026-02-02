import { create } from 'zustand'
import { PRICE } from '../data/constants'

export const useProductStore = create((set) => ({
  filters: {
    priceRange: [0, PRICE.MAX],
    colors: [],
    memory: [],
    brands: [],
    inStock: false,
  },
  sortBy: 'popular',
  viewMode: 'grid',

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),

  toggleArrayFilter: (key, value) =>
    set((state) => {
      const current = state.filters[key]
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      return { filters: { ...state.filters, [key]: updated } }
    }),

  resetFilters: () =>
    set({
      filters: {
        priceRange: [0, PRICE.MAX],
        colors: [],
        memory: [],
        brands: [],
        inStock: false,
      },
    }),

  setSortBy: (sortBy) => set({ sortBy }),

  setViewMode: (viewMode) => set({ viewMode }),
}))
