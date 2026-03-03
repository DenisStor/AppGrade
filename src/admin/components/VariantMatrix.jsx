import { useState, useCallback, useRef } from 'react'
import { Plus, X, Pencil } from 'lucide-react'
import { useImageUpload } from '../hooks/useImageUpload'
import AdminModal from './AdminModal'
import SortableImages from './SortableImages'

const STOCK_OPTIONS = [
  { value: 'in_stock', label: 'В наличии', dot: 'bg-emerald-500', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { value: 'on_order', label: 'Под заказ', dot: 'bg-amber-500', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'out_of_stock', label: 'Нет', dot: 'bg-red-500', bg: 'bg-red-50 text-red-700 border-red-200' },
]

const BULK_ACTIONS = [
  { value: 'set', label: 'Установить' },
  { value: 'increase', label: 'Увеличить на' },
  { value: 'decrease', label: 'Уменьшить на' },
]

const priceFormatter = new Intl.NumberFormat('ru-RU')

function cartesianProduct(arrays) {
  if (!arrays.length) return [[]]
  return arrays.reduce((acc, arr) =>
    acc.flatMap(combo => arr.map(item => [...combo, item])),
    [[]]
  )
}

// === PriceInput ===
function PriceInput({ value, onChange, placeholder = 'Цена', row, col }) {
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)

  const displayValue = !focused && value
    ? `${priceFormatter.format(value)} ₽`
    : ''

  return focused ? (
    <input
      ref={inputRef}
      type="number"
      min={0}
      data-price-input
      data-row={row}
      data-col={col}
      placeholder={placeholder}
      value={value || ''}
      onChange={e => onChange(Number(e.target.value))}
      onBlur={() => setFocused(false)}
      onKeyDown={e => {
        if (e.key === 'Enter' || (e.key === 'Tab' && !e.shiftKey)) {
          e.preventDefault()
          const all = [...document.querySelectorAll('[data-price-input]')]
          const curRow = Number(e.target.dataset.row)
          const curCol = Number(e.target.dataset.col)
          const activate = el => el.tagName === 'BUTTON' ? el.click() : el.focus()
          // Следующий по столбцу (тот же col, row + 1)
          const next = all.find(el =>
            Number(el.dataset.col) === curCol && Number(el.dataset.row) === curRow + 1
          )
          if (next) { activate(next); return }
          // Следующий столбец, минимальный row
          const nextColEls = all
            .filter(el => Number(el.dataset.col) > curCol)
            .sort((a, b) => Number(a.dataset.col) - Number(b.dataset.col) || Number(a.dataset.row) - Number(b.dataset.row))
          if (nextColEls.length) { activate(nextColEls[0]); return }
          e.target.blur()
        }
      }}
      autoFocus
      className="w-full px-3 py-2 border border-blue-400 rounded-lg text-sm font-medium outline-none ring-2 ring-blue-100 tabular-nums"
    />
  ) : (
    <button
      type="button"
      data-price-input
      data-row={row}
      data-col={col}
      onClick={() => setFocused(true)}
      className={`w-full px-3 py-2 border rounded-lg text-sm font-medium text-left transition-colors tabular-nums ${
        value ? 'border-gray-200 text-gray-900 hover:border-gray-400' : 'border-dashed border-gray-300 text-gray-400 hover:border-gray-400'
      }`}
    >
      {displayValue || placeholder}
    </button>
  )
}

