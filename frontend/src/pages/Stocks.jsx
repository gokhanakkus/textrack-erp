import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, AlertTriangle, Edit2, Trash2, Loader2 } from 'lucide-react'
import { stocksService } from '../services/stocks'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import { formatMeter } from '../utils/formatters'
import api from '../services/api'

function StockForm({ initial, onSubmit, loading, products }) {
  const [form, setForm] = useState({
    product_id: '', fabric_type: '', color: '',
    quantity_meter: '', critical_level: '',
    ...initial,
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Ürün *</label>
          <select value={form.product_id} onChange={e => set('product_id', e.target.value)} required className="input w-full">
            <option value="">Ürün seç...</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Kumaş Tipi *</label>
          <input value={form.fabric_type} onChange={e => set('fabric_type', e.target.value)} required className="input" placeholder="Pamuk" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Renk *</label>
          <input value={form.color} onChange={e => set('color', e.target.value)} required className="input" placeholder="Lacivert" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Miktar (m) *</label>
          <input type="number" step="0.01" value={form.quantity_meter} onChange={e => set('quantity_meter', e.target.value)} required min="0" className="input" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Kritik Seviye (m) *</label>
          <input type="number" step="0.01" value={form.critical_level} onChange={e => set('critical_level', e.target.value)} required min="0" className="input" />
        </div>
      </div>
      <div className="flex justify-end pt-3 border-t border-gray-100">
        <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
          {loading && <Loader2 size={14} className="animate-spin" />}
          {initial ? 'Stok Güncelle' : 'Stok Ekle'}
        </button>
      </div>
    </form>
  )
}

export default function Stocks() {
  const [stocks, setStocks] = useState([])
  const [meta, setMeta] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [criticalOnly, setCriticalOnly] = useState(false)
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetch = useCallback(() => {
    setLoading(true)
    stocksService.getAll({ page, search, critical: criticalOnly ? 1 : '', per_page: 12 })
      .then(res => { setStocks(res.data.data); setMeta(res.data.meta) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [page, search, criticalOnly])

  useEffect(() => { fetch() }, [fetch])

  useEffect(() => {
    api.get('/stocks', { params: { per_page: 100 } }).then(r => {
      const prods = [...new Map(r.data.data.map(s => [s.product_id, s.product])).values()].filter(Boolean)
      setProducts(prods)
    }).catch(() => {})
  }, [])

  const handleCreate = async (form) => {
    setSaving(true); setError('')
    try { await stocksService.create(form); setModal(null); fetch() }
    catch (e) { setError(e.response?.data?.message ?? 'Hata oluştu') }
    finally { setSaving(false) }
  }

  const handleUpdate = async (form) => {
    setSaving(true); setError('')
    try { await stocksService.update(selected.id, form); setModal(null); setSelected(null); fetch() }
    catch (e) { setError(e.response?.data?.message ?? 'Hata oluştu') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setSaving(true)
    try { await stocksService.delete(selected.id); setModal(null); setSelected(null); fetch() }
    catch (e) {} finally { setSaving(false) }
  }

  const criticalCount = stocks.filter(s => s.is_critical).length

  const columns = [
    { key: 'product',        label: 'Ürün',         render: r => <span className="font-medium text-gray-800">{r.product?.name ?? '—'}</span> },
    { key: 'fabric_type',    label: 'Kumaş Tipi' },
    { key: 'color',          label: 'Renk' },
    { key: 'quantity_meter', label: 'Miktar',        render: r => (
        <span className={r.is_critical ? 'text-red-600 font-semibold' : 'text-gray-700'}>
          {formatMeter(r.quantity_meter)}
        </span>
      )
    },
    { key: 'critical_level', label: 'Kritik Seviye', render: r => formatMeter(r.critical_level) },
    { key: 'status',         label: 'Durum',         render: r => r.is_critical ? (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200">
          <AlertTriangle size={11} /> Kritik
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          Normal
        </span>
      )
    },
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
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Stok Yönetimi</h1>
          <p className="text-sm text-gray-500 mt-1">
            {meta?.total ?? 0} ürün
            {criticalCount > 0 && <span className="ml-2 text-red-500 font-medium">· {criticalCount} kritik</span>}
          </p>
        </div>
        <button onClick={() => { setError(''); setModal('create') }} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Stok Ekle
        </button>
      </div>

      {criticalCount > 0 && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertTriangle size={16} className="text-red-500 shrink-0" />
          <span>{criticalCount} stok kalemi kritik eşiğin altında. Yeniden sipariş gerekli.</span>
        </div>
      )}

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Kumaş, renk ara..." className="input pl-9" />
        </div>
        <button
          onClick={() => { setCriticalOnly(!criticalOnly); setPage(1) }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${criticalOnly ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
        >
          <AlertTriangle size={14} /> Sadece kritik
        </button>
      </div>

      <DataTable columns={columns} data={stocks} meta={meta} onPageChange={setPage} isLoading={loading} />

      {modal === 'create' && (
        <Modal title="Stok Kalemi Ekle" onClose={() => setModal(null)}>
          {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</div>}
          <StockForm onSubmit={handleCreate} loading={saving} products={products} />
        </Modal>
      )}
      {modal === 'edit' && selected && (
        <Modal title="Stok Kalemini Düzenle" onClose={() => { setModal(null); setSelected(null) }}>
          {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</div>}
          <StockForm initial={selected} onSubmit={handleUpdate} loading={saving} products={products} />
        </Modal>
      )}
      {modal === 'delete' && selected && (
        <Modal title="Stok Sil" onClose={() => { setModal(null); setSelected(null) }} size="sm">
          <p className="text-gray-600 mb-5"><strong className="text-gray-900">{selected.fabric_type} - {selected.color}</strong> silinsin mi?</p>
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
