import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { categoryService } from '../services/categoryService'
import ImageUploader from '../components/ImageUploader'
import { generateSlug } from '../utils/generateSlug'
import toast from 'react-hot-toast'

export default function CategoryEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = !id
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '', slug: '', description: '', image_url: '', parent_id: null, active: 1,
  })

  useEffect(() => {
    if (!isNew) {
      categoryService.getById(id)
        .then(data => setForm(data))
        .catch(() => toast.error('Категория не найдена'))
        .finally(() => setLoading(false))
    }
  }, [id, isNew])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleNameChange = (name) => {
    set('name', name)
    if (isNew) set('slug', generateSlug(name))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name || !form.slug) return toast.error('Заполните название и slug')
    setSaving(true)
    try {
      if (isNew) {
        await categoryService.create(form)
        toast.success('Категория создана')
      } else {
        await categoryService.update(id, form)
        toast.success('Категория обновлена')
      }
      navigate('/admin/categories')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" /></div>

  return (
    <div className="max-w-2xl">
      <button onClick={() => navigate('/admin/categories')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft size={16} /> Назад к категориям
      </button>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{isNew ? 'Новая категория' : 'Редактирование категории'}</h1>

      <form onSubmit={handleSave} className="space-y-6 bg-white rounded-xl border border-gray-200 p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
          <input type="text" value={form.name} onChange={e => handleNameChange(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input type="text" value={form.slug} onChange={e => set('slug', e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
          <textarea value={form.description || ''} onChange={e => set('description', e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none" />
        </div>

        <ImageUploader
          label="Изображение"
          value={form.image_url}
          onChange={url => set('image_url', url)}
          type="categories"
        />

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={!!form.active} onChange={e => set('active', e.target.checked ? 1 : 0)} className="rounded" />
          <span className="text-sm text-gray-700">Активна</span>
        </label>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50">
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
          <button type="button" onClick={() => navigate('/admin/categories')} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
            Отмена
          </button>
        </div>
      </form>
    </div>
  )
}
