import { ColorSelector } from './ColorSelector'
import { MemorySelector } from './MemorySelector'
import { SimSelector } from './SimSelector'

export function ProductConfig({
  product,
  colors,
  memoryOptions,
  selectedColor,
  selectedMemory,
  selectedSim,
  onColorChange,
  onMemoryChange,
  onSimChange,
  availableMemoryForColor,
}) {
  return (
    <div className="space-y-6 mb-8">
      <ColorSelector
        colors={colors}
        selected={selectedColor}
        onChange={onColorChange}
        variants={product.variants}
      />

      {memoryOptions.length > 0 && (
        <MemorySelector
          options={memoryOptions}
          selected={selectedMemory}
          onChange={onMemoryChange}
          availableForColor={availableMemoryForColor}
        />
      )}

      {product.simOptions?.length > 0 && (
        <SimSelector
          options={product.simOptions}
          selected={selectedSim}
          onChange={onSimChange}
        />
      )}
    </div>
  )
}
