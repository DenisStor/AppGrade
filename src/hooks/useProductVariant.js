import { useState, useEffect, useMemo, useCallback } from 'react'
import { getAvailableColors, getAvailableMemory, getAvailableSims, getAvailableDimensionValues } from '../utils/product'

export function useProductVariant(product) {
  const [selections, setSelections] = useState({})

  const dimensions = useMemo(() => product?.dimensions || [], [product])

  // Legacy-совместимые списки
  const colors = useMemo(() => getAvailableColors(product), [product])
  const memoryOptions = useMemo(() => getAvailableMemory(product), [product])
  const simOptions = useMemo(() => getAvailableSims(product), [product])

  // Инициализация из первого inStock варианта
  useEffect(() => {
    if (!product?.variants?.length) return

    const firstInStock = product.variants.find((v) => v.inStock) || product.variants[0]
    const initial = {}

    if (dimensions.length > 0) {
      for (const dim of dimensions) {
        initial[dim.key] = firstInStock.attributes?.[dim.key]?.id || null
      }
    } else {
      // Legacy fallback
      if (firstInStock.color) initial.color = firstInStock.color.id
      if (firstInStock.memory) initial.memory = String(firstInStock.memory)
      if (firstInStock.sim) initial.sim = firstInStock.sim.id
    }

    setSelections(initial)
  }, [product, dimensions])

  // Текущий вариант
  const currentVariant = useMemo(() => {
    if (!product?.variants?.length) return null

    const keys = dimensions.length > 0
      ? dimensions.map(d => d.key)
      : Object.keys(selections)

    if (!keys.length) return product.variants[0]

    return product.variants.find((v) =>
      keys.every(key => {
        const selected = selections[key]
        if (!selected) return true
        const attrId = v.attributes?.[key]?.id
        if (attrId) return attrId === selected
        // Legacy fallback
        if (key === 'color') return v.color?.id === selected
        if (key === 'memory') return String(v.memory) === selected
        if (key === 'sim') return v.sim?.id === selected
        return true
      })
    ) || null
  }, [product, selections, dimensions])

  // Установка выбранного значения с автоподбором
  const setSelection = useCallback((dimKey, valueId) => {
    if (!product?.variants?.length) return

    setSelections(prev => {
      const next = { ...prev, [dimKey]: valueId }

      // Проверяем существует ли такая комбинация
      const keys = dimensions.length > 0
        ? dimensions.map(d => d.key)
        : Object.keys(next)

      const exists = product.variants.some(v =>
        keys.every(key => {
          const sel = next[key]
          if (!sel) return true
          return v.attributes?.[key]?.id === sel
        })
      )

      if (!exists) {
        // Подбираем первый вариант с этим значением
        const fallback = product.variants.find(v =>
          v.attributes?.[dimKey]?.id === valueId
        )
        if (fallback) {
          const adjusted = {}
          for (const key of keys) {
            adjusted[key] = fallback.attributes?.[key]?.id || null
          }
          return adjusted
        }
      }

      return next
    })
  }, [product, dimensions])

  // Опции для конкретного измерения (с учётом доступности)
  const getOptionsForDimension = useCallback((dimKey) => {
    return getAvailableDimensionValues(product, dimKey)
  }, [product])

  // Legacy-совместимые геттеры
  const selectedColor = selections.color || null
  const selectedMemory = selections.memory ? Number(selections.memory) : null
  const selectedSim = selections.sim || null

  // Доступность памяти для выбранного цвета (legacy compat)
  const availableMemoryForColor = useMemo(() => {
    if (!product || !selectedColor) return []
    return product.variants
      .filter((v) => (v.attributes?.color?.id || v.color?.id) === selectedColor)
      .map((v) => ({ memory: v.memory, inStock: v.inStock }))
  }, [product, selectedColor])

  return {
    selections,
    setSelection,
    dimensions,
    getOptionsForDimension,
    currentVariant,
    // Legacy compat
    selectedColor,
    selectedMemory,
    selectedSim,
    setSelectedColor: (id) => setSelection('color', id),
    setSelectedMemory: (mem) => setSelection('memory', String(mem)),
    setSelectedSim: (id) => setSelection('sim', id),
    colors,
    memoryOptions,
    simOptions,
    availableMemoryForColor,
  }
}
