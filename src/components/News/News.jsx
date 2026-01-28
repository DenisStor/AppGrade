import { NewsCard } from './NewsCard'
import { news } from '../../data/news'

export function News() {
  return (
    <section className="py-10 md:py-14 px-4 lg:px-8">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-dark">
          Последнее из блога
        </h2>
        <a
          href="#"
          className="text-gray-dark hover:text-gray-medium font-medium transition-colors"
        >
          Смотреть все →
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {news.map((item) => (
          <NewsCard key={item.id} {...item} />
        ))}
      </div>
    </section>
  )
}
