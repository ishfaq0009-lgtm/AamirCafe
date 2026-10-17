import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, X } from 'lucide-react'
import { getDinner, updateDinner } from '../../api/dinners.js'

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

const EditDinner = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState('')

  const [form, setForm] = useState({
    name: '',
    price: '',
    category: 'Rice',
    description: '',
  })

  useEffect(() => {
    ;(async () => {
      try {
        const res = await getDinner(id)
        if (res.success && res.OneDinner) {
          const d = res.OneDinner
          setForm({
            name: d.name || '',
            price: d.price || '',
            category: d.category || 'Main Course',
            description: d.description || '',
          })
          setPreview(d.image || '')
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  const update = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.value }))

  const handleImage = (e) => {
    const file = e.target.files[0]
    setImageFile(file)
    if (file) setPreview(URL.createObjectURL(file))
  }

  const save = async () => {
    setError('')
    if (!form.name || !form.price) {
      setError('Name and price are required')
      return
    }
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('id', id)
      fd.append('name', form.name)
      fd.append('price', form.price)
      fd.append('category', form.category)
      fd.append('description', form.description)
      if (imageFile) fd.append('image', imageFile)

      const res = await updateDinner(fd)
      if (res.success) {
        alert('Dinner updated successfully!')
        navigate('/admin/dinners')
      } else {
        setError(res.msg || 'Update failed')
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-10 h-10 border-4 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.3em] text-[#C0392B] mb-2 font-semibold">
        Aamir Marriage Hall
      </p>
      <h1 className="font-serif text-4xl text-[#1A1A1A] font-semibold mb-8">
        Update Dinner
      </h1>

      <div className="bg-[#FFFDF7] rounded-2xl border border-[#F5A623]/25 p-6 sm:p-8 max-w-2xl shadow-sm">
        {error && (
          <div className="mb-5 rounded-lg bg-[#C0392B]/10 border border-[#C0392B]/30 px-4 py-3 text-sm text-[#C0392B]">
            ⚠ {error}
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label className="block text-xs text-[#6B4C2A] mb-2 font-semibold uppercase tracking-wider">
              Current Image
            </label>
            <img
              src={preview}
              alt="preview"
              className="w-full h-48 object-cover rounded-xl border border-[#F5A623]/25 mb-3"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="w-full border border-[#F5A623]/25 bg-[#FFF8E7] rounded-lg px-4 py-3 text-sm text-[#1A1A1A]"
            />
            <p className="text-xs text-[#6B4C2A]/60 mt-2">
              Leave empty to keep the current image.
            </p>
          </div>

          <Input
            label="Dinner Name"
            value={form.name}
            onChange={update('name')}
          />
          <Input
            label="Price Per Plate (Rs.)"
            type="number"
            value={form.price}
            onChange={update('price')}
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
              Description
            </label>
            <textarea
              rows="4"
              value={form.description}
              onChange={update('description')}
              className="w-full border border-[#F5A623]/25 bg-[#FFF8E7] rounded-lg px-4 py-3 text-sm text-[#1A1A1A] outline-none focus:border-[#F5A623]"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={save}
              disabled={saving}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#F5A623] to-[#E8941A] py-3 text-sm font-bold text-[#1A1A1A] hover:shadow-[0_8px_25px_rgba(245,166,35,0.4)] transition disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={() => navigate('/admin/dinners')}
              className="inline-flex items-center gap-2 rounded-full border border-[#1A1A1A]/20 px-6 py-3 text-sm font-medium text-[#6B4C2A] hover:bg-[#F5A623]/10 transition"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const Input = ({ label, value, onChange, type = 'text' }) => (
  <div>
    <label className="block text-xs text-[#6B4C2A] mb-2 font-semibold uppercase tracking-wider">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full border border-[#F5A623]/25 bg-[#FFF8E7] rounded-lg px-4 py-3 text-sm text-[#1A1A1A] outline-none focus:border-[#F5A623]"
    />
  </div>
)

export default EditDinner