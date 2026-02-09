import { ColorSelector } from './ColorSelector'
import { MemorySelector } from './MemorySelector'
import { SimSelector } from './SimSelector'
import { DimensionSelector } from './DimensionSelector'

export function ProductConfig({
  product,
  dimensions = [],
  selections = {},
  onSelectionChange,
  getOptionsForDimension,
  // Legacy props
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
  // Динамический рендеринг если есть dimensions
  if (dimensions.length > 0) {
    return (
      <div className="space-y-6 mb-8">
        {dimensions.map((dim) =>
          dim.type === 'color' ? (
            <ColorSelector
              key={dim.key}
              label={dim.label}
              colors={getOptionsForDimension(dim.key)}
              selected={selections[dim.key]}
              onChange={(id) => onSelectionChange(dim.key, id)}
              variants={product.variants}
            />
          ) : (
            <DimensionSelector
              key={dim.key}
              label={dim.label}
              options={getOptionsForDimension(dim.key)}
              selected={selections[dim.key]}
              onChange={(id) => onSelectionChange(dim.key, id)}
            />
          )
        )}
      </div>
    )
  }

  // Legacy fallback
  return (
    <div className="space-y-6 mb-8">
      {colors?.length > 0 && (
        <ColorSelector
          colors={colors}
          selected={selectedColor}
          onChange={onColorChange}
          variants={product.variants}
        />
      )}

      {memoryOptions?.length > 0 && (
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
