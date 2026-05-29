export const formatDate = (date) => {
  if (!date) return '—'
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit', month: 'short', year: 'numeric',
  }).format(new Date(date))
}

export const formatNumber = (n) => {
  if (n == null) return '—'
  if (typeof n === 'string') return n
  return new Intl.NumberFormat('tr-TR').format(n)
}

export const formatMeter = (n) => {
  if (n == null) return '—'
  return `${parseFloat(n).toFixed(2)} m`
}

export const formatPercent = (n) => {
  if (n == null) return '—'
  return `${Math.round(n)}%`
}

export const timeAgo = (dateStr) => {
  if (!dateStr) return '—'
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'şimdi'
  if (mins < 60) return `${mins} dk önce`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} sa önce`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days} gün önce`
  return formatDate(dateStr)
}
