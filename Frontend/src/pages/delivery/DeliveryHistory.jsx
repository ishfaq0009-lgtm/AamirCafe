import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { CheckCircle2, Package, Phone } from 'lucide-react'
import { getMyDeliveries } from '../../api/orders.js'
import { useAuth } from '../../context/AuthContext.jsx'

const DeliveryHistory = () => {
  const { user } = useAuth()
  const [completed, setCompleted] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        if (!user?._id) return
        const res = await getMyDeliveries(user._id)
        if (res.success) setCompleted(res.completedOrders || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    })()
  }, [user])

  return (
    <div>
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#C0392B] mb-2 font-semibold">
          Aamir Delivery
        </p>
        <h1 className="font-serif text-4xl text-[#1A1A1A] font-semibold">
          Delivery History
        </h1>
        <p className="mt-2 text-sm text-[#6B4C2A]">
          All the orders you have successfully delivered.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : completed.length === 0 ? (
        <div className="bg-[#FFFDF7] rounded-2xl border border-[#F5A623]/25 p-12 text-center">
          <Package className="h-12 w-12 text-[#F5A623] mx-auto mb-4" />
          <p className="font-medium text-[#1A1A1A]">No completed deliveries yet</p>
          <p className="text-sm text-[#6B4C2A] mt-1">
            Completed orders will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {completed.map((o) => (
            <motion.div
              key={o._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-[#F5A623]/25 bg-[#FFFDF7] p-5 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-[#1A1A1A]">
                    Order #{o._id.slice(-6).toUpperCase()}
                  </p>
                  <p className="text-xs text-[#6B4C2A]">
                    {new Date(o.deliveredAt || o.updatedAt).toLocaleString()}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 border border-green-500/30 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-green-700">
                  <CheckCircle2 className="h-3 w-3" />
                  Delivered
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                <Info label="Customer" value={o.customerName} />
                <Info label="Phone" value={o.phone} icon={Phone} />
                <Info label="Total" value={`Rs. ${o.total}`} />
              </div>

              <div className="mt-3 pt-3 border-t border-[#F5A623]/15">
                <p className="text-[10px] uppercase tracking-wider text-[#6B4C2A] font-semibold mb-1">
                  Delivered to
                </p>
                <p className="text-xs text-[#1A1A1A]/80">
                  {o.address?.street}, {o.address?.city}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

const Info = ({ label, value }) => (
  <div>
    <p className="text-[10px] uppercase tracking-wider text-[#6B4C2A] font-semibold">
      {label}
    </p>
    <p className="text-sm text-[#1A1A1A] font-medium truncate">{value || '—'}</p>
  </div>
)

export default DeliveryHistory