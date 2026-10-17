import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useAuth } from '../context/AuthContext.jsx'
import Logo from './Logo.jsx'
import {
  User,
  LogOut,
  Utensils,
  Building2,
  LayoutDashboard,
  ChevronDown,
} from 'lucide-react'

const UserNavbar = () => {
  const [open, setOpen] = useState(false)
  const [userMenu, setUserMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const menuRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/fast-food', label: 'Fast Foods' },
    { to: '/sweets', label: 'Sweets' },
    { to: '/cafe', label: 'Café' },
    { to: '/cakes', label: 'Cakes' },
    { to: '/deals', label: 'Deals' },
    { to: '/booking', label: 'Marriage Hall' },
    { to: '/contact', label: 'Contact' },
  ]

  const handleLogout = () => {
    logout()
    setOpen(false)
    setUserMenu(false)
    navigate('/')
  }

  const menuItems =
    user?.role === 'Admin'
      ? [
          { to: '/admin/bookings', label: 'Admin Panel', Icon: LayoutDashboard },
          { to: '/admin/orders', label: 'All Orders', Icon: Utensils },
          { to: '/admin/bookings', label: 'All Bookings', Icon: Building2 },
        ]
      : [
          { to: '/profile', label: 'My Profile', Icon: User },
          { to: '/my-orders', label: 'My Orders', Icon: Utensils },
          { to: '/my-bookings', label: 'My Bookings', Icon: Building2 },
        ]

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ${
          scrolled
            ? 'bg-[#FFF8E7]/95 backdrop-blur-2xl border-b border-[#F5A623]/25 py-3 shadow-[0_4px_20px_rgba(107,76,42,0.06)]'
            : 'bg-[#FFF8E7]/85 backdrop-blur-xl border-b border-[#F5A623]/15 py-4'
        }`}
      >
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">
          <div className="flex items-center justify-between">
            <Logo variant="dark" />

            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `relative text-[12px] font-medium uppercase tracking-[0.15em] transition-colors duration-300 group ${
                      isActive
                        ? 'text-[#C0392B]'
                        : 'text-[#1A1A1A]/70 hover:text-[#C0392B]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      <span
                        className={`absolute -bottom-1 left-0 h-0.5 bg-[#F5A623] transition-all duration-500 ${
                          isActive ? 'w-full' : 'w-0 group-hover:w-full'
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-4">
              {user ? (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setUserMenu(!userMenu)}
                    className="group flex items-center gap-2 rounded-full border border-[#F5A623]/30 bg-white/60 px-4 py-2 text-[13px] font-medium text-[#1A1A1A] transition hover:border-[#F5A623] hover:bg-[#F5A623]/10"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#F5A623] to-[#E8941A] flex items-center justify-center text-[10px] font-bold text-[#1A1A1A] overflow-hidden">
                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        (user.name || 'U').charAt(0).toUpperCase()
                      )}
                    </div>
                    <span className="max-w-[100px] truncate">
                      {user.name?.split(' ')[0] || 'Profile'}
                    </span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform ${
                        userMenu ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {userMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 rounded-2xl border border-[#F5A623]/25 bg-[#FFFDF7] shadow-[0_15px_40px_rgba(107,76,42,0.15)] overflow-hidden"
                      >
                        <div className="border-b border-[#F5A623]/15 px-4 py-3">
                          <p className="text-[10px] uppercase tracking-[0.2em] text-[#C0392B] font-semibold">
                            Signed in as
                          </p>
                          <p className="mt-1 text-sm font-medium text-[#1A1A1A] truncate">
                            {user.email}
                          </p>
                        </div>

                        <div className="p-2">
                          {menuItems.map((item) => (
                            <Link
                              key={item.to}
                              to={item.to}
                              onClick={() => setUserMenu(false)}
                              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] transition hover:bg-[#F5A623]/10"
                            >
                              <item.Icon className="h-4 w-4 text-[#C0392B]" />
                              {item.label}
                            </Link>
                          ))}
                        </div>

                        <div className="border-t border-[#F5A623]/15 p-2">
                          <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#C0392B] transition hover:bg-[#C0392B]/10"
                          >
                            <LogOut className="h-4 w-4" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-[13px] font-medium uppercase tracking-[0.15em] text-[#1A1A1A]/80 transition hover:text-[#C0392B]"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="rounded-full bg-gradient-to-r from-[#F5A623] to-[#E8941A] px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A] transition-all duration-500 hover:shadow-[0_8px_25px_rgba(245,166,35,0.5)]"
                  >
                    Reserve
                  </Link>
                </>
              )}
            </div>

            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 text-[#1A1A1A]"
              aria-label="Menu"
            >
              <div className="w-7 h-5 flex flex-col justify-between">
                <span
                  className={`h-0.5 bg-[#C0392B] transition-all duration-300 ${
                    open ? 'rotate-45 translate-y-2' : ''
                  }`}
                />
                <span
                  className={`h-0.5 bg-[#C0392B] transition-all duration-300 ${
                    open ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`h-0.5 bg-[#C0392B] transition-all duration-300 ${
                    open ? '-rotate-45 -translate-y-2' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 top-[70px] z-40 bg-[#FFF8E7]/98 backdrop-blur-2xl lg:hidden overflow-y-auto"
          >
            <div className="px-8 pt-10 pb-16">
              <div className="flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.5 }}
                  >
                    <NavLink
                      to={link.to}
                      end={link.to === '/'}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `block border-b border-[#F5A623]/15 py-4 font-serif text-3xl transition-colors ${
                          isActive
                            ? 'text-[#C0392B]'
                            : 'text-[#1A1A1A]/85 hover:text-[#C0392B]'
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  </motion.div>
                ))}
              </div>

              {user && (
                <div className="mt-8 border-t border-[#F5A623]/15 pt-6">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#C0392B] font-semibold mb-3">
                    My Account
                  </p>
                  <div className="flex flex-col gap-1">
                    {menuItems.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#1A1A1A] hover:bg-[#F5A623]/10 transition"
                      >
                        <item.Icon className="h-4 w-4 text-[#C0392B]" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex gap-3">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="flex-1 rounded-full bg-[#C0392B] py-4 text-xs font-bold uppercase tracking-[0.2em] text-white inline-flex items-center justify-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setOpen(false)}
                      className="flex-1 rounded-full border border-[#1A1A1A]/20 py-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1A1A]"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setOpen(false)}
                      className="flex-1 rounded-full bg-gradient-to-r from-[#F5A623] to-[#E8941A] py-4 text-center text-xs font-bold uppercase tracking-[0.2em] text-[#1A1A1A]"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default UserNavbar