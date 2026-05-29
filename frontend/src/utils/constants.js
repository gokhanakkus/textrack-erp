export const ORDER_STATUSES = ['Pending', 'In Production', 'Quality Control', 'Completed', 'Delayed']

export const ORDER_STATUS_LABELS = {
  'Pending':         'Beklemede',
  'In Production':   'Üretimde',
  'Quality Control': 'Kalite Kontrolde',
  'Completed':       'Tamamlandı',
  'Delayed':         'Gecikti',
}

export const PRODUCTION_STATUSES = ['Waiting', 'Running', 'Paused', 'Completed']

export const PRODUCTION_STATUS_LABELS = {
  'Waiting':   'Bekliyor',
  'Running':   'Çalışıyor',
  'Paused':    'Duraklatıldı',
  'Completed': 'Tamamlandı',
}

export const DEFECT_TYPES = [
  { value: 'stitching_error',  label: 'Dikiş Hatası' },
  { value: 'color_difference', label: 'Renk Farkı' },
  { value: 'torn_fabric',      label: 'Yırtık Kumaş' },
  { value: 'print_error',      label: 'Baskı Hatası' },
  { value: 'none',             label: 'Hata Yok' },
]

export const QC_RESULTS = [
  { value: 'passed',  label: 'Geçti' },
  { value: 'failed',  label: 'Başarısız' },
  { value: 'partial', label: 'Kısmi' },
]

export const USER_ROLES = [
  { value: 'admin',              label: 'Yönetici' },
  { value: 'production_manager', label: 'Üretim Müdürü' },
  { value: 'warehouse_staff',    label: 'Depo Personeli' },
  { value: 'quality_control',    label: 'Kalite Kontrol' },
]

export const PRODUCTION_LINES = ['Hat-A', 'Hat-B', 'Hat-C', 'Hat-D']
