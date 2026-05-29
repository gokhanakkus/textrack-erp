import { useState, useEffect, useCallback } from 'react'
import {
  TrendingUp, TrendingDown, DollarSign, Percent,
  ShoppingBag, ChevronLeft, ChevronRight,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import { financeService } from '../services/finance'
import StatusBadge from '../components/StatusBadge'
import { formatDate } from '../utils/formatters'

// ─── Para formatı ─────────────────────────────────────────────────────────────
function fmt(n) {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(n ?? 0)
}
function fmtK(n) {
  if (!n) return '₺0'
  if (Math.abs(n) >= 1_000_000) return `₺${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000)     return `₺${(n / 1_000).toFixed(0)}B`
  return `₺${n.toFixed(0)}`
}

// ─── Özet Kart ────────────────────────────────────────────────────────────────
function SummaryCard({ label, value, sub, icon: Icon, color }) {
  const palette = {
    teal:   { bg: 'bg-teal-50',   border: 'border-teal-100',   text: 'text-teal-700',   iconBg: 'rgba(13,148,136,0.10)',  iconBorder: 'rgba(13,148,136,0.25)',  iconColor: '#0d9488' },
    red:    { bg: 'bg-rose-50',   border: 'border-rose-100',   text: 'text-rose-700',   iconBg: 'rgba(225,29,72,0.10)',   iconBorder: 'rgba(225,29,72,0.25)',   iconColor: '#e11d48' },
    emerald:{ bg: 'bg-emerald-50',border: 'border-emerald-100',text: 'text-emerald-700',iconBg: 'rgba(5,150,105,0.10)',   iconBorder: 'rgba(5,150,105,0.25)',   iconColor: '#059669' },
    amber:  { bg: 'bg-amber-50',  border: 'border-amber-100',  text: 'text-amber-700',  iconBg: 'rgba(217,119,6,0.10)',   iconBorder: 'rgba(217,119,6,0.25)',   iconColor: '#d97706' },
    indigo: { bg: 'bg-indigo-50', border: 'border-indigo-100', text: 'text-indigo-700', iconBg: 'rgba(99,102,241,0.10)',  iconBorder: 'rgba(99,102,241,0.25)',  iconColor: '#6366f1' },
  }
  const c = palette[color] ?? palette.teal

  return (
    <div className={`bg-white border ${c.border} rounded-2xl p-5 shadow-sm`}>
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: c.iconBg, border: `1.5px solid ${c.iconBorder}` }}
        >
          <Icon size={18} style={{ color: c.iconColor }}/>
        </div>
      </div>
      <p className={`mt-4 text-2xl font-bold tracking-tight ${c.text}`}>{value}</p>
      <p className="text-sm font-semibold text-gray-700 mt-1">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}

// ─── Özel tooltip ─────────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-gray-700 mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }}/>
          <span className="text-gray-500">{p.name}:</span>
          <span className="font-semibold text-gray-800">{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Marjin badge ─────────────────────────────────────────────────────────────
function MarginBadge({ value }) {
  const color = value >= 40
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : value >= 20
    ? 'bg-amber-50 text-amber-700 border-amber-200'
    : 'bg-rose-50 text-rose-700 border-rose-200'
  return (
    <span className={`inline-flex items-center gap-0.5 border px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>
      {value >= 20 ? <TrendingUp size={10}/> : <TrendingDown size={10}/>}
      %{value}
    </span>
  )
}

