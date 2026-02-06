import { lazy, Suspense } from 'react'
import { useParams } from 'react-router-dom'
import InfoLayout from '../../layouts/InfoLayout'
import { INFO_PAGES } from '../../data/infoPages'

const NotFoundPage = lazy(() => import('../NotFoundPage'))

function PolicyContent({ content }) {
  return (
    <div className="text-gray-dark leading-relaxed space-y-8">
      <p className="text-gray-medium">{content.intro}</p>
      {content.sections.map((section) => (
        <div key={section.title}>
          <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
          <ul className="space-y-2">
            {section.items.map((item, i) => (
              <li key={i} className="text-gray-medium pl-4 relative before:content-['—'] before:absolute before:left-0">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default function InfoPage() {
  const { slug } = useParams()
  const page = INFO_PAGES[slug]

  if (!page) {
    return (
      <Suspense fallback={null}>
        <NotFoundPage />
      </Suspense>
    )
  }

  if (page.content) {
    return (
      <InfoLayout title={page.title} hasContent>
        <PolicyContent content={page.content} />
      </InfoLayout>
    )
  }

  return (
    <InfoLayout title={page.title}>
      <p className="text-gray-medium">Страница в разработке</p>
    </InfoLayout>
  )
}
