import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, X, Plus, Minus, Trash2, CupSoda } from 'lucide-react'
import api from '../../api/axios.js'
import { createDeal } from '../../api/deals.js'

const AddDeal = () => {
  const navigate = useNavigate()
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    title: '',
    description: '',
    dealPrice: '',
    tag: 'Deal',
    isHot: false,
  })
  const [items, setItems] = useState({}) // foodId -> { food, quantity }
  const [drinks, setDrinks] = useState([]) // { name, price, quantity }

  useEffect(() => {
    ;(async () => {
      try {
        const res = await api.get('/AddNewFastFood/AllFoodApi')
        if (res.data.success) setFoods(res.data.AllFood || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const update = (key) => (e) => {
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((p) => ({ ...p, [key]: value }))
  }

  /* ============ ITEMS ============ */
  const addItem = (food) => {
    setItems((prev) => {
      const existing = prev[food._id]
      return {
        ...prev,
        [food._id]: { food, quantity: existing ? existing.quantity + 1 : 1 },
      }
    })
  }

  const updateQty = (foodId, delta) => {
    setItems((prev) => {
      const item = prev[foodId]
      if (!item) return prev
      const newQty = item.quantity + delta
      if (newQty <= 0) {
        const copy = { ...prev }
        delete copy[foodId]
        return copy
      }
      return { ...prev, [foodId]: { ...item, quantity: newQty } }
    })
  }

  /* ============ DRINKS ============ */
  const addDrink = () =>
    setDrinks((p) => [...p, { name: '', price: '', quantity: 1 }])

  const updateDrink = (i, key, val) =>
    setDrinks((p) => {
      const copy = [...p]
      copy[i] = { ...copy[i], [key]: val }
      return copy
    })

  const removeDrink = (i) => setDrinks((p) => p.filter((_, idx) => idx !== i))

  const selectedItems = Object.values(items)
  const itemsOriginal = selectedItems.reduce(
    (sum, it) => sum + it.food.price * it.quantity,
    0
  )
  const drinksOriginal = drinks.reduce(
    (sum, d) => sum + (Number(d.price) || 0) * (Number(d.quantity) || 1),
    0
  )
  const originalPrice = itemsOriginal + drinksOriginal

  const submit = async () => {
    setError('')
    if (!form.title.trim()) return setError('Title required')
    if (selectedItems.length === 0) return setError('Select at least one item')
    if (!form.dealPrice || Number(form.dealPrice) <= 0)
      return setError('Enter a valid deal price')

    setSaving(true)
    try {
      const cleanDrinks = drinks
        .filter((d) => d.name.trim() && d.price !== '')
        .map((d) => ({
          name: d.name.trim(),
          price: Number(d.price) || 0,
          quantity: Number(d.quantity) || 1,
        }))

      const payload = {
        title: form.title.trim(),
        description: form.description || '',
        dealPrice: Number(form.dealPrice),
        tag: form.tag || 'Deal',
        isHot: !!form.isHot,
        image: selectedItems[0].food.image || '',
        items: selectedItems.map(({ food, quantity }) => ({
          foodId: food._id,
          name: food.name,
          price: Number(food.price),
          image: food.image || '',
          quantity,
        })),
        coldDrinks: cleanDrinks,
      }

      const res = await createDeal(payload)
      if (res.success) {
        alert('Deal created!')
        navigate('/admin/deals')
      } else setError(res.msg || 'Failed')
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed')
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
        Aamir Cafe
      </p>
      <h1 className="font-serif text-4xl text-[#1A1A1A] font-semibold mb-8">
        Add Deal
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-[#FFFDF7] rounded-2xl border border-[#F5A623]/25 p-6 sm:p-8 shadow-sm">
          {error && (
            <div className="mb-5 rounded-lg bg-[#C0392B]/10 border border-[#C0392B]/30 px-4 py-3 text-sm text-[#C0392B]">
              ⚠ {error}
            </div>
          )}

          <div className="space-y-5">
            <Input
              label="Deal Title"
              value={form.title}
              onChange={update('title')}
              placeholder="e.g. Family Feast Combo"
            />
            <div>
              <label className="block text-xs text-[#6B4C2A] mb-2 font-semibold uppercase tracking-wider">
                Description
              </label>
              <textarea
                rows="3"
                value={form.description}
                onChange={update('description')}
                placeholder="Describe this deal..."
                className="w-full border border-[#F5A623]/25 bg-[#FFF8E7] rounded-lg px-4 py-3 text-sm text-[#1A1A1A] outline-none focus:border-[#F5A623]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Deal Price (Rs.)"
                type="number"
                value={form.dealPrice}
                onChange={update('dealPrice')}
              />
              <Input
                label="Tag"
                value={form.tag}
                onChange={update('tag')}
                placeholder="Deal, Combo, Special..."
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isHot}
                onChange={update('isHot')}
                className="w-4 h-4 accent-[#F5A623]"
              />
              <span className="text-sm font-medium text-[#1A1A1A]">
                Mark as Hot Deal (shown on homepage)
              </span>
            </label>

            {/* Selected items */}
            <div className="pt-4 border-t border-[#F5A623]/20">
              <p className="text-[10px] uppercase tracking-wider text-[#C0392B] font-bold mb-3">
                Selected Items ({selectedItems.length})
              </p>
              {selectedItems.length === 0 ? (
                <p className="text-xs text-[#6B4C2A]/60">
                  Click items on the right to add them to this deal.
                </p>
              ) : (
                <div className="space-y-2">
                  {selectedItems.map(({ food, quantity }) => (
                    <div
                      key={food._id}
                      className="flex items-center gap-3 rounded-lg bg-[#FFF8E7] p-2 border border-[#F5A623]/20"
                    >
                      <img
                        src={food.image}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#1A1A1A] truncate">
                          {food.name}
                        </p>
                        <p className="text-[10px] text-[#6B4C2A]">
                          Rs. {food.price} each
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => updateQty(food._id, -1)}
                          className="w-6 h-6 rounded bg-[#F5A623]/20 hover:bg-[#F5A623]/40 flex items-center justify-center"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-bold w-5 text-center">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQty(food._id, 1)}
                          className="w-6 h-6 rounded bg-[#F5A623]/20 hover:bg-[#F5A623]/40 flex items-center justify-center"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cold Drinks */}
            <div className="pt-4 border-t border-[#F5A623]/20">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] uppercase tracking-wider text-[#C0392B] font-bold flex items-center gap-2">
                  <CupSoda className="h-3.5 w-3.5" />
                  Cold Drinks (Optional)
                </p>
                <button
                  type="button"
                  onClick={addDrink}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#C97D12] hover:text-[#C0392B]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Drink
                </button>
              </div>

              {drinks.length === 0 ? (
                <p className="text-xs text-[#6B4C2A]/60">
                  No cold drinks added to this deal.
                </p>
              ) : (
                <div className="space-y-2">
                  {drinks.map((d, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={d.name}
                        onChange={(e) => updateDrink(i, 'name', e.target.value)}
                        placeholder="e.g. Coca Cola (1.5L)"
                        className="flex-1 border border-[#F5A623]/25 bg-[#FFF8E7] rounded-lg px-3 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#F5A623]"
                      />
                      <input
                        type="number"
                        value={d.price}
                        onChange={(e) => updateDrink(i, 'price', e.target.value)}
                        placeholder="Rs."
                        className="w-24 border border-[#F5A623]/25 bg-[#FFF8E7] rounded-lg px-3 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#F5A623]"
                      />
                      <input
                        type="number"
                        value={d.quantity}
                        onChange={(e) =>
                          updateDrink(i, 'quantity', e.target.value)
                        }
                        placeholder="Qty"
                        className="w-20 border border-[#F5A623]/25 bg-[#FFF8E7] rounded-lg px-3 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#F5A623]"
                      />
                      <button
                        type="button"
                        onClick={() => removeDrink(i)}
                        className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#C0392B]/30 text-[#C0392B] hover:bg-[#C0392B]/10 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {originalPrice > 0 && (
              <div className="pt-3 border-t border-[#F5A623]/20 text-sm flex justify-between items-center">
                <span className="text-[#6B4C2A]">
                  Original total:{' '}
                  <span className="font-semibold text-[#1A1A1A]">
                    Rs. {originalPrice}
                  </span>
                </span>
                {form.dealPrice && Number(form.dealPrice) < originalPrice && (
                  <span className="text-[10px] font-bold uppercase tracking-wider rounded-full bg-green-500/10 text-green-700 px-2 py-0.5">
                    {Math.round(
                      ((originalPrice - Number(form.dealPrice)) / originalPrice) *
                        100
                    )}
                    % off
                  </span>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={submit}
                disabled={saving}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#F5A623] to-[#E8941A] py-3 text-sm font-bold text-[#1A1A1A] hover:shadow-[0_8px_25px_rgba(245,166,35,0.4)] transition disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Creating...' : 'Create Deal'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/deals')}
                className="inline-flex items-center gap-2 rounded-full border border-[#1A1A1A]/20 px-6 py-3 text-sm font-medium text-[#6B4C2A] hover:bg-[#F5A623]/10 transition"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Menu items picker */}
        <div className="bg-[#FFFDF7] rounded-2xl border border-[#F5A623]/25 p-6 shadow-sm max-h-[80vh] overflow-y-auto">
          <h3 className="font-serif text-xl font-semibold text-[#1A1A1A] mb-4">
            Choose Items
          </h3>
          {foods.length === 0 ? (
            <p className="text-sm text-[#6B4C2A]">No food items in menu.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {foods.map((f) => (
                <button
                  type="button"
                  key={f._id}
                  onClick={() => addItem(f)}
                  className="text-left rounded-xl border border-[#F5A623]/25 bg-[#FFF8E7] p-3 hover:border-[#F5A623] hover:bg-[#F5A623]/10 transition"
                >
                  <img
                    src={f.image}
                    alt=""
                    className="w-full h-20 object-cover rounded-lg mb-2"
                  />
                  <p className="text-xs font-semibold text-[#1A1A1A] truncate">
                    {f.name}
                  </p>
                  <p className="text-[10px] text-[#C0392B] font-bold">
                    Rs. {f.price}
                  </p>
                </button>
              ))}
            </div>
          )}
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

export default AddDeal