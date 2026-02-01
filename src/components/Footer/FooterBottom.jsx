import { Link } from 'react-router-dom'
import { COMPANY } from '../../data/config'

export function FooterBottom() {
  return (
    <div className="relative">
      {/* Градиентный разделитель */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="pt-6 pb-8">
        {/* Юридическая информация */}
        <div className="mb-6 text-gray-600 text-xs leading-relaxed">
          <p className="mb-2">
            Все права на любые материалы, опубликованные на сайте, защищены в соответствии с российским и международным законодательством об авторском праве и смежных правах.
          </p>
          <p className="mb-2">
            {COMPANY.legalName} &nbsp;·&nbsp; ИНН: {COMPANY.inn} &nbsp;·&nbsp; ОГРНИП: {COMPANY.ogrnip}
          </p>
          <p>
            Сайт не является публичной офертой, а носит информационный характер.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {COMPANY.year} {COMPANY.name}. Все права защищены.
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-2 text-sm">
            <Link
              to="/privacy"
              className="text-gray-500 hover:text-gray-300 transition-colors"
            >
              Политика конфиденциальности
            </Link>
            <Link
              to="/terms"
              className="text-gray-500 hover:text-gray-300 transition-colors"
            >
              Пользовательское соглашение
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
