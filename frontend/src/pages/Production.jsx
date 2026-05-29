import { useState, useEffect, useCallback } from 'react'
import {
  Plus, Edit2, Trash2, Loader2, Play, Pause,
  AlertTriangle, Package, ChevronDown, ChevronUp,
  ClipboardList, Sun, Sunset, Moon
} from 'lucide-react'
import { productionService } from '../services/production'
import { ordersService }     from '../services/orders'
import { stocksService }     from '../services/stocks'
import DataTable   from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import Modal       from '../components/Modal'
import ProgressBar from '../components/ProgressBar'
import { formatDate, timeAgo } from '../utils/formatters'
import { PRODUCTION_STATUSES, PRODUCTION_STATUS_LABELS, PRODUCTION_LINES } from '../utils/constants'

const SHIFTS = [
  { value: 'sabah', label: 'Sabah',  sub: '06:00 – 14:00', icon: Sun    },
  { value: 'öğle',  label: 'Öğle',   sub: '14:00 – 22:00', icon: Sunset },
  { value: 'gece',  label: 'Gece',   sub: '22:00 – 06:00', icon: Moon   },
]

// ─── Üretim Emri Formu ────────────────────────────────────────────────────────
function ProductionForm({ initial, onSubmit, loading, orders, stocks }) {
  const [form, setForm] = useState({
    order_id: '', stock_id: '', required_meter: '',
    production_line: 'Hat-A', start_date: '', end_date: '',
    progress_percentage: 0, status: 'Waiting', notes: '',
    ...initial,
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const selectedStock     = stocks.find(s => String(s.id) === String(form.stock_id))
  const stockInsufficient = selectedStock && form.required_meter &&
    parseFloat(form.required_meter) > selectedStock.quantity_meter

  const handleSubmit = (e) => {
    e.preventDefault()
    if (stockInsufficient) return
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Sipariş *</label>
          <select value={form.order_id} onChange={e => set('order_id', e.target.value)} required className="input w-full">
            <option value="">Sipariş seç...</option>
            {orders.map(o => <option key={o.id} value={o.id}>#{o.id} — {o.customer_name} ({o.product_type})</option>)}
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Hammadde Stoku <span className="text-gray-400 font-normal">(opsiyonel)</span></label>
          <select value={form.stock_id} onChange={e => set('stock_id', e.target.value)} className="input w-full">
            <option value="">Stok seç...</option>
            {stocks.map(s => <option key={s.id} value={s.id}>{s.fabric_type} — {s.color} ({s.quantity_meter}m mevcut)</option>)}
          </select>
          {selectedStock && (
            <div className={`mt-2 px-3 py-2 rounded-lg flex items-center gap-2 text-xs ${
              selectedStock.quantity_meter <= selectedStock.critical_level
                ? 'bg-red-50 border border-red-200 text-red-700'
                : 'bg-teal-50 border border-teal-200 text-teal-700'
            }`}>
              {selectedStock.quantity_meter <= selectedStock.critical_level ? <AlertTriangle size={13}/> : <Package size={13}/>}
              Mevcut: <strong>{selectedStock.quantity_meter}m</strong>
              {selectedStock.quantity_meter <= selectedStock.critical_level && ' — Kritik seviyede!'}
            </div>
          )}
        </div>

        {form.stock_id && (
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Gereken Hammadde (metre)</label>
            <input type="number" step="0.01" min="0.01" value={form.required_meter}
              onChange={e => set('required_meter', e.target.value)} className="input" placeholder="0.00"/>
            {stockInsufficient
              ? <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1"><AlertTriangle size={11}/> Yetersiz stok! Mevcut {selectedStock.quantity_meter}m</p>
              : selectedStock && form.required_meter && (
                <p className="mt-1.5 text-xs text-teal-600">
                  İşlemden sonra kalan: <strong>{(selectedStock.quantity_meter - parseFloat(form.required_meter||0)).toFixed(2)}m</strong>
                </p>
              )
            }
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Üretim Hattı *</label>
          <select value={form.production_line} onChange={e => set('production_line', e.target.value)} className="input w-full">
            {PRODUCTION_LINES.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Durum</label>
          <select value={form.status} onChange={e => set('status', e.target.value)} className="input w-full">
            {PRODUCTION_STATUSES.map(s => <option key={s} value={s}>{PRODUCTION_STATUS_LABELS[s]}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Başlangıç *</label>
          <input type="date" value={form.start_date} onChange={e => set('start_date', e.target.value)} required className="input"/>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Bitiş</label>
          <input type="date" value={form.end_date} onChange={e => set('end_date', e.target.value)} className="input"/>
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">İlerleme ({form.progress_percentage}%)</label>
          <input type="range" min="0" max="100" value={form.progress_percentage}
            onChange={e => set('progress_percentage', Number(e.target.value))} className="w-full accent-teal-600"/>
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Notlar</label>
          <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} className="input resize-none"/>
        </div>
      </div>
      <div className="flex justify-end pt-3 border-t border-gray-100">
        <button type="submit" disabled={loading || stockInsufficient} className="btn-primary flex items-center gap-2">
          {loading && <Loader2 size={14} className="animate-spin"/>}
          {initial ? 'Güncelle' : 'Oluştur'}
        </button>
      </div>
    </form>
  )
}

// ─── Vardiya Kaydı Formu ──────────────────────────────────────────────────────
function LogForm({ onSubmit, loading, targetQuantity, totalProduced }) {
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({ date: today, shift: 'sabah', produced_quantity: '', notes: '' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const remaining = Math.max(0, targetQuantity - totalProduced)

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(form) }} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tarih *</label>
          <input type="date" value={form.date} onChange={e => set('date', e.target.value)} required className="input"/>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Vardiya *</label>
          <select value={form.shift} onChange={e => set('shift', e.target.value)} className="input">
            {SHIFTS.map(s => <option key={s.value} value={s.value}>{s.label} ({s.sub})</option>)}
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            Üretilen Adet *
            {remaining > 0 && <span className="ml-2 text-gray-400 font-normal">Kalan hedef: {remaining.toLocaleString('tr-TR')} adet</span>}
          </label>
          <input type="number" min="1" value={form.produced_quantity}
            onChange={e => set('produced_quantity', e.target.value)} required className="input" placeholder="0"/>
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Not</label>
          <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} className="input resize-none" placeholder="Makine arızası, kalite sorunu vb..."/>
        </div>
      </div>
      <div className="flex justify-end pt-2 border-t border-gray-100">
        <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
          {loading && <Loader2 size={14} className="animate-spin"/>}
          Kaydet
        </button>
      </div>
    </form>
  )
}

// ─── Vardiya Log Paneli ───────────────────────────────────────────────────────
function LogPanel({ production, onProgressUpdate }) {
  const [logs, setLogs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [error, setError]     = useState('')

  const targetQty    = production.order?.quantity ?? 0
  const totalProduced = logs.reduce((s, l) => s + l.produced_quantity, 0)

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    try {
      const res = await productionService.getLogs(production.id)
      setLogs(Array.isArray(res.data) ? res.data : [])
    } catch { setLogs([]) }
    finally { setLoading(false) }
  }, [production.id])

  useEffect(() => { fetchLogs() }, [fetchLogs])

  const handleAdd = async (form) => {
    setSaving(true)
    setError('')
    try {
      await productionService.createLog(production.id, form)
      await fetchLogs()
      setShowForm(false)
      onProgressUpdate?.()
    } catch (e) {
      setError(e.response?.data?.message ?? 'Aynı tarih ve vardiya için kayıt zaten var.')
    } finally { setSaving(false) }
  }

  const handleDelete = async (logId) => {
    if (!confirm('Bu vardiya kaydı silinsin mi?')) return
    try {
      await productionService.deleteLog(production.id, logId)
      await fetchLogs()
      onProgressUpdate?.()
    } catch {}
  }

  const shiftIcon = (shift) => {
    const found = SHIFTS.find(s => s.value === shift)
    const Icon  = found?.icon ?? Sun
    return <Icon size={13}/>
  }

  return (
    <div className="px-4 pb-4 pt-2">
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">

        {/* Özet satırı */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-500">
              Toplam üretilen: <strong className="text-gray-900">{totalProduced.toLocaleString('tr-TR')}</strong> adet
            </span>
            {targetQty > 0 && (
              <span className="text-gray-500">
                Hedef: <strong className="text-gray-900">{targetQty.toLocaleString('tr-TR')}</strong> adet
              </span>
            )}
            {targetQty > 0 && totalProduced >= targetQty && (
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                ✓ Hedef tamamlandı
              </span>
            )}
          </div>
          <button onClick={() => setShowForm(v => !v)} className="btn-primary flex items-center gap-1.5 py-1.5 px-3 text-xs">
            <Plus size={13}/> Vardiya Ekle
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="mb-4 bg-white border border-teal-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-teal-700 mb-3 flex items-center gap-1.5">
              <ClipboardList size={13}/> Yeni Vardiya Kaydı
            </p>
            {error && (
              <div className="mb-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 flex items-center gap-1.5">
                <AlertTriangle size={12}/> {error}
              </div>
            )}
            <LogForm onSubmit={handleAdd} loading={saving} targetQuantity={targetQty} totalProduced={totalProduced}/>
          </div>
        )}

        {/* Log tablosu */}
        {loading ? (
          <div className="space-y-2">
            {[1,2,3].map(i => <div key={i} className="h-10 bg-gray-200 rounded-lg animate-pulse"/>)}
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-6 text-gray-400 text-sm">
            Henüz vardiya kaydı yok
          </div>
        ) : (
          <div className="space-y-1.5">
            {logs.map(log => (
              <div key={log.id} className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-3 py-2.5">
                <div className="flex items-center gap-1.5 text-gray-500 w-20 shrink-0">
                  {shiftIcon(log.shift)}
                  <span className="text-xs font-medium capitalize">{log.shift}</span>
                </div>
                <span className="text-xs text-gray-400 w-24 shrink-0">{formatDate(log.date)}</span>
                <span className="text-sm font-bold text-gray-900 w-24 shrink-0">
                  {log.produced_quantity.toLocaleString('tr-TR')} adet
                </span>
                {log.notes && <span className="text-xs text-gray-400 flex-1 truncate">{log.notes}</span>}
                {!log.notes && <span className="flex-1"/>}
                {log.user && <span className="text-xs text-gray-400 hidden md:block shrink-0">{log.user.name}</span>}
                <span className="text-xs text-gray-300 shrink-0">{timeAgo(log.created_at)}</span>
                <button onClick={() => handleDelete(log.id)}
                  className="p-1 rounded text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0">
                  <Trash2 size={12}/>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Ana Sayfa ────────────────────────────────────────────────────────────────
export default function Production() {
  const [productions, setProductions] = useState([])
  const [meta, setMeta]       = useState(null)
  const [orders, setOrders]   = useState([])
  const [stocks, setStocks]   = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage]       = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [modal, setModal]     = useState(null)
  const [selected, setSelected] = useState(null)
  const [saving, setSaving]   = useState(false)
  const [saveError, setSaveError] = useState('')
  const [expandedId, setExpandedId] = useState(null)

  const fetch = useCallback(() => {
    setLoading(true)
    productionService.getAll({ page, status: statusFilter, per_page: 12 })
      .then(res => { setProductions(res.data.data); setMeta(res.data.meta) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [page, statusFilter])

  useEffect(() => { fetch() }, [fetch])
  useEffect(() => {
    ordersService.getAll({ per_page: 100 })
      .then(res => setOrders(res.data.data.filter(o => ['Pending','In Production'].includes(o.status))))
    stocksService.getAll({ per_page: 200 })
      .then(res => setStocks(res.data.data ?? []))
  }, [])

  const handleCreate = async (form) => {
    setSaving(true); setSaveError('')
    try { await productionService.create(form); setModal(null); fetch() }
    catch (e) { setSaveError(e.response?.data?.message ?? e.message ?? 'Bir hata oluştu') }
    finally { setSaving(false) }
  }

  const handleUpdate = async (form) => {
    setSaving(true); setSaveError('')
    try { await productionService.update(selected.id, form); setModal(null); setSelected(null); fetch() }
    catch (e) { setSaveError(e.response?.data?.message ?? e.message ?? 'Bir hata oluştu') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setSaving(true)
    try { await productionService.delete(selected.id); setModal(null); setSelected(null); fetch() }
    catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  const quickStatus = async (prod, status) => {
    try { await productionService.update(prod.id, { status, progress_percentage: prod.progress_percentage }); fetch() }
    catch (e) { console.error(e) }
  }

  const toggleExpand = (id) => setExpandedId(prev => prev === id ? null : id)

  const columns = [
    {
      key: 'expand', label: '',
      render: r => (
        <button onClick={() => toggleExpand(r.id)}
          className="p-1 rounded text-gray-400 hover:text-teal-600 hover:bg-teal-50 transition-colors">
          {expandedId === r.id ? <ChevronUp size={15}/> : <ChevronDown size={15}/>}
        </button>
      ),
    },
    { key: 'id',              label: '#',         render: r => <span className="font-mono text-gray-400 text-xs">#{r.id}</span> },
    { key: 'order',           label: 'Sipariş',   render: r => r.order ? `${r.order.customer_name} – ${r.order.product_type}` : '—' },
    { key: 'production_line', label: 'Hat',        render: r => <span className="font-medium text-gray-800">{r.production_line}</span> },
    {
      key: 'stock', label: 'Hammadde',
      render: r => r.stock
        ? <span className="text-xs text-gray-600">{r.stock.fabric_type} – {r.stock.color} <span className="text-gray-400">({r.required_meter}m)</span></span>
        : <span className="text-xs text-gray-300">—</span>,
    },
    { key: 'progress',   label: 'İlerleme', render: r => <ProgressBar value={r.progress_percentage}/> },
    { key: 'status',     label: 'Durum',    render: r => <StatusBadge status={r.status}/> },
    { key: 'start_date', label: 'Başlangıç',render: r => formatDate(r.start_date) },
    { key: 'end_date',   label: 'Bitiş',    render: r => formatDate(r.end_date) },
    {
      key: 'actions', label: '',
      render: (row) => (
        <div className="flex items-center gap-1 justify-end">
          {row.status === 'Running' && (
            <button onClick={() => quickStatus(row, 'Paused')} title="Duraklat"
              className="p-1.5 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition-colors">
              <Pause size={14}/>
            </button>
          )}
          {row.status === 'Paused' && (
            <button onClick={() => quickStatus(row, 'Running')} title="Devam Et"
              className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
              <Play size={14}/>
            </button>
          )}
          <button onClick={() => { setSelected(row); setModal('edit') }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-teal-600 hover:bg-teal-50 transition-colors">
            <Edit2 size={14}/>
          </button>
          <button onClick={() => { setSelected(row); setModal('delete') }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
            <Trash2 size={14}/>
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Üretim Takibi</h1>
          <p className="text-sm text-gray-500 mt-1">{meta?.total ?? 0} üretim emri</p>
        </div>
        <button onClick={() => { setSaveError(''); setModal('create') }} className="btn-primary flex items-center gap-2">
          <Plus size={16}/> Yeni Üretim Emri
        </button>
      </div>

      <div className="flex gap-3">
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }} className="input w-44">
          <option value="">Tüm durumlar</option>
          {PRODUCTION_STATUSES.map(s => <option key={s} value={s}>{PRODUCTION_STATUS_LABELS[s]}</option>)}
        </select>
      </div>

      {/* Tablo + genişleyebilir log paneli */}
      <DataTable
        columns={columns}
        data={productions}
        meta={meta}
        onPageChange={setPage}
        isLoading={loading}
        expandedRow={expandedId}
        renderExpanded={(row) => (
          <LogPanel
            production={row}
            onProgressUpdate={fetch}
          />
        )}
      />

      {modal === 'create' && (
        <Modal title="Yeni Üretim Emri" onClose={() => setModal(null)}>
          {saveError && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2"><AlertTriangle size={14}/> {saveError}</div>}
          <ProductionForm onSubmit={handleCreate} loading={saving} orders={orders} stocks={stocks}/>
        </Modal>
      )}
      {modal === 'edit' && selected && (
        <Modal title="Üretim Emrini Düzenle" onClose={() => { setModal(null); setSelected(null) }}>
          {saveError && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2"><AlertTriangle size={14}/> {saveError}</div>}
          <ProductionForm
            initial={{ ...selected, start_date: selected.start_date?.split('T')[0] ?? selected.start_date, end_date: selected.end_date?.split('T')[0] ?? selected.end_date ?? '' }}
            onSubmit={handleUpdate} loading={saving} orders={orders} stocks={stocks}
          />
        </Modal>
      )}
      {modal === 'delete' && selected && (
        <Modal title="Üretim Emrini Sil" onClose={() => { setModal(null); setSelected(null) }} size="sm">
          <p className="text-gray-600 mb-5"><strong className="text-gray-900">#{selected.id}</strong> numaralı üretim emri silinsin mi?</p>
          <div className="flex justify-end gap-2">
            <button onClick={() => { setModal(null); setSelected(null) }} className="btn-secondary">İptal</button>
            <button onClick={handleDelete} disabled={saving} className="btn-danger flex items-center gap-2">
              {saving && <Loader2 size={14} className="animate-spin"/>} Sil
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
