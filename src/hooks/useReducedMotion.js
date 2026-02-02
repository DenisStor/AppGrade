import { useMatchMedia } from './useMatchMedia'

export function useReducedMotion() {
  return useMatchMedia('(prefers-reduced-motion: reduce)')
}
