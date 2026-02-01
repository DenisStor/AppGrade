import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { SectionDivider } from '../ui/SectionDivider'
import { FAQ_ITEMS } from '../../data/faq'

function FAQItem({ icon: Icon, question, answer, isOpen, onToggle }) {
  return (
    <div className="relative overflow-hidden rounded-3xl">
      {/* Фоновые слои */}
      <div className="absolute inset-0 bg-gray-light transition-opacity duration-300" style={{ opacity: isOpen ? 0 : 1 }} />
      <div className="absolute inset-0 bg-gray-dark transition-opacity duration-300" style={{ opacity: isOpen ? 1 : 0 }} />

      {/* Декоративное свечение */}
      <div
        className="absolute top-0 right-0 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl transition-opacity duration-300 pointer-events-none"
        style={{ opacity: isOpen ? 1 : 0 }}
      />

      {/* Контент */}
      <div className="relative">
        <button
          onClick={onToggle}
          className="w-full px-6 py-6 lg:px-8 lg:py-7 flex items-center gap-5 text-left cursor-pointer group"
        >
          {/* Иконка */}
          <div
            className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
            style={{
              backgroundColor: isOpen ? 'rgba(255,255,255,0.1)' : '#fff',
              boxShadow: isOpen ? 'none' : '0 4px 12px rgba(0,0,0,0.08)',
            }}
          >
            <Icon
              className="w-6 h-6 lg:w-7 lg:h-7 transition-colors duration-300"
              style={{ color: isOpen ? '#fff' : '#1d1d1f' }}
            />
          </div>

          {/* Вопрос */}
          <span
            className="flex-1 text-lg lg:text-xl font-semibold transition-colors duration-300"
            style={{ color: isOpen ? '#fff' : '#1d1d1f' }}
          >
            {question}
          </span>

          {/* Кнопка +/- */}
          <div
            className="w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
            style={{
              backgroundColor: isOpen ? '#fff' : '#e5e5e5',
              color: isOpen ? '#1d1d1f' : '#6e6e73',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            {isOpen ? (
              <Minus className="w-5 h-5 lg:w-6 lg:h-6" strokeWidth={2.5} />
            ) : (
              <Plus className="w-5 h-5 lg:w-6 lg:h-6" strokeWidth={2.5} />
            )}
          </div>
        </button>

        {/* Ответ */}
        <div
          className="grid transition-all duration-300 ease-out"
          style={{
            gridTemplateRows: isOpen ? '1fr' : '0fr',
            opacity: isOpen ? 1 : 0,
          }}
        >
          <div className="overflow-hidden">
            <p className="px-6 pb-6 lg:px-8 lg:pb-8 pl-[5.5rem] lg:pl-[6.5rem] text-white/80 text-base lg:text-lg leading-relaxed">
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
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-dark">
            Часто задаваемые вопросы
          </h2>
        </div>

        {/* Список */}
        <div className="flex flex-col gap-4">
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
