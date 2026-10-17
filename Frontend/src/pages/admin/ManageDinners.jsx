import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Pencil, Trash2, ChefHat } from 'lucide-react'
import { getAllDinners, deleteDinner } from '../../api/dinners.js'

const ManageDinners = () => {
  const [dinners, setDinners] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(null)
  const navigate = useNavigate()

  const load = async () => {
    try {
      const res = await getAllDinners()
      if (res.success) setDinners(res.AllDinners || [])
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
    if (!window.confirm('Delete this dinner item?')) return
    setBusy(id)
    try {
      const res = await deleteDinner(id)
      if (res.success) setDinners((prev) => prev.filter((d) => d._id !== id))
    } catch (e) {
      alert('Delete failed')
    } finally {
      setBusy(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#C0392B] mb-2 font-semibold">
            Aamir Marriage Hall
          </p>
          <h1 className="font-serif text-4xl text-[#1A1A1A] font-semibold">
            Dinner Menu
          </h1>
          <p className="mt-2 text-sm text-[#6B4C2A]">
            Add dinner dishes (rice, white karahi, BBQ, etc.) that customers
            can pick while booking the hall.
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/add-dinner')}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#F5A623] to-[#E8941A] px-5 py-3 text-sm font-bold text-[#1A1A1A] hover:shadow-[0_8px_25px_rgba(245,166,35,0.4)] transition"
        >
          <Plus className="h-4 w-4" />
          Add Dinner
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : dinners.length === 0 ? (
        <div className="bg-[#FFFDF7] rounded-2xl border border-[#F5A623]/25 p-12 text-center">
          <ChefHat className="h-12 w-12 text-[#F5A623] mx-auto mb-4" />
          <p className="font-medium text-[#1A1A1A]">No dinner items yet</p>
          <p className="text-sm text-[#6B4C2A] mt-1">
            Click "Add Dinner" to create your first dinner dish.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {dinners.map((d) => (
            <div
              key={d._id}
              className="bg-[#FFFDF7] rounded-2xl border border-[#F5A623]/25 overflow-hidden shadow-sm hover:shadow-md hover:border-[#F5A623]/50 transition"
            >
              <div className="relative">
                <img
                  src={d.image}
                  alt={d.name}
                  className="h-44 w-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#FFFDF7]/95 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#C0392B] shadow">
                  {d.category || 'Main Course'}
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-[#1A1A1A]">{d.name}</h3>
                  <span className="text-[#C0392B] font-bold whitespace-nowrap">
                    Rs. {d.price}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[#6B4C2A] line-clamp-2">
                  {d.description}
                </p>

                <div className="mt-4 flex gap-2 border-t border-[#F5A623]/15 pt-4">
                  <button
                    onClick={() => navigate(`/admin/edit-dinner/${d._id}`)}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-[#F5A623]/40 bg-[#F5A623]/5 py-2 text-xs font-bold uppercase tracking-[0.1em] text-[#C97D12] hover:bg-[#F5A623] hover:text-[#1A1A1A] transition"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(d._id)}
                    disabled={busy === d._id}
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

export default ManageDinners