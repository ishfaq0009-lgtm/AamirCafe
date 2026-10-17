import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import api from '../../api/axios.js'

const AllFood = () => {
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(null)
  const navigate = useNavigate()

  const load = async () => {
    try {
      const res = await api.get('/AddNewFastFood/AllFoodApi')
      if (res.data.success) setFoods(res.data.AllFood || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this food item permanently?')) return
    setBusy(id)
    try {
      const res = await api.post('/AddNewFastFood/DeleteFood', { id })
      if (res.data.success) setFoods((prev) => prev.filter((f) => f._id !== id))
    } catch (err) {
      alert('Delete failed')
    } finally {
      setBusy(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#C0392B] mb-2 font-semibold">
            Aamir Admin
          </p>
          <h1 className="font-serif text-4xl text-[#1A1A1A] font-semibold">
            All Food Items
          </h1>
        </div>
        <Link
          to="/admin/add-food"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#F5A623] to-[#E8941A] px-5 py-3 text-sm font-bold text-[#1A1A1A] hover:shadow-[0_8px_25px_rgba(245,166,35,0.4)] transition"
        >
          <Plus className="h-4 w-4" />
          Add Food
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : foods.length === 0 ? (
        <div className="bg-[#FFFDF7] rounded-2xl border border-[#F5A623]/25 p-10 text-center text-[#6B4C2A]">
          No food items yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {foods.map((f) => (
            <div
              key={f._id}
              className="bg-[#FFFDF7] rounded-2xl border border-[#F5A623]/25 overflow-hidden shadow-sm hover:shadow-md hover:border-[#F5A623]/50 transition group"
            >
              <div className="relative">
                <img
                  src={f.image}
                  alt={f.name}
                  className="h-44 w-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#FFFDF7]/95 px-3 py-1 rounded-full text-xs font-semibold text-[#C0392B] shadow">
                  {f.category}
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-[#1A1A1A]">{f.name}</h3>
                  <span className="text-[#C0392B] font-bold">
                    Rs. {f.price}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[#6B4C2A] line-clamp-2">
                  {f.description}
                </p>

                <div className="mt-4 flex gap-2 border-t border-[#F5A623]/15 pt-4">
                  <button
                    onClick={() => navigate(`/admin/edit-food/${f._id}`)}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-[#F5A623]/40 bg-[#F5A623]/5 py-2 text-xs font-bold uppercase tracking-[0.1em] text-[#C97D12] hover:bg-[#F5A623] hover:text-[#1A1A1A] transition"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(f._id)}
                    disabled={busy === f._id}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-[#C0392B]/40 bg-[#C0392B]/5 py-2 text-xs font-bold uppercase tracking-[0.1em] text-[#C0392B] hover:bg-[#C0392B] hover:text-white transition disabled:opacity-40"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AllFood