import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, ChevronDown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { notificationsService } from '../services/notifications'

export default function Navbar() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [unread, setUnread] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    notificationsService.getAll()
      .then(res => setUnread(res.data.unread_count ?? 0))
      .catch(() => {})
  }, [])

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <span className="text-gray-400 text-sm font-medium select-none">
        Tekstil Üretim Yönetim Sistemi
      </span>

      <div className="flex items-center gap-1">
        {/* Bildirim */}
        <button
          onClick={() => navigate('/notifications')}
          className="relative p-2 rounded-lg text-gray-400 hover:bg-teal-50 hover:text-teal-600 transition-colors"
          title="Bildirimler"
        >
          <Bell size={18} />
          {unread > 0 && (
            <span className="absolute top-1.5 right-1.5 w-[18px] h-[18px] bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center leading-none">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>

        {/* Kullanıcı */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-teal-50 transition-colors ml-1"
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm shrink-0"
              style={{ background: 'linear-gradient(135deg, #0d9488, #0891b2)' }}
            >
              {user?.name?.charAt(0)?.toUpperCase() ?? 'K'}
            </div>
            <span className="text-sm text-gray-700 hidden md:block font-medium">{user?.name}</span>
            <ChevronDown size={13} className={`text-gray-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 mt-1.5 w-52 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100" style={{ background: '#f0fdfa' }}>
                  <div className="text-sm font-semibold text-gray-900">{user?.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5 capitalize">{user?.role?.replace(/_/g, ' ')}</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
