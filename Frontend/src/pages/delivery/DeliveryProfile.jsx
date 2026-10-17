import { useState } from 'react'
import { motion } from 'motion/react'
import { Save, Upload, User, Bike, Phone, Lock } from 'lucide-react'
import { updateMyProfile } from '../../api/delivery.js'
import { useAuth } from '../../context/AuthContext.jsx'

const DeliveryProfile = () => {
  const { user, updateUser } = useAuth()

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    vehicle: user?.vehicle || 'Bike',
    vehicleNumber: user?.vehicleNumber || '',
    password: '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState(user?.profileImage || '')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  const update = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.value }))

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMsg('')
    setError('')
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('id', user._id)
      fd.append('name', form.name)
      fd.append('phone', form.phone)
      fd.append('vehicle', form.vehicle)
      fd.append('vehicleNumber', form.vehicleNumber)
      if (form.password) fd.append('password', form.password)
      if (imageFile) fd.append('profileImage', imageFile)

      const res = await updateMyProfile(fd)
      if (res.success) {
        updateUser({
          name: res.user.name,
          phone: res.user.phone,
          vehicle: res.user.vehicle,
          vehicleNumber: res.user.vehicleNumber,
          profileImage: res.user.profileImage,
        })
        setMsg('Profile updated successfully!')
        setForm((p) => ({ ...p, password: '' }))
        setImageFile(null)
      } else {
        setError(res.msg || 'Update failed')
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#C0392B] mb-2 font-semibold">
          Aamir Delivery
        </p>
        <h1 className="font-serif text-4xl text-[#1A1A1A] font-semibold">
          My Profile
        </h1>
        <p className="mt-2 text-sm text-[#6B4C2A]">
          Update your rider profile and vehicle details.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl bg-[#FFFDF7] rounded-2xl border border-[#F5A623]/25 p-6 sm:p-8 shadow-sm"
      >
        {/* Avatar */}
        <div className="flex items-center gap-5 mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-[#F5A623] to-[#E8941A] flex items-center justify-center text-3xl font-bold text-[#1A1A1A]">
              {preview ? (
                <img src={preview} alt="" className="w-full h-full object-cover" />
              ) : (
                (form.name || 'R').charAt(0).toUpperCase()
              )}
            </div>
            <label className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#1A1A1A] text-white cursor-pointer hover:bg-[#C0392B] transition">
              <Upload className="h-3.5 w-3.5" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="hidden"
              />
            </label>
          </div>
          <div>
            <p className="font-serif text-2xl font-semibold text-[#1A1A1A]">
              {form.name || 'Rider'}
            </p>
            <p className="text-sm text-[#6B4C2A]">{user?.email}</p>
            <span className="mt-1 inline-block rounded-full bg-[#C0392B]/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#C0392B]">
              Delivery Rider
            </span>
          </div>
        </div>

        {msg && (
          <div className="mb-5 rounded-lg bg-green-500/10 border border-green-500/30 px-4 py-3 text-sm text-green-700">
            {msg}
          </div>
        )}
        {error && (
          <div className="mb-5 rounded-lg bg-[#C0392B]/10 border border-[#C0392B]/30 px-4 py-3 text-sm text-[#C0392B]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Full Name"
            icon={User}
            value={form.name}
            onChange={update('name')}
            required
          />
          <Input
            label="Phone"
            icon={Phone}
            value={form.phone}
            onChange={update('phone')}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#C0392B] font-bold mb-2">
                Vehicle Type
              </label>
              <div className="relative">
                <Bike className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C0392B]" />
                <select
                  value={form.vehicle}
                  onChange={update('vehicle')}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#F5A623]/25 bg-[#FFF8E7] text-sm text-[#1A1A1A] outline-none focus:border-[#F5A623]"
                >
                  <option>Bike</option>
                  <option>Car</option>
                  <option>Van</option>
                  <option>Bicycle</option>
                </select>
              </div>
            </div>
            <Input
              label="Vehicle Number"
              value={form.vehicleNumber}
              onChange={update('vehicleNumber')}
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#C0392B] font-bold mb-2">
              New Password (optional)
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C0392B]" />
              <input
                type="password"
                value={form.password}
                onChange={update('password')}
                placeholder="Leave empty to keep current password"
                minLength={6}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#F5A623]/25 bg-[#FFF8E7] text-sm text-[#1A1A1A] outline-none focus:border-[#F5A623] placeholder:text-[#6B4C2A]/40"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#F5A623] to-[#E8941A] text-[#1A1A1A] py-3.5 rounded-full font-bold text-sm uppercase tracking-[0.2em] transition-all hover:shadow-[0_8px_25px_rgba(245,166,35,0.4)] disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

const Input = ({ label, icon: Icon, value, onChange, type = 'text', ...props }) => (
  <div>
    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#C0392B] font-bold mb-2">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C0392B]" />
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full ${
          Icon ? 'pl-11' : 'px-4'
        } pr-4 py-3 rounded-xl border border-[#F5A623]/25 bg-[#FFF8E7] text-sm text-[#1A1A1A] outline-none focus:border-[#F5A623]`}
        {...props}
      />
    </div>
  </div>
)

export default DeliveryProfile