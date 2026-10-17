import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createDinner } from '../../api/dinners.js'

const DINNER_CATEGORIES = [
  'Rice',
  'Karahi',
  'BBQ',
  'Curry',
  'Bread',
  'Salad',
  'Dessert',
  'Main Course',
  'Other',
]

const AddDinner = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    price: '',
    category: 'Rice',
    description: '',
    image: null,
  })

  const update = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.value }))

  const submit = async () => {
    setError('')
    if (!form.name || !form.price || !form.image) {
      setError('Name, price and image are required')
      return
    }
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('price', form.price)
      fd.append('category', form.category)
      fd.append('description', form.description)
      fd.append('image', form.image)

      const res = await createDinner(fd)
      if (res.success) {
        alert('Dinner added successfully!')
        navigate('/admin/dinners')
      } else {
        setError(res.msg || 'Failed to add dinner')
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to add dinner')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.3em] text-[#C0392B] mb-2 font-semibold">
        Aamir Marriage Hall
      </p>
      <h1 className="font-serif text-4xl text-[#1A1A1A] font-semibold mb-8">
        Add Dinner Item
      </h1>

      <div className="bg-[#FFFDF7] rounded-2xl border border-[#F5A623]/25 p-6 sm:p-8 max-w-2xl shadow-sm">
        {error && (
          <div className="mb-5 rounded-lg bg-[#C0392B]/10 border border-[#C0392B]/30 px-4 py-3 text-sm text-[#C0392B]">
            ⚠ {error}
          </div>
        )}

        <div className="space-y-5">
          <Input
            label="Dinner Name"
            value={form.name}
            onChange={update('name')}
            placeholder="e.g. Chicken White Karahi"
          />
          <Input
            label="Price Per Plate (Rs.)"
            type="number"
            value={form.price}
            onChange={update('price')}
            placeholder="e.g. 450"
          />

          <div>
            <label className="block text-xs text-[#6B4C2A] mb-2 font-semibold uppercase tracking-wider">
              Category
            </label>
            <select
              value={form.category}
              onChange={update('category')}
              className="w-full border border-[#F5A623]/25 bg-[#FFF8E7] rounded-lg px-4 py-3 text-sm text-[#1A1A1A] outline-none focus:border-[#F5A623]"
            >
              {DINNER_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-[#6B4C2A] mb-2 font-semibold uppercase tracking-wider">
              Description (optional)
            </label>
            <textarea
              rows="4"
              value={form.description}
              onChange={update('description')}
              className="w-full border border-[#F5A623]/25 bg-[#FFF8E7] rounded-lg px-4 py-3 text-sm text-[#1A1A1A] outline-none focus:border-[#F5A623]"
              placeholder="Short description..."
            />
          </div>

          <div>
            <label className="block text-xs text-[#6B4C2A] mb-2 font-semibold uppercase tracking-wider">
              Dish Image
            </label>
            <input
              type="file"
              onChange={(e) =>
                setForm((p) => ({ ...p, image: e.target.files[0] }))
              }
              className="w-full border border-[#F5A623]/25 bg-[#FFF8E7] rounded-lg px-4 py-3 text-sm text-[#1A1A1A]"
            />
          </div>

          <button
            onClick={submit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#F5A623] to-[#E8941A] text-[#1A1A1A] font-bold py-3 rounded-full transition-all hover:shadow-[0_8px_25px_rgba(245,166,35,0.4)] disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Dinner'}
          </button>
        </div>
      </div>
    </div>
  )
}

const Input = ({ label, value, onChange, type = 'text', placeholder = '' }) => (
  <div>
    <label className="block text-xs text-[#6B4C2A] mb-2 font-semibold uppercase tracking-wider">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border border-[#F5A623]/25 bg-[#FFF8E7] rounded-lg px-4 py-3 text-sm text-[#1A1A1A] outline-none focus:border-[#F5A623]"
    />
  </div>
)

export default AddDinner