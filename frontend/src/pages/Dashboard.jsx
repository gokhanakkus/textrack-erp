import { useState, useEffect } from 'react'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import {
  ShoppingCart, Factory, CheckCircle, AlertTriangle,
  TrendingUp, Package, Activity
} from 'lucide-react'
import { dashboardService } from '../services/dashboard'
import DashboardCard from '../components/DashboardCard'
import { SkeletonCard } from '../components/LoadingSkeleton'

const PIE_COLORS = ['#0d9488', '#f59e0b', '#ef4444', '#22c55e', '#a855f7']

const DEFECT_LABELS = {
  stitching_error:  'Dikiş Hatası',
  color_difference: 'Renk Farkı',
  torn_fabric:      'Yırtık Kumaş',
  print_error:      'Baskı Hatası',
}

const CHART_STYLE = {
  background: '#ffffff',
  border: '1px solid #f1f5f9',
  borderRadius: '12px',
  color: '#374151',
  fontSize: '12px',
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07)',
}

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardService.get()
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const s = data?.stats ?? {}
  const defectRate = s.defect_rate != null ? `${Number(s.defect_rate).toFixed(1)}%` : '0%'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Panel</h1>
        <p className="text-sm text-gray-500 mt-1">Tekstil üretim genel görünümü</p>
      </div>

      {/* KPI Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <DashboardCard title="Toplam Sipariş"    value={s.total_orders}       subtitle="Tüm zamanlar"     icon={ShoppingCart} color="blue" />
            <DashboardCard title="Üretimde"           value={s.running_productions} subtitle="Aktif hatlar"    icon={Factory}      color="yellow" />
            <DashboardCard title="Tamamlanan"         value={s.completed_orders}   subtitle="Bu dönem"        icon={CheckCircle}  color="green" />
            <DashboardCard title="Kritik Stok"        value={s.critical_stocks}    subtitle="Eşiğin altında"  icon={AlertTriangle} color="red" />
          </>
        )}
      </div>

      {/* İkinci satır */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <DashboardCard title="Aktif Siparişler"   value={s.active_orders}  icon={Activity}      color="blue" />
        <DashboardCard title="Geciken Siparişler" value={s.delayed_orders} icon={AlertTriangle} color="red" />
        <DashboardCard title="Hata Oranı"         value={defectRate}       icon={TrendingUp}    color="purple" subtitle="Kalite kontrol ölçütü" />
      </div>

      {/* Grafikler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Haftalık Üretim */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Haftalık Üretim</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data?.weekly_production ?? []} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" stroke="#d1d5db" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis stroke="#d1d5db" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={CHART_STYLE} cursor={{ fill: '#f8fafc' }} />
              <Bar dataKey="count" name="Üretimler" fill="#0d9488" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Hata Dağılımı */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Hata Dağılımı</h2>
          {(data?.defect_distribution ?? []).length === 0 ? (
            <div className="flex items-center justify-center h-52 text-gray-400 text-sm">Hata verisi yok</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={(data?.defect_distribution ?? []).map(d => ({ ...d, name: DEFECT_LABELS[d.name] ?? d.name }))}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={78}
                  innerRadius={32}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {(data?.defect_distribution ?? []).map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={CHART_STYLE} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Aylık Verimlilik */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-800 mb-4">Aylık Üretim Verimliliği (%)</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data?.monthly_efficiency ?? []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="month" stroke="#d1d5db" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis stroke="#d1d5db" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} domain={[0, 100]} />
            <Tooltip contentStyle={CHART_STYLE} />
            <Line
              type="monotone"
              dataKey="efficiency"
              name="Verimlilik"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={{ fill: '#10b981', r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
