import { useState, useEffect } from 'react'
import { Bell, CheckCheck, AlertTriangle, AlertCircle, Info, Package, Factory } from 'lucide-react'
import { notificationsService } from '../services/notifications'
import { timeAgo } from '../utils/formatters'

const TYPE_ICONS = {
  critical_stock:    { icon: Package,       color: 'text-red-500',    bg: 'bg-red-50 border-red-100' },
  delayed_order:     { icon: AlertTriangle, color: 'text-amber-500',  bg: 'bg-amber-50 border-amber-100' },
  production_stopped:{ icon: Factory,       color: 'text-orange-500', bg: 'bg-orange-50 border-orange-100' },
  quality_issue:     { icon: AlertCircle,   color: 'text-violet-500', bg: 'bg-violet-50 border-violet-100' },
  info:              { icon: Info,          color: 'text-blue-500',   bg: 'bg-blue-50 border-blue-100' },
}

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [unread, setUnread] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetch = () => {
    setLoading(true)
    notificationsService.getAll()
      .then(res => {
        setNotifications(Array.isArray(res.data.data) ? res.data.data : [])
        setUnread(res.data.unread_count ?? 0)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [])

  const markRead = async (id) => {
    try {
      await notificationsService.markRead(id)
      setNotifications(ns => ns.map(n => n.id === id ? { ...n, is_read: true } : n))
      setUnread(u => Math.max(0, u - 1))
    } catch {}
  }

  const markAllRead = async () => {
    try {
      await notificationsService.markAllRead()
      setNotifications(ns => ns.map(n => ({ ...n, is_read: true })))
      setUnread(0)
    } catch {}
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Bildirimler</h1>
          <p className="text-sm text-gray-500 mt-1">
            {unread > 0 ? <span className="font-semibold text-teal-600">{unread} okunmamış</span> : 'Tümü okundu'}
          </p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors shadow-sm font-medium">
            <CheckCheck size={15} className="text-teal-500" />
            Tümünü okundu işaretle
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-4 animate-pulse shadow-sm">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2.5 pt-1">
                  <div className="h-4 bg-gray-200 rounded-md w-48" />
                  <div className="h-3 bg-gray-100 rounded-md w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-14 text-center shadow-sm">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Bell size={26} className="text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">Henüz bildirim yok</p>
          <p className="text-gray-400 text-sm mt-1">Yeni bildirimler burada görünecek</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const conf = TYPE_ICONS[n.type] ?? TYPE_ICONS.info
            const Icon = conf.icon
            return (
              <div
                key={n.id}
                onClick={() => !n.is_read && markRead(n.id)}
                className={`bg-white border rounded-2xl p-4 transition-all cursor-pointer shadow-sm ${
                  n.is_read
                    ? 'border-gray-200 opacity-60'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className="flex gap-3.5 items-start">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${conf.bg}`}>
                    <Icon size={17} className={conf.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">{n.title}</p>
                      {!n.is_read && (
                        <span className="w-2 h-2 bg-teal-500 rounded-full shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1.5">{timeAgo(n.created_at)}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
