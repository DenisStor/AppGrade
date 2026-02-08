import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Search, Trash2 } from 'lucide-react'
import { useQuery } from '../hooks/useQuery'
import { productService } from '../services/productService'
import DataTable from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import ConfirmDialog from '../components/ConfirmDialog'
import toast from 'react-hot-toast'

export default function ProductsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [categoryFilter, setCategoryFilter] = useState('')
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const qs = new URLSearchParams({ page, limit: 30 })
  if (search) qs.set('search', search)
  if (categoryFilter) qs.set('category_id', categoryFilter)

  const { data, loading, refetch } = useQuery(`/products?${qs}`, [page, search, categoryFilter])
  const { data: categories } = useQuery('/categories')

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await productService.remove(deleteId)
      toast.success('Товар удалён')
      setDeleteId(null)
      refetch()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    { key: 'name', label: 'Название', sortable: true, render: (_, row) => (
      <div>
        <p className="font-medium text-gray-900">{row.name}</p>
        <p className="text-xs text-gray-400">/{row.category_slug}/{row.brand_slug}/{row.slug}</p>
      </div>
    )},
    { key: 'category_name', label: 'Категория', sortable: true, width: '120px' },
    { key: 'brand_name', label: 'Бренд', sortable: true, width: '100px' },
    { key: 'variantCount', label: 'Варианты', width: '90px', className: 'text-center' },
    { key: 'minPrice', label: 'Цена от', sortable: true, width: '110px', render: (v) => v ? `${v.toLocaleString('ru')} ₽` : '—' },
    { key: 'active', label: 'Статус', width: '100px', render: (v) => <StatusBadge status={v ? 'active' : 'draft'} /> },
    { key: 'actions', label: '', width: '50px', render: (_, row) => (
      <button
        onClick={(e) => { e.stopPropagation(); setDeleteId(row.id) }}
        className="p-1 hover:bg-gray-100 rounded"
      >
        <Trash2 size={14} className="text-red-500" />
      </button>
    )},
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Товары</h1>
        <Link to="/admin/products/new" className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800">
          <Plus size={16} /> Добавить
        </Link>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск товаров..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setPage(1) }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
        >
          <option value="">Все категории</option>
          {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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
          onRowClick={(row) => navigate(`/admin/products/${row.id}`)}
          emptyMessage="Нет товаров"
        />
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Удалить товар?"
        message="Товар и все его варианты будут удалены."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  )
}
