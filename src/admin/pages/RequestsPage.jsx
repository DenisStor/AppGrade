import { useState } from 'react'
import { useQuery } from '../hooks/useQuery'
import { requestService } from '../services/requestService'
import DataTable from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import AdminModal from '../components/AdminModal'
import toast from 'react-hot-toast'

const TYPE_OPTIONS = [
  { value: '', label: 'Все типы' },
  { value: 'order', label: 'Заказ' },
  { value: 'quick_buy', label: 'Быстрый заказ' },
  { value: 'repair', label: 'Ремонт' },
  { value: 'contact', label: 'Обратная связь' },
]

const STATUS_OPTIONS = [
  { value: '', label: 'Все статусы' },
  { value: 'new', label: 'Новые' },
  { value: 'processing', label: 'В работе' },
  { value: 'closed', label: 'Закрытые' },
]

const TYPE_LABELS = { order: 'Заказ', quick_buy: 'Быстрый заказ', repair: 'Ремонт', contact: 'Обратная связь' }

const dispatchStatsUpdate = () => {
  window.dispatchEvent(new CustomEvent('stats-updated'))
}

const formatDateTime = (v) => {
  if (!v) return '—'
  return new Date(v).toLocaleString('ru', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function RequestsPage() {
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [notesText, setNotesText] = useState('')
  const [saving, setSaving] = useState(false)

  const qs = new URLSearchParams({ page, limit: 30 })
  if (typeFilter) qs.set('type', typeFilter)
  if (statusFilter) qs.set('status', statusFilter)

  const { data, loading, refetch } = useQuery(`/requests?${qs}`, [page, typeFilter, statusFilter])

  const handleStatusChange = async (id, status) => {
    setSaving(true)
    try {
      const updated = await requestService.update(id, { status })
      toast.success('Статус обновлён')
      refetch()
      dispatchStatsUpdate()
      if (selectedRequest?.id === id) {
        setSelectedRequest({ ...selectedRequest, ...updated, status })
      }
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleNotesSave = async () => {
    if (!selectedRequest) return
    setSaving(true)
    try {
      await requestService.update(selectedRequest.id, { admin_notes: notesText })
      toast.success('Заметка сохранена')
      setSelectedRequest({ ...selectedRequest, admin_notes: notesText })
      refetch()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  const openDetail = (row) => {
    setSelectedRequest(row)
    setNotesText(row.admin_notes || '')
  }

  const columns = [
    { key: 'id', label: '#', width: '50px', sortable: true },
    { key: 'type', label: 'Тип', width: '120px', render: (v) => TYPE_LABELS[v] || v },
    { key: 'name', label: 'Имя', sortable: true },
    { key: 'phone', label: 'Телефон', width: '140px' },
    { key: 'email', label: 'Email', width: '180px', render: (v) => v || '—' },
    { key: 'status', label: 'Статус', width: '100px', render: (v) => <StatusBadge status={v} /> },
    { key: 'created_at', label: 'Дата', width: '100px', sortable: true, render: (v) =>
      v ? new Date(v).toLocaleDateString('ru') : '—'
    },
  ]

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Заявки</h1>

      <div className="flex gap-3 flex-wrap">
        <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1) }} className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none">
          {TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }} className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none">
          {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" /></div>
      ) : (
        <DataTable
          columns={columns}
          data={data?.items || []}
          total={data?.total}
          page={page}
          limit={30}
          onPageChange={setPage}
          onRowClick={openDetail}
          rowClassName={(row) => row.status === 'new' ? 'bg-blue-50/50' : ''}
          emptyMessage="Нет заявок"
        />
      )}

      <AdminModal
        open={!!selectedRequest}
        title={selectedRequest ? `Заявка #${selectedRequest.id}` : ''}
        onClose={() => setSelectedRequest(null)}
      >
        {selectedRequest && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{TYPE_LABELS[selectedRequest.type] || selectedRequest.type}</span>
              <StatusBadge status={selectedRequest.status} />
            </div>

            <p className="text-xs text-gray-400">{formatDateTime(selectedRequest.created_at)}</p>

            <div className="space-y-2 pt-2 border-t border-gray-100">
              <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Контакт</h4>
              <div className="grid grid-cols-[80px_1fr] gap-y-1.5 text-sm">
                <span className="text-gray-400">Имя</span>
                <span className="text-gray-900">{selectedRequest.name}</span>
                <span className="text-gray-400">Телефон</span>
                <a href={`tel:${selectedRequest.phone}`} className="text-blue-600 hover:underline">{selectedRequest.phone}</a>
                {selectedRequest.email && (
                  <>
                    <span className="text-gray-400">Email</span>
                    <a href={`mailto:${selectedRequest.email}`} className="text-blue-600 hover:underline">{selectedRequest.email}</a>
                  </>
                )}
              </div>
            </div>

            {selectedRequest.product_name && (
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Товар</h4>
                <p className="text-sm text-gray-900">{selectedRequest.product_name}</p>
                {selectedRequest.variant_info && (
                  <p className="text-xs text-gray-500">{selectedRequest.variant_info}</p>
                )}
              </div>
            )}

            {selectedRequest.comment && (
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Комментарий</h4>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedRequest.comment}</p>
              </div>
            )}

            <div className="space-y-2 pt-2 border-t border-gray-100">
              <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Заметки</h4>
              <textarea
                value={notesText}
                onChange={e => setNotesText(e.target.value)}
                rows={3}
                placeholder="Внутренние заметки..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none resize-none focus:border-gray-400 transition-colors"
              />
              {notesText !== (selectedRequest.admin_notes || '') && (
                <button
                  onClick={handleNotesSave}
                  disabled={saving}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
                >
                  Сохранить заметки
                </button>
              )}
            </div>

            <div className="flex gap-2 pt-2 border-t border-gray-100">
              {selectedRequest.status === 'new' && (
                <>
                  <button
                    onClick={() => handleStatusChange(selectedRequest.id, 'processing')}
                    disabled={saving}
                    className="flex-1 px-3 py-2 text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 rounded-lg transition-colors disabled:opacity-50"
                  >
                    В работу
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedRequest.id, 'closed')}
                    disabled={saving}
                    className="flex-1 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Закрыть
                  </button>
                </>
              )}
              {selectedRequest.status === 'processing' && (
                <button
                  onClick={() => handleStatusChange(selectedRequest.id, 'closed')}
                  disabled={saving}
                  className="flex-1 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  Закрыть
                </button>
              )}
              {selectedRequest.status === 'closed' && (
                <button
                  onClick={() => handleStatusChange(selectedRequest.id, 'processing')}
                  disabled={saving}
                  className="flex-1 px-3 py-2 text-sm font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  Вернуть в работу
                </button>
              )}
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  )
}
