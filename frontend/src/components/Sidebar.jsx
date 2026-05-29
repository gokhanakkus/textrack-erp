import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, ShoppingCart, Package, Factory,
  CheckSquare, Bell, LogOut, Users, TrendingUp
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const navItems = [
  { to: '/dashboard',       label: 'Panel',          icon: LayoutDashboard },
  { to: '/customers',       label: 'Müşteriler',     icon: Users },
  { to: '/orders',          label: 'Siparişler',     icon: ShoppingCart },
  { to: '/stocks',          label: 'Stok Yönetimi',  icon: Package },
  { to: '/production',      label: 'Üretim',         icon: Factory },
  { to: '/quality-control', label: 'Kalite Kontrol', icon: CheckSquare },
  { to: '/finance',         label: 'Finans',          icon: TrendingUp },
  { to: '/notifications',   label: 'Bildirimler',    icon: Bell },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">

      {/* ── Logo + Yazı ── */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
        <img
          src="/logo.png"
          alt="TexTrack ERP"
          className="h-10 w-10 object-contain shrink-0"
        />
        <div className="min-w-0">
          {/* "Tex" koyu sabit, "Track" gradient — login ile aynı iki-ton pattern */}
          <div className="text-sm font-black tracking-tight leading-tight">
            <span className="text-gray-900">Tex</span><span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)' }}
            >Track</span>
          </div>
          <div
            className="text-[10px] font-bold tracking-[0.22em] uppercase leading-tight mt-0.5"
            style={{ color: '#0d9488' }}
          >
            ERP
          </div>
        </div>
      </div>

      {/* ── Navigasyon ── */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'text-white shadow-md'
                  : 'text-gray-600 hover:bg-teal-50 hover:text-teal-700'
              }`
            }
            style={({ isActive }) => isActive ? {
              background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)',
              boxShadow: '0 4px 12px rgba(13,148,136,0.30)',
            } : {}}
          >
            {({ isActive }) => (
              <>
                <span className={`flex items-center justify-center w-7 h-7 rounded-lg shrink-0 transition-colors ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-500 group-hover:bg-teal-100 group-hover:text-teal-600'
                }`}>
                  <Icon size={15} strokeWidth={isActive ? 2.5 : 2} />
                </span>
                <span className="flex-1 leading-none">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Kullanıcı ── */}
      <div className="p-3 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm"
            style={{ background: 'linear-gradient(135deg, #0d9488, #0891b2)' }}
          >
            {user?.name?.charAt(0)?.toUpperCase() ?? 'K'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-gray-800 truncate leading-tight">{user?.name}</div>
            <div className="text-[11px] text-gray-400 truncate capitalize leading-tight mt-0.5">
              {user?.role?.replace(/_/g, ' ')}
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Çıkış Yap"
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>

    </aside>
  )
}
