import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { bannerService } from '../services/bannerService'
import ImageUploader from '../components/ImageUploader'
import toast from 'react-hot-toast'

export default function BannerEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = !id
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    image_desktop: '',
    image_mobile: '',
    alt: '',
    link: '',
    active: 1,
  })

  useEffect(() => {
    if (!isNew) {
      bannerService.getById(id)
        .then(data => setForm(data))
        .catch(() => toast.error('Баннер не найден'))
        .finally(() => setLoading(false))
    }
  }, [id, isNew])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.image_desktop || !form.image_mobile) {
      return toast.error('Загрузите оба изображения')
    }
    setSaving(true)
    try {
      if (isNew) {
        await bannerService.create(form)
        toast.success('Баннер создан')
      } else {
        await bannerService.update(id, form)
        toast.success('Баннер обновлён')
      }
      navigate('/admin/banners')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" /></div>

  return (
    <div className="max-w-2xl">
      <button onClick={() => navigate('/admin/banners')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft size={16} /> Назад к баннерам
      </button>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{isNew ? 'Новый баннер' : 'Редактирование баннера'}</h1>

      <form onSubmit={handleSave} className="space-y-6 bg-white rounded-xl border border-gray-200 p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
          <input
            type="text"
            value={form.title || ''}
            onChange={(e) => set('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ImageUploader
            label="Десктоп (1920x600)"
            value={form.image_desktop}
            onChange={(url) => set('image_desktop', url)}
            type="banners"
          />
          <ImageUploader
            label="Мобильный (768x400)"
            value={form.image_mobile}
            onChange={(url) => set('image_mobile', url)}
            type="banners"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Alt-текст</label>
          <input
            type="text"
            value={form.alt || ''}
            onChange={(e) => set('alt', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ссылка</label>
          <input
            type="text"
            value={form.link || ''}
            onChange={(e) => set('link', e.target.value)}
            placeholder="/catalog/smartphones"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={!!form.active}
            onChange={(e) => set('active', e.target.checked ? 1 : 0)}
            className="rounded"
          />
          <span className="text-sm text-gray-700">Активен</span>
        </label>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
          >
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/banners')}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  )
}
