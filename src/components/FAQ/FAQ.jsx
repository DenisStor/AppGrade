import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { SectionDivider } from '../ui/SectionDivider'
import { FAQ_ITEMS } from '../../data/faq'

function FAQItem({ icon: Icon, question, answer, isOpen, onToggle }) {
  return (
    <div className="relative overflow-hidden rounded-3xl" data-open={isOpen || undefined}>
      {/* Фоновые слои */}
      <div className="absolute inset-0 bg-gray-light transition-opacity duration-300 opacity-100 data-[open]:opacity-0" data-open={isOpen || undefined} />
      <div className="absolute inset-0 bg-gray-dark transition-opacity duration-300 opacity-0 data-[open]:opacity-100" data-open={isOpen || undefined} />

      {/* Декоративное свечение */}
      <div
        className="absolute top-0 right-0 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl transition-opacity duration-300 pointer-events-none opacity-0 data-[open]:opacity-100"
        data-open={isOpen || undefined}
      />

      {/* Контент */}
      <div className="relative">
        <button
          onClick={onToggle}
          className="w-full px-6 py-5 lg:px-8 lg:py-6 flex items-center gap-4 text-left cursor-pointer group"
        >
          {/* Иконка */}
          <div
            className={`w-10 h-10 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
              isOpen
                ? 'bg-white/10 shadow-none'
                : 'bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)]'
            }`}
          >
            <Icon
              className={`w-5 h-5 lg:w-6 lg:h-6 transition-colors duration-300 ${
                isOpen ? 'text-white' : 'text-gray-dark'
              }`}
            />
          </div>

          {/* Вопрос */}
          <span
            className={`flex-1 text-lg lg:text-xl font-semibold transition-colors duration-300 ${
              isOpen ? 'text-white' : 'text-gray-dark'
            }`}
          >
            {question}
          </span>

          {/* Кнопка +/- */}
          <div
            className={`w-9 h-9 lg:w-10 lg:h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
              isOpen
                ? 'bg-white text-gray-dark rotate-180'
                : 'bg-gray-200 text-gray-medium rotate-0'
            }`}
          >
            {isOpen ? (
              <Minus className="w-4 h-4 lg:w-5 lg:h-5" strokeWidth={2.5} />
            ) : (
              <Plus className="w-4 h-4 lg:w-5 lg:h-5" strokeWidth={2.5} />
            )}
          </div>
        </button>

        {/* Ответ */}
        <div
          className={`grid transition-all duration-300 ease-out ${
            isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <p className="px-6 pb-6 lg:px-8 lg:pb-8 pl-[4.5rem] lg:pl-[5.25rem] text-white/80 text-base lg:text-lg leading-relaxed">
              {answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function FAQ() {
  const [openId, setOpenId] = useState(null)

  const handleToggle = (id) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <section className="pb-14 md:pb-20">
      <SectionDivider className="mb-14 md:mb-20" />
      <div className="section-padding">
        {/* Заголовок */}
        <div className="mb-10 lg:mb-14">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3 block">
            Ответы на вопросы
          </span>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-dark">
            Часто задаваемые вопросы
          </h2>
        </div>

        {/* Список */}
        <div className="flex flex-col gap-3">
          {FAQ_ITEMS.map((item) => (
            <FAQItem
              key={item.id}
              icon={item.icon}
              question={item.question}
              answer={item.answer}
              isOpen={openId === item.id}
              onToggle={() => handleToggle(item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
