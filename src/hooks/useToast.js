import { useToastStore } from '../stores/useToastStore'

export function useToast() {
  const { addToast } = useToastStore()
  return { toast: addToast }
}

export { useToastStore }
