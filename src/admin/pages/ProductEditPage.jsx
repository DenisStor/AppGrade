import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, X, Search } from 'lucide-react'
import { productService } from '../services/productService'
import { useQuery } from '../hooks/useQuery'
import VariantMatrix from '../components/VariantMatrix'
import AdminModal from '../components/AdminModal'
import { generateSlug } from '../utils/generateSlug'
import toast from 'react-hot-toast'

const BADGE_OPTIONS = ['new', 'hit', 'sale', 'used']

export default function ProductEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = !id
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [hasMemory, setHasMemory] = useState(true)
  const [errors, setErrors] = useState({})

  // Модалки
  const [specModal, setSpecModal] = useState({ open: false, key: '', value: '', editKey: null })
  const [simModal, setSimModal] = useState({ open: false, id: '', name: '', editIndex: null })

  // Связанные товары — поиск
  const [relatedSearch, setRelatedSearch] = useState('')
  const [relatedSearchDebounced, setRelatedSearchDebounced] = useState('')
  const [relatedNames, setRelatedNames] = useState({})

  const { data: categories } = useQuery('/categories')

  // Debounced поиск связанных товаров
  useEffect(() => {
    const timer = setTimeout(() => setRelatedSearchDebounced(relatedSearch), 300)
    return () => clearTimeout(timer)
  }, [relatedSearch])

  const { data: searchResults } = useQuery(
    relatedSearchDebounced ? `/products?search=${encodeURIComponent(relatedSearchDebounced)}&limit=20` : null
  )

  const [form, setForm] = useState({
    name: '', slug: '', category_id: '', brand_id: '',
    short_description: '', description: '',
    badges: [], specs: {},
    is_used: 0, condition: '', condition_label: '', warranty: '',
    active: 1, variants: [], simOptions: [], relatedIds: [],
  })

  useEffect(() => {
    if (!isNew) {
      productService.getById(id)
        .then(data => {
          const variants = data.variants?.map(v => ({
            color_name: v.color_name,
            color_hex: v.color_hex,
            memory: v.memory,
            price: v.price,
            old_price: v.old_price,
            stock_status: v.stock_status,
            images: v.images || [],
          })) || []

          const hasAnyMemory = variants.some(v => v.memory)
          setHasMemory(hasAnyMemory)

          setForm({
            ...data,
            badges: data.badges || [],
            specs: data.specs || {},
            variants,
            simOptions: data.simOptions || [],
            relatedIds: data.relatedIds || [],
          })

          // Сохраняем имена связанных товаров
          if (data.relatedProducts?.length) {
            const names = {}
            data.relatedProducts.forEach(p => { names[p.id] = p.name })
            setRelatedNames(prev => ({ ...prev, ...names }))
          }
        })
        .catch(() => toast.error('Товар не найден'))
        .finally(() => setLoading(false))
    }
  }, [id, isNew])

  const set = useCallback((key, val) => {
    setForm(f => ({ ...f, [key]: val }))
    setErrors(e => ({ ...e, [key]: undefined }))
  }, [])

  const toggleBadge = (badge) => {
    const current = form.badges || []
    set('badges', current.includes(badge) ? current.filter(b => b !== badge) : [...current, badge])
  }

  // === Валидация ===
  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Укажите название'
    if (!form.slug.trim()) e.slug = 'Укажите slug'
    if (!form.category_id) e.category_id = 'Выберите категорию'
    if (!form.brand_id) e.brand_id = 'Выберите бренд'
    if (!form.variants.length) {
      e.variants = 'Добавьте хотя бы один вариант'
    } else {
      const hasPrice = form.variants.some(v => v.price > 0)
      if (!hasPrice) e.variants = 'Укажите цену хотя бы у одного варианта'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // === Спеки ===
  const openSpecModal = (editKey = null) => {
    if (editKey) {
      setSpecModal({ open: true, key: editKey, value: form.specs[editKey] || '', editKey })
    } else {
      setSpecModal({ open: true, key: '', value: '', editKey: null })
    }
  }

  const saveSpec = () => {
    const { key, value, editKey } = specModal
    if (!key.trim()) return
    const newSpecs = { ...form.specs }
    if (editKey && editKey !== key.trim()) delete newSpecs[editKey]
    newSpecs[key.trim()] = value
    set('specs', newSpecs)
    setSpecModal({ open: false, key: '', value: '', editKey: null })
  }

  const removeSpec = (key) => {
    const { [key]: _, ...rest } = form.specs
    set('specs', rest)
  }

  // === SIM ===
  const openSimModal = (editIndex = null) => {
    if (editIndex !== null) {
      const s = form.simOptions[editIndex]
      setSimModal({ open: true, id: s.sim_id || s.id || '', name: s.name, editIndex })
    } else {
      setSimModal({ open: true, id: '', name: '', editIndex: null })
    }
  }

  const saveSim = () => {
    const { id: simId, name, editIndex } = simModal
    if (!name.trim()) return
    const finalId = simId.trim() || name.trim().toLowerCase().replace(/\s+/g, '-')
    const newOptions = [...form.simOptions]
    if (editIndex !== null) {
      newOptions[editIndex] = { sim_id: finalId, name: name.trim() }
    } else {
      newOptions.push({ sim_id: finalId, name: name.trim() })
    }
    set('simOptions', newOptions)
    setSimModal({ open: false, id: '', name: '', editIndex: null })
  }

  const removeSim = (i) => {
    set('simOptions', form.simOptions.filter((_, idx) => idx !== i))
  }

  // === Связанные товары ===
  const toggleRelated = (product) => {
    const ids = form.relatedIds || []
    if (ids.includes(product.id)) {
      set('relatedIds', ids.filter(rid => rid !== product.id))
    } else {
      set('relatedIds', [...ids, product.id])
      setRelatedNames(prev => ({ ...prev, [product.id]: product.name }))
    }
  }

  const removeRelated = (productId) => {
    set('relatedIds', (form.relatedIds || []).filter(rid => rid !== productId))
  }

  // === Сохранение ===
  const handleSave = async (e) => {
    e.preventDefault()
    if (!validate()) return toast.error('Исправьте ошибки в форме')
    setSaving(true)
    try {
      const payload = { ...form }
      if (isNew) {
        await productService.create(payload)
        toast.success('Товар создан')
      } else {
        await productService.update(id, payload)
        toast.success('Товар обновлён')
      }
      navigate('/admin/products')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" /></div>

  const inputClass = (field) =>
    `w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent ${errors[field] ? 'border-red-400 ring-1 ring-red-400' : 'border-gray-300'}`

  return (
    <div className="max-w-4xl">
      <button onClick={() => navigate('/admin/products')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft size={16} /> Назад к товарам
      </button>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{isNew ? 'Новый товар' : `Редактирование: ${form.name}`}</h1>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Основная информация */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Основная информация</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Название *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => { set('name', e.target.value); if (isNew) set('slug', generateSlug(e.target.value)) }}
                className={inputClass('name')}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
              <input
                type="text"
                value={form.slug}
                onChange={e => set('slug', e.target.value)}
                className={inputClass('slug')}
              />
              {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Категория *</label>
              <select
                value={form.category_id}
                onChange={e => set('category_id', Number(e.target.value))}
                className={inputClass('category_id')}
              >
                <option value="">Выберите категорию</option>
                {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {errors.category_id && <p className="text-xs text-red-500 mt-1">{errors.category_id}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Бренд *</label>
              <select
                value={form.brand_id}
                onChange={e => set('brand_id', Number(e.target.value))}
                className={inputClass('brand_id')}
              >
                <option value="">Выберите бренд</option>
                <option value={1}>Apple</option>
                <option value={2}>Samsung</option>
                <option value={3}>Dyson</option>
              </select>
              {errors.brand_id && <p className="text-xs text-red-500 mt-1">{errors.brand_id}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Краткое описание</label>
            <input
              type="text"
              value={form.short_description || ''}
              onChange={e => set('short_description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Полное описание</label>
            <textarea
              value={form.description || ''}
              onChange={e => set('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Бейджи</label>
            <div className="flex gap-2">
              {BADGE_OPTIONS.map(b => (
                <button
                  key={b}
                  type="button"
                  onClick={() => toggleBadge(b)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    form.badges?.includes(b)
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2">
            <input type="checkbox" checked={!!form.active} onChange={e => set('active', e.target.checked ? 1 : 0)} className="rounded" />
            <span className="text-sm text-gray-700">Активен</span>
          </label>
        </section>

        {/* Б/У */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={!!form.is_used} onChange={e => set('is_used', e.target.checked ? 1 : 0)} className="rounded" />
            <span className="text-sm font-semibold text-gray-900">Б/У товар</span>
          </label>
          {!!form.is_used && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Состояние</label>
                <select value={form.condition || ''} onChange={e => set('condition', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none">
                  <option value="">—</option>
                  <option value="perfect">Идеальное</option>
                  <option value="excellent">Отличное</option>
                  <option value="good">Хорошее</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Метка состояния</label>
                <input type="text" value={form.condition_label || ''} onChange={e => set('condition_label', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Гарантия</label>
                <input type="text" value={form.warranty || ''} onChange={e => set('warranty', e.target.value)} placeholder="6 месяцев" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none" />
              </div>
            </div>
          )}
        </section>

        {/* Варианты */}
        <section className={`bg-white rounded-xl border p-6 space-y-4 ${errors.variants ? 'border-red-400' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Варианты</h2>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" checked={hasMemory} onChange={e => setHasMemory(e.target.checked)} className="rounded" />
              Товар с памятью
            </label>
          </div>
          <VariantMatrix
            variants={form.variants}
            onChange={v => set('variants', v)}
            hasMemory={hasMemory}
          />
          {errors.variants && <p className="text-xs text-red-500">{errors.variants}</p>}
        </section>

        {/* SIM-опции */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">SIM-опции</h2>
            <button type="button" onClick={() => openSimModal()} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
              <Plus size={14} /> Добавить
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.simOptions.map((s, i) => (
              <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5">
                <span className="text-sm">{s.name}</span>
                <button type="button" onClick={() => openSimModal(i)} className="text-gray-400 hover:text-blue-500"><X size={12} /></button>
                <button type="button" onClick={() => removeSim(i)} className="text-gray-400 hover:text-red-500"><X size={14} /></button>
              </div>
            ))}
            {form.simOptions.length === 0 && <p className="text-sm text-gray-400">Нет SIM-опций</p>}
          </div>
        </section>

        {/* Характеристики */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Характеристики</h2>
            <button type="button" onClick={() => openSpecModal()} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
              <Plus size={14} /> Добавить
            </button>
          </div>
          {Object.keys(form.specs || {}).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(form.specs).map(([key, val]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="w-1/3 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded text-sm truncate cursor-pointer hover:bg-gray-100" onClick={() => openSpecModal(key)}>
                    {key}
                  </span>
                  <span className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded text-sm truncate cursor-pointer hover:bg-gray-100" onClick={() => openSpecModal(key)}>
                    {val}
                  </span>
                  <button type="button" onClick={() => removeSpec(key)} className="text-gray-400 hover:text-red-500">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">Нет характеристик</p>
          )}
        </section>

        {/* Связанные товары */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Связанные товары</h2>

          {/* Выбранные чипы */}
          {form.relatedIds?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.relatedIds.map(rid => (
                <div key={rid} className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1">
                  <span className="text-sm">{relatedNames[rid] || `#${rid}`}</span>
                  <button type="button" onClick={() => removeRelated(rid)} className="text-gray-400 hover:text-red-500">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Поиск */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={relatedSearch}
              onChange={e => setRelatedSearch(e.target.value)}
              placeholder="Поиск товаров..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
          {relatedSearchDebounced && searchResults?.items?.length > 0 && (
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
              {searchResults.items.filter(p => String(p.id) !== String(id)).map(p => (
                <label key={p.id} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0">
                  <input
                    type="checkbox"
                    checked={form.relatedIds?.includes(p.id)}
                    onChange={() => toggleRelated(p)}
                    className="rounded"
                  />
                  <span className="text-sm">{p.name}</span>
                  <span className="text-xs text-gray-400">{p.brand_name}</span>
                </label>
              ))}
            </div>
          )}
          {relatedSearchDebounced && !searchResults?.items?.length && (
            <p className="text-sm text-gray-400">Ничего не найдено</p>
          )}
        </section>

        {/* Кнопки */}
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
            onClick={() => navigate('/admin/products')}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            Отмена
          </button>
        </div>
      </form>

      {/* Модалка спеков */}
      <AdminModal
        open={specModal.open}
        title={specModal.editKey ? 'Редактировать характеристику' : 'Добавить характеристику'}
        onClose={() => setSpecModal(s => ({ ...s, open: false }))}
        onConfirm={saveSpec}
        confirmText={specModal.editKey ? 'Сохранить' : 'Добавить'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ключ</label>
            <input
              type="text"
              value={specModal.key}
              onChange={e => setSpecModal(s => ({ ...s, key: e.target.value }))}
              placeholder="Процессор"
              autoFocus
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Значение</label>
            <input
              type="text"
              value={specModal.value}
              onChange={e => setSpecModal(s => ({ ...s, value: e.target.value }))}
              placeholder="Apple A18 Pro"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
        </div>
      </AdminModal>

      {/* Модалка SIM */}
      <AdminModal
        open={simModal.open}
        title={simModal.editIndex !== null ? 'Редактировать SIM-опцию' : 'Добавить SIM-опцию'}
        onClose={() => setSimModal(s => ({ ...s, open: false }))}
        onConfirm={saveSim}
        confirmText={simModal.editIndex !== null ? 'Сохранить' : 'Добавить'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
            <input
              type="text"
              value={simModal.name}
              onChange={e => setSimModal(s => ({ ...s, name: e.target.value }))}
              placeholder="nanoSIM + eSIM"
              autoFocus
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID (необязательно)</label>
            <input
              type="text"
              value={simModal.id}
              onChange={e => setSimModal(s => ({ ...s, id: e.target.value }))}
              placeholder="Авто-генерация из названия"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
        </div>
      </AdminModal>
    </div>
  )
}
