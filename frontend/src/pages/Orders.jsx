import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Edit2, Trash2, Loader2 } from 'lucide-react'
import { ordersService } from '../services/orders'
import DataTable from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'
import { formatDate } from '../utils/formatters'
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from '../utils/constants'

function OrderForm({ initial, onSubmit, loading }) {
  const [form, setForm] = useState({
    customer_name: '', product_type: '', color: '', size: '',
    quantity: '', delivery_date: '', status: 'Pending', notes: '',
    unit_price: '', unit_cost: '',
    ...initial,
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const revenue = form.quantity && form.unit_price ? form.quantity * parseFloat(form.unit_price) : null
  const profit  = revenue && form.unit_cost ? revenue - form.quantity * parseFloat(form.unit_cost) : null
  const margin  = revenue && profit ? ((profit / revenue) * 100).toFixed(1) : null

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Müşteri Adı *</label>
          <input value={form.customer_name} onChange={e => set('customer_name', e.target.value)} required className="input" placeholder="Zara Türkiye" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Ürün Tipi *</label>
          <input value={form.product_type} onChange={e => set('product_type', e.target.value)} required className="input" placeholder="T-Shirt" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Renk *</label>
          <input value={form.color} onChange={e => set('color', e.target.value)} required className="input" placeholder="Lacivert" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Beden *</label>
          <input value={form.size} onChange={e => set('size', e.target.value)} required className="input" placeholder="M" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Miktar *</label>
          <input type="number" value={form.quantity} onChange={e => set('quantity', e.target.value)} required min="1" className="input" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Teslimat Tarihi *</label>
          <input type="date" value={form.delivery_date} onChange={e => set('delivery_date', e.target.value)} required className="input" />
        </div>
        {initial && (
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Durum</label>
            <select value={form.status} onChange={e => set('status', e.target.value)} className="input">
              {ORDER_STATUSES.map(s => <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>)}
            </select>
          </div>
        )}

        {/* ─ Finansal alanlar ─ */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Birim Satış Fiyatı (₺)</label>
          <input type="number" step="0.01" min="0" value={form.unit_price}
            onChange={e => set('unit_price', e.target.value)} className="input" placeholder="0.00"/>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Birim Maliyet (₺)</label>
          <input type="number" step="0.01" min="0" value={form.unit_cost}
            onChange={e => set('unit_cost', e.target.value)} className="input" placeholder="0.00"/>
        </div>

        {/* Anlık kâr önizleme */}
        {revenue !== null && (
          <div className="col-span-2 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-600 flex gap-5">
            <span>Gelir: <strong className="text-teal-700">{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(revenue)}</strong></span>
            {profit !== null && (
              <>
                <span>Kâr: <strong className={profit >= 0 ? 'text-emerald-600' : 'text-red-600'}>{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(profit)}</strong></span>
                <span>Marjin: <strong className={parseFloat(margin) >= 20 ? 'text-emerald-600' : 'text-amber-600'}>%{margin}</strong></span>
              </>
            )}
          </div>
        )}

        <div className="col-span-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Notlar</label>
          <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} className="input resize-none" placeholder="İsteğe bağlı notlar..." />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
        <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
          {loading && <Loader2 size={14} className="animate-spin" />}
          {initial ? 'Siparişi Güncelle' : 'Sipariş Oluştur'}
        </button>
      </div>
    </form>
  )
}

const COLUMNS = [
  { key: 'customer_name', label: 'Müşteri' },
  { key: 'product_type',  label: 'Ürün' },
  { key: 'color',         label: 'Renk' },
  { key: 'quantity',      label: 'Adet', render: r => r.quantity?.toLocaleString('tr-TR') },
  { key: 'delivery_date', label: 'Teslimat', render: r => formatDate(r.delivery_date) },
  { key: 'status',        label: 'Durum',    render: r => <StatusBadge status={r.status} /> },
  { key: 'actions',       label: '' },
]

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetch = useCallback(() => {
    setLoading(true)
    ordersService.getAll({ page, search, status: statusFilter, per_page: 12 })
      .then(res => { setOrders(res.data.data); setMeta(res.data.meta) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [page, search, statusFilter])

  useEffect(() => { fetch() }, [fetch])

  const handleCreate = async (form) => {
    setSaving(true); setError('')
    try { await ordersService.create(form); setModal(null); fetch() }
    catch (e) { setError(e.response?.data?.message ?? 'Sipariş oluşturulurken hata oluştu') }
    finally { setSaving(false) }
  }

  const handleUpdate = async (form) => {
    setSaving(true); setError('')
    try { await ordersService.update(selected.id, form); setModal(null); setSelected(null); fetch() }
    catch (e) { setError(e.response?.data?.message ?? 'Sipariş güncellenirken hata oluştu') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setSaving(true)
    try { await ordersService.delete(selected.id); setModal(null); setSelected(null); fetch() }
    catch (e) { setError(e.response?.data?.message ?? 'Sipariş silinirken hata oluştu') }
    finally { setSaving(false) }
  }

  const columns = [
    ...COLUMNS.slice(0, -1),
    {
      key: 'actions', label: '',
      render: (row) => (
        <div className="flex items-center gap-1 justify-end">
          <button onClick={() => { setSelected(row); setModal('edit') }} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
            <Edit2 size={14} />
          </button>
          <button onClick={() => { setSelected(row); setModal('delete') }} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Siparişler</h1>
          <p className="text-sm text-gray-500 mt-1">{meta?.total ?? 0} toplam sipariş</p>
        </div>
        <button onClick={() => { setError(''); setModal('create') }} className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          Yeni Sipariş
        </button>
      </div>

      {/* Filtreler */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Müşteri ara..."
            className="input pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
          className="input w-44"
        >
          <option value="">Tüm durumlar</option>
          {ORDER_STATUSES.map(s => <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>)}
        </select>
      </div>

      <DataTable columns={columns} data={orders} meta={meta} onPageChange={setPage} isLoading={loading} />

      {modal === 'create' && (
        <Modal title="Yeni Sipariş Oluştur" onClose={() => setModal(null)}>
          {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</div>}
          <OrderForm onSubmit={handleCreate} loading={saving} />
        </Modal>
      )}

      {modal === 'edit' && selected && (
        <Modal title="Sipariş Düzenle" onClose={() => { setModal(null); setSelected(null) }}>
          {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</div>}
          <OrderForm
            initial={{ ...selected, delivery_date: selected.delivery_date?.split('T')[0] ?? selected.delivery_date }}
            onSubmit={handleUpdate}
            loading={saving}
          />
        </Modal>
      )}

      {modal === 'delete' && selected && (
        <Modal title="Sipariş Sil" onClose={() => { setModal(null); setSelected(null) }} size="sm">
          <p className="text-gray-600 mb-5">
            <strong className="text-gray-900">{selected.customer_name}</strong> için olan siparişi silmek istediğinizden emin misiniz?
            Bu işlem geri alınamaz.
          </p>
          <div className="flex justify-end gap-2">
            <button onClick={() => { setModal(null); setSelected(null) }} className="btn-secondary">İptal</button>
            <button onClick={handleDelete} disabled={saving} className="btn-danger flex items-center gap-2">
              {saving && <Loader2 size={14} className="animate-spin" />} Sil
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
