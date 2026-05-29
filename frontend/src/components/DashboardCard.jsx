import { TrendingUp, TrendingDown } from 'lucide-react'

const COLORS = {
  blue: {
    border:    'border-teal-100',
    iconBg:    'rgba(13,148,136,0.10)',
    iconBorder:'rgba(13,148,136,0.25)',
    iconColor: '#0d9488',
    value:     'text-teal-700',
  },
  green: {
    border:    'border-emerald-100',
    iconBg:    'rgba(5,150,105,0.10)',
    iconBorder:'rgba(5,150,105,0.25)',
    iconColor: '#059669',
    value:     'text-emerald-700',
  },
  yellow: {
    border:    'border-amber-100',
    iconBg:    'rgba(217,119,6,0.10)',
    iconBorder:'rgba(217,119,6,0.25)',
    iconColor: '#d97706',
    value:     'text-amber-700',
  },
  red: {
    border:    'border-rose-100',
    iconBg:    'rgba(225,29,72,0.10)',
    iconBorder:'rgba(225,29,72,0.25)',
    iconColor: '#e11d48',
    value:     'text-rose-700',
  },
  purple: {
    border:    'border-indigo-100',
    iconBg:    'rgba(99,102,241,0.10)',
    iconBorder:'rgba(99,102,241,0.25)',
    iconColor: '#6366f1',
    value:     'text-indigo-700',
  },
}

export default function DashboardCard({ title, value, subtitle, icon: Icon, color = 'blue', trend }) {
  const c = COLORS[color] ?? COLORS.blue

  const displayValue = typeof value === 'string'
    ? value
    : (value == null ? '—' : value.toLocaleString('tr-TR'))

  return (
    <div className={`bg-white rounded-2xl p-5 border ${c.border} shadow-sm hover:shadow-md transition-all duration-200 group`}>
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200"
          style={{
            background: c.iconBg,
            border: `1.5px solid ${c.iconBorder}`,
          }}
        >
          {Icon && <Icon size={20} strokeWidth={2} style={{ color: c.iconColor }} />}
        </div>

        {trend != null && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${trend >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
            {trend >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <p className={`text-3xl font-bold tracking-tight ${c.value}`}>{displayValue}</p>
      <p className="text-sm font-semibold text-gray-700 mt-1.5">{title}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  )
}