// ─── Ana Sayfa ────────────────────────────────────────────────────────────────
export default function Finance() {
  const [stats, setStats]     = useState(null)
  const [orders, setOrders]   = useState([])
  const [meta, setMeta]       = useState(null)
  const [page, setPage]       = useState(1)
  const [loading, setLoading] = useState(true)
  const [tableLoading, setTableLoading] = useState(false)

  useEffect(() => {
    financeService.getStats()
      .then(res => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const fetchOrders = useCallback(() => {
    setTableLoading(true)
    financeService.getOrders({ page })
      .then(res => { setOrders(res.data.data); setMeta(res.data.meta) })
      .catch(console.error)
      .finally(() => setTableLoading(false))
  }, [page])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  // Aylık grafik verisi — eksik ayları sıfırla
  const monthlyData = (() => {
    if (!stats?.monthly) return []
    return stats.monthly.map(m => ({
      ...m,
      label: new Date(m.month + '-01').toLocaleDateString('tr-TR', { month: 'short', year: '2-digit' }),
    }))
  })()

  const s = stats?.summary

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"/>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse"/>)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Başlık */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Maliyet & Kâr Takibi</h1>
        <p className="text-sm text-gray-500 mt-1">
          {s?.order_count ?? 0} fiyatlandırılmış sipariş · Finansal analiz
        </p>
      </div>

      {/* Özet kartlar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          label="Toplam Gelir"
          value={fmt(s?.total_revenue)}
          sub={`${s?.order_count} sipariş`}
          icon={DollarSign}
          color="teal"
        />
        <SummaryCard
          label="Toplam Maliyet"
          value={fmt(s?.total_cost)}
          sub="Hammadde + üretim"
          icon={ShoppingBag}
          color="red"
        />
        <SummaryCard
          label="Net Kâr"
          value={fmt(s?.total_profit)}
          sub={s?.total_profit >= 0 ? 'Pozitif bakiye' : 'Zarar'}
          icon={TrendingUp}
          color="emerald"
        />
        <SummaryCard
          label="Ortalama Marjin"
          value={`%${s?.margin ?? 0}`}
          sub="Kâr / Gelir oranı"
          icon={Percent}
          color="amber"
        />
      </div>

      {/* Aylık grafik */}
      {monthlyData.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Aylık Gelir / Maliyet / Kâr</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData} margin={{ top: 4, right: 10, left: 10, bottom: 0 }} barSize={14} barGap={3}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}/>
              <YAxis tickFormatter={fmtK} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={52}/>
              <Tooltip content={<ChartTooltip/>}/>
              <Legend
                formatter={v => ({ revenue: 'Gelir', cost: 'Maliyet', profit: 'Kâr' }[v] ?? v)}
                iconType="circle" iconSize={8}
                wrapperStyle={{ fontSize: 12, color: '#6b7280' }}
              />
              <Bar dataKey="revenue" name="revenue" fill="#0d9488" radius={[3,3,0,0]}/>
              <Bar dataKey="cost"    name="cost"    fill="#f87171" radius={[3,3,0,0]}/>
              <Bar dataKey="profit"  name="profit"  fill="#34d399" radius={[3,3,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Sipariş kâr tablosu */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Sipariş Bazlı Kâr Analizi</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['#', 'Müşteri', 'Ürün', 'Adet', 'Birim Fiyat', 'Birim Maliyet', 'Gelir', 'Maliyet', 'Kâr', 'Marjin', 'Durum'].map(h => (
                  <th key={h} className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tableLoading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(11)].map((_, j) => (
                      <td key={j} className="px-4 py-3.5">
                        <div className="h-4 bg-gray-100 rounded animate-pulse"/>
                      </td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-12 text-center text-gray-400 text-sm">
                    Henüz fiyatlandırılmış sipariş yok
                  </td>
                </tr>
              ) : (
                orders.map(o => (
                  <tr key={o.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-gray-400 text-xs">#{o.id}</td>
                    <td className="px-4 py-3.5 font-medium text-gray-800 max-w-[140px] truncate">{o.customer_name}</td>
                    <td className="px-4 py-3.5 text-gray-600 max-w-[100px] truncate">{o.product_type}</td>
                    <td className="px-4 py-3.5 text-gray-700 text-right">{o.quantity.toLocaleString('tr-TR')}</td>
                    <td className="px-4 py-3.5 text-right text-gray-700">{fmt(o.unit_price)}</td>
                    <td className="px-4 py-3.5 text-right text-gray-500">{fmt(o.unit_cost)}</td>
                    <td className="px-4 py-3.5 text-right font-semibold text-teal-700">{fmt(o.revenue)}</td>
                    <td className="px-4 py-3.5 text-right text-rose-600">{fmt(o.cost)}</td>
                    <td className={`px-4 py-3.5 text-right font-bold ${o.profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {fmt(o.profit)}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <MarginBadge value={o.margin}/>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={o.status}/>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Sayfalama */}
        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/50">
            <p className="text-sm text-gray-400">
              Sayfa {meta.current_page} / {meta.last_page} &mdash; toplam {meta.total} sipariş
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={meta.current_page === 1}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-200 hover:text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              ><ChevronLeft size={16}/></button>
              <button
                onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
                disabled={meta.current_page === meta.last_page}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-200 hover:text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              ><ChevronRight size={16}/></button>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
