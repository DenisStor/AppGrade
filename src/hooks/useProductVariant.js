import { useState, useEffect, useMemo, useCallback } from 'react'
import { getAvailableColors, getAvailableMemory, getAvailableSims, getAvailableDimensionValues } from '../utils/product'

const isAvailable = (v) => v.stockStatus !== 'out_of_stock'

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

    const firstInStock = product.variants.find((v) => isAvailable(v)) || product.variants[0]
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

  // Хелпер: проверка совпадения атрибута варианта с выбранным значением
  const matchesAttr = useCallback((variant, key, value) => {
    if (variant.attributes?.[key]?.id === value) return true
    if (key === 'color') return variant.color?.id === value
    if (key === 'memory') return String(variant.memory) === value
    if (key === 'sim') return (variant.sim?.id || variant.attributes?.sim?.id) === value
    return false
  }, [])

  // Извлечь selections из варианта
  const extractSelections = useCallback((variant, keys) => {
    const result = {}
    for (const key of keys) {
      result[key] = variant.attributes?.[key]?.id
        || (key === 'color' && variant.color?.id)
        || (key === 'memory' && String(variant.memory))
        || (key === 'sim' && (variant.sim?.id || variant.attributes?.sim?.id))
        || null
    }
    return result
  }, [])

  // Установка выбранного значения с автоподбором
  const setSelection = useCallback((dimKey, valueId) => {
    if (!product?.variants?.length) return

    setSelections(prev => {
      const next = { ...prev, [dimKey]: valueId }

      const keys = dimensions.length > 0
        ? dimensions.map(d => d.key)
        : Object.keys(next)

      // Найти вариант с точным совпадением всех selections
      const exactMatch = product.variants.find(v =>
        keys.every(key => {
          const sel = next[key]
          if (!sel) return true
          return matchesAttr(v, key, sel)
        })
      )

      if (!exactMatch) {
        // Combo не существует — подобрать fallback (предпочитаем inStock)
        const withDim = product.variants.filter(v => matchesAttr(v, dimKey, valueId))
        const fallback = withDim.find(v => isAvailable(v)) || withDim[0]
        if (fallback) {
          return extractSelections(fallback, keys)
        }
        return next
      }

      // Combo существует, но если out_of_stock — попробовать in-stock с тем же dimKey
      if (!isAvailable(exactMatch)) {
        const inStockAlt = product.variants.find(v =>
          isAvailable(v) && matchesAttr(v, dimKey, valueId)
        )
        if (inStockAlt) {
          return extractSelections(inStockAlt, keys)
        }
      }

      return next
    })
  }, [product, dimensions, matchesAttr, extractSelections])

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

  // Доступность SIM для выбранного цвета + памяти (legacy compat)
  const availableSimsForSelection = useMemo(() => {
    if (!product?.variants) return []
    return product.variants
      .filter(v => {
        if (selectedColor && (v.attributes?.color?.id || v.color?.id) !== selectedColor) return false
        if (selectedMemory && v.memory !== selectedMemory) return false
        return true
      })
      .map(v => ({ id: v.sim?.id || v.attributes?.sim?.id, name: v.sim?.name || v.attributes?.sim?.name, inStock: v.inStock }))
      .filter(s => s.id)
  }, [product, selectedColor, selectedMemory])

  // Доступность опции dimension с учётом остальных выбранных (modern dimensions)
  const getOptionAvailability = useCallback((dimKey, optionId) => {
    if (!product?.variants) return false
    return product.variants.some(v => {
      if (v.attributes?.[dimKey]?.id !== optionId) return false
      for (const [key, val] of Object.entries(selections)) {
        if (key === dimKey || !val) continue
        if (v.attributes?.[key]?.id !== val) return false
      }
      return isAvailable(v)
    })
  }, [product, selections])

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
    availableSimsForSelection,
    getOptionAvailability,
  }
}
