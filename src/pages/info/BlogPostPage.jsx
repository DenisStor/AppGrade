import { useParams } from 'react-router-dom'
import { Header } from '../../components/Header/Header'
import { Footer } from '../../components/Footer/Footer'
import { news } from '../../data/news'

export default function BlogPostPage() {
  const { id } = useParams()
  const post = news.find(item => item.id === Number(id))

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-dark mb-4">Статья не найдена</h1>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 py-20 px-6 lg:px-60">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs text-gray-medium uppercase tracking-wider">
            {post.date}
          </span>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-dark mt-4 mb-8">
            {post.title}
          </h1>
          <img
            src={post.image}
            alt={post.title}
            className="w-full aspect-[2/1] object-cover mb-8"
          />
          <p className="text-gray-medium text-lg">Страница в разработке</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
