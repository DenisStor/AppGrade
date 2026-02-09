import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Search, Trash2, Pencil, Eye, EyeOff } from 'lucide-react'
import { useQuery } from '../hooks/useQuery'
import { productService } from '../services/productService'
import DataTable from '../components/DataTable'
import SortableList from '../components/SortableList'
import StatusBadge from '../components/StatusBadge'
import ConfirmDialog from '../components/ConfirmDialog'
import toast from 'react-hot-toast'

const TABS = [
  { key: 'new', label: 'Новые', is_used: 0 },
  { key: 'used', label: 'Б/У', is_used: 1 },
]

export default function ProductsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [categoryFilter, setCategoryFilter] = useState('')
  const [brandFilter, setBrandFilter] = useState('')
  const [activeTab, setActiveTab] = useState('new')
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const currentTab = TABS.find(t => t.key === activeTab)
  const isUsedTab = activeTab === 'used'
  const isSortMode = !!(categoryFilter && brandFilter && !search)

  const qs = new URLSearchParams({ is_used: currentTab.is_used })
  if (search) qs.set('search', search)
  if (categoryFilter) qs.set('category_id', categoryFilter)
  if (brandFilter) qs.set('brand_id', brandFilter)
  if (isSortMode) {
    qs.set('limit', '200')
  } else {
    qs.set('page', page)
    qs.set('limit', '30')
  }

  const { data, loading, refetch } = useQuery(`/products?${qs}`, [page, search, categoryFilter, brandFilter, activeTab])
  const { data: categories } = useQuery('/categories')
  const { data: brands } = useQuery('/brands')

  const handleTabChange = (key) => {
    setActiveTab(key)
    setPage(1)
  }

  const handleReorder = async (newItems) => {
    try {
      await productService.reorder(newItems.map(i => i.id))
      refetch()
    } catch (e) {
      toast.error(e.message)
    }
  }

  const toggleActive = async (product) => {
    try {
      await productService.update(product.id, { active: product.active ? 0 : 1 })
      refetch()
      toast.success(product.active ? 'Товар скрыт' : 'Товар активирован')
    } catch (e) {
      toast.error(e.message)
    }
  }

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

  const baseColumns = [
    { key: 'name', label: 'Название', sortable: true, render: (_, row) => (
      <div>
        <p className="font-medium text-gray-900">{row.name}</p>
        <p className="text-xs text-gray-400">/{row.category_slug}/{row.brand_slug}/{row.slug}</p>
      </div>
    )},
    { key: 'category_name', label: 'Категория', sortable: true, width: '120px' },
    { key: 'brand_name', label: 'Бренд', sortable: true, width: '100px' },
  ]

  const newColumns = [
    ...baseColumns,
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

  const usedColumns = [
    ...baseColumns,
    { key: 'condition_label', label: 'Состояние', width: '120px', render: (v) => v || '—' },
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

  const columns = isUsedTab ? usedColumns : newColumns

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Товары</h1>
        <Link
          to={isUsedTab ? '/admin/products/new?used=1' : '/admin/products/new'}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800"
        >
          <Plus size={16} /> {isUsedTab ? 'Добавить Б/У' : 'Добавить'}
        </Link>
      </div>

      <div className="flex gap-1 border-b border-gray-200">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
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
          onChange={(e) => { setCategoryFilter(e.target.value); setBrandFilter(''); setPage(1) }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
        >
          <option value="">Все категории</option>
          {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select
          value={brandFilter}
          onChange={(e) => { setBrandFilter(e.target.value); setPage(1) }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
        >
          <option value="">Все бренды</option>
          {brands?.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>

      {isSortMode && (
        <p className="text-xs text-gray-500">Перетаскивайте товары для изменения порядка отображения</p>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" /></div>
      ) : isSortMode ? (
        (data?.items?.length) ? (
          <SortableList
            items={data.items}
            onReorder={handleReorder}
            renderItem={(product) => (
              <div className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{product.name}</p>
                  <p className="text-xs text-gray-400">
                    {product.minPrice ? `${product.minPrice.toLocaleString('ru')} ₽` : '—'}
                    {product.variantCount > 0 && ` · ${product.variantCount} вар.`}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => toggleActive(product)} className="p-1.5 hover:bg-gray-100 rounded" title={product.active ? 'Скрыть' : 'Показать'}>
                    {product.active ? <Eye size={16} className="text-green-500" /> : <EyeOff size={16} className="text-gray-400" />}
                  </button>
                  <button onClick={() => navigate(`/admin/products/${product.id}`)} className="p-1.5 hover:bg-gray-100 rounded">
                    <Pencil size={16} className="text-gray-500" />
                  </button>
                  <button onClick={() => setDeleteId(product.id)} className="p-1.5 hover:bg-gray-100 rounded">
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>
              </div>
            )}
          />
        ) : (
          <div className="text-center py-12 text-gray-400">Нет товаров</div>
        )
      ) : (
        <DataTable
          columns={columns}
          data={data?.items || []}
          total={data?.total}
          page={page}
          limit={30}
          onPageChange={setPage}
          onRowClick={(row) => navigate(`/admin/products/${row.id}`)}
          emptyMessage={isUsedTab ? 'Нет Б/У товаров' : 'Нет товаров'}
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
