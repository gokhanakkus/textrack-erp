const STATUS_STYLES = {
  // Sipariş durumları
  'Pending':         'bg-amber-50 text-amber-700 border border-amber-200',
  'In Production':   'bg-blue-50 text-blue-700 border border-blue-200',
  'Quality Control': 'bg-violet-50 text-violet-700 border border-violet-200',
  'Completed':       'bg-emerald-50 text-emerald-700 border border-emerald-200',
  'Delayed':         'bg-red-50 text-red-600 border border-red-200',
  // Üretim durumları
  'Waiting':         'bg-gray-100 text-gray-600 border border-gray-200',
  'Running':         'bg-blue-50 text-blue-700 border border-blue-200',
  'Paused':          'bg-orange-50 text-orange-700 border border-orange-200',
  // Kalite kontrol sonuçları
  'passed':          'bg-emerald-50 text-emerald-700 border border-emerald-200',
  'failed':          'bg-red-50 text-red-600 border border-red-200',
  'partial':         'bg-amber-50 text-amber-700 border border-amber-200',
}

const STATUS_LABELS = {
  'Pending':         'Beklemede',
  'In Production':   'Üretimde',
  'Quality Control': 'Kalite Kontrolde',
  'Completed':       'Tamamlandı',
  'Delayed':         'Gecikti',
  'Waiting':         'Bekliyor',
  'Running':         'Çalışıyor',
  'Paused':          'Duraklatıldı',
  'passed':          'Geçti',
  'failed':          'Başarısız',
  'partial':         'Kısmi',
}

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-600 border border-gray-200'
  const label = STATUS_LABELS[status] ?? status
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${style}`}>
      {label}
    </span>
  )
}
