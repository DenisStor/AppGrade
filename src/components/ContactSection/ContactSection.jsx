import { useState } from 'react'
import { User, Phone, ChevronDown } from 'lucide-react'
import { Button } from '../ui/Button'

const interestOptions = [
  'iPhone',
  'iPad',
  'Mac',
  'Apple Watch',
  'AirPods',
  'Аксессуары',
  'Другое'
]

export function ContactSection() {
  const [interest, setInterest] = useState('')
  const [agreed, setAgreed] = useState(false)

  return (
    <section className="py-10 md:py-14">
      <div className="mx-4 lg:mx-8 border-t border-gray-300 mb-8" />
      <div className="px-4 md:px-6">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-dark mb-8">
          Свяжитесь с нами
        </h2>
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Яндекс карта */}
          <div className="h-[350px] lg:h-auto min-h-[400px]">
            <iframe
              src="https://yandex.ru/map-widget/v1/?z=12&ol=biz&oid=204645025784"
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
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ваше имя"
                  className="w-full pl-12 pr-4 py-3 bg-gray-dark border border-gray-600 text-white placeholder:text-gray-400 focus:outline-none focus:border-white"
                />
              </div>

              {/* Поле телефона */}
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  placeholder="Телефон"
                  className="w-full pl-12 pr-4 py-3 bg-gray-dark border border-gray-600 text-white placeholder:text-gray-400 focus:outline-none focus:border-white"
                />
              </div>

              {/* Дропдаун "Что интересует?" */}
              <div className="relative">
                <select
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-600 focus:outline-none focus:border-white appearance-none bg-gray-dark text-white cursor-pointer"
                >
                  <option value="" disabled>Что интересует?</option>
                  {interestOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              {/* Чекбокс согласия */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-5 h-5 mt-0.5 accent-white cursor-pointer"
                />
                <span className="text-sm text-gray-300">
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
