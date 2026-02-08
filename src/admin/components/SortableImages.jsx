import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { X, Plus, GripVertical } from 'lucide-react'

function SortableImage({ id, url, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="relative w-16 h-16 group rounded-lg overflow-hidden border border-gray-200">
      <img src={typeof url === 'string' ? url : url?.url} alt="" className="w-full h-full object-cover" />
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="absolute top-0 left-0 w-full h-full cursor-grab opacity-0 group-hover:opacity-100 bg-black/20 flex items-center justify-center"
      >
        <GripVertical size={14} className="text-white" />
      </button>
      <button
        type="button"
        onClick={onRemove}
        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 flex items-center justify-center shadow-sm z-10"
      >
        <X size={10} />
      </button>
    </div>
  )
}

const getImageId = (img, i) => {
  const url = typeof img === 'string' ? img : img?.url
  return url || `img-${i}`
}

export default function SortableImages({ images = [], onImagesChange, onUpload, uploading }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const ids = images.map((img, i) => getImageId(img, i))
    const oldIndex = ids.indexOf(active.id)
    const newIndex = ids.indexOf(over.id)
    if (oldIndex !== -1 && newIndex !== -1) {
      onImagesChange(arrayMove(images, oldIndex, newIndex))
    }
  }

  const handleRemove = (index) => {
    onImagesChange(images.filter((_, i) => i !== index))
  }

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) await onUpload(files)
    e.target.value = ''
  }

  return (
    <div className="flex gap-2 flex-wrap items-center">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={images.map((img, i) => getImageId(img, i))} strategy={rectSortingStrategy}>
          {images.map((img, i) => {
            const id = getImageId(img, i)
            return (
              <SortableImage
                key={id}
                id={id}
                url={img}
                onRemove={() => handleRemove(i)}
              />
            )
          })}
        </SortableContext>
      </DndContext>
      <label className={`w-16 h-16 flex items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition-colors ${uploading ? 'border-gray-200 bg-gray-50' : 'border-gray-300 hover:border-gray-400'}`}>
        {uploading ? (
          <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        ) : (
          <Plus size={16} className="text-gray-400" />
        )}
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          disabled={uploading}
          onChange={handleFileSelect}
        />
      </label>
    </div>
  )
}
