import { useParams, Navigate } from 'react-router-dom'
import InfoLayout from '../../layouts/InfoLayout'
import { INFO_PAGES } from '../../data/infoPages'

export default function InfoPage() {
  const { slug } = useParams()
  const page = INFO_PAGES[slug]

  if (!page) {
    return <Navigate to="/" replace />
  }

  return (
    <InfoLayout title={page.title}>
      <p className="text-gray-medium">Страница в разработке</p>
    </InfoLayout>
  )
}
