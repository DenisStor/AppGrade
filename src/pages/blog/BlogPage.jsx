import { Link } from 'react-router-dom'
import { Header } from '../../components/Header/Header'
import { Footer } from '../../components/Footer/Footer'
import { Breadcrumbs } from '../../components/ui/Breadcrumbs'
import { AnimatedSection } from '../../components/ui/AnimatedSection'
import { StaggeredList } from '../../components/ui/StaggeredList'
import { ImageWithSkeleton } from '../../components/ui/ImageWithSkeleton'
import { news } from '../../data/news'

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <section className="section-padding py-10 lg:py-16">
          <Breadcrumbs
            items={[{ label: 'Блог' }]}
            className="mb-8"
          />

          <AnimatedSection>
            <h1 className="text-3xl lg:text-5xl font-bold text-gray-dark mb-4">
              Блог
            </h1>
            <p className="text-gray-medium text-lg max-w-2xl mb-10 lg:mb-14">
              Новости, советы и истории из мира Apple — от команды APPGRADE
            </p>
          </AnimatedSection>

          <StaggeredList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {news.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className="block group"
              >
                <div className="aspect-[2/1] overflow-hidden mb-4">
                  <ImageWithSkeleton
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <span className="text-xs text-gray-medium uppercase tracking-wider">
                  {post.date}
                </span>
                <h2 className="font-semibold text-xl md:text-2xl text-gray-dark mt-2 mb-2 group-hover:text-gray-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-medium text-sm leading-relaxed">
                  {post.excerpt}
                </p>
              </Link>
            ))}
          </StaggeredList>
        </section>
      </main>
      <Footer />
    </div>
  )
}
