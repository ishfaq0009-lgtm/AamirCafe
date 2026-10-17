import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  Phone,
  MapPin,
  Truck,
  Package,
  CheckCircle2,
  Clock,
  Navigation,
} from 'lucide-react'
import { getOrder } from '../../api/orders.js'

const StatusTimeline = ({ status }) => {
  const steps = ['Pending', 'Accepted', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered']
  const currentIdx = steps.indexOf(status)

  return (
    <div className="rounded-2xl bg-[#FFFDF7] border border-[#F5A623]/25 p-6">
      <h3 className="font-serif text-lg font-semibold text-[#1A1A1A] mb-5">
        Order Progress
      </h3>
      <div className="relative">
        <div className="absolute left-4 top-2 bottom-2 w-px bg-[#F5A623]/20" />
        {steps.map((s, i) => {
          const done = i <= currentIdx
          const active = i === currentIdx
          return (
            <div key={s} className="relative flex items-center gap-4 mb-4 last:mb-0">
              <div
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${
                  done
                    ? 'border-[#F5A623] bg-gradient-to-br from-[#F5A623] to-[#E8941A]'
                    : 'border-[#F5A623]/25 bg-[#FFFDF7]'
                }`}
              >
                {i < currentIdx ? (
                  <CheckCircle2 className="h-4 w-4 text-[#1A1A1A]" />
                ) : active ? (
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="h-2 w-2 rounded-full bg-[#1A1A1A]"
                  />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-[#F5A623]/40" />
                )}
              </div>
              <span
                className={`text-sm font-medium ${
                  done ? 'text-[#1A1A1A]' : 'text-[#6B4C2A]/50'
                }`}
              >
                {s}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const OrderTracking = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(null)

  const load = async () => {
    try {
      const res = await getOrder(id)
      if (res.success) {
        setOrder(res.order)
        setLastUpdate(new Date())
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // Auto-refresh every 5 seconds to keep live location fresh
    const interval = setInterval(load, 5000)
    return () => clearInterval(interval)
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8E7] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FFF8E7] flex flex-col items-center justify-center gap-4 pt-20">
        <p className="text-[#6B4C2A]">Order not found</p>
        <Link
          to="/my-orders"
          className="bg-gradient-to-r from-[#F5A623] to-[#E8941A] text-[#1A1A1A] px-6 py-3 rounded-full font-bold"
        >
          Back to Orders
        </Link>
      </div>
    )
  }

  const delivery = order.deliveryPerson
  const hasLive = order.deliveryLocation?.lat && order.deliveryLocation?.lng
  const userLoc = order.address?.lat && order.address?.lng

  // Build Google Maps embed URL
  const mapSrc = hasLive && userLoc
    ? `https://www.google.com/maps?q=${order.deliveryLocation.lat},${order.deliveryLocation.lng}&z=14&output=embed`
    : userLoc
    ? `https://www.google.com/maps?q=${order.address.lat},${order.address.lng}&z=14&output=embed`
    : ''

  return (
    <div className="min-h-screen bg-[#FFF8E7] py-16 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/my-orders"
            className="text-xs uppercase tracking-[0.2em] text-[#6B4C2A] hover:text-[#C0392B] font-semibold"
          >
            ← Back to Orders
          </Link>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#1A1A1A] mt-3">
            Track Order
          </h1>
          <p className="text-sm text-[#6B4C2A] mt-1">
            Order #{order._id.slice(-8).toUpperCase()}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Timeline + summary */}
          <div className="lg:col-span-1 space-y-6">
            <StatusTimeline status={order.status} />

            {/* Delivery man card */}
            {delivery && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-[#FFFDF7] border border-[#F5A623]/25 p-6"
              >
                <h3 className="font-serif text-lg font-semibold text-[#1A1A1A] mb-4">
                  Your Delivery Man
                </h3>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#F5A623] to-[#E8941A] flex items-center justify-center text-xl font-bold text-[#1A1A1A]">
                    {delivery.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#1A1A1A] truncate">
                      {delivery.name}
                    </p>
                    <p className="text-xs text-[#6B4C2A]">
                      {delivery.vehicle} · {delivery.vehicleNumber}
                    </p>
                  </div>
                </div>

                {delivery.phone && (
                  <a
                    href={`tel:${delivery.phone}`}
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#F5A623] to-[#E8941A] text-[#1A1A1A] py-3 font-bold text-xs uppercase tracking-wider hover:shadow-[0_4px_15px_rgba(245,166,35,0.4)] transition"
                  >
                    <Phone className="h-4 w-4" />
                    Call Delivery Man
                  </a>
                )}
              </motion.div>
            )}

            {/* Order total */}
            <div className="rounded-2xl bg-[#FFFDF7] border border-[#F5A623]/25 p-6">
              <h3 className="font-serif text-lg font-semibold text-[#1A1A1A] mb-4">
                Summary
              </h3>
              <div className="space-y-2 text-sm">
                {order.items?.map((it, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-[#6B4C2A]">
                      {it.foodName} × {it.quantity}
                    </span>
                    <span className="font-medium text-[#1A1A1A]">
                      Rs. {it.price * it.quantity}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between text-[#6B4C2A] pt-2 border-t border-[#F5A623]/15">
                  <span>Delivery</span>
                  <span>Rs. {order.deliveryCharges}</span>
                </div>
              </div>
              <div className="flex justify-between items-center border-t border-[#F5A623]/20 pt-4 mt-4">
                <span className="font-semibold text-[#1A1A1A]">Total</span>
                <span className="font-serif text-2xl font-bold text-[#C0392B]">
                  Rs. {order.total}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Map */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-[#FFFDF7] border border-[#F5A623]/25 overflow-hidden">
              <div className="p-5 border-b border-[#F5A623]/15 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#1A1A1A]">
                    Live Location
                  </h3>
                  <p className="text-xs text-[#6B4C2A]">
                    {lastUpdate && `Updated ${lastUpdate.toLocaleTimeString()}`}
                  </p>
                </div>
                {hasLive && (
                  <span className="flex items-center gap-2 text-xs text-green-600 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    LIVE
                  </span>
                )}
              </div>

              {mapSrc ? (
                <iframe
                  title="Order Tracking Map"
                  src={mapSrc}
                  className="w-full h-[500px] border-0"
                  loading="lazy"
                />
              ) : (
                <div className="h-[500px] flex flex-col items-center justify-center text-[#6B4C2A] gap-3">
                  <MapPin className="h-12 w-12 text-[#F5A623]" />
                  <p>Waiting for live location...</p>
                </div>
              )}
            </div>

            {/* Address card */}
            <div className="mt-6 rounded-2xl bg-[#FFFDF7] border border-[#F5A623]/25 p-6">
              <h3 className="font-serif text-lg font-semibold text-[#1A1A1A] mb-3 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#C0392B]" />
                Delivery Address
              </h3>
              <p className="text-sm text-[#6B4C2A] leading-7">
                {order.address?.label} · {order.address?.street}
                <br />
                {order.address?.city}, {order.address?.state} {order.address?.zipCode}
              </p>
              <p className="text-sm text-[#1A1A1A] font-semibold mt-3">
                📞 {order.phone || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderTracking