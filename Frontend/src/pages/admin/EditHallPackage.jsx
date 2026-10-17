import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, X, Plus, Trash2 } from 'lucide-react'
import { getPackage, updatePackage } from '../../api/hallPackages.js'

const EditHallPackage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    description: '',
    basePrice: '',
    pricePerGuest: '',
    capacity: '',
    isPopular: false,
  })
  const [features, setFeatures] = useState([''])
  const [decorations, setDecorations] = useState([])

  useEffect(() => {
    ;(async () => {
      try {
        const res = await getPackage(id)
        if (res.success && res.package) {
          const p = res.package
          setForm({
            name: p.name || '',
            description: p.description || '',
            basePrice: p.basePrice || '',
            pricePerGuest: p.pricePerGuest || '',
            capacity: p.capacity || '',
            isPopular: !!p.isPopular,
          })
          setFeatures(p.features?.length > 0 ? p.features : [''])
          setDecorations(
            p.decorationOptions?.map((d) => ({
              name: d.name || '',
              price: d.price ?? '',
            })) || []
          )
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  const update = (key) => (e) => {
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((p) => ({ ...p, [key]: value }))
  }

  const updateFeature = (i, val) => {
    const copy = [...features]
    copy[i] = val
    setFeatures(copy)
  }
  const addFeature = () => setFeatures([...features, ''])
  const removeFeature = (i) =>
    setFeatures(features.filter((_, idx) => idx !== i))

  const addDecoration = () =>
    setDecorations([...decorations, { name: '', price: '' }])
  const updateDecoration = (i, key, val) => {
    const copy = [...decorations]
    copy[i] = { ...copy[i], [key]: val }
    setDecorations(copy)
  }
  const removeDecoration = (i) =>
    setDecorations(decorations.filter((_, idx) => idx !== i))

  const save = async () => {
    setError('')
    if (!form.name || !form.basePrice) {
      setError('Name and base price are required')
      return
    }
    setSaving(true)
    try {
      const payload = {
        id,
        name: form.name,
        description: form.description,
        basePrice: Number(form.basePrice),
        pricePerGuest: Number(form.pricePerGuest || 0),
        capacity: form.capacity,
        isPopular: form.isPopular,
        features: features.filter((f) => f.trim() !== ''),
        decorationOptions: decorations
          .filter((d) => d.name && d.price !== '')
          .map((d) => ({ name: d.name, price: Number(d.price) })),
      }
      const res = await updatePackage(payload)
      if (res.success) {
        alert('Package updated successfully!')
        navigate('/admin/packages')
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
        Update Package
      </h1>

      <div className="bg-[#FFFDF7] rounded-2xl border border-[#F5A623]/25 p-6 sm:p-8 max-w-2xl shadow-sm">
        {error && (
          <div className="mb-5 rounded-lg bg-[#C0392B]/10 border border-[#C0392B]/30 px-4 py-3 text-sm text-[#C0392B]">
            {error}
          </div>
        )}

        <div className="space-y-5">
          <Input label="Package Name" value={form.name} onChange={update('name')} />

          <div>
            <label className="block text-xs text-[#6B4C2A] mb-2 font-semibold uppercase tracking-wider">
              Description
            </label>
            <textarea
              rows="3"
              value={form.description}
              onChange={update('description')}
              className="w-full border border-[#F5A623]/25 bg-[#FFF8E7] rounded-lg px-4 py-3 text-sm text-[#1A1A1A] outline-none focus:border-[#F5A623]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Hall Base Price (Rs.)"
              type="number"
              value={form.basePrice}
              onChange={update('basePrice')}
            />
            <Input
              label="Price Per Guest (Rs.)"
              type="number"
              value={form.pricePerGuest}
              onChange={update('pricePerGuest')}
            />
          </div>

          <Input
            label="Capacity"
            value={form.capacity}
            onChange={update('capacity')}
          />

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
                    className="flex-1 border border-[#F5A623]/25 bg-[#FFF8E7] rounded-lg px-4 py-3 text-sm text-[#1A1A1A] outline-none focus:border-[#F5A623]"
                  />
                  {features.length > 1 && (
                    <button
                      onClick={() => removeFeature(i)}
                      className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#C0392B]/30 text-[#C0392B] hover:bg-[#C0392B]/10 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addFeature}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#C97D12] hover:text-[#C0392B] transition"
              >
                <Plus className="h-4 w-4" />
                Add Feature
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#6B4C2A] mb-2 font-semibold uppercase tracking-wider">
              Decoration Options
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
                    className="w-28 border border-[#F5A623]/25 bg-[#FFF8E7] rounded-lg px-3 py-3 text-sm text-[#1A1A1A] outline-none focus:border-[#F5A623]"
                  />
                  <button
                    onClick={() => removeDecoration(i)}
                    className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#C0392B]/30 text-[#C0392B] hover:bg-[#C0392B]/10 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
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
              checked={form.isPopular}
              onChange={update('isPopular')}
              className="w-4 h-4 accent-[#F5A623]"
            />
            <span className="text-sm font-medium text-[#1A1A1A]">
              Mark as Popular
            </span>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              onClick={save}
              disabled={saving}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#F5A623] to-[#E8941A] py-3 text-sm font-bold text-[#1A1A1A] hover:shadow-[0_8px_25px_rgba(245,166,35,0.4)] transition disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
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

export default EditHallPackage