import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  Package,
  MapPin,
  Truck,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  CreditCard,
} from 'lucide-react'
import { getMyOrders } from '../../api/orders.js'
import { useAuth } from '../../context/AuthContext.jsx'

const STATUS_COLORS = {
  Pending: 'bg-[#F5A623]/15 text-[#C97D12] border-[#F5A623]/40',
  Accepted: 'bg-blue-500/10 text-blue-700 border-blue-500/30',
  Preparing: 'bg-indigo-500/10 text-indigo-700 border-indigo-500/30',
  Ready: 'bg-purple-500/10 text-purple-700 border-purple-500/30',
  'Out for Delivery': 'bg-orange-500/10 text-orange-700 border-orange-500/30',
  Delivered: 'bg-green-500/10 text-green-700 border-green-500/30',
  Rejected: 'bg-[#C0392B]/10 text-[#C0392B] border-[#C0392B]/30',
  Cancelled: 'bg-gray-500/10 text-gray-600 border-gray-500/30',
}

const MyOrders = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        if (!user?._id) return
        const res = await getMyOrders(user._id)
        if (res.success) setOrders(res.AllOrders || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    })()
  }, [user])

  return (
    <div className="min-h-screen bg-[#FFF8E7] px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#C0392B] font-semibold mb-2">
          Aamir Cafe
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#1A1A1A] mb-8">
          My Orders
        </h1>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-[#FFFDF7] rounded-2xl border border-[#F5A623]/25 p-12 text-center">
            <Package className="h-12 w-12 text-[#F5A623] mx-auto mb-4" />
            <p className="font-medium text-[#1A1A1A]">No orders yet</p>
            <p className="text-sm text-[#6B4C2A] mt-1">
              Start ordering from our delicious menu!
            </p>
            <Link
              to="/fast-food"
              className="mt-6 inline-block rounded-full bg-gradient-to-r from-[#F5A623] to-[#E8941A] px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] text-[#1A1A1A] transition hover:shadow-[0_8px_20px_rgba(245,166,35,0.4)]"
            >
              Browse Food
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <motion.div
                key={o._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#FFFDF7] rounded-2xl border border-[#F5A623]/25 overflow-hidden shadow-sm hover:shadow-md transition"
              >
                {/* Header */}
                <div className="p-5 border-b border-[#F5A623]/15 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5A623]/15">
                      <Package className="h-5 w-5 text-[#C0392B]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1A1A1A] text-sm">
                        Order #{o._id.slice(-6).toUpperCase()}
                      </p>
                      <p className="text-xs text-[#6B4C2A]">
                        {new Date(o.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                      STATUS_COLORS[o.status] || STATUS_COLORS.Pending
                    }`}
                  >
                    {o.status}
                  </span>
                </div>

                {/* Items preview */}
                <div className="p-5 flex flex-wrap gap-3">
                  {o.items?.slice(0, 3).map((it, i) => (
                    <div key={i} className="flex items-center gap-2">
                      {it.image && (
                        <img
                          src={it.image}
                          alt={it.foodName}
                          className="w-10 h-10 rounded-lg object-cover border border-[#F5A623]/20"
                        />
                      )}
                      <div className="text-xs">
                        <p className="font-semibold text-[#1A1A1A]">
                          {it.foodName}
                        </p>
                        <p className="text-[#6B4C2A]">
                          ×{it.quantity} · Rs. {it.price}
                        </p>
                      </div>
                    </div>
                  ))}
                  {o.items?.length > 3 && (
                    <span className="text-xs text-[#6B4C2A] self-center">
                      +{o.items.length - 3} more
                    </span>
                  )}
                </div>

                {/* Bottom row */}
                <div className="px-5 pb-5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-4 text-xs text-[#6B4C2A]">
                    <span className="flex items-center gap-1.5">
                      <CreditCard className="h-3.5 w-3.5 text-[#C0392B]" />
                      {o.paymentMethod}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-[#C0392B]" />
                      {o.address?.city}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-serif text-xl font-bold text-[#C0392B]">
                      Rs. {o.total}
                    </span>

                    {(o.status === 'Out for Delivery' ||
                      o.status === 'Delivered') && (
                      <Link
                        to={`/track-order/${o._id}`}
                        className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#F5A623] to-[#E8941A] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] hover:shadow-[0_4px_15px_rgba(245,166,35,0.4)] transition"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Track
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrders