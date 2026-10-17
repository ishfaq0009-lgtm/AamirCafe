import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, X, Plus, Trash2 } from 'lucide-react'
import { createPackage } from '../../api/hallPackages.js'

const AddHallPackage = () => {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // ⭐ Single source of truth — all fields as strings
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [basePrice, setBasePrice] = useState('')
  const [pricePerGuest, setPricePerGuest] = useState('')
  const [capacity, setCapacity] = useState('')
  const [isPopular, setIsPopular] = useState(false)
  const [features, setFeatures] = useState([''])
  const [decorations, setDecorations] = useState([])

  /* ============ FEATURES ============ */
  const updateFeature = (i, val) => {
    const copy = [...features]
    copy[i] = val
    setFeatures(copy)
  }
  const addFeature = () => setFeatures([...features, ''])
  const removeFeature = (i) =>
    setFeatures(features.filter((_, idx) => idx !== i))

  /* ============ DECORATIONS ============ */
  const addDecoration = () =>
    setDecorations([...decorations, { name: '', price: '' }])
  const updateDecoration = (i, key, val) => {
    const copy = [...decorations]
    copy[i] = { ...copy[i], [key]: val }
    setDecorations(copy)
  }
  const removeDecoration = (i) =>
    setDecorations(decorations.filter((_, idx) => idx !== i))

  /* ============ SAVE ============ */
  const handleSave = async () => {
    setError('')

    // ⭐ Robust validation
    const trimmedName = name.trim()
    const numericBase = Number(basePrice)

    if (!trimmedName) {
      setError('Package name is required')
      return
    }
    if (!basePrice || isNaN(numericBase) || numericBase <= 0) {
      setError('Hall base price is required and must be a number greater than 0')
      return
    }

    setSaving(true)
    try {
      const payload = {
        name: trimmedName,
        description: description || '',
        basePrice: numericBase,
        pricePerGuest: Number(pricePerGuest || 0),
        capacity: capacity || 'Up to 300 guests',
        isPopular: !!isPopular,
        features: features.map((f) => f.trim()).filter(Boolean),
        decorationOptions: decorations
          .filter((d) => d.name.trim() && d.price !== '')
          .map((d) => ({
            name: d.name.trim(),
            price: Number(d.price),
          })),
      }

      console.log('📦 [AddHallPackage] Payload:', payload)

      const res = await createPackage(payload)
      console.log('📦 [AddHallPackage] Response:', res)

      if (res.success) {
        alert('Package created successfully!')
        navigate('/admin/packages')
      } else {
        setError(res.msg || 'Failed to create package')
      }
    } catch (err) {
      console.error('❌ [AddHallPackage] Error:', err)
      setError(
        err.response?.data?.msg ||
          err.message ||
          'Failed to create package'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.3em] text-[#C0392B] mb-2 font-semibold">
        Aamir Marriage Hall
      </p>
      <h1 className="font-serif text-4xl text-[#1A1A1A] font-semibold mb-8">
        Add Hall Package
      </h1>

      <div className="bg-[#FFFDF7] rounded-2xl border border-[#F5A623]/25 p-6 sm:p-8 max-w-2xl shadow-sm">
        {error && (
          <div className="mb-5 rounded-lg bg-[#C0392B]/10 border border-[#C0392B]/30 px-4 py-3 text-sm text-[#C0392B] font-medium">
            ⚠ {error}
          </div>
        )}

        <div className="space-y-5">
          <Field
            label="Package Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Premium Wedding"
          />

          <div>
            <label className="block text-xs text-[#6B4C2A] mb-2 font-semibold uppercase tracking-wider">
              Description
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A complete package designed for beautiful wedding events."
              className="w-full border border-[#F5A623]/25 bg-[#FFF8E7] rounded-lg px-4 py-3 text-sm text-[#1A1A1A] outline-none focus:border-[#F5A623]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field
              label="Hall Base Price (Rs.)"
              type="number"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              placeholder="e.g. 15000"
            />
            <Field
              label="Price Per Guest (Rs.)"
              type="number"
              value={pricePerGuest}
              onChange={(e) => setPricePerGuest(e.target.value)}
              placeholder="e.g. 500"
            />
          </div>

          <Field
            label="Capacity"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            placeholder="e.g. Up to 300 guests"
          />

          {/* Features */}
          <div>
            <label className="block text-xs text-[#6B4C2A] mb-2 font-semibold uppercase tracking-wider">
              Features
            </label>
            <div className="space-y-2">
              {features.map((f, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={f}
                    onChange={(e) => updateFeature(i, e.target.value)}
                    placeholder="e.g. Premium Decoration"
                    className="flex-1 border border-[#F5A623]/25 bg-[#FFF8E7] rounded-lg px-4 py-3 text-sm text-[#1A1A1A] outline-none focus:border-[#F5A623]"
                  />
                  {features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(i)}
                      className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#C0392B]/30 text-[#C0392B] hover:bg-[#C0392B]/10 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#C97D12] hover:text-[#C0392B] transition"
              >
                <Plus className="h-4 w-4" />
                Add Feature
              </button>
            </div>
          </div>

          {/* Decorations */}
          <div>
            <label className="block text-xs text-[#6B4C2A] mb-2 font-semibold uppercase tracking-wider">
              Decoration Options (optional)
            </label>
            <div className="space-y-2">
              {decorations.map((d, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={d.name}
                    onChange={(e) => updateDecoration(i, 'name', e.target.value)}
                    placeholder="e.g. Premium Floral"
                    className="flex-1 border border-[#F5A623]/25 bg-[#FFF8E7] rounded-lg px-4 py-3 text-sm text-[#1A1A1A] outline-none focus:border-[#F5A623]"
                  />
                  <input
                    type="number"
                    value={d.price}
                    onChange={(e) => updateDecoration(i, 'price', e.target.value)}
                    placeholder="Rs."
                    className="w-32 border border-[#F5A623]/25 bg-[#FFF8E7] rounded-lg px-3 py-3 text-sm text-[#1A1A1A] outline-none focus:border-[#F5A623]"
                  />
                  <button
                    type="button"
                    onClick={() => removeDecoration(i)}
                    className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#C0392B]/30 text-[#C0392B] hover:bg-[#C0392B]/10 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addDecoration}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#C97D12] hover:text-[#C0392B] transition"
              >
                <Plus className="h-4 w-4" />
                Add Decoration Option
              </button>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isPopular}
              onChange={(e) => setIsPopular(e.target.checked)}
              className="w-4 h-4 accent-[#F5A623]"
            />
            <span className="text-sm font-medium text-[#1A1A1A]">
              Mark as Popular
            </span>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#F5A623] to-[#E8941A] py-3 text-sm font-bold text-[#1A1A1A] hover:shadow-[0_8px_25px_rgba(245,166,35,0.4)] transition disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Creating...' : 'Create Package'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/packages')}
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

const Field = ({ label, value, onChange, type = 'text', placeholder = '' }) => (
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

export default AddHallPackage