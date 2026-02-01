import { CheckCircle, X, AlertCircle, Info } from 'lucide-react'
import { useToastStore } from '../../hooks/useToast'

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
}

const styles = {
  success: 'bg-gray-dark text-white',
  error: 'bg-red-500 text-white',
  info: 'bg-blue-500 text-white',
}

function ToastItem({ toast, onClose }) {
  const Icon = icons[toast.type] || icons.success
  const style = styles[toast.type] || styles.success

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg
        animate-toast-slide-up ${style}
      `}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="text-sm font-medium">{toast.message}</span>
      <button
        onClick={() => onClose(toast.id)}
        className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors"
        aria-label="Закрыть"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  if (!toasts.length) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  )
}
