import { Link, useParams } from 'react-router-dom'
import { usePageTitle } from '../../hooks/usePageTitle'
import { Breadcrumbs } from '../../components/ui/Breadcrumbs'
import { AnimatedSection } from '../../components/ui/AnimatedSection'
import { StaggeredList } from '../../components/ui/StaggeredList'
import { SectionDivider } from '../../components/ui/SectionDivider'
import { ImageWithSkeleton } from '../../components/ui/ImageWithSkeleton'
import { news } from '../../data/news'
import { PageLayout } from '../../layouts/PageLayout'

export default function BlogPostPage() {
  const { id } = useParams()
  const post = news.find(item => item.id === Number(id))

  usePageTitle(post ? `${post.title} — APPGRADE` : 'Статья не найдена — APPGRADE')

  if (!post) {
    return (
      <PageLayout className="flex-1 flex items-center justify-center">
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold text-gray-dark mb-4">Статья не найдена</h1>
          <Link to="/blog" className="text-gray-medium hover:text-gray-dark transition-colors underline">
            Вернуться в блог
          </Link>
        </div>
      </PageLayout>
    )
  }

  const otherPosts = news.filter(item => item.id !== post.id)

  return (
    <PageLayout>
      <article className="section-padding py-10 lg:py-16">
        <Breadcrumbs
          items={[
            { label: 'Блог', href: '/blog' },
            { label: post.title },
          ]}
          className="mb-8"
        />

        <AnimatedSection>
          <div className="max-w-3xl">
            <span className="text-xs text-gray-medium uppercase tracking-wider">
              {post.date}
            </span>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-dark mt-4 mb-8">
              {post.title}
            </h1>
          </div>

          <div className="aspect-[2/1] overflow-hidden rounded-2xl mb-10">
            <ImageWithSkeleton
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
              sizes="100vw"
              widths={[800, 1200]}
            />
          </div>

          {post.content && (
            <div className="max-w-3xl space-y-6">
              {post.content.map((paragraph, index) => (
                <p key={index} className="text-gray-dark text-lg leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </AnimatedSection>
      </article>

      {otherPosts.length > 0 && (
        <>
          <SectionDivider className="my-12" />
          <section className="section-padding pb-16">
            <AnimatedSection>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-dark mb-8">
                Другие статьи
              </h2>
            </AnimatedSection>
            <StaggeredList className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {otherPosts.map((item) => (
                <Link
                  key={item.id}
                  to={`/blog/${item.id}`}
                  className="block group"
                >
                  <div className="aspect-[2/1] overflow-hidden rounded-card mb-4">
                    <ImageWithSkeleton
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      widths={[400, 800]}
                    />
                  </div>
                  <span className="text-xs text-gray-medium uppercase tracking-wider">
                    {item.date}
                  </span>
                  <h3 className="font-semibold text-xl text-gray-dark mt-2 group-hover:text-gray-600 transition-colors">
                    {item.title}
                  </h3>
                </Link>
              ))}
            </StaggeredList>
          </section>
        </>
      )}
    </PageLayout>
  )
}
