import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Pencil, Trash2, Star } from 'lucide-react'
import { getAllPackages, deletePackage } from '../../api/hallPackages.js'

const ManageHallPackages = () => {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(null)
  const navigate = useNavigate()

  const load = async () => {
    try {
      const res = await getAllPackages()
      if (res.success) setPackages(res.AllPackages || [])
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
    if (!window.confirm('Delete this hall package?')) return
    setBusy(id)
    try {
      const res = await deletePackage(id)
      if (res.success) setPackages((prev) => prev.filter((p) => p._id !== id))
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
            Hall Packages
          </h1>
          <p className="mt-2 text-sm text-[#6B4C2A]">
            Create and manage pricing for hall bookings.
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/add-package')}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#F5A623] to-[#E8941A] px-5 py-3 text-sm font-bold text-[#1A1A1A] hover:shadow-[0_8px_25px_rgba(245,166,35,0.4)] transition"
        >
          <Plus className="h-4 w-4" />
          Add Package
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : packages.length === 0 ? (
        <div className="bg-[#FFFDF7] rounded-2xl border border-[#F5A623]/25 p-10 text-center text-[#6B4C2A]">
          No packages yet. Click "Add Package" to create your first one.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {packages.map((pkg) => (
            <div
              key={pkg._id}
              className="bg-[#FFFDF7] rounded-2xl border border-[#F5A623]/25 p-6 shadow-sm hover:shadow-md transition relative"
            >
              {pkg.isPopular && (
                <div className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#F5A623] to-[#E8941A] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]">
                  <Star className="h-3 w-3 fill-current" />
                  Popular
                </div>
              )}
              <h3 className="font-serif text-2xl font-semibold text-[#1A1A1A] pr-20">
                {pkg.name}
              </h3>
              <p className="mt-2 text-sm text-[#6B4C2A] line-clamp-2">
                {pkg.description}
              </p>

              {/* ⭐ basePrice + perGuest */}
              <div className="mt-4 space-y-1">
                <p className="font-serif text-3xl text-[#C0392B] font-semibold">
                  Rs. {pkg.basePrice?.toLocaleString()}
                </p>
                {pkg.pricePerGuest > 0 && (
                  <p className="text-xs text-[#6B4C2A] font-medium">
                    + Rs. {pkg.pricePerGuest.toLocaleString()} per guest
                  </p>
                )}
              </div>

              <p className="text-xs uppercase tracking-wider text-[#6B4C2A]/60 mt-2 font-semibold">
                {pkg.capacity}
              </p>

              {pkg.features?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#F5A623]/20 space-y-1.5">
                  {pkg.features.slice(0, 4).map((f, i) => (
                    <p key={i} className="text-xs text-[#6B4C2A] flex gap-2">
                      <span className="text-[#C0392B]">✓</span>
                      {f}
                    </p>
                  ))}
                </div>
              )}

              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => navigate(`/admin/edit-package/${pkg._id}`)}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-[#F5A623]/40 bg-[#F5A623]/5 py-2 text-xs font-bold uppercase tracking-[0.1em] text-[#C97D12] hover:bg-[#F5A623] hover:text-[#1A1A1A] transition"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(pkg._id)}
                  disabled={busy === pkg._id}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-[#C0392B]/40 bg-[#C0392B]/5 py-2 text-xs font-bold uppercase tracking-[0.1em] text-[#C0392B] hover:bg-[#C0392B] hover:text-white transition disabled:opacity-40"
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

export default ManageHallPackages