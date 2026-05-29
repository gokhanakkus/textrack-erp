import { useState, useEffect, useCallback } from 'react'
import { Plus, Edit2, Trash2, Loader2, Search, Building2, Phone, Mail, MapPin } from 'lucide-react'
import { customersService } from '../services/customers'
import Modal from '../components/Modal'
import DataTable from '../components/DataTable'

function CustomerForm({ initial, onSubmit, loading }) {
  const [form, setForm] = useState({
    name: '', contact_person: '', email: '',
    phone: '', city: '', address: '', tax_no: '',
    ...initial,
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Şirket Adı *</label>
          <input value={form.name} onChange={e => set('name', e.target.value)} required className="input" placeholder="LC Waikiki A.Ş." />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">İrtibat Kişisi</label>
          <input value={form.contact_person} onChange={e => set('contact_person', e.target.value)} className="input" placeholder="Ad Soyad" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Telefon</label>
          <input value={form.phone} onChange={e => set('phone', e.target.value)} className="input" placeholder="0212 555 00 00" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">E-posta</label>
          <input type="email" value={form.email} onChange={e => set('email', e.target.value)} className="input" placeholder="tedarik@firma.com" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Şehir</label>
          <input value={form.city} onChange={e => set('city', e.target.value)} className="input" placeholder="İstanbul" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Vergi Numarası</label>
          <input value={form.tax_no} onChange={e => set('tax_no', e.target.value)} className="input" placeholder="1234567890" />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Adres</label>
          <textarea value={form.address} onChange={e => set('address', e.target.value)} rows={2} className="input resize-none" placeholder="Açık adres..." />
        </div>
      </div>
      <div className="flex justify-end pt-3 border-t border-gray-100">
        <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
          {loading && <Loader2 size={14} className="animate-spin" />}
          {initial ? 'Güncelle' : 'Kaydet'}
        </button>
      </div>
    </form>
  )
}

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [meta, setMeta]           = useState(null)
  const [loading, setLoading]     = useState(true)
  const [page, setPage]           = useState(1)
  const [search, setSearch]       = useState('')
  const [modal, setModal]         = useState(null)
  const [selected, setSelected]   = useState(null)
  const [saving, setSaving]       = useState(false)

  const fetch = useCallback(() => {
    setLoading(true)
    customersService.getAll({ page, search, per_page: 15 })
      .then(res => { setCustomers(res.data.data); setMeta(res.data.meta) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [page, search])

  useEffect(() => { fetch() }, [fetch])

  const handleCreate = async (form) => {
    setSaving(true)
    try { await customersService.create(form); setModal(null); fetch() }
    catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  const handleUpdate = async (form) => {
    setSaving(true)
    try { await customersService.update(selected.id, form); setModal(null); setSelected(null); fetch() }
    catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setSaving(true)
    try { await customersService.delete(selected.id); setModal(null); setSelected(null); fetch() }
    catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  const columns = [
    {
      key: 'name', label: 'Şirket',
      render: r => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'rgba(13,148,136,0.10)', border: '1.5px solid rgba(13,148,136,0.25)' }}>
            <Building2 size={14} style={{ color: '#0d9488' }} />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">{r.name}</div>
            {r.contact_person && <div className="text-xs text-gray-400">{r.contact_person}</div>}
          </div>
        </div>
      ),
    },
    {
      key: 'contact', label: 'İletişim',
      render: r => (
        <div className="space-y-0.5">
          {r.email && <div className="flex items-center gap-1.5 text-xs text-gray-500"><Mail size={11} />{r.email}</div>}
          {r.phone && <div className="flex items-center gap-1.5 text-xs text-gray-500"><Phone size={11} />{r.phone}</div>}
        </div>
      ),
    },
    {
      key: 'city', label: 'Şehir',
      render: r => r.city
        ? <div className="flex items-center gap-1 text-xs text-gray-600"><MapPin size={11} />{r.city}</div>
        : <span className="text-gray-300">—</span>,
    },
    {
      key: 'orders_count', label: 'Siparişler',
      render: r => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{ background: 'rgba(13,148,136,0.10)', color: '#0d9488' }}>
          {r.orders_count} sipariş
        </span>
      ),
    },
    {
      key: 'tax_no', label: 'Vergi No',
      render: r => <span className="font-mono text-xs text-gray-400">{r.tax_no || '—'}</span>,
    },
    {
      key: 'actions', label: '',
      render: row => (
        <div className="flex items-center gap-1 justify-end">
          <button onClick={() => { setSelected(row); setModal('edit') }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-teal-600 hover:bg-teal-50 transition-colors">
            <Edit2 size={14} />
          </button>
          <button onClick={() => { setSelected(row); setModal('delete') }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Müşteriler</h1>
          <p className="text-sm text-gray-500 mt-1">{meta?.total ?? 0} kayıtlı müşteri</p>
        </div>
        <button onClick={() => setModal('create')} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Yeni Müşteri
        </button>
      </div>

      {/* Arama */}
      <div className="relative w-72">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          placeholder="Şirket, kişi veya e-posta..."
          className="input pl-9"
        />
      </div>

      <DataTable columns={columns} data={customers} meta={meta} onPageChange={setPage} isLoading={loading} />

      {modal === 'create' && (
        <Modal title="Yeni Müşteri" onClose={() => setModal(null)}>
          <CustomerForm onSubmit={handleCreate} loading={saving} />
        </Modal>
      )}
      {modal === 'edit' && selected && (
        <Modal title="Müşteriyi Düzenle" onClose={() => { setModal(null); setSelected(null) }}>
          <CustomerForm initial={selected} onSubmit={handleUpdate} loading={saving} />
        </Modal>
      )}
      {modal === 'delete' && selected && (
        <Modal title="Müşteriyi Sil" onClose={() => { setModal(null); setSelected(null) }} size="sm">
          <p className="text-gray-600 mb-2">
            <strong className="text-gray-900">{selected.name}</strong> silinsin mi?
          </p>
          {selected.orders_count > 0 && (
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
              Bu müşteriye ait {selected.orders_count} sipariş var. Müşteri silinirse siparişlerden bağlantısı kopar.
            </p>
          )}
          <div className="flex justify-end gap-2 mt-5">
            <button onClick={() => { setModal(null); setSelected(null) }} className="btn-secondary">İptal</button>
            <button onClick={handleDelete} disabled={saving} className="btn-danger flex items-center gap-2">
              {saving && <Loader2 size={14} className="animate-spin" />} Sil
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
