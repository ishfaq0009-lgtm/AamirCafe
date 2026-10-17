import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  LayoutDashboard,
  History,
  User,
  LogOut,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import Logo from './Logo.jsx'

const DeliverySidebar = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const items = [
    { to: '/delivery', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/delivery/history', label: 'History', icon: History },
    { to: '/delivery/profile', label: 'My Profile', icon: User },
  ]

  return (
    <aside className="w-64 flex flex-col bg-[#FFFDF7] border-r border-[#F5A623]/25 min-h-screen shadow-sm">
      <div className="p-6 border-b border-[#F5A623]/20">
        <Logo variant="dark" />
        <span className="mt-3 inline-block rounded-full bg-[#C0392B]/10 text-[#C0392B] px-3 py-1 text-[9px] font-bold uppercase tracking-wider">
          Rider Panel
        </span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-[#F5A623] to-[#E8941A] text-[#1A1A1A] font-semibold shadow-[0_4px_15px_rgba(245,166,35,0.3)]'
                  : 'text-[#6B4C2A] hover:bg-[#F5A623]/10 hover:text-[#1A1A1A]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="delivery-nav-active"
                    className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 bg-[#C0392B]"
                  />
                )}
                <item.icon className="h-4 w-4" />
                <span className="font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-[#F5A623]/20 space-y-1">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#6B4C2A] transition hover:bg-[#C0392B]/10 hover:text-[#C0392B]"
        >
          <LogOut className="h-4 w-4" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default DeliverySidebar