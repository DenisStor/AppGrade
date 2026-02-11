import { Phone } from 'lucide-react'
import { CONTACTS } from '../../data/config'

export function FloatingCallButton() {
  return (
    <a
      href={CONTACTS.phoneLink}
      aria-label="Позвонить"
      className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gray-dark text-white shadow-lg transition-transform active:scale-95 lg:hidden"
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gray-dark opacity-20" />
      <Phone className="relative h-6 w-6" />
    </a>
  )
}
