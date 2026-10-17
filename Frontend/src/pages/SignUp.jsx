import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const SignUp = () => {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'User',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await signup(form)
      if (res.success) {
        if (form.role === 'Admin') {
          navigate('/admin/bookings')
        } else {
          navigate('/')
        }
      } else {
        setError(res.msg || 'Registration failed')
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF8E7] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-7">
          <Link to="/" className="inline-flex flex-col items-center gap-3">
            <img
              src="/logo.webp"
              alt="Aamir"
              className="h-20 w-auto object-contain"
            />
            <h1 className="font-serif text-4xl tracking-[0.18em] text-[#1A1A1A] font-semibold">
              AAMIR
            </h1>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#C0392B]">
              Cafe · Bakers · Hall
            </p>
            <p className="text-[9px] uppercase tracking-[0.3em] text-[#F5A623] font-semibold">
              Since 1985
            </p>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-[#FFFDF7] rounded-2xl border border-[#F5A623]/20 shadow-[0_15px_45px_rgba(107,76,42,0.08)] px-7 py-8 sm:px-9">
          <div className="text-center mb-7">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#C0392B] font-medium">
              Join Us
            </p>
            <h1 className="font-serif text-3xl text-[#1A1A1A] mt-2 font-semibold">
              Create Account
            </h1>
            <p className="text-sm text-[#6B4C2A] mt-2">
              Create your Aamir Cafe account
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-[#C0392B]/10 border border-[#C0392B]/30 px-4 py-3 text-sm text-[#C0392B]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                required
                value={form.name}
                onChange={onChange}
                placeholder="Enter your name"
                className="w-full border border-[#F5A623]/25 rounded-lg px-4 py-3 text-sm text-[#1A1A1A] bg-[#FFFDF7] outline-none transition focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 placeholder:text-[#6B4C2A]/40"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={onChange}
                placeholder="Enter your email"
                className="w-full border border-[#F5A623]/25 rounded-lg px-4 py-3 text-sm text-[#1A1A1A] bg-[#FFFDF7] outline-none transition focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 placeholder:text-[#6B4C2A]/40"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={onChange}
                placeholder="Min 6 characters"
                className="w-full border border-[#F5A623]/25 rounded-lg px-4 py-3 text-sm text-[#1A1A1A] bg-[#FFFDF7] outline-none transition focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 placeholder:text-[#6B4C2A]/40"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Register As
              </label>
              <select
                name="role"
                value={form.role}
                onChange={onChange}
                className="w-full border border-[#F5A623]/25 rounded-lg px-4 py-3 text-sm bg-[#FFFDF7] text-[#1A1A1A] outline-none transition focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20"
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
              <p className="text-xs text-[#6B4C2A]/60 mt-2">
                Delivery riders are added by an admin from the admin panel.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#F5A623] to-[#E8941A] text-[#1A1A1A] py-3 rounded-lg font-semibold text-sm tracking-wide transition duration-300 hover:shadow-[0_8px_25px_rgba(245,166,35,0.4)] disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-[#6B4C2A]">
            Already have an account?
            <Link
              to="/login"
              className="ml-1 text-[#C0392B] font-semibold hover:text-[#F5A623] transition"
            >
              Login
            </Link>
          </div>
        </div>

        <div className="text-center mt-5">
          <Link
            to="/"
            className="text-xs uppercase tracking-[0.2em] text-[#6B4C2A]/60 hover:text-[#F5A623] transition"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SignUp