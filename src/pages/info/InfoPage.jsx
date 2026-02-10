import { lazy, Suspense } from 'react'
import { useParams } from 'react-router-dom'
import InfoLayout from '../../layouts/InfoLayout'
import { usePageTitle } from '../../hooks/usePageTitle'
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
              <li key={i} className="text-gray-medium flex gap-2">
                <span className="shrink-0 text-gray-medium/60">—</span>
                <span>{item}</span>
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

  usePageTitle(page ? `${page.title} — APPGRADE` : null)

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
