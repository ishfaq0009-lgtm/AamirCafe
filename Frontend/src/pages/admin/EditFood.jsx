import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, X, Plus, Trash2 } from 'lucide-react'
import api from '../../api/axios.js'

const EditFood = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState('')
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
  })
  const [sizes, setSizes] = useState([])

  useEffect(() => {
    ;(async () => {
      try {
        const res = await api.get(`/AddNewFastFood/OneFoodData?id=${id}`)
        if (res.data.success && res.data.OneFood) {
          const f = res.data.OneFood
          setForm({
            name: f.name || '',
            price: f.price || '',
            category: f.category || '',
            description: f.description || '',
          })
          setPreview(f.image || '')
          setSizes(
            (f.sizes || []).map((s) => ({ name: s.name, price: s.price }))
          )
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

  const addSize = () => setSizes((p) => [...p, { name: '', price: '' }])
  const updateSize = (i, key, val) =>
    setSizes((p) => {
      const copy = [...p]
      copy[i] = { ...copy[i], [key]: val }
      return copy
    })
  const removeSize = (i) => setSizes((p) => p.filter((_, idx) => idx !== i))

  const handleImage = (e) => {
    const file = e.target.files[0]
    setImage(file)
    if (file) setPreview(URL.createObjectURL(file))
  }

  const save = async () => {
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('id', id)
      fd.append('name', form.name)
      fd.append('price', form.price)
      fd.append('category', form.category)
      fd.append('description', form.description)

      const cleanSizes = sizes
        .filter((s) => s.name.trim() && s.price !== '')
        .map((s) => ({ name: s.name.trim(), price: Number(s.price) }))
      fd.append('sizes', JSON.stringify(cleanSizes))

      if (image) fd.append('image', image)

      const res = await api.post('/AddNewFastFood/UpdateFood', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (res.data.success) {
        alert('Food updated successfully!')
        navigate('/admin/food')
      }
    } catch (err) {
      alert(err.response?.data?.msg || 'Update failed')
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
        Aamir Admin
      </p>
      <h1 className="font-serif text-4xl text-[#1A1A1A] font-semibold mb-8">
        Update Food
      </h1>

      <div className="bg-[#FFFDF7] rounded-2xl border border-[#F5A623]/25 p-6 sm:p-8 max-w-2xl shadow-sm">
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

          <Input label="Food Name" value={form.name} onChange={update('name')} />
          <Input
            label="Price (Rs.)"
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
              <option value="">Select Category</option>
              <option value="Fast Food">Fast Food</option>
              <option value="Sweets">Sweets</option>
              <option value="Cafe">Café</option>
              <option value="Cakes">Cakes</option>
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

          {/* Sizes */}
          <div className="pt-3 border-t border-[#F5A623]/20">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs text-[#6B4C2A] font-semibold uppercase tracking-wider">
                Size Options
              </label>
              <button
                type="button"
                onClick={addSize}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#C97D12] hover:text-[#C0392B]"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Size
              </button>
            </div>
            {sizes.length === 0 ? (
              <p className="text-xs text-[#6B4C2A]/60">
                No size options — base price will be used.
              </p>
            ) : (
              <div className="space-y-2">
                {sizes.map((s, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={s.name}
                      onChange={(e) => updateSize(i, 'name', e.target.value)}
                      placeholder="e.g. Small"
                      className="flex-1 border border-[#F5A623]/25 bg-[#FFF8E7] rounded-lg px-3 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#F5A623]"
                    />
                    <input
                      type="number"
                      value={s.price}
                      onChange={(e) => updateSize(i, 'price', e.target.value)}
                      placeholder="Rs."
                      className="w-28 border border-[#F5A623]/25 bg-[#FFF8E7] rounded-lg px-3 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#F5A623]"
                    />
                    <button
                      type="button"
                      onClick={() => removeSize(i)}
                      className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#C0392B]/30 text-[#C0392B] hover:bg-[#C0392B]/10 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
              onClick={() => navigate('/admin/food')}
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

export default EditFood