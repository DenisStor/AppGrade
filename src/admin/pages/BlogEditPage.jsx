import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { blogService } from '../services/blogService'
import { generateSlug } from '../utils/generateSlug'
import ImageUploader from '../components/ImageUploader'
import RichTextEditor from '../components/RichTextEditor'
import toast from 'react-hot-toast'

export default function BlogEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = !id
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '', slug: '', image_url: '', excerpt: '', content: '', status: 'draft',
  })

  useEffect(() => {
    if (!isNew) {
      blogService.getById(id)
        .then(data => setForm(data))
        .catch(() => toast.error('Статья не найдена'))
        .finally(() => setLoading(false))
    }
  }, [id, isNew])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.title || !form.slug) return toast.error('Заполните заголовок и slug')
    setSaving(true)
    try {
      if (isNew) {
        await blogService.create(form)
        toast.success('Статья создана')
      } else {
        await blogService.update(id, form)
        toast.success('Статья обновлена')
      }
      navigate('/admin/blog')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" /></div>

  return (
    <div className="max-w-4xl">
      <button onClick={() => navigate('/admin/blog')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft size={16} /> Назад к блогу
      </button>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{isNew ? 'Новая статья' : 'Редактирование статьи'}</h1>

      <form onSubmit={handleSave} className="space-y-6">
        <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Заголовок *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => { set('title', e.target.value); if (isNew) set('slug', generateSlug(e.target.value)) }}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
              <input
                type="text"
                value={form.slug}
                onChange={e => set('slug', e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Краткое описание</label>
            <textarea
              value={form.excerpt || ''}
              onChange={e => set('excerpt', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
            />
          </div>

          <ImageUploader
            label="Обложка"
            value={form.image_url}
            onChange={url => set('image_url', url)}
            type="blog"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
            <select
              value={form.status}
              onChange={e => set('status', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
            >
              <option value="draft">Черновик</option>
              <option value="published">Опубликовано</option>
            </select>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Содержание</label>
          <RichTextEditor value={form.content} onChange={val => set('content', val)} />
        </section>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50">
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
          <button type="button" onClick={() => navigate('/admin/blog')} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
            Отмена
          </button>
        </div>
      </form>
    </div>
  )
}
