import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { serviceService } from '../services/serviceService'
import { IPHONE_MODELS } from '../../data/service'
import toast from 'react-hot-toast'

export default function ServiceEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = !id
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    time: '',
    active: 1,
  })
  const [prices, setPrices] = useState({})

  useEffect(() => {
    if (!isNew) {
      serviceService.getById(id)
        .then(data => {
          setForm({ name: data.name, time: data.time, active: data.active })
          const priceMap = {}
          if (data.prices) {
            for (const p of data.prices) {
              priceMap[p.model_id] = p.price
            }
          }
          setPrices(priceMap)
        })
        .catch(() => toast.error('Услуга не найдена'))
        .finally(() => setLoading(false))
    }
  }, [id, isNew])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))
  const setPrice = (modelId, val) => setPrices(p => ({ ...p, [modelId]: val }))

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name || !form.time) {
      return toast.error('Заполните название и время')
    }
    setSaving(true)
    try {
      const data = { ...form, prices }
      if (isNew) {
        await serviceService.create(data)
        toast.success('Услуга создана')
      } else {
        await serviceService.update(id, data)
        toast.success('Услуга обновлена')
      }
      navigate('/admin/services')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" /></div>

  return (
    <div className="max-w-2xl">
      <button onClick={() => navigate('/admin/services')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft size={16} /> Назад к услугам
      </button>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{isNew ? 'Новая услуга' : 'Редактирование услуги'}</h1>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Замена экрана"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Время</label>
            <input
              type="text"
              value={form.time}
              onChange={(e) => set('time', e.target.value)}
              placeholder="от 1 часа"
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
            <span className="text-sm text-gray-700">Активна</span>
          </label>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Цены по моделям</h2>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {IPHONE_MODELS.map((model) => (
              <div key={model.id} className="flex items-center gap-3">
                <label className="text-sm text-gray-700 w-44 flex-shrink-0">{model.name}</label>
                <input
                  type="text"
                  value={prices[model.id] || ''}
                  onChange={(e) => setPrice(model.id, e.target.value)}
                  placeholder={model.id === 'all' ? 'от 4 990 ₽' : '—'}
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
            ))}
          </div>
        </div>

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
            onClick={() => navigate('/admin/services')}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  )
}
