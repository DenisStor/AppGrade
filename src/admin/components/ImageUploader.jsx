import { useRef, useState } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { useImageUpload } from '../hooks/useImageUpload'

export default function ImageUploader({ value, onChange, type = 'products', label, className = '' }) {
  const { upload, uploading } = useImageUpload()
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFile = async (file) => {
    if (!file) return
    const url = await upload(file, type)
    onChange?.(url)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}

      {value ? (
        <div className="relative group">
          <img
            src={value}
            alt=""
            className="w-full h-40 object-cover rounded-lg border border-gray-200"
          />
          <button
            type="button"
            onClick={() => onChange?.('')}
            className="absolute top-2 right-2 p-1 bg-white/90 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`
            flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors
            ${dragOver ? 'border-gray-400 bg-gray-50' : 'border-gray-300 hover:border-gray-400'}
            ${uploading ? 'pointer-events-none opacity-50' : ''}
          `}
        >
          {uploading ? (
            <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          ) : (
            <>
              <ImageIcon size={24} className="text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Перетащите или нажмите</span>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />
    </div>
  )
}
