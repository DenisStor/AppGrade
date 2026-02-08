import { useState, useEffect, useMemo } from 'react'
import { getAvailableColors, getAvailableMemory } from '../utils/product'

export function useProductVariant(product) {
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedMemory, setSelectedMemory] = useState(null)
  const [selectedSim, setSelectedSim] = useState(null)

  const colors = useMemo(() => getAvailableColors(product), [product])
  const memoryOptions = useMemo(() => getAvailableMemory(product), [product])

  // Инициализация выбранных опций
  useEffect(() => {
    if (product?.variants?.length) {
      const firstInStock = product.variants.find((v) => v.inStock) || product.variants[0]
      setSelectedColor(firstInStock.color.id)
      setSelectedMemory(firstInStock.memory)
    }
    if (product?.simOptions?.length) {
      setSelectedSim(product.simOptions[0].id)
    }
  }, [product])

  // Текущий вариант
  const currentVariant = useMemo(() => {
    if (!product) return null
    // Для товаров без памяти ищем только по цвету
    if (memoryOptions.length === 0) {
      return product.variants.find((v) => v.color.id === selectedColor)
    }
    return product.variants.find(
      (v) => v.color.id === selectedColor && v.memory === selectedMemory
    )
  }, [product, selectedColor, selectedMemory, memoryOptions])

  // Доступность памяти для выбранного цвета
  const availableMemoryForColor = useMemo(() => {
    if (!product || !selectedColor) return []
    return product.variants
      .filter((v) => v.color.id === selectedColor)
      .map((v) => ({ memory: v.memory, inStock: v.inStock }))
  }, [product, selectedColor])

  // Смена цвета с автоподбором памяти
  const handleColorChange = (colorId) => {
    setSelectedColor(colorId)
    const variantsForColor = product.variants.filter((v) => v.color.id === colorId)
    if (variantsForColor.length > 0 && !variantsForColor.find((v) => v.memory === selectedMemory)) {
      setSelectedMemory(variantsForColor[0].memory)
    }
  }

  return {
    selectedColor,
    selectedMemory,
    selectedSim,
    setSelectedColor: handleColorChange,
    setSelectedMemory,
    setSelectedSim,
    currentVariant,
    colors,
    memoryOptions,
    availableMemoryForColor,
  }
}
