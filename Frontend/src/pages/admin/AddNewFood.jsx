import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2 } from 'lucide-react'
import api from '../../api/axios.js'

const AddNewFood = () => {
  const navigate = useNavigate()
  const [food, setFood] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    image: null,
  })
  const [sizes, setSizes] = useState([])
  const [loading, setLoading] = useState(false)

  const update = (key) => (e) =>
    setFood((p) => ({ ...p, [key]: e.target.value }))

  const addSize = () => setSizes((p) => [...p, { name: '', price: '' }])
  const updateSize = (i, key, val) => {
    setSizes((p) => {
      const copy = [...p]
      copy[i] = { ...copy[i], [key]: val }
      return copy
    })
  }
  const removeSize = (i) => setSizes((p) => p.filter((_, idx) => idx !== i))

  const submit = async () => {
    if (!food.name || !food.price || !food.category || !food.image) {
      alert('Please fill all fields including image')
      return
    }
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('name', food.name)
      fd.append('price', food.price)
      fd.append('category', food.category)
      fd.append('description', food.description)
      fd.append('image', food.image)

      const cleanSizes = sizes
        .filter((s) => s.name.trim() && s.price !== '')
        .map((s) => ({ name: s.name.trim(), price: Number(s.price) }))
      if (cleanSizes.length > 0) {
        fd.append('sizes', JSON.stringify(cleanSizes))
      }

      const res = await api.post('/AddNewFastFood/AddFastFood', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (res.data.success) {
        alert('Food added successfully!')
        navigate('/admin/food')
      }
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to add food')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.3em] text-[#C0392B] mb-2 font-semibold">
        Aamir Admin
      </p>
      <h1 className="font-serif text-4xl text-[#1A1A1A] font-semibold mb-8">
        Add New Food
      </h1>

      <div className="bg-[#FFFDF7] rounded-2xl border border-[#F5A623]/25 p-6 sm:p-8 max-w-2xl shadow-sm">
        <div className="space-y-5">
          <Input label="Food Name" value={food.name} onChange={update('name')} />
          <Input
            label="Price"
            type="number"
            value={food.price}
            onChange={update('price')}
          />

          <div>
            <label className="block text-xs text-[#6B4C2A] mb-2 font-semibold uppercase tracking-wider">
              Category
            </label>
            <select
              value={food.category}
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
              value={food.description}
              onChange={update('description')}
              className="w-full border border-[#F5A623]/25 bg-[#FFF8E7] rounded-lg px-4 py-3 text-sm text-[#1A1A1A] outline-none focus:border-[#F5A623]"
              placeholder="Enter food description..."
            />
          </div>

          <div>
            <label className="block text-xs text-[#6B4C2A] mb-2 font-semibold uppercase tracking-wider">
              Food Image
            </label>
            <input
              type="file"
              onChange={(e) =>
                setFood((p) => ({ ...p, image: e.target.files[0] }))
              }
              className="w-full border border-[#F5A623]/25 bg-[#FFF8E7] rounded-lg px-4 py-3 text-sm text-[#1A1A1A]"
            />
          </div>

          {/* Size options */}
          <div className="pt-3 border-t border-[#F5A623]/20">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs text-[#6B4C2A] font-semibold uppercase tracking-wider">
                Size Options (optional)
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
            <p className="text-[10px] text-[#6B4C2A]/60 mb-3">
              If you add sizes, customers can pick a size on the product page.
            </p>

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
                      placeholder="e.g. Small / Medium / Large"
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

          <button
            onClick={submit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#F5A623] to-[#E8941A] text-[#1A1A1A] font-bold py-3 rounded-full transition-all hover:shadow-[0_8px_25px_rgba(245,166,35,0.4)] disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Food'}
          </button>
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

export default AddNewFood