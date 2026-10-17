import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Truck,
  MapPin,
  Phone,
  Check,
  Package,
  Navigation,
  Clock,
  User,
} from 'lucide-react'
import {
  getAvailableForDelivery,
  claimOrder,
  getMyDeliveries,
  updateOrderLocation,
  markDelivered,
} from '../../api/orders.js'
import { useAuth } from '../../context/AuthContext.jsx'

const TABS = ['Available', 'My Deliveries', 'Completed']

const DeliveryDashboard = () => {
  const { user } = useAuth()
  const [tab, setTab] = useState('Available')
  const [available, setAvailable] = useState([])
  const [active, setActive] = useState([])
  const [completed, setCompleted] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(null)

  const load = async () => {
    try {
      const [av, mine] = await Promise.all([
        getAvailableForDelivery(),
        getMyDeliveries(user?._id),
      ])
      if (av.success) setAvailable(av.AllOrders || [])
      if (mine.success) {
        setActive(mine.activeOrders || [])
        setCompleted(mine.completedOrders || [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, 15000)
    return () => clearInterval(interval)
  }, [user])

  // Live location broadcasting
  useEffect(() => {
    if (!user?._id) return
    if (!navigator.geolocation) return

    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords

        // Update for all active orders this delivery man owns
        for (const o of active) {
          try {
            await updateOrderLocation(o._id, latitude, longitude)
          } catch (e) {
            /* silent */
          }
        }
      },
      (err) => console.warn('Geo error:', err),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [user, active.length])

  const handleClaim = async (orderId) => {
    setBusy(orderId)
    try {
      const res = await claimOrder(orderId, user._id)
      if (res.success) {
        load()
        setTab('My Deliveries')
      } else {
        alert(res.msg)
      }
    } catch (e) {
      alert('Failed to claim')
    } finally {
      setBusy(null)
    }
  }

  const handleDelivered = async (orderId) => {
    if (!window.confirm('Mark as delivered?')) return
    setBusy(orderId)
    try {
      const res = await markDelivered(orderId)
      if (res.success) {
        load()
        setTab('Completed')
      }
    } catch (e) {
      alert('Failed')
    } finally {
      setBusy(null)
    }
  }

  const counts = {
    Available: available.length,
    'My Deliveries': active.length,
    Completed: completed.length,
  }

  const list =
    tab === 'Available' ? available : tab === 'My Deliveries' ? active : completed

  return (
    <div>
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#C0392B] mb-2 font-semibold">
          Aamir Delivery
        </p>
        <h1 className="font-serif text-4xl text-[#1A1A1A] font-semibold">
          Delivery Dashboard
        </h1>
        <p className="mt-2 text-sm text-[#6B4C2A]">
          Welcome, {user?.name}. Your live location is broadcasting.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex flex-wrap gap-2 border-b border-[#F5A623]/20 pb-4">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-5 py-2 text-[11px] font-bold uppercase tracking-wider transition ${
              tab === t
                ? 'bg-gradient-to-r from-[#F5A623] to-[#E8941A] text-[#1A1A1A]'
                : 'border border-[#1A1A1A]/10 text-[#6B4C2A] hover:border-[#F5A623]/50'
            }`}
          >
            {t}
            <span className="ml-2 opacity-70">({counts[t]})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : list.length === 0 ? (
        <div className="bg-[#FFFDF7] rounded-2xl border border-[#F5A623]/25 p-12 text-center">
          <Package className="h-12 w-12 text-[#F5A623] mx-auto mb-4" />
          <p className="font-medium text-[#1A1A1A]">
            {tab === 'Available' ? 'No available orders right now' : 'Nothing here'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {list.map((o) => (
              <motion.div
                key={o._id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-[#F5A623]/25 bg-[#FFFDF7] overflow-hidden"
              >
                <div className="p-5 border-b border-[#F5A623]/15 flex justify-between items-center">
                  <p className="font-semibold text-[#1A1A1A]">
                    Order #{o._id.slice(-6).toUpperCase()}
                  </p>
                  <span className="text-xs text-[#6B4C2A]">
                    {new Date(o.createdAt).toLocaleTimeString()}
                  </span>
                </div>

                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Info icon={User} label="Customer" value={o.customerName} />
                    <Info icon={Phone} label="Phone" value={o.phone} />
                    <Info icon={MapPin} label="City" value={o.address?.city} />
                    <Info
                      icon={Clock}
                      label="Total"
                      value={`Rs. ${o.total}`}
                    />
                  </div>

                  {/* Full address */}
                  <div className="rounded-xl bg-[#F5A623]/5 border border-[#F5A623]/20 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-[#6B4C2A] font-semibold mb-1">
                      Full Address
                    </p>
                    <p className="text-sm text-[#1A1A1A]">
                      {o.address?.street}, {o.address?.city}
                    </p>
                    {o.address?.lat && (
                      <a
                        href={`https://www.google.com/maps?q=${o.address.lat},${o.address.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-[#C0392B] hover:underline"
                      >
                        <Navigation className="h-3.5 w-3.5" />
                        Open in Google Maps
                      </a>
                    )}
                  </div>

                  {/* Items */}
                  <div className="rounded-xl bg-[#FFF8E7] border border-[#F5A623]/20 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-[#6B4C2A] font-semibold mb-2">
                      Items to deliver
                    </p>
                    {o.items?.map((it, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-[#1A1A1A]">
                          {it.foodName} × {it.quantity}
                        </span>
                        <span className="text-[#6B4C2A]">
                          Rs. {it.price * it.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {tab === 'Available' && (
                      <button
                        onClick={() => handleClaim(o._id)}
                        disabled={busy === o._id}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#F5A623] to-[#E8941A] text-[#1A1A1A] py-3 text-xs font-bold uppercase tracking-wider hover:shadow-[0_4px_15px_rgba(245,166,35,0.4)] transition disabled:opacity-50"
                      >
                        <Truck className="h-4 w-4" />
                        {busy === o._id ? 'Claiming...' : 'Accept Delivery'}
                      </button>
                    )}

                    {tab === 'My Deliveries' && (
                      <>
                        {o.phone && (
                          <a
                            href={`tel:${o.phone}`}
                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-[#F5A623]/40 text-[#C97D12] py-3 text-xs font-bold uppercase tracking-wider hover:bg-[#F5A623] hover:text-[#1A1A1A] transition"
                          >
                            <Phone className="h-4 w-4" />
                            Call
                          </a>
                        )}
                        <button
                          onClick={() => handleDelivered(o._id)}
                          disabled={busy === o._id}
                          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 text-xs font-bold uppercase tracking-wider hover:shadow-lg transition disabled:opacity-50"
                        >
                          <Check className="h-4 w-4" />
                          Mark Delivered
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

const Info = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-2">
    <Icon className="h-4 w-4 text-[#C0392B] mt-0.5 shrink-0" />
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-wider text-[#6B4C2A] font-semibold">
        {label}
      </p>
      <p className="text-sm text-[#1A1A1A] font-medium truncate">
        {value || '—'}
      </p>
    </div>
  </div>
)

export default DeliveryDashboard