import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios.js'
import { useAuth } from '../../context/AuthContext.jsx'

const STATUS_STYLES = {
  Pending: 'bg-[#F5A623]/15 text-[#C97D12] border-[#F5A623]/40',
  Accepted: 'bg-green-500/10 text-green-700 border-green-500/30',
  Rejected: 'bg-[#C0392B]/10 text-[#C0392B] border-[#C0392B]/30',
  Completed: 'bg-blue-500/10 text-blue-700 border-blue-500/30',
}

const MyBookings = () => {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        if (!user?.email) {
          setLoading(false)
          return
        }
        const res = await api.get('/Booking/MyBookings', {
          params: { email: user.email },
        })
        if (res.data.success) setBookings(res.data.AllBookingData || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    })()
  }, [user])

  return (
    <div className="min-h-screen bg-[#FFF8E7] px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs uppercase tracking-[0.3em] text-[#C0392B] mb-2 font-semibold">
          Aamir Marriage Hall
        </p>
        <h1 className="font-serif text-4xl text-[#1A1A1A] font-semibold mb-8">
          My Bookings
        </h1>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-[#FFFDF7] rounded-2xl border border-[#F5A623]/25 p-10 text-center">
            <p className="text-4xl mb-3">🏛️</p>
            <p className="font-medium text-[#1A1A1A]">No bookings yet</p>
            <p className="text-sm text-[#6B4C2A] mt-1">
              Plan your special day with us.
            </p>
            <Link
              to="/booking"
              className="mt-6 inline-block rounded-full bg-gradient-to-r from-[#F5A623] to-[#E8941A] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.15em] text-[#1A1A1A] transition hover:shadow-[0_8px_20px_rgba(245,166,35,0.4)]"
            >
              Book Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div
                key={b._id}
                className="bg-[#FFFDF7] rounded-2xl border border-[#F5A623]/25 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-[#1A1A1A]">
                      {b.eventtype}
                    </h3>
                    <p className="text-sm text-[#6B4C2A]">
                      {b.eventData} • {b.Eventtime}
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                      STATUS_STYLES[b.status] || STATUS_STYLES.Pending
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm text-[#6B4C2A]">
                  <p>
                    <span className="text-[#6B4C2A]/60">Guests: </span>
                    {b.guests}
                  </p>
                  <p>
                    <span className="text-[#6B4C2A]/60">Hall: </span>
                    {b.HallSection}
                  </p>
                  <p>
                    <span className="text-[#6B4C2A]/60">Decoration: </span>
                    {b.decoration}
                  </p>
                  <p>
                    <span className="text-[#6B4C2A]/60">Package: </span>
                    {b.package || 'Basic'}
                  </p>
                </div>
                {b.status === 'Rejected' && b.adminNote && (
                  <div className="mt-4 rounded-xl bg-[#C0392B]/5 border border-[#C0392B]/20 p-3">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-[#C0392B] font-semibold mb-1">
                      Admin Note
                    </p>
                    <p className="text-sm text-[#6B4C2A]">{b.adminNote}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyBookings