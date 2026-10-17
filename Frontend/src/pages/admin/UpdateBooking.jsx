import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api/axios.js'

const UpdateBooking = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await api.post('/Booking/UpdataBooking', { id })
        setData(res.data.BookingID)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  const update = (key) => (e) =>
    setData((p) => ({ ...p, [key]: e.target.value }))

  const save = async () => {
    try {
      const res = await api.post('/Booking/BookingUpdataApi', { ...data, id })
      if (res.data.success) {
        alert('Booking updated!')
        navigate('/admin/bookings')
      }
    } catch (e) {
      alert('Update failed')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-10 h-10 border-4 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center text-[#6B4C2A]">Booking not found.</div>
    )
  }

  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.3em] text-[#C0392B] mb-2 font-semibold">
        Aamir Marriage Hall
      </p>
      <h1 className="font-serif text-4xl text-[#1A1A1A] font-semibold mb-8">
        Update Booking
      </h1>

      <div className="bg-[#FFFDF7] rounded-2xl border border-[#F5A623]/25 p-6 sm:p-8 max-w-3xl shadow-sm">
        <div className="grid gap-5 sm:grid-cols-2">
          <Input label="Full Name" value={data.name} onChange={update('name')} />
          <Input label="Phone" value={data.Phone} onChange={update('Phone')} />
          <Input
            label="Email"
            value={data.email}
            onChange={update('email')}
            className="sm:col-span-2"
          />
          <Select
            label="Event Type"
            value={data.eventtype}
            onChange={update('eventtype')}
            options={['Wedding', 'Walima', 'Engagement', 'Mehndi', 'Birthday', 'Other']}
          />
          <Input
            label="Event Date"
            type="date"
            value={data.eventData}
            onChange={update('eventData')}
          />
          <Select
            label="Event Time"
            value={data.Eventtime}
            onChange={update('Eventtime')}
            options={['Morning', 'Afternoon', 'Evening', 'Night']}
          />
          <Select
            label="Guests"
            value={data.guests}
            onChange={update('guests')}
            options={['Up to 100', '100-200', '200-300', '300-500', '500+']}
          />
          <Select
            label="Hall Section"
            value={data.HallSection}
            onChange={update('HallSection')}
            options={['Main Hall', 'Male Section', 'Female Section', 'Both Sections']}
          />
          <Select
            label="Decoration"
            value={data.decoration}
            onChange={update('decoration')}
            options={['Basic', 'Premium', 'Custom']}
          />
        </div>

        <div className="mt-5">
          <label className="block text-xs text-[#6B4C2A] mb-2 font-semibold uppercase tracking-wider">
            Message
          </label>
          <textarea
            rows="4"
            value={data.message || ''}
            onChange={update('message')}
            className="w-full border border-[#F5A623]/25 bg-[#FFF8E7] rounded-lg px-4 py-3 text-sm text-[#1A1A1A] outline-none focus:border-[#F5A623]"
          />
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={save}
            className="rounded-full bg-gradient-to-r from-[#F5A623] to-[#E8941A] px-6 py-3 text-sm font-bold text-[#1A1A1A] hover:shadow-[0_8px_25px_rgba(245,166,35,0.4)] transition"
          >
            Save Changes
          </button>
          <button
            onClick={() => navigate('/admin/bookings')}
            className="rounded-full border border-[#1A1A1A]/15 px-6 py-3 text-sm font-medium text-[#6B4C2A] hover:bg-[#F5A623]/10 hover:border-[#F5A623]/40 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

const Input = ({ label, value, onChange, type = 'text', className = '' }) => (
  <div className={className}>
    <label className="block text-xs text-[#6B4C2A] mb-2 font-semibold uppercase tracking-wider">
      {label}
    </label>
    <input
      type={type}
      value={value || ''}
      onChange={onChange}
      className="w-full border border-[#F5A623]/25 bg-[#FFF8E7] rounded-lg px-4 py-3 text-sm text-[#1A1A1A] outline-none focus:border-[#F5A623]"
    />
  </div>
)

const Select = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-xs text-[#6B4C2A] mb-2 font-semibold uppercase tracking-wider">
      {label}
    </label>
    <select
      value={value || ''}
      onChange={onChange}
      className="w-full border border-[#F5A623]/25 bg-[#FFF8E7] rounded-lg px-4 py-3 text-sm text-[#1A1A1A] outline-none focus:border-[#F5A623]"
    >
      <option value="">Select</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  </div>
)

export default UpdateBooking