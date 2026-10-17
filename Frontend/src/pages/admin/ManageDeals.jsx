import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Pencil, Trash2, Flame, Tag } from 'lucide-react'
import { getAllDeals, deleteDeal } from '../../api/deals.js'

const ManageDeals = () => {
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(null)
  const navigate = useNavigate()

  const load = async () => {
    try {
      const res = await getAllDeals()
      if (res.success) setDeals(res.AllDeals || [])
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
    if (!window.confirm('Delete this deal?')) return
    setBusy(id)
    try {
      const res = await deleteDeal(id)
      if (res.success) setDeals((prev) => prev.filter((d) => d._id !== id))
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
            Aamir Cafe
          </p>
          <h1 className="font-serif text-4xl text-[#1A1A1A] font-semibold">
            Deals
          </h1>
          <p className="mt-2 text-sm text-[#6B4C2A]">
            Create combos of your menu items and offer them at a discounted price.
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/add-deal')}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#F5A623] to-[#E8941A] px-5 py-3 text-sm font-bold text-[#1A1A1A] hover:shadow-[0_8px_25px_rgba(245,166,35,0.4)] transition"
        >
          <Plus className="h-4 w-4" />
          Add Deal
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : deals.length === 0 ? (
        <div className="bg-[#FFFDF7] rounded-2xl border border-[#F5A623]/25 p-12 text-center">
          <Tag className="h-12 w-12 text-[#F5A623] mx-auto mb-4" />
          <p className="font-medium text-[#1A1A1A]">No deals yet</p>
          <p className="text-sm text-[#6B4C2A] mt-1">
            Create your first deal combo to attract more customers.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {deals.map((d) => (
            <div
              key={d._id}
              className="bg-[#FFFDF7] rounded-2xl border border-[#F5A623]/25 p-5 shadow-sm hover:shadow-md transition relative"
            >
              {d.isHot && (
                <div className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#C0392B] to-[#8B2620] px-3 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                  <Flame className="h-2.5 w-2.5" />
                  Hot
                </div>
              )}
              {d.image && (
                <img
                  src={d.image}
                  alt={d.title}
                  className="w-full h-40 object-cover rounded-xl mb-4"
                />
              )}
              <h3 className="font-serif text-xl font-semibold text-[#1A1A1A] pr-16">
                {d.title}
              </h3>
              <p className="text-sm text-[#6B4C2A] mt-1 line-clamp-2">
                {d.description}
              </p>

              <div className="mt-3 space-y-1 text-xs text-[#6B4C2A]">
                {d.items?.map((it, i) => (
                  <p key={i}>
                    • {it.name} × {it.quantity}
                  </p>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-[#F5A623]/20 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[#6B4C2A]/60 font-semibold">
                    Deal Price
                  </p>
                  <p className="font-serif text-2xl font-bold text-[#C0392B]">
                    Rs. {d.dealPrice?.toLocaleString()}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider rounded-full px-3 py-1 ${
                    d.isActive
                      ? 'bg-green-500/10 text-green-700'
                      : 'bg-gray-500/10 text-gray-600'
                  }`}
                >
                  {d.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => navigate(`/admin/edit-deal/${d._id}`)}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-[#F5A623]/40 bg-[#F5A623]/5 py-2 text-xs font-bold uppercase tracking-wider text-[#C97D12] hover:bg-[#F5A623] hover:text-[#1A1A1A] transition"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(d._id)}
                  disabled={busy === d._id}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-[#C0392B]/40 bg-[#C0392B]/5 py-2 text-xs font-bold uppercase tracking-wider text-[#C0392B] hover:bg-[#C0392B] hover:text-white transition disabled:opacity-40"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ManageDeals