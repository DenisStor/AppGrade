import { useState, useCallback } from 'react'
import { Plus, X, Pencil } from 'lucide-react'
import { useImageUpload } from '../hooks/useImageUpload'
import AdminModal from './AdminModal'
import SortableImages from './SortableImages'

const STOCK_OPTIONS = [
  { value: 'in_stock', label: 'В наличии' },
  { value: 'on_order', label: 'Под заказ' },
  { value: 'out_of_stock', label: 'Нет' },
]

const MEMORY_PRESETS = [64, 128, 256, 512, 1024]

export default function VariantMatrix({ variants = [], onChange, hasMemory = true }) {
  const { upload, uploading } = useImageUpload()
  const [colorModal, setColorModal] = useState({ open: false, name: '', hex: '#000000', editName: null })
  const [memoryModal, setMemoryModal] = useState({ open: false, value: '', editValue: null })

  // Извлекаем уникальные цвета и объёмы
  const colors = []
  const colorSet = new Set()
  const memories = new Set()

  for (const v of variants) {
    const key = `${v.color_name}|${v.color_hex}`
    if (!colorSet.has(key)) {
      colorSet.add(key)
      colors.push({ name: v.color_name, hex: v.color_hex })
    }
    if (v.memory) memories.add(v.memory)
  }

  const memoryList = [...memories].sort((a, b) => a - b)

  // Картинки привязаны к цвету, а не к конкретному memory-варианту
  const getColorImages = useCallback((colorName) => {
    const first = variants.find(v => v.color_name === colorName)
    return first?.images || []
  }, [variants])

  const setColorImages = useCallback((colorName, images) => {
    let firstSet = false
    const newVariants = variants.map(v => {
      if (v.color_name === colorName) {
        if (!firstSet) {
          firstSet = true
          return { ...v, images }
        }
        return { ...v, images: [] }
      }
      return v
    })
    onChange(newVariants)
  }, [variants, onChange])

  const findVariant = (colorName, memory) =>
    variants.find(v => v.color_name === colorName && (hasMemory ? v.memory === memory : true))

  const updateVariant = (colorName, memory, updates) => {
    const newVariants = variants.map(v => {
      if (v.color_name === colorName && (hasMemory ? v.memory === memory : true)) {
        return { ...v, ...updates }
      }
      return v
    })
    onChange(newVariants)
  }

  // === Модалка цвета ===
  const openColorModal = (editName = null) => {
    if (editName) {
      const c = colors.find(c => c.name === editName)
      setColorModal({ open: true, name: c.name, hex: c.hex, editName })
    } else {
      setColorModal({ open: true, name: '', hex: '#000000', editName: null })
    }
  }

  const saveColor = () => {
    const { name, hex, editName } = colorModal
    if (!name.trim()) return

    if (editName) {
      // Редактирование
      const newVariants = variants.map(v =>
        v.color_name === editName ? { ...v, color_name: name.trim(), color_hex: hex } : v
      )
      onChange(newVariants)
    } else {
      // Добавление
      if (colorSet.has(`${name.trim()}|${hex}`)) return
      if (hasMemory && memoryList.length > 0) {
        onChange([
          ...variants,
          ...memoryList.map(mem => ({
            color_name: name.trim(), color_hex: hex, memory: mem,
            price: 0, old_price: null, stock_status: 'in_stock', images: [],
          })),
        ])
      } else {
        onChange([
          ...variants,
          { color_name: name.trim(), color_hex: hex, memory: null, price: 0, old_price: null, stock_status: 'in_stock', images: [] },
        ])
      }
    }
    setColorModal({ open: false, name: '', hex: '#000000', editName: null })
  }

  const removeColor = (colorName) => {
    onChange(variants.filter(v => v.color_name !== colorName))
  }

  // === Модалка памяти ===
  const openMemoryModal = (editValue = null) => {
    setMemoryModal({ open: true, value: editValue ? String(editValue) : '', editValue })
  }

  const saveMemory = () => {
    const mem = Number(memoryModal.value)
    if (!mem || mem <= 0) return

    const { editValue } = memoryModal
    if (editValue) {
      // Редактирование
      const newVariants = variants.map(v =>
        v.memory === editValue ? { ...v, memory: mem } : v
      )
      onChange(newVariants)
    } else {
      // Добавление
      if (memories.has(mem)) return
      const newVariants = [...variants]
      for (const c of colors) {
        newVariants.push({
          color_name: c.name, color_hex: c.hex, memory: mem,
          price: 0, old_price: null, stock_status: 'in_stock', images: [],
        })
      }
      onChange(newVariants)
    }
    setMemoryModal({ open: false, value: '', editValue: null })
  }

  const removeMemory = (mem) => {
    onChange(variants.filter(v => v.memory !== mem))
  }

  // === Загрузка нескольких картинок ===
  const handleMultiUpload = async (colorName, files) => {
    const urls = []
    for (const file of files) {
      const url = await upload(file, 'products')
      if (url) urls.push(url)
    }
    if (urls.length) {
      const current = getColorImages(colorName)
      setColorImages(colorName, [...current, ...urls])
    }
  }

  return (
    <div className="space-y-4">
      {/* Цвета */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-700">Цвета</h4>
          <button type="button" onClick={() => openColorModal()} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
            <Plus size={14} /> Добавить цвет
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {colors.map(c => (
            <div key={c.name} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5">
              <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: c.hex }} />
              <span className="text-sm">{c.name}</span>
              <button type="button" onClick={() => openColorModal(c.name)} className="text-gray-400 hover:text-blue-500">
                <Pencil size={12} />
              </button>
              <button type="button" onClick={() => removeColor(c.name)} className="text-gray-400 hover:text-red-500">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Память */}
      {hasMemory && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700">Объёмы памяти</h4>
            <button type="button" onClick={() => openMemoryModal()} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
              <Plus size={14} /> Добавить
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {memoryList.map(m => (
              <div key={m} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5">
                <span className="text-sm">{m >= 1024 ? `${m / 1024} ТБ` : `${m} ГБ`}</span>
                <button type="button" onClick={() => openMemoryModal(m)} className="text-gray-400 hover:text-blue-500">
                  <Pencil size={12} />
                </button>
                <button type="button" onClick={() => removeMemory(m)} className="text-gray-400 hover:text-red-500">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Матрица вариантов */}
      {colors.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-3 py-2 text-left font-medium text-gray-500">Цвет</th>
                {hasMemory && memoryList.length > 0 ? (
                  memoryList.map(m => (
                    <th key={m} className="px-3 py-2 text-center font-medium text-gray-500">
                      {m >= 1024 ? `${m / 1024} ТБ` : `${m} ГБ`}
                    </th>
                  ))
                ) : (
                  <th className="px-3 py-2 text-center font-medium text-gray-500">Цена / Статус</th>
                )}
              </tr>
            </thead>
            <tbody>
              {colors.map(c => (
                <tr key={c.name} className="border-t border-gray-100">
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                    </div>
                    <SortableImages
                      images={getColorImages(c.name)}
                      onImagesChange={(imgs) => setColorImages(c.name, imgs)}
                      onUpload={(files) => handleMultiUpload(c.name, files)}
                      uploading={uploading}
                    />
                  </td>
                  {hasMemory && memoryList.length > 0 ? (
                    memoryList.map(m => {
                      const v = findVariant(c.name, m)
                      return (
                        <td key={m} className="px-2 py-2 text-center align-top">
                          <input
                            type="number"
                            placeholder="Цена"
                            value={v?.price || ''}
                            onChange={e => updateVariant(c.name, m, { price: Number(e.target.value) })}
                            className="w-full px-2 py-1 border rounded text-xs mb-1"
                          />
                          <input
                            type="number"
                            placeholder="Старая цена"
                            value={v?.old_price || ''}
                            onChange={e => updateVariant(c.name, m, { old_price: Number(e.target.value) || null })}
                            className="w-full px-2 py-1 border rounded text-xs mb-1"
                          />
                          <select
                            value={v?.stock_status || 'in_stock'}
                            onChange={e => updateVariant(c.name, m, { stock_status: e.target.value })}
                            className="w-full px-1 py-1 border rounded text-xs"
                          >
                            {STOCK_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                          </select>
                        </td>
                      )
                    })
                  ) : (
                    <td className="px-2 py-2 text-center align-top">
                      {(() => {
                        const v = findVariant(c.name, null)
                        return (
                          <div className="space-y-1">
                            <input
                              type="number"
                              placeholder="Цена"
                              value={v?.price || ''}
                              onChange={e => updateVariant(c.name, null, { price: Number(e.target.value) })}
                              className="w-full px-2 py-1 border rounded text-xs"
                            />
                            <input
                              type="number"
                              placeholder="Старая цена"
                              value={v?.old_price || ''}
                              onChange={e => updateVariant(c.name, null, { old_price: Number(e.target.value) || null })}
                              className="w-full px-2 py-1 border rounded text-xs"
                            />
                            <select
                              value={v?.stock_status || 'in_stock'}
                              onChange={e => updateVariant(c.name, null, { stock_status: e.target.value })}
                              className="w-full px-1 py-1 border rounded text-xs"
                            >
                              {STOCK_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                          </div>
                        )
                      })()}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Модалка добавления/редактирования цвета */}
      <AdminModal
        open={colorModal.open}
        title={colorModal.editName ? 'Редактировать цвет' : 'Добавить цвет'}
        onClose={() => setColorModal(s => ({ ...s, open: false }))}
        onConfirm={saveColor}
        confirmText={colorModal.editName ? 'Сохранить' : 'Добавить'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
            <input
              type="text"
              value={colorModal.name}
              onChange={e => setColorModal(s => ({ ...s, name: e.target.value }))}
              placeholder="Чёрный"
              autoFocus
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Цвет (HEX)</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={colorModal.hex}
                onChange={e => setColorModal(s => ({ ...s, hex: e.target.value }))}
                className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={colorModal.hex}
                onChange={e => setColorModal(s => ({ ...s, hex: e.target.value }))}
                placeholder="#000000"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-mono"
              />
            </div>
          </div>
        </div>
      </AdminModal>

      {/* Модалка добавления/редактирования памяти */}
      <AdminModal
        open={memoryModal.open}
        title={memoryModal.editValue ? 'Редактировать объём' : 'Добавить объём памяти'}
        onClose={() => setMemoryModal(s => ({ ...s, open: false }))}
        onConfirm={saveMemory}
        confirmText={memoryModal.editValue ? 'Сохранить' : 'Добавить'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Быстрый выбор</label>
            <div className="flex flex-wrap gap-2">
              {MEMORY_PRESETS.map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMemoryModal(s => ({ ...s, value: String(m) }))}
                  disabled={!memoryModal.editValue && memories.has(m)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    Number(memoryModal.value) === m
                      ? 'bg-gray-900 text-white border-gray-900'
                      : memories.has(m) && !memoryModal.editValue
                        ? 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {m >= 1024 ? `${m / 1024} ТБ` : `${m} ГБ`}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Или введите значение (ГБ)</label>
            <input
              type="number"
              value={memoryModal.value}
              onChange={e => setMemoryModal(s => ({ ...s, value: e.target.value }))}
              min="1"
              placeholder="256"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
        </div>
      </AdminModal>
    </div>
  )
}
