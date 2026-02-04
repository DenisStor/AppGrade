import { User, Users, TrendingUp, ShieldCheck } from 'lucide-react'
import { SectionDivider } from '../ui/SectionDivider'
import aboutImage from '../../assets/about/applego.jpg'

const features = [
  {
    icon: User,
    title: 'Качество',
    description: 'Мы работаем только с оригинальной продукцией Apple с полной гарантией качества'
  },
  {
    icon: Users,
    title: 'Команда',
    description: 'Профессиональные консультанты помогут подобрать идеальное устройство для ваших задач'
  },
  {
    icon: TrendingUp,
    title: 'Развитие',
    description: 'Постоянно расширяем ассортимент и улучшаем сервис для наших клиентов'
  },
  {
    icon: ShieldCheck,
    title: 'Надежность',
    description: 'Официальная гарантия на все товары и профессиональный сервисный центр'
  }
]

export function AboutUs({ showDivider = true }) {
  return (
    <section className="pb-14 md:pb-20">
      {showDivider && <SectionDivider className="mb-14 md:mb-20" />}
      <div className="section-padding">
        {/* Верхняя часть - 2 колонки */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 mb-12 lg:mb-16">
          {/* Левая колонка - текст */}
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-dark mb-6">
              О нас
            </h2>
            <p className="text-gray-medium text-base lg:text-lg mb-4">
              AppGrade — это команда энтузиастов, которая с 2018 года помогает клиентам
              выбирать и приобретать технику Apple. Мы ценим доверие каждого покупателя
              и стремимся предоставить лучший сервис.
            </p>
            <p className="text-gray-medium text-base lg:text-lg">
              Наш магазин предлагает полный ассортимент оригинальной продукции Apple
              с официальной гарантией. Мы работаем напрямую с авторизованными
              дистрибьюторами, что гарантирует подлинность каждого устройства.
            </p>
          </div>

          {/* Правая колонка - изображение */}
          <div className="lg:order-last">
            <img
              src={aboutImage}
              alt="Магазин AppleGO"
              className="w-full h-64 lg:h-full object-cover"
            />
          </div>
        </div>

        {/* Нижняя часть - 4 карточки */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="liquid-glass p-5 lg:p-6 hover:shadow-liquid-hover hover:scale-[1.02] transition-all duration-liquid"
            >
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-dark mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-medium text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
