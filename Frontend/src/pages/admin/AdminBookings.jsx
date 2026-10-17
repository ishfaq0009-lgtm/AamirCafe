import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Check, X, Pencil, Trash2, Clock } from 'lucide-react'
import {
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
} from '../../api/booking.js'

const TABS = ['All', 'Pending', 'Accepted', 'Rejected', 'Completed']

const STATUS_STYLES = {
  Pending: 'bg-[#F5A623]/15 text-[#C97D12] border-[#F5A623]/40',
  Accepted: 'bg-green-500/10 text-green-700 border-green-500/30',
  Rejected: 'bg-[#C0392B]/10 text-[#C0392B] border-[#C0392B]/30',
  Completed: 'bg-blue-500/10 text-blue-700 border-blue-500/30',
}

const AdminBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('All')
  const [busy, setBusy] = useState(null)
  const navigate = useNavigate()

  const load = async () => {
    try {
      const res = await getAllBookings()
      if (res.success) setBookings(res.AllBookingData || [])
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
    if (status === 'Rejected' && !window.confirm('Reject this booking?')) return
    setBusy(id)
    try {
      const res = await updateBookingStatus(id, status)
      if (res.success) {
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? { ...b, status } : b))
        )
      } else {
        alert(res.msg || 'Failed to update')
      }
    } catch (e) {
      alert('Failed to update status')
    } finally {
      setBusy(null)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this booking permanently?')) return
    setBusy(id)
    try {
      const res = await deleteBooking(id)
      if (res.success) setBookings((prev) => prev.filter((b) => b._id !== id))
    } catch (e) {
      alert('Delete failed')
    } finally {
      setBusy(null)
    }
  }

  const filtered =
    tab === 'All' ? bookings : bookings.filter((b) => b.status === tab)

  const counts = {
    All: bookings.length,
    Pending: bookings.filter((b) => b.status === 'Pending').length,
    Accepted: bookings.filter((b) => b.status === 'Accepted').length,
    Rejected: bookings.filter((b) => b.status === 'Rejected').length,
    Completed: bookings.filter((b) => b.status === 'Completed').length,
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#C0392B] mb-2 font-semibold">
          Aamir Marriage Hall
        </p>
        <h1 className="font-serif text-4xl text-[#1A1A1A] font-semibold">
          Bookings
        </h1>
        <p className="mt-2 text-sm text-[#6B4C2A]">
          Review, approve and manage event bookings.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex flex-wrap gap-2 border-b border-[#F5A623]/20 pb-4">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.15em] transition ${
              tab === t
                ? 'bg-gradient-to-r from-[#F5A623] to-[#E8941A] text-[#1A1A1A] shadow-[0_4px_12px_rgba(245,166,35,0.3)]'
                : 'border border-[#1A1A1A]/10 text-[#6B4C2A] hover:border-[#F5A623]/50 hover:text-[#1A1A1A]'
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
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-[#F5A623]/15 bg-[#FFFDF7] p-12 text-center text-[#6B4C2A]">
          No bookings found.
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filtered.map((b) => (
              <motion.div
                key={b._id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="rounded-2xl border border-[#F5A623]/15 bg-[#FFFDF7] overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex flex-col justify-between gap-4 border-b border-[#F5A623]/10 pb-5 sm:flex-row sm:items-start">
                    <div>
                      <h2 className="font-serif text-2xl text-[#1A1A1A] font-semibold">
                        {b.name}
                      </h2>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#C0392B] font-medium">
                        {b.eventtype}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full border px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] ${
                        STATUS_STYLES[b.status] || STATUS_STYLES.Pending
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-1 gap-x-8 gap-y-4 py-5 sm:grid-cols-2 lg:grid-cols-3">
                    <Info label="Phone" value={b.Phone} />
                    <Info label="Email" value={b.email} />
                    <Info label="Date" value={b.eventData} />
                    <Info label="Time" value={b.Eventtime} />
                    <Info label="Guests" value={b.guests} />
                    <Info label="Hall Section" value={b.HallSection} />
                    <Info label="Decoration" value={b.decoration} />
                    <Info label="Package" value={b.package || 'Basic'} />
                  </div>

                  {b.message && (
                    <div className="rounded-xl border border-[#F5A623]/15 bg-[#FFF8E7] p-4 mb-5">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-[#6B4C2A]/60 mb-2 font-semibold">
                        Special Requirements
                      </p>
                      <p className="text-sm leading-7 text-[#1A1A1A]/80">
                        {b.message}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 border-t border-[#F5A623]/10 pt-5">
                    {b.status === 'Pending' && (
                      <>
                        <ActionBtn
                          onClick={() => handleStatus(b._id, 'Accepted')}
                          disabled={busy === b._id}
                          icon={<Check className="h-4 w-4" />}
                          label="Accept"
                          variant="green"
                        />
                        <ActionBtn
                          onClick={() => handleStatus(b._id, 'Rejected')}
                          disabled={busy === b._id}
                          icon={<X className="h-4 w-4" />}
                          label="Reject"
                          variant="red"
                        />
                      </>
                    )}

                    {b.status === 'Accepted' && (
                      <ActionBtn
                        onClick={() => handleStatus(b._id, 'Completed')}
                        disabled={busy === b._id}
                        icon={<Check className="h-4 w-4" />}
                        label="Mark Completed"
                        variant="blue"
                      />
                    )}

                    {b.status === 'Rejected' && (
                      <ActionBtn
                        onClick={() => handleStatus(b._id, 'Pending')}
                        disabled={busy === b._id}
                        icon={<Clock className="h-4 w-4" />}
                        label="Move to Pending"
                        variant="gold"
                      />
                    )}

                    <ActionBtn
                      onClick={() =>
                        navigate(`/admin/bookings/update/${b._id}`)
                      }
                      icon={<Pencil className="h-4 w-4" />}
                      label="Edit"
                      variant="ghost"
                    />

                    <ActionBtn
                      onClick={() => handleDelete(b._id)}
                      disabled={busy === b._id}
                      icon={<Trash2 className="h-4 w-4" />}
                      label="Delete"
                      variant="ghost-red"
                    />
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

const Info = ({ label, value }) => (
  <div>
    <p className="text-[10px] uppercase tracking-[0.25em] text-[#6B4C2A]/60 mb-1 font-semibold">
      {label}
    </p>
    <p className="text-sm text-[#1A1A1A] font-medium">{value || '—'}</p>
  </div>
)

const VARIANTS = {
  green:
    'bg-green-500/10 text-green-700 border-green-500/30 hover:bg-green-600 hover:text-white',
  red: 'bg-[#C0392B]/10 text-[#C0392B] border-[#C0392B]/30 hover:bg-[#C0392B] hover:text-white',
  blue: 'bg-blue-500/10 text-blue-700 border-blue-500/30 hover:bg-blue-600 hover:text-white',
  gold: 'bg-[#F5A623]/15 text-[#C97D12] border-[#F5A623]/40 hover:bg-[#F5A623] hover:text-[#1A1A1A]',
  ghost:
    'bg-[#1A1A1A]/5 text-[#6B4C2A] border-[#1A1A1A]/10 hover:bg-[#1A1A1A] hover:text-[#FFF8E7]',
  'ghost-red':
    'bg-[#1A1A1A]/5 text-[#C0392B] border-[#1A1A1A]/10 hover:bg-[#C0392B]/15 hover:border-[#C0392B]/30',
}

const ActionBtn = ({ onClick, disabled, icon, label, variant }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.15em] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed ${VARIANTS[variant]}`}
  >
    {icon}
    {label}
  </button>
)

export default AdminBookings