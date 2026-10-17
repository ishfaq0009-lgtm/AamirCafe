import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios.js'

const AdminDashboard = () => {
  const [stats, setStats] = useState({ bookings: 0, orders: 0, foods: 0 })

  useEffect(() => {
    ;(async () => {
      try {
        const [b, f] = await Promise.all([
          api.get('/Booking/AllBookingHall'),
          api.get('/AddNewFastFood/AllFoodApi'),
        ])
        setStats({
          bookings: b.data.AllBookingData?.length || 0,
          foods: f.data.AllFood?.length || 0,
          orders: 0,
        })
      } catch (e) {
        console.error(e)
      }
    })()
  }, [])

  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.3em] text-[#C0392B] mb-2 font-semibold">
        Aamir Admin
      </p>
      <h1 className="font-serif text-4xl text-[#1A1A1A] font-semibold mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard title="Total Bookings" value={stats.bookings} icon="🏛️" />
        <StatCard title="Total Orders" value={stats.orders} icon="🍽️" />
        <StatCard title="Food Items" value={stats.foods} icon="🥘" />
        <StatCard title="Revenue" value="Rs. 0" icon="💰" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <QuickCard
          to="/admin/bookings"
          title="Manage Bookings"
          desc="Review and manage marriage hall bookings"
          icon="🏛️"
        />
        <QuickCard
          to="/admin/food"
          title="Manage Food Menu"
          desc="View, add and update menu items"
          icon="🥘"
        />
      </div>
    </div>
  )
}

const StatCard = ({ title, value, icon }) => (
  <div className="bg-[#FFFDF7] rounded-2xl border border-[#F5A623]/25 p-6 shadow-sm hover:shadow-md transition">
    <div className="flex items-center justify-between mb-3">
      <span className="text-2xl">{icon}</span>
    </div>
    <p className="text-xs uppercase tracking-wider text-[#6B4C2A] font-semibold">
      {title}
    </p>
    <p className="mt-1 font-serif text-3xl text-[#1A1A1A] font-semibold">
      {value}
    </p>
  </div>
)

const QuickCard = ({ to, title, desc, icon }) => (
  <Link
    to={to}
    className="bg-[#FFFDF7] rounded-2xl border border-[#F5A623]/25 p-6 shadow-sm hover:border-[#F5A623] hover:shadow-md transition group"
  >
    <div className="flex items-start gap-4">
      <span className="text-3xl">{icon}</span>
      <div className="flex-1">
        <h3 className="font-serif text-xl text-[#1A1A1A] font-semibold">
          {title}
        </h3>
        <p className="mt-1 text-sm text-[#6B4C2A]">{desc}</p>
      </div>
      <span className="text-[#F5A623] text-2xl transition-transform group-hover:translate-x-1">
        →
      </span>
    </div>
  </Link>
)

export default AdminDashboard