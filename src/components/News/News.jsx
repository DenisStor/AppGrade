import { SectionHeader } from '../ui/SectionHeader'
import { SectionDivider } from '../ui/SectionDivider'
import { NewsCard } from './NewsCard'
import { news } from '../../data/news'

export function News() {
  return (
    <section className="pb-14 md:pb-20">
      <SectionDivider className="mb-14 md:mb-20" />
      <div className="section-padding">
        <SectionHeader
          title="Последнее из блога"
          linkHref="/blog"
          className="mb-10 md:mb-12"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {news.map((item) => (
            <NewsCard key={item.id} {...item} />
          ))}
        </div>
      </div>
    </section>
  )
}
