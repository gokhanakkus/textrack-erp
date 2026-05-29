import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const FEATURES = [
  'Gerçek zamanlı üretim takibi',
  'Sipariş ve stok yönetimi',
  'Kalite kontrol raporları',
]

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@textrack.com')
  const [password, setPassword] = useState('password')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message ?? 'Geçersiz e-posta veya şifre')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Sol panel ── */}
      <div
        className="hidden lg:flex lg:w-5/12 flex-col items-center justify-center p-14 relative overflow-hidden select-none"
        style={{ background: 'linear-gradient(145deg, #042f2e 0%, #0f4c4c 40%, #0e7490 100%)' }}
      >
        {/* Dekoratif halkalar */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full border border-teal-400/10" />
          <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full border border-teal-400/10" />
          <div className="absolute -bottom-32 -right-32 w-[480px] h-[480px] rounded-full border border-cyan-400/8" />
          <div className="absolute bottom-12 right-12 w-72 h-72 rounded-full border border-cyan-400/10" />
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.12) 0%, transparent 70%)' }}
          />
        </div>

        <div className="relative z-10 text-center max-w-[17rem]">

          {/* Logo */}
          <div
            className="inline-flex rounded-2xl overflow-hidden mb-8"
            style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.1)' }}
          >
            <img src="/logo.png" alt="TexTrack ERP" className="h-32 w-auto object-contain" />
          </div>

          {/* Marka adı — login ile aynı gradient konsepti */}
          <h1 className="text-4xl font-black tracking-tight leading-none mb-2">
            <span className="text-white">Tex</span><span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)' }}
            >Track</span>
          </h1>

          <p
            className="text-[11px] font-bold tracking-[0.3em] uppercase mb-6"
            style={{ color: '#2dd4bf' }}
          >
            ERP Yönetim Sistemi
          </p>

          <p
            className="text-sm leading-7 mb-10"
            style={{ color: 'rgba(255,255,255,0.60)' }}
          >
            Tekstil üretim süreçlerinizi<br />tek platformdan yönetin.
          </p>

          {/* Özellik listesi — stat kutular yerine */}
          <div className="text-left space-y-3.5">
            {FEATURES.map(f => (
              <div key={f} className="flex items-center gap-3">
                <CheckCircle2
                  size={15}
                  strokeWidth={2.5}
                  style={{ color: '#2dd4bf', flexShrink: 0 }}
                />
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>{f}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ── Sağ panel — form ── */}
      <div className="flex-1 bg-gray-50 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">

          {/* Mobil logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <img src="/logo.png" alt="TexTrack ERP" className="h-12 w-12 object-contain" />
            <div>
              <div className="font-black text-sm tracking-tight">
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: 'linear-gradient(135deg, #0d9488, #0891b2)' }}
                >
                  TexTrack
                </span>
              </div>
              <div className="text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: '#0d9488' }}>ERP</div>
            </div>
          </div>

          <h2 className="text-2xl font-black text-gray-900 mb-1 tracking-tight">Giriş Yap</h2>
          <p className="text-gray-500 text-sm mb-8">Üretim panelinize erişin</p>

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">E-posta</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="input"
                placeholder="siz@textrack.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Şifre</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="input pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-white border border-gray-200 rounded-xl text-xs text-gray-400 shadow-sm">
            <p className="font-semibold text-gray-500 mb-1.5">Demo hesapları</p>
            <p>admin@textrack.com / password</p>
            <p className="mt-0.5">manager@textrack.com / password</p>
          </div>
        </div>
      </div>

    </div>
  )
}
