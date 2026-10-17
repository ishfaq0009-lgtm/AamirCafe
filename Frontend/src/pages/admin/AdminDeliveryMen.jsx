import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Plus,
  Trash2,
  Bike,
  Phone,
  Mail,
  X,
  Check,
  Pencil,
} from 'lucide-react'
import {
  createDeliveryMan,
  getAllDeliveryMen,
  deleteDeliveryMan,
  updateDeliveryMan,
} from '../../api/delivery.js'

const emptyForm = {
  name: '',
  email: '',
  password: '',
  phone: '',
  vehicle: 'Bike',
  vehicleNumber: '',
}

const AdminDeliveryMen = () => {
  const [men, setMen] = useState([])
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState(null) // 'create' | 'edit'
  const [editingId, setEditingId] = useState(null)
  const [busy, setBusy] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [imageFile, setImageFile] = useState(null)

  const load = async () => {
    try {
      const res = await getAllDeliveryMen()
      if (res.success) setMen(res.deliveryMen || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const openCreate = () => {
    setForm(emptyForm)
    setImageFile(null)
    setEditingId(null)
    setMode('create')
  }

  const openEdit = (man) => {
    setForm({
      name: man.name || '',
      email: man.email || '',
      password: '',
      phone: man.phone || '',
      vehicle: man.vehicle || 'Bike',
      vehicleNumber: man.vehicleNumber || '',
    })
    setImageFile(null)
    setEditingId(man._id)
    setMode('edit')
  }

  const close = () => {
    setMode(null)
    setEditingId(null)
    setForm(emptyForm)
    setImageFile(null)
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setBusy('create')
    try {
      const res = await createDeliveryMan(form)
      if (res.success) {
        close()
        load()
      } else alert(res.msg || 'Failed')
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed')
    } finally {
      setBusy(null)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setBusy('update')
    try {
      const fd = new FormData()
      fd.append('id', editingId)
      fd.append('name', form.name)
      fd.append('email', form.email)
      fd.append('phone', form.phone)
      fd.append('vehicle', form.vehicle)
      fd.append('vehicleNumber', form.vehicleNumber)
      if (form.password) fd.append('password', form.password)
      if (imageFile) fd.append('profileImage', imageFile)

      const res = await updateDeliveryMan(fd)
      if (res.success) {
        close()
        load()
      } else alert(res.msg || 'Failed')
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed')
    } finally {
      setBusy(null)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this delivery man?')) return
    setBusy(id)
    try {
      const res = await deleteDeliveryMan(id)
      if (res.success) setMen((prev) => prev.filter((m) => m._id !== id))
    } catch (e) {
      alert('Failed')
    } finally {
      setBusy(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#C0392B] mb-2 font-semibold">
            Aamir Cafe
          </p>
          <h1 className="font-serif text-4xl text-[#1A1A1A] font-semibold">
            Delivery Men
          </h1>
          <p className="mt-2 text-sm text-[#6B4C2A]">
            Manage your delivery team — add, update or remove riders.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#F5A623] to-[#E8941A] px-5 py-3 text-sm font-bold text-[#1A1A1A] hover:shadow-[0_8px_25px_rgba(245,166,35,0.4)] transition"
        >
          <Plus className="h-4 w-4" />
          Add Delivery Man
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : men.length === 0 ? (
        <div className="bg-[#FFFDF7] rounded-2xl border border-[#F5A623]/25 p-12 text-center">
          <Bike className="h-12 w-12 text-[#F5A623] mx-auto mb-4" />
          <p className="font-medium text-[#1A1A1A]">No delivery men yet</p>
          <p className="text-sm text-[#6B4C2A] mt-1">
            Add your first delivery man to start assigning orders.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {men.map((m) => (
            <motion.div
              key={m._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#FFFDF7] rounded-2xl border border-[#F5A623]/25 p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#F5A623] to-[#E8941A] flex items-center justify-center text-xl font-bold text-[#1A1A1A] overflow-hidden">
                  {m.profileImage ? (
                    <img
                      src={m.profileImage}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    m.name?.charAt(0)?.toUpperCase()
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1A1A1A] truncate">
                    {m.name}
                  </p>
                  <p className="text-xs text-[#6B4C2A] flex items-center gap-1 mt-0.5">
                    <Bike className="h-3 w-3" />
                    {m.vehicle} · {m.vehicleNumber || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#6B4C2A] mb-4">
                <p className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-[#C0392B]" />
                  <span className="truncate">{m.email}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-[#C0392B]" />
                  {m.phone || 'N/A'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-lg bg-[#F5A623]/10 p-3 text-center">
                  <p className="font-serif text-xl font-bold text-[#C0392B]">
                    {m.totalDeliveries || 0}
                  </p>
                  <p className="text-[9px] uppercase tracking-wider text-[#6B4C2A] font-semibold mt-0.5">
                    Deliveries
                  </p>
                </div>
                <div className="rounded-lg bg-[#F5A623]/10 p-3 text-center">
                  <p className="font-serif text-xl font-bold text-[#C0392B]">
                    ★ {m.rating || 5}
                  </p>
                  <p className="text-[9px] uppercase tracking-wider text-[#6B4C2A] font-semibold mt-0.5">
                    Rating
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(m)}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-[#F5A623]/40 bg-[#F5A623]/5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#C97D12] hover:bg-[#F5A623] hover:text-[#1A1A1A] transition"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(m._id)}
                  disabled={busy === m._id}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-[#C0392B]/40 bg-[#C0392B]/5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#C0392B] hover:bg-[#C0392B] hover:text-white transition disabled:opacity-40"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {mode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={close}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FFFDF7] rounded-2xl border border-[#F5A623]/25 w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl font-semibold text-[#1A1A1A]">
                  {mode === 'create' ? 'Add Delivery Man' : 'Update Delivery Man'}
                </h2>
                <button
                  onClick={close}
                  className="text-[#6B4C2A] hover:text-[#C0392B]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form
                onSubmit={mode === 'create' ? handleCreate : handleUpdate}
                className="space-y-4"
              >
                {mode === 'edit' && (
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#C0392B] font-bold mb-2">
                      Profile Image (optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files[0])}
                      className="w-full rounded-xl border border-[#F5A623]/25 bg-[#FFF8E7] px-4 py-3 text-sm"
                    />
                  </div>
                )}

                <Input
                  label="Full Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
                <Input
                  label={
                    mode === 'create'
                      ? 'Password'
                      : 'New Password (leave empty to keep)'
                  }
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required={mode === 'create'}
                  minLength={mode === 'create' ? 6 : 0}
                />
                <Input
                  label="Phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#C0392B] font-bold mb-2">
                      Vehicle
                    </label>
                    <select
                      value={form.vehicle}
                      onChange={(e) =>
                        setForm({ ...form, vehicle: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#F5A623]/25 bg-[#FFF8E7] px-4 py-3 text-sm text-[#1A1A1A] outline-none focus:border-[#F5A623]"
                    >
                      <option>Bike</option>
                      <option>Car</option>
                      <option>Van</option>
                      <option>Bicycle</option>
                    </select>
                  </div>
                  <Input
                    label="Vehicle No."
                    value={form.vehicleNumber}
                    onChange={(e) =>
                      setForm({ ...form, vehicleNumber: e.target.value })
                    }
                  />
                </div>

                <button
                  type="submit"
                  disabled={busy === 'create' || busy === 'update'}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#F5A623] to-[#E8941A] text-[#1A1A1A] py-3 rounded-full font-bold text-sm uppercase tracking-[0.15em] hover:shadow-[0_8px_25px_rgba(245,166,35,0.4)] transition disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                  {mode === 'create'
                    ? busy === 'create'
                      ? 'Creating...'
                      : 'Create Delivery Man'
                    : busy === 'update'
                    ? 'Saving...'
                    : 'Save Changes'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const Input = ({ label, value, onChange, type = 'text', ...props }) => (
  <div>
    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#C0392B] font-bold mb-2">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full rounded-xl border border-[#F5A623]/25 bg-[#FFF8E7] px-4 py-3 text-sm text-[#1A1A1A] outline-none focus:border-[#F5A623]"
      {...props}
    />
  </div>
)

export default AdminDeliveryMen