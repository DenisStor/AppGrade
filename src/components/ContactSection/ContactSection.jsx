import { useState, useCallback } from 'react'
import { Phone, MapPin, Clock, ArrowRight } from 'lucide-react'
import { CONTACTS } from '../../data/config'
import { api } from '../../services/api'
import { useToast } from '../../hooks/useToast'

export function ContactSection() {
  const [agreed, setAgreed] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    if (!agreed) return
    setIsLoading(true)
    try {
      await api.submitContactForm({ name, phone })
      toast('Заявка отправлена! Мы скоро свяжемся с вами', 'success')
      setName('')
      setPhone('')
      setAgreed(false)
    } catch {
      toast('Ошибка отправки. Попробуйте позже', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [name, phone, agreed, toast])

  return (
    <section className="lg:min-h-[400px]">
      <div className="grid lg:grid-cols-[55%_45%]">
        {/* Левая часть — Карта */}
        <div className="h-[250px] lg:h-auto lg:min-h-[400px] order-2 lg:order-1">
          <iframe
            src={`https://yandex.ru/map-widget/v1/?z=14&ol=biz&oid=${CONTACTS.mapId}`}
            width="100%"
            height="100%"
            frameBorder="0"
            title="Наш адрес"
            className="w-full h-full"
            style={{ filter: 'grayscale(100%) contrast(1.1) brightness(0.85)' }}
          />
        </div>

        {/* Правая часть — Тёмный фон */}
        <div className="bg-[#111111] p-6 md:p-8 lg:p-10 flex flex-col justify-center order-1 lg:order-2">
          {/* Заголовок */}
          <h2 className="text-xl lg:text-2xl font-bold text-white tracking-[0.15em] uppercase mb-4">
            КОНТАКТЫ
          </h2>

          {/* Контактная информация — вертикально */}
          <div className="flex flex-col gap-4 mb-5">
            {/* Адрес */}
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-white/40 flex-shrink-0" strokeWidth={1.5} />
              <p className="text-sm text-white/80">{CONTACTS.fullAddress}</p>
            </div>

            {/* Телефон */}
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-white/40 flex-shrink-0" strokeWidth={1.5} />
              <a
                href={CONTACTS.phoneLink}
                className="text-sm font-semibold text-white hover:text-white/80 transition-colors"
              >
                {CONTACTS.phone}
              </a>
            </div>

            {/* Режим работы */}
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-white/40 flex-shrink-0" strokeWidth={1.5} />
              <p className="text-sm text-white/80">{CONTACTS.workHours}</p>
            </div>
          </div>

          {/* Мессенджеры */}
          <div className="flex items-center gap-2 mb-5">
            <a
              href={CONTACTS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 border border-white/20 hover:border-white/40 text-white/60 hover:text-white transition-all"
              aria-label="WhatsApp"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
            <a
              href={CONTACTS.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 border border-white/20 hover:border-white/40 text-white/60 hover:text-white transition-all"
              aria-label="Telegram"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </a>
            <a
              href={CONTACTS.vk}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 border border-white/20 hover:border-white/40 text-white/60 hover:text-white transition-all"
              aria-label="VK"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z"/>
              </svg>
            </a>
          </div>

          {/* Форма — горизонтально на desktop */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex flex-col lg:flex-row gap-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Имя"
                className="input-dark flex-1 py-3"
              />

              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Телефон"
                className="input-dark flex-1 py-3"
              />

              <button
                type="submit"
                disabled={!agreed || isLoading}
                className="w-full lg:w-auto px-6 py-3 bg-white text-black font-semibold text-sm uppercase tracking-wider hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Чекбокс под формой */}
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-3.5 h-3.5 border border-white/30 peer-checked:border-white peer-checked:bg-white transition-all flex items-center justify-center">
                  {agreed && (
                    <svg className="w-2 h-2 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-[11px] text-white/40 group-hover:text-white/60 transition-colors">
                Согласен на обработку персональных данных
              </span>
            </label>
          </form>
        </div>
      </div>
    </section>
  )
}
