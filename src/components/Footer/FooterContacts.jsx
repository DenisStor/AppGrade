import { Mail, MapPin, Clock } from 'lucide-react'
import { CONTACTS } from '../../data/config'

export function FooterContacts() {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
        <span className="w-8 h-px bg-gradient-to-r from-blue-500 to-transparent" />
        Контакты
      </h3>

      {/* Телефон — крупный блок */}
      <div className="mb-6">
        <a
          href={CONTACTS.phoneLink}
          className="group block"
        >
          <span className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
            {CONTACTS.phone}
          </span>
        </a>
      </div>

      {/* Остальные контакты */}
      <div className="space-y-3">
        <a
          href={`mailto:${CONTACTS.email}`}
          className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group"
        >
          <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
            <Mail size={16} />
          </span>
          <span>{CONTACTS.email}</span>
        </a>
        <div className="flex items-center gap-3 text-gray-400">
          <span className="w-8 h-8 shrink-0 rounded-lg bg-white/5 flex items-center justify-center">
            <MapPin size={16} />
          </span>
          <span>{CONTACTS.fullAddress}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-400">
          <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
            <Clock size={16} />
          </span>
          <span>{CONTACTS.workHours}</span>
        </div>
      </div>
    </div>
  )
}
