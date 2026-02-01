import { create } from 'zustand'

export const useSearchStore = create((set) => ({
  query: '',
  isOpen: false,
  results: [],
  isLoading: false,

  setQuery: (query) => set({ query }),

  setResults: (results) => set({ results }),

  setIsOpen: (isOpen) => set({ isOpen }),

  setIsLoading: (isLoading) => set({ isLoading }),

  reset: () => set({ query: '', results: [], isOpen: false, isLoading: false }),
}))
