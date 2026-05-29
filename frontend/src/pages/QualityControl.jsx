import { useState, useEffect, useCallback } from 'react'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { qualityService } from '../services/quality'
import { productionService } from '../services/production'
import DataTable from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'
import { DEFECT_TYPES, QC_RESULTS } from '../utils/constants'

const PIE_COLORS = ['#0d9488', '#f59e0b', '#ef4444', '#6366f1']

const RESULT_LABELS = { passed: 'Geçti', failed: 'Başarısız', partial: 'Kısmi' }
const CHART_STYLE = {
  background: '#ffffff',
  border: '1px solid #f1f5f9',
  borderRadius: '12px',
  color: '#374151',
  fontSize: '12px',
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07)',
}

const DEFECT_LABEL = Object.fromEntries(DEFECT_TYPES.map(d => [d.value, d.label]))

function QCForm({ initial, onSubmit, loading, productions }) {
  const [form, setForm] = useState({
    production_order_id: '', defect_type: 'none', description: '',
    defect_quantity: 0, passed_quantity: 0, result: 'passed',
    ...initial,
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Üretim Emri *</label>
          <select value={form.production_order_id} onChange={e => set('production_order_id', e.target.value)} required className="input w-full">
            <option value="">Üretim emri seç...</option>
            {productions.map(p => <option key={p.id} value={p.id}>#{p.id} — {p.order?.customer_name} ({p.production_line})</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Hata Tipi *</label>
          <select value={form.defect_type} onChange={e => set('defect_type', e.target.value)} className="input w-full">
            {DEFECT_TYPES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Sonuç *</label>
          <select value={form.result} onChange={e => set('result', e.target.value)} className="input w-full">
            {QC_RESULTS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Hatalı Miktar</label>
          <input type="number" value={form.defect_quantity} onChange={e => set('defect_quantity', Number(e.target.value))} min="0" className="input" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Geçen Miktar</label>
          <input type="number" value={form.passed_quantity} onChange={e => set('passed_quantity', Number(e.target.value))} min="0" className="input" />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Açıklama</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} className="input resize-none" />
        </div>
      </div>
      <div className="flex justify-end pt-3 border-t border-gray-100">
        <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
          {loading && <Loader2 size={14} className="animate-spin" />}
          {initial ? 'Güncelle' : 'Kaydet'}
        </button>
      </div>
    </form>
  )
}

export default function QualityControl() {
  const [qcs, setQcs] = useState([])
  const [meta, setMeta] = useState(null)
  const [stats, setStats] = useState(null)
  const [productions, setProductions] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [saving, setSaving] = useState(false)

  const fetch = useCallback(() => {
    setLoading(true)
    qualityService.getAll({ page, per_page: 12 })
      .then(res => { setQcs(res.data.data); setMeta(res.data.meta) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [page])

  useEffect(() => { fetch() }, [fetch])
  useEffect(() => {
    qualityService.getStats().then(res => setStats(res.data)).catch(() => {})
    productionService.getAll({ per_page: 100 }).then(res => setProductions(res.data.data)).catch(() => {})
  }, [])

  const handleCreate = async (form) => {
    setSaving(true)
    try { await qualityService.create(form); setModal(null); fetch(); qualityService.getStats().then(r => setStats(r.data)) }
    catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setSaving(true)
    try { await qualityService.delete(selected.id); setModal(null); setSelected(null); fetch() }
    catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  const pieData = (stats?.by_type ?? [])
    .map(d => ({ name: DEFECT_LABEL[d.defect_type] ?? d.defect_type, value: Number(d.total) }))
    .filter(d => d.value > 0)

  const defectRate = stats?.defect_rate != null ? Number(stats.defect_rate).toFixed(1) : '0'
  const isHighRate = parseFloat(defectRate) > 5

  const columns = [
    { key: 'id',             label: '#',       render: r => <span className="font-mono text-gray-400 text-xs">#{r.id}</span> },
    { key: 'order',          label: 'Müşteri', render: r => r.production_order?.order?.customer_name ?? '—' },
    { key: 'defect_type',    label: 'Hata',    render: r => <span className="text-xs font-medium">{DEFECT_LABEL[r.defect_type] ?? r.defect_type}</span> },
    { key: 'defect_quantity',label: 'Hatalı',  render: r => <span className="font-medium text-red-500">{r.defect_quantity}</span> },
    { key: 'passed_quantity',label: 'Geçen',   render: r => <span className="font-medium text-emerald-600">{r.passed_quantity}</span> },
    { key: 'result',         label: 'Sonuç',   render: r => <StatusBadge status={r.result} /> },
    {
      key: 'actions', label: '',
      render: (row) => (
        <div className="flex justify-end">
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
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Kalite Kontrol</h1>
          <p className="text-sm text-gray-500 mt-1">Hata oranı: <span className={`font-semibold ${isHighRate ? 'text-red-500' : 'text-emerald-600'}`}>{defectRate}%</span></p>
        </div>
        <button onClick={() => setModal('create')} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Muayene Kaydet
        </button>
      </div>

      {/* İstatistik + Grafik */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Özet */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Özet</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Toplam Hata</span>
              <span className="text-sm font-bold text-gray-900">{stats?.total_defects ?? 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Hata Oranı</span>
              <span className={`text-sm font-bold ${isHighRate ? 'text-red-500' : 'text-emerald-600'}`}>{defectRate}%</span>
            </div>
            <div className="border-t border-gray-100 pt-2 space-y-2">
              {(stats?.by_result ?? []).map(r => (
                <div key={r.result} className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">{RESULT_LABELS[r.result] ?? r.result}</span>
                  <span className="text-xs font-semibold text-gray-700">{r.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Grafik */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Hata Dağılımı</h2>
          {pieData.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">Hata verisi yok</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  innerRadius={38}
                  strokeWidth={2}
                  stroke="#fff"
                  label={({ cx, cy, midAngle, outerRadius, name, percent, index }) => {
                    const RADIAN = Math.PI / 180
                    const r = outerRadius + 32
                    const x = cx + r * Math.cos(-midAngle * RADIAN)
                    const y = cy + r * Math.sin(-midAngle * RADIAN)
                    const color = PIE_COLORS[index % PIE_COLORS.length]
                    return (
                      <g>
                        <text x={x} y={y - 6} textAnchor={x > cx ? 'start' : 'end'}
                          fill={color} fontSize={11} fontWeight={700}>
                          {name}
                        </text>
                        <text x={x} y={y + 8} textAnchor={x > cx ? 'start' : 'end'}
                          fill={color} fontSize={10} opacity={0.85}>
                          {`${(percent * 100).toFixed(0)}%`}
                        </text>
                      </g>
                    )
                  }}
                  labelLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
                >
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip
                  contentStyle={CHART_STYLE}
                  formatter={(value, name) => [`${value} adet`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <DataTable columns={columns} data={qcs} meta={meta} onPageChange={setPage} isLoading={loading} />

      {modal === 'create' && (
        <Modal title="Kalite Muayenesi Kaydet" onClose={() => setModal(null)}>
          <QCForm onSubmit={handleCreate} loading={saving} productions={productions} />
        </Modal>
      )}
      {modal === 'delete' && selected && (
        <Modal title="Kaydı Sil" onClose={() => { setModal(null); setSelected(null) }} size="sm">
          <p className="text-gray-600 mb-5"><strong className="text-gray-900">#{selected.id}</strong> numaralı kalite kontrol kaydı silinsin mi?</p>
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