// === StockStatusSelect ===
function StockStatusSelect({ value, onChange }) {
  const current = STOCK_OPTIONS.find(o => o.value === value) || STOCK_OPTIONS[0]

  return (
    <div className="relative">
      <span className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${current.dot}`} />
      <select
        value={value || 'in_stock'}
        onChange={e => onChange(e.target.value)}
        className={`w-full pl-7 pr-2 py-1.5 border rounded-lg text-xs font-medium appearance-none cursor-pointer outline-none ${current.bg}`}
      >
        {STOCK_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

// === DiscountBadge ===
function DiscountBadge({ price, oldPrice }) {
  if (!oldPrice || !price || oldPrice <= price) return null
  const pct = Math.round((1 - price / oldPrice) * 100)
  return (
    <span className="inline-block px-1.5 py-0.5 text-[10px] font-semibold rounded bg-orange-100 text-orange-600">
      −{pct}%
    </span>
  )
}

// === BulkToolbar ===
function BulkToolbar({ onApply }) {
  const [action, setAction] = useState('set')
  const [amount, setAmount] = useState('')
  const [unit, setUnit] = useState('rub')

  const handleApply = () => {
    const val = Number(amount)
    if (!val || val < 0) return
    onApply(action, val, unit)
    setAmount('')
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg">
      <select
        value={action}
        onChange={e => setAction(e.target.value)}
        className="px-2 py-1.5 border border-gray-300 rounded-lg text-xs font-medium bg-white outline-none cursor-pointer"
      >
        {BULK_ACTIONS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
      </select>
      <input
        type="number"
        min={0}
        value={amount}
        onChange={e => setAmount(e.target.value)}
        placeholder="0"
        className="w-28 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent tabular-nums"
      />
      <select
        value={unit}
        onChange={e => setUnit(e.target.value)}
        className="px-2 py-1.5 border border-gray-300 rounded-lg text-xs font-medium bg-white outline-none cursor-pointer"
      >
        <option value="rub">₽</option>
        <option value="pct">%</option>
      </select>
      <button
        type="button"
        onClick={handleApply}
        className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-medium hover:bg-gray-800 transition-colors whitespace-nowrap"
      >
        Применить ко всем
      </button>
    </div>
  )
}

// === VariantCell ===
function VariantCell({ variant, onUpdate, row, col }) {
  const price = variant?.price || 0
  const oldPrice = variant?.old_price || 0

  return (
    <div className="space-y-2 min-w-[160px]">
      <PriceInput
        value={price}
        onChange={val => onUpdate({ price: val })}
        placeholder="Цена"
        row={row}
        col={col * 2}
      />
      <div className="flex items-center gap-1.5">
        <PriceInput
          value={oldPrice}
          onChange={val => onUpdate({ old_price: val || null })}
          placeholder="Старая цена"
          row={row}
          col={col * 2 + 1}
        />
        <DiscountBadge price={price} oldPrice={oldPrice} />
      </div>
      <StockStatusSelect
        value={variant?.stock_status}
        onChange={val => onUpdate({ stock_status: val })}
      />
    </div>
  )
}

export default function VariantMatrix({ variants = [], onChange, dimensions = [] }) {
  const { upload, uploading } = useImageUpload()
  const [valueModal, setValueModal] = useState({
    open: false,
    dimKey: null,
    dimType: null,
    id: '',
    name: '',
    hex: '#000000',
    editId: null,
  })

  // Извлечение уникальных значений для каждого измерения
  const getDimValues = useCallback((dimKey) => {
    const values = []
    const seen = new Set()
    for (const v of variants) {
      const attr = v.attributes?.[dimKey]
      if (attr && !seen.has(attr.id)) {
        seen.add(attr.id)
        values.push(attr)
      }
    }
    return values
  }, [variants])

  // Первое измерение = строки, остальные = колонки
  const firstDim = dimensions[0] || null
  const restDims = dimensions.slice(1)

  const rowValues = firstDim ? getDimValues(firstDim.key) : []

  // Колонки — декартово произведение остальных измерений
  const restDimValues = restDims.map(d => getDimValues(d.key))
  const columnCombinations = restDims.length > 0
    ? cartesianProduct(restDimValues).map(combo => {
        const label = combo.map(v => v.name).join(' / ')
        const attrs = {}
        restDims.forEach((d, i) => { attrs[d.key] = combo[i] })
        return { label, attrs }
      })
    : []

  // Картинки привязаны к первому измерению
  const getRowImages = useCallback((rowValueId) => {
    if (!firstDim) return variants[0]?.images || []
    const first = variants.find(v => v.attributes?.[firstDim.key]?.id === rowValueId)
    return first?.images || []
  }, [variants, firstDim])

  const setRowImages = useCallback((rowValueId, images) => {
    if (!firstDim) {
      const newVariants = variants.map((v, i) =>
        i === 0 ? { ...v, images } : { ...v, images: [] }
      )
      onChange(newVariants)
      return
    }
    let firstSet = false
    const newVariants = variants.map(v => {
      if (v.attributes?.[firstDim.key]?.id === rowValueId) {
        if (!firstSet) { firstSet = true; return { ...v, images } }
        return { ...v, images: [] }
      }
      return v
    })
    onChange(newVariants)
  }, [variants, onChange, firstDim])

  const findVariant = (rowValue, colAttrs) => {
    return variants.find(v => {
      if (firstDim && v.attributes?.[firstDim.key]?.id !== rowValue?.id) return false
      for (const [key, val] of Object.entries(colAttrs || {})) {
        if (v.attributes?.[key]?.id !== val.id) return false
      }
      return true
    })
  }

  const updateVariant = (rowValue, colAttrs, updates) => {
    const newVariants = variants.map(v => {
      if (firstDim && v.attributes?.[firstDim.key]?.id !== rowValue?.id) return v
      for (const [key, val] of Object.entries(colAttrs || {})) {
        if (v.attributes?.[key]?.id !== val.id) return v
      }
      return { ...v, ...updates }
    })
    onChange(newVariants)
  }

  // Построить все комбинации вариантов из значений измерений
  const rebuildVariants = (dimValueArrays, dims) => {
    const combos = cartesianProduct(dimValueArrays)
    return combos.map(combo => {
      const attributes = {}
      dims.forEach((d, i) => { attributes[d.key] = combo[i] })
      // Backward compat legacy fields
      const colorAttr = attributes.color
      const memAttr = attributes.memory
      const simAttr = attributes.sim
      return {
        color_name: colorAttr?.name || 'Default',
        color_hex: colorAttr?.hex || '#000000',
        memory: memAttr ? Number(memAttr.id) : null,
        sim_id: simAttr?.id || null,
        sim_name: simAttr?.name || null,
        attributes,
        price: 0,
        old_price: null,
        stock_status: 'in_stock',
        images: [],
      }
    })
  }

  // === Bulk-операция над ценами ===
  const handleBulkApply = (action, amount, unit) => {
    const newVariants = variants.map(v => {
      const currentPrice = v.price || 0
      let newPrice
      if (action === 'set') {
        newPrice = unit === 'pct' ? currentPrice : amount
      } else if (action === 'increase') {
        newPrice = unit === 'pct'
          ? Math.round(currentPrice * (1 + amount / 100))
          : currentPrice + amount
      } else {
        newPrice = unit === 'pct'
          ? Math.round(currentPrice * (1 - amount / 100))
          : currentPrice - amount
      }
      return { ...v, price: Math.max(0, Math.round(newPrice)) }
    })
    onChange(newVariants)
  }

  // === Модалка значения ===
  const openValueModal = (dim, editId = null) => {
    if (editId) {
      const val = getDimValues(dim.key).find(v => v.id === editId)
      setValueModal({
        open: true, dimKey: dim.key, dimType: dim.type,
        id: val.id, name: val.name, hex: val.hex || '#000000', editId,
      })
    } else {
      setValueModal({
        open: true, dimKey: dim.key, dimType: dim.type,
        id: '', name: '', hex: '#000000', editId: null,
      })
    }
  }

  const saveValue = () => {
    const { dimKey, dimType, id: rawId, name, hex, editId } = valueModal
    if (!name.trim()) return

    const newVal = dimType === 'color'
      ? { id: rawId.trim() || hex.replace('#', '').toLowerCase(), name: name.trim(), hex }
      : { id: rawId.trim() || name.trim().toLowerCase().replace(/[^a-zа-яё0-9]/g, '-'), name: name.trim() }

    if (editId) {
      // Редактирование — обновляем attributes во всех вариантах
      const newVariants = variants.map(v => {
        if (v.attributes?.[dimKey]?.id !== editId) return v
        const newAttrs = { ...v.attributes, [dimKey]: newVal }
        return {
          ...v,
          attributes: newAttrs,
          ...legacyFromAttrs(newAttrs),
        }
      })
      onChange(newVariants)
    } else {
      // Добавление — генерируем новые комбинации
      const existingIds = new Set(getDimValues(dimKey).map(v => v.id))
      if (existingIds.has(newVal.id)) return

      // Собираем все значения с новым
      const allDimValues = dimensions.map(d => {
        const vals = getDimValues(d.key)
        if (d.key === dimKey) return [...vals, newVal]
        return vals.length > 0 ? vals : []
      })

      // Если какое-то измерение пустое (кроме текущего), пропускаем
      if (allDimValues.some(arr => arr.length === 0)) {
        // Просто добавляем один вариант с этим значением
        const attrs = {}
        dimensions.forEach((d, i) => {
          if (d.key === dimKey) attrs[d.key] = newVal
          else {
            const vals = allDimValues[i]
            if (vals.length > 0) attrs[d.key] = vals[0]
          }
        })
        onChange([...variants, {
          ...legacyFromAttrs(attrs),
          attributes: attrs,
          price: 0, old_price: null, stock_status: 'in_stock', images: [],
        }])
      } else {
        // Генерируем только новые комбинации (с новым значением)
        const otherDimValues = dimensions
          .filter(d => d.key !== dimKey)
          .map(d => getDimValues(d.key))

        const otherCombos = otherDimValues.length > 0
          ? cartesianProduct(otherDimValues)
          : [[]]

        const newVars = otherCombos.map(combo => {
          const attrs = { [dimKey]: newVal }
          const otherDims = dimensions.filter(d => d.key !== dimKey)
          otherDims.forEach((d, i) => { attrs[d.key] = combo[i] })
          return {
            ...legacyFromAttrs(attrs),
            attributes: attrs,
            price: 0, old_price: null, stock_status: 'in_stock', images: [],
          }
        })
        onChange([...variants, ...newVars])
      }
    }
    setValueModal(s => ({ ...s, open: false }))
  }

  const removeValue = (dimKey, valueId) => {
    onChange(variants.filter(v => v.attributes?.[dimKey]?.id !== valueId))
  }

  // === Загрузка картинок ===
  const handleMultiUpload = async (rowValueId, files) => {
    const urls = []
    for (const file of files) {
      const url = await upload(file, 'products')
      if (url) urls.push(url)
    }
    if (urls.length) {
      const current = getRowImages(rowValueId)
      setRowImages(rowValueId, [...current, ...urls])
    }
  }

  const hasVariants = variants.length > 0

  return (
    <div className="space-y-4">
      {/* Значения каждого измерения */}
      {dimensions.map(dim => (
        <div key={dim.key}>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700">{dim.label}</h4>
            <button type="button" onClick={() => openValueModal(dim)} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
              <Plus size={14} /> Добавить
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {getDimValues(dim.key).map(val => (
              <div key={val.id} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5">
                {dim.type === 'color' && (
                  <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: val.hex }} />
                )}
                <span className="text-sm">{val.name}</span>
                <button type="button" onClick={() => openValueModal(dim, val.id)} className="text-gray-400 hover:text-blue-500">
                  <Pencil size={12} />
                </button>
                <button type="button" onClick={() => removeValue(dim.key, val.id)} className="text-gray-400 hover:text-red-500">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Bulk-тулбар */}
      {hasVariants && <BulkToolbar onApply={handleBulkApply} />}

      {/* Матрица вариантов */}
      {firstDim && rowValues.length > 0 && (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-medium text-gray-500 sticky left-0 bg-gray-50 z-10 min-w-[140px]">
                  {firstDim.label}
                </th>
                {columnCombinations.length > 0 ? (
                  columnCombinations.map((col, i) => (
                    <th key={i} className="px-3 py-3 text-center font-medium text-gray-500 whitespace-nowrap">
                      {col.label}
                    </th>
                  ))
                ) : (
                  <th className="px-3 py-3 text-center font-medium text-gray-500">Цена / Статус</th>
                )}
              </tr>
            </thead>
            <tbody>
              {rowValues.map((rowVal, rowIdx) => (
                <tr key={rowVal.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 align-top sticky left-0 bg-white z-10">
                    <div className="flex items-center gap-2">
                      {firstDim.type === 'color' && (
                        <div className="w-5 h-5 rounded-full border border-gray-300 shrink-0" style={{ backgroundColor: rowVal.hex }} />
                      )}
                      <span className="font-medium text-gray-900">{rowVal.name}</span>
                    </div>
                  </td>
                  {columnCombinations.length > 0 ? (
                    columnCombinations.map((col, colIdx) => {
                      const v = findVariant(rowVal, col.attrs)
                      return (
                        <td key={colIdx} className="px-3 py-3 align-top">
                          <VariantCell
                            variant={v}
                            onUpdate={(updates) => updateVariant(rowVal, col.attrs, updates)}
                            row={rowIdx}
                            col={colIdx}
                          />
                        </td>
                      )
                    })
                  ) : (
                    <td className="px-3 py-3 align-top">
                      <VariantCell
                        variant={findVariant(rowVal, {})}
                        onUpdate={(updates) => updateVariant(rowVal, {}, updates)}
                        row={rowIdx}
                        col={0}
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Нет измерений — один вариант */}
      {dimensions.length === 0 && variants.length > 0 && (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-3 py-3 text-center font-medium text-gray-500">Цена / Статус</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-100">
                <td className="px-3 py-3 align-top">
                  <VariantCell
                    variant={variants[0]}
                    onUpdate={(updates) => onChange([{ ...variants[0], ...updates }])}
                    row={0}
                    col={0}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Изображения */}
      {firstDim && rowValues.length > 0 && (
        <div className="space-y-3 border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-700">Изображения</h4>
          {rowValues.map(rowVal => (
            <div key={rowVal.id} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                {firstDim.type === 'color' && (
                  <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: rowVal.hex }} />
                )}
                <span className="text-sm font-medium">{rowVal.name}</span>
              </div>
              <SortableImages
                images={getRowImages(rowVal.id)}
                onImagesChange={(imgs) => setRowImages(rowVal.id, imgs)}
                onUpload={(files) => handleMultiUpload(rowVal.id, files)}
                uploading={uploading}
              />
            </div>
          ))}
        </div>
      )}

      {/* Нет первого измерения — один блок картинок */}
      {(!firstDim || rowValues.length === 0) && variants.length > 0 && (
        <div className="space-y-3 border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-700">Изображения</h4>
          <div className="bg-gray-50 rounded-lg p-3">
            <SortableImages
              images={variants[0]?.images || []}
              onImagesChange={(imgs) => onChange([{ ...variants[0], images: imgs }])}
              onUpload={async (files) => {
                const urls = []
                for (const file of files) {
                  const url = await upload(file, 'products')
                  if (url) urls.push(url)
                }
                if (urls.length) {
                  onChange([{ ...variants[0], images: [...(variants[0]?.images || []), ...urls] }])
                }
              }}
              uploading={uploading}
            />
          </div>
        </div>
      )}

      {/* Универсальная модалка значения */}
      <AdminModal
        open={valueModal.open}
        title={valueModal.editId ? `Редактировать значение` : `Добавить значение`}
        onClose={() => setValueModal(s => ({ ...s, open: false }))}
        onConfirm={saveValue}
        confirmText={valueModal.editId ? 'Сохранить' : 'Добавить'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
            <input
              type="text"
              value={valueModal.name}
              onChange={e => setValueModal(s => ({ ...s, name: e.target.value }))}
              placeholder={valueModal.dimType === 'color' ? 'Чёрный' : '256 ГБ'}
              autoFocus
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
          {valueModal.dimType === 'color' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Цвет (HEX)</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={valueModal.hex}
                  onChange={e => setValueModal(s => ({ ...s, hex: e.target.value }))}
                  className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={valueModal.hex}
                  onChange={e => setValueModal(s => ({ ...s, hex: e.target.value }))}
                  placeholder="#000000"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-mono"
                />
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID (необязательно)</label>
            <input
              type="text"
              value={valueModal.id}
              onChange={e => setValueModal(s => ({ ...s, id: e.target.value }))}
              placeholder="Авто-генерация из названия"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
        </div>
      </AdminModal>
    </div>
  )
}

function legacyFromAttrs(attrs) {
  const result = {}
  if (attrs.color) {
    result.color_name = attrs.color.name
    result.color_hex = attrs.color.hex
  } else {
    result.color_name = 'Default'
    result.color_hex = '#000000'
  }
  result.memory = attrs.memory ? Number(attrs.memory.id) : null
  result.sim_id = attrs.sim?.id || null
  result.sim_name = attrs.sim?.name || null
  return result
}
