import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Check,
  X,
  Truck,
  User,
  MapPin,
  CreditCard,
  Eye,
  Clock,
} from 'lucide-react'
import {
  getAllOrders,
  updateOrderStatus,
  assignDelivery,
} from '../../api/orders.js'
import { getAllDeliveryMen } from '../../api/delivery.js'

const TABS = ['All', 'Pending', 'Accepted', 'Preparing', 'Out for Delivery', 'Delivered', 'Rejected']

const STATUS_STYLES = {
  Pending: 'bg-[#F5A623]/15 text-[#C97D12] border-[#F5A623]/40',
  Accepted: 'bg-blue-500/10 text-blue-700 border-blue-500/30',
  Preparing: 'bg-indigo-500/10 text-indigo-700 border-indigo-500/30',
  Ready: 'bg-purple-500/10 text-purple-700 border-purple-500/30',
  'Out for Delivery': 'bg-orange-500/10 text-orange-700 border-orange-500/30',
  Delivered: 'bg-green-500/10 text-green-700 border-green-500/30',
  Rejected: 'bg-[#C0392B]/10 text-[#C0392B] border-[#C0392B]/30',
  Cancelled: 'bg-gray-500/10 text-gray-600 border-gray-500/30',
}

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [deliveryMen, setDeliveryMen] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('All')
  const [busy, setBusy] = useState(null)
  const [assigning, setAssigning] = useState(null)

  const load = async () => {
    try {
      const [ordersRes, menRes] = await Promise.all([
        getAllOrders(),
        getAllDeliveryMen(),
      ])
      if (ordersRes.success) setOrders(ordersRes.AllOrders || [])
      if (menRes.success) setDeliveryMen(menRes.deliveryMen || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleStatus = async (id, status) => {
    if (status === 'Rejected' && !window.confirm('Reject this order?')) return
    setBusy(id)
    try {
      const res = await updateOrderStatus(id, status)
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === id ? { ...o, status } : o))
        )
      } else {
        alert(res.msg || 'Failed')
      }
    } catch (e) {
      alert('Failed')
    } finally {
      setBusy(null)
    }
  }

  const handleAssign = async (orderId, deliveryId) => {
    setBusy(orderId)
    try {
      const res = await assignDelivery(orderId, deliveryId)
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? res.order : o))
        )
        setAssigning(null)
      } else {
        alert(res.msg || 'Failed to assign')
      }
    } catch (e) {
      alert('Failed to assign')
    } finally {
      setBusy(null)
    }
  }

  const filtered = tab === 'All' ? orders : orders.filter((o) => o.status === tab)
  const counts = {
    All: orders.length,
    Pending: orders.filter((o) => o.status === 'Pending').length,
    Accepted: orders.filter((o) => o.status === 'Accepted').length,
    Preparing: orders.filter((o) => o.status === 'Preparing').length,
    'Out for Delivery': orders.filter((o) => o.status === 'Out for Delivery').length,
    Delivered: orders.filter((o) => o.status === 'Delivered').length,
    Rejected: orders.filter((o) => o.status === 'Rejected').length,
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#C0392B] mb-2 font-semibold">
          Aamir Cafe
        </p>
        <h1 className="font-serif text-4xl text-[#1A1A1A] font-semibold">Orders</h1>
        <p className="mt-2 text-sm text-[#6B4C2A]">
          Manage food orders, assign delivery men, track progress.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex flex-wrap gap-2 border-b border-[#F5A623]/20 pb-4">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition ${
              tab === t
                ? 'bg-gradient-to-r from-[#F5A623] to-[#E8941A] text-[#1A1A1A]'
                : 'border border-[#1A1A1A]/10 text-[#6B4C2A] hover:border-[#F5A623]/50 hover:text-[#1A1A1A]'
            }`}
          >
            {t}
            <span className="ml-2 opacity-70">({counts[t] ?? 0})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#FFFDF7] rounded-2xl border border-[#F5A623]/25 p-12 text-center text-[#6B4C2A]">
          No orders in this category.
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filtered.map((o) => (
              <motion.div
                key={o._id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-[#F5A623]/25 bg-[#FFFDF7] overflow-hidden shadow-sm"
              >
                <div className="p-5 border-b border-[#F5A623]/15 flex flex-wrap justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[#1A1A1A]">
                      Order #{o._id.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-xs text-[#6B4C2A]">
                      {new Date(o.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                      STATUS_STYLES[o.status] || STATUS_STYLES.Pending
                    }`}
                  >
                    {o.status}
                  </span>
                </div>

                <div className="p-5 space-y-4">
                  {/* Customer */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Info icon={User} label="Customer" value={o.customerName || o.userId?.name} />
                    <Info icon={MapPin} label="City" value={o.address?.city} />
                    <Info icon={CreditCard} label="Payment" value={`${o.paymentMethod} · ${o.paymentStatus}`} />
                    {o.phone && <Info icon={User} label="Phone" value={o.phone} />}
                  </div>

                  {/* Items */}
                  <div className="rounded-xl border border-[#F5A623]/15 bg-[#FFF8E7] p-4">
                    <p className="text-[10px] uppercase tracking-wider text-[#6B4C2A] font-semibold mb-2">
                      Items
                    </p>
                    <div className="space-y-1.5">
                      {o.items?.map((it, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-[#1A1A1A]">
                            {it.foodName} × {it.quantity}
                          </span>
                          <span className="text-[#6B4C2A] font-medium">
                            Rs. {it.price * it.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between border-t border-[#F5A623]/20 pt-2 mt-2">
                      <span className="font-semibold text-[#1A1A1A]">Total</span>
                      <span className="font-serif text-xl font-bold text-[#C0392B]">
                        Rs. {o.total}
                      </span>
                    </div>
                  </div>

                  {/* Delivery info */}
                  {o.deliveryPerson && (
                    <div className="rounded-xl border border-[#F5A623]/20 bg-[#F5A623]/5 p-4 flex items-center gap-3">
                      <Truck className="h-5 w-5 text-[#C0392B]" />
                      <div className="flex-1">
                        <p className="text-[10px] uppercase tracking-wider text-[#6B4C2A] font-semibold">
                          Assigned to
                        </p>
                        <p className="text-sm font-semibold text-[#1A1A1A]">
                          {o.deliveryPerson.name} · {o.deliveryPerson.phone}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Assign dropdown */}
                  {assigning === o._id && (
                    <div className="rounded-xl border-2 border-dashed border-[#F5A623]/40 p-4">
                      <p className="text-[10px] uppercase tracking-wider text-[#C0392B] font-bold mb-3">
                        Select Delivery Man
                      </p>
                      {deliveryMen.length === 0 ? (
                        <p className="text-sm text-[#6B4C2A]">
                          No delivery men added yet. Add them from the sidebar.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {deliveryMen.map((m) => (
                            <button
                              key={m._id}
                              onClick={() => handleAssign(o._id, m._id)}
                              disabled={busy === o._id}
                              className="rounded-xl border border-[#F5A623]/25 bg-[#FFF8E7] p-3 text-left hover:border-[#F5A623] hover:bg-[#F5A623]/10 transition disabled:opacity-50"
                            >
                              <p className="font-semibold text-[#1A1A1A] text-sm">
                                {m.name}
                              </p>
                              <p className="text-xs text-[#6B4C2A]">
                                {m.vehicle} · {m.vehicleNumber}
                              </p>
                              <p className="text-xs text-[#6B4C2A]">{m.phone}</p>
                            </button>
                          ))}
                        </div>
                      )}
                      <button
                        onClick={() => setAssigning(null)}
                        className="mt-3 text-xs text-[#6B4C2A] hover:text-[#C0392B] underline font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-[#F5A623]/15">
                    {o.status === 'Pending' && (
                      <>
                        <ActionBtn
                          onClick={() => handleStatus(o._id, 'Accepted')}
                          disabled={busy === o._id}
                          icon={Check}
                          label="Accept"
                          variant="green"
                        />
                        <ActionBtn
                          onClick={() => handleStatus(o._id, 'Rejected')}
                          disabled={busy === o._id}
                          icon={X}
                          label="Reject"
                          variant="red"
                        />
                      </>
                    )}

                    {o.status === 'Accepted' && (
                      <>
                        <ActionBtn
                          onClick={() => handleStatus(o._id, 'Preparing')}
                          disabled={busy === o._id}
                          icon={Clock}
                          label="Start Preparing"
                          variant="gold"
                        />
                        <ActionBtn
                          onClick={() => setAssigning(o._id)}
                          icon={Truck}
                          label="Assign Delivery"
                          variant="gold"
                        />
                      </>
                    )}

                    {o.status === 'Preparing' && (
                      <ActionBtn
                        onClick={() => setAssigning(o._id)}
                        icon={Truck}
                        label="Assign Delivery Man"
                        variant="gold"
                      />
                    )}

                    {o.status === 'Out for Delivery' && (
                      <ActionBtn
                        onClick={() => handleStatus(o._id, 'Delivered')}
                        icon={Check}
                        label="Mark Delivered"
                        variant="green"
                      />
                    )}

                    <a
                      href={`/track-order/${o._id}`}
                      className="inline-flex items-center gap-2 rounded-full border border-[#1A1A1A]/15 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[#6B4C2A] hover:bg-[#1A1A1A] hover:text-[#FFF8E7] transition"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </a>
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
    <div>
      <p className="text-[10px] uppercase tracking-wider text-[#6B4C2A] font-semibold">
        {label}
      </p>
      <p className="text-sm text-[#1A1A1A] font-medium">{value || '—'}</p>
    </div>
  </div>
)

const VARIANTS = {
  green:
    'bg-green-500/10 text-green-700 border-green-500/30 hover:bg-green-600 hover:text-white',
  red: 'bg-[#C0392B]/10 text-[#C0392B] border-[#C0392B]/30 hover:bg-[#C0392B] hover:text-white',
  gold: 'bg-[#F5A623]/15 text-[#C97D12] border-[#F5A623]/40 hover:bg-[#F5A623] hover:text-[#1A1A1A]',
}

const ActionBtn = ({ onClick, disabled, icon: Icon, label, variant }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider transition-all duration-300 disabled:opacity-40 ${VARIANTS[variant]}`}
  >
    <Icon className="h-4 w-4" />
    {label}
  </button>
)

export default AdminOrders