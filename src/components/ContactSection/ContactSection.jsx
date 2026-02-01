import { useState } from 'react'
import { User, Phone, ChevronDown, HelpCircle } from 'lucide-react'
import { Button } from '../ui/Button'
import { SectionDivider } from '../ui/SectionDivider'
import { CONTACTS } from '../../data/config'

const interestOptions = [
  'iPhone',
  'iPad',
  'Mac',
  'Apple Watch',
  'AirPods',
  'Аксессуары',
  'Другое'
]

const inputClasses = `
  w-full pl-12 pr-4 py-3.5 min-h-[48px]
  bg-gray-dark border border-gray-600
  text-white placeholder:text-gray-400
  focus:outline-none focus:border-white
  focus:ring-2 focus:ring-white/20
  transition-all duration-200
  focus:scale-[1.01]
`

export function ContactSection() {
  const [interest, setInterest] = useState('')
  const [agreed, setAgreed] = useState(false)

  return (
    <section className="py-14 md:py-20">
      <SectionDivider className="mb-12" />
      <div className="section-padding">
        <h2 className="text-fluid-2xl font-bold text-gray-dark mb-12">
          Свяжитесь с нами
        </h2>
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Яндекс карта */}
          <div className="h-[280px] xs:h-[320px] sm:h-[380px] lg:h-auto lg:min-h-[400px]">
            <iframe
              src={`https://yandex.ru/map-widget/v1/?z=12&ol=biz&oid=${CONTACTS.mapId}`}
              width="100%"
              height="100%"
              frameBorder="0"
              title="Наш адрес"
            />
          </div>

          {/* Форма заявки */}
          <div className="bg-gray-dark p-8 md:p-10 flex flex-col justify-center">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
              Оставить заявку
            </h3>
            <p className="text-gray-300 mb-6">
              Менеджер перезвонит в течение 15 минут
            </p>
            <form className="space-y-4">
              {/* Поле имени */}
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors duration-200 group-focus-within:text-white" />
                <input
                  type="text"
                  placeholder="Ваше имя"
                  className={inputClasses}
                />
              </div>

              {/* Поле телефона */}
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors duration-200 group-focus-within:text-white" />
                <input
                  type="tel"
                  placeholder="Телефон"
                  className={inputClasses}
                />
              </div>

              {/* Дропдаун "Что интересует?" */}
              <div className="relative group">
                <HelpCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none transition-colors duration-200 group-focus-within:text-white" />
                <select
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className="w-full pl-12 pr-10 py-3.5 min-h-[48px] border border-gray-600 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/20 appearance-none bg-gray-dark text-white cursor-pointer transition-all duration-200 focus:scale-[1.01]"
                >
                  <option value="" disabled>Что интересует?</option>
                  {interestOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none transition-colors duration-200 group-focus-within:text-white" />
              </div>

              {/* Чекбокс согласия */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-5 h-5 mt-0.5 accent-white cursor-pointer transition-transform duration-200 hover:scale-110"
                />
                <span className="text-sm text-gray-300 transition-colors duration-200 group-hover:text-white">
                  Согласен на обработку персональных данных
                </span>
              </label>

              <Button variant="white" className="w-full" disabled={!agreed}>
                Перезвоните мне
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
