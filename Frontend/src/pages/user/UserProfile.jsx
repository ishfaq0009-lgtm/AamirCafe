import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  Utensils,
  Building2,
  PlusCircle,
  LogOut,
  Save,
  User,
  Phone,
  Lock,
  Upload,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { updateMyProfile } from '../../api/user.js'

const UserProfile = () => {
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
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

  const handleSave = async (e) => {
    e.preventDefault()
    setMsg('')
    setError('')
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('id', user._id)
      fd.append('name', form.name)
      fd.append('phone', form.phone)
      if (form.password) fd.append('password', form.password)
      if (imageFile) fd.append('profileImage', imageFile)

      const res = await updateMyProfile(fd)
      if (res.success) {
        updateUser({
          name: res.user.name,
          phone: res.user.phone,
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

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#FFF8E7] px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs uppercase tracking-[0.3em] text-[#C0392B] mb-2 font-semibold">
          My Account
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#1A1A1A] font-semibold mb-10">
          Profile
        </h1>

        {/* Profile card + Edit form */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: identity card */}
          <div className="lg:col-span-2 bg-[#FFFDF7] rounded-2xl border border-[#F5A623]/25 p-6 shadow-[0_15px_45px_rgba(107,76,42,0.08)]">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-5">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-[#F5A623] to-[#E8941A] flex items-center justify-center text-3xl font-bold text-[#1A1A1A]">
                  {preview ? (
                    <img
                      src={preview}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    (form.name || 'U').charAt(0).toUpperCase()
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

              <h2 className="text-xl font-semibold text-[#1A1A1A]">
                {form.name || 'User'}
              </h2>
              <p className="text-sm text-[#6B4C2A] mt-0.5">{user?.email}</p>
              {form.phone && (
                <p className="text-xs text-[#6B4C2A] mt-1">📞 {form.phone}</p>
              )}
              <span className="mt-3 inline-block rounded-full bg-[#C0392B]/10 px-3 py-1 text-xs font-semibold text-[#C0392B]">
                {user?.role}
              </span>
            </div>

            <div className="mt-8 space-y-3">
              <ProfileLink to="/my-orders" label="My Orders" Icon={Utensils} />
              <ProfileLink
                to="/my-bookings"
                label="My Bookings"
                Icon={Building2}
              />
              <ProfileLink
                to="/booking"
                label="New Booking"
                Icon={PlusCircle}
              />
            </div>

            <button
              onClick={handleLogout}
              className="mt-6 w-full bg-[#1A1A1A] text-[#FFF8E7] py-3 rounded-full font-semibold text-sm transition hover:bg-[#C0392B] inline-flex items-center justify-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>

          {/* Right: edit form */}
          <div className="lg:col-span-3 bg-[#FFFDF7] rounded-2xl border border-[#F5A623]/25 p-6 sm:p-8 shadow-[0_15px_45px_rgba(107,76,42,0.08)]">
            <h3 className="font-serif text-2xl font-semibold text-[#1A1A1A] mb-6">
              Edit Profile
            </h3>

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

            <form onSubmit={handleSave} className="space-y-5">
              <InputField
                label="Full Name"
                icon={User}
                value={form.name}
                onChange={update('name')}
                required
              />
              <InputField
                label="Phone Number (optional)"
                icon={Phone}
                value={form.phone}
                onChange={update('phone')}
                placeholder="e.g. 03XX-XXXXXXX"
              />
              <InputField
                label="New Password (optional)"
                icon={Lock}
                type="password"
                value={form.password}
                onChange={update('password')}
                placeholder="Leave empty to keep current password"
                minLength={6}
              />

              <p className="text-xs text-[#6B4C2A]/60">
                Your email address cannot be changed.
              </p>

              <button
                type="submit"
                disabled={saving}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#F5A623] to-[#E8941A] text-[#1A1A1A] py-3.5 rounded-full font-bold text-sm uppercase tracking-[0.2em] transition-all hover:shadow-[0_8px_25px_rgba(245,166,35,0.4)] disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

const ProfileLink = ({ to, label, Icon }) => (
  <Link
    to={to}
    className="flex items-center gap-3 border border-[#F5A623]/25 rounded-xl py-3 px-4 hover:border-[#F5A623] hover:bg-[#F5A623]/5 transition group"
  >
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5A623]/15 transition group-hover:bg-[#F5A623]/25">
      <Icon className="h-4 w-4 text-[#C0392B]" />
    </div>
    <span className="text-sm font-medium text-[#1A1A1A]">{label}</span>
    <span className="ml-auto text-[#C0392B] opacity-40 group-hover:opacity-100 transition">
      →
    </span>
  </Link>
)

const InputField = ({
  label,
  icon: Icon,
  value,
  onChange,
  type = 'text',
  ...props
}) => (
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
        } pr-4 py-3 rounded-xl border border-[#F5A623]/25 bg-[#FFF8E7] text-sm text-[#1A1A1A] outline-none focus:border-[#F5A623] placeholder:text-[#6B4C2A]/40`}
        {...props}
      />
    </div>
  </div>
)

export default UserProfile