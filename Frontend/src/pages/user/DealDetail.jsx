import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  ArrowLeft,
  Check,
  Minus,
  Plus,
  ShoppingBag,
  Flame,
  Tag,
  CupSoda,
} from 'lucide-react'
import { getDeal } from '../../api/deals.js'
import { useAuth } from '../../context/AuthContext.jsx'

const DealDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const isAdmin = user?.role === 'Admin'

  const [deal, setDeal] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await getDeal(id)
        if (res.success && res.deal) {
          setDeal(res.deal)
          // Fetch related deals
          const { getActiveDeals } = await import('../../api/deals.js')
          const all = await getActiveDeals()
          if (all.success) {
            setRelated(
              (all.AllDeals || []).filter((d) => d._id !== res.deal._id).slice(0, 3)
            )
          }
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8E7] flex items-center justify-center pt-20">
        <div className="w-12 h-12 border-4 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-[#FFF8E7] flex flex-col items-center justify-center gap-4 pt-20">
        <p className="text-[#6B4C2A]">Deal not found</p>
        <Link
          to="/deals"
          className="bg-gradient-to-r from-[#F5A623] to-[#E8941A] text-[#1A1A1A] px-6 py-3 rounded-full font-bold"
        >
          Back to Deals
        </Link>
      </div>
    )
  }

  // Calculate original total (items + drinks)
  const itemsOriginal = (deal.items || []).reduce(
    (sum, it) => sum + Number(it.price) * (it.quantity || 1),
    0
  )
  const drinksOriginal = (deal.coldDrinks || []).reduce(
    (sum, d) => sum + Number(d.price) * (d.quantity || 1),
    0
  )
  const originalTotal = itemsOriginal + drinksOriginal
  const discount =
    originalTotal > 0
      ? Math.round(
          ((originalTotal - deal.dealPrice) / originalTotal) * 100
        )
      : 0

  const total = Number(deal.dealPrice) * quantity

  const handleOrder = () => {
    if (isAdmin) {
      alert('Admins cannot place orders.')
      return
    }
    navigate('/order', {
      state: {
        _id: deal._id,
        name: deal.title,
        price: deal.dealPrice,
        image: deal.image || deal.items?.[0]?.image,
        category: 'Deal',
        description: deal.description,
        isDeal: true,
        initialQuantity: quantity,
      },
    })
  }

  return (
    <div className="min-h-screen bg-[#FFF8E7] py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#6B4C2A] hover:text-[#C0392B] font-semibold mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden border border-[#F5A623]/25 bg-[#FFFDF7]"
          >
            <img
              src={deal.image || deal.items?.[0]?.image}
              alt={deal.title}
              className="w-full h-[450px] object-cover"
            />

            {deal.isHot && (
              <div className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#C0392B] to-[#8B2620] px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-lg">
                <Flame className="h-3.5 w-3.5" />
                Hot Deal
              </div>
            )}

            <div className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-[#FFFDF7]/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#C0392B] shadow">
              <Tag className="h-3 w-3" />
              {deal.tag || 'Deal'}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#C0392B] font-semibold mb-3">
              Special Combo
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#1A1A1A] leading-tight">
              {deal.title}
            </h1>
            <p className="mt-4 text-[15px] leading-7 text-[#6B4C2A]">
              {deal.description || 'A handpicked combo crafted for you.'}
            </p>

            {/* Pricing */}
            <div className="mt-6 flex items-end gap-4">
              <p className="font-serif text-4xl font-bold text-[#C0392B]">
                Rs. {Number(deal.dealPrice).toLocaleString()}
              </p>
              {originalTotal > deal.dealPrice && (
                <>
                  <p className="text-lg line-through text-[#6B4C2A]/50">
                    Rs. {originalTotal.toLocaleString()}
                  </p>
                  <span className="rounded-full bg-green-500/15 text-green-700 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Included items */}
            <div className="mt-8 rounded-2xl border border-[#F5A623]/25 bg-[#FFFDF7] p-5">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#C0392B] font-bold mb-3">
                What's Included
              </p>
              <div className="space-y-2">
                {(deal.items || []).map((it, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="flex items-center gap-2 text-[#1A1A1A]">
                      <Check className="h-3.5 w-3.5 text-[#C0392B]" />
                      {it.name}
                    </span>
                    <span className="text-[#6B4C2A]">
                      × {it.quantity || 1}
                    </span>
                  </div>
                ))}
              </div>

              {deal.coldDrinks?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#F5A623]/20">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#C0392B] font-bold mb-3 flex items-center gap-2">
                    <CupSoda className="h-3.5 w-3.5" />
                    Cold Drinks
                  </p>
                  <div className="space-y-2">
                    {deal.coldDrinks.map((d, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="flex items-center gap-2 text-[#1A1A1A]">
                          <Check className="h-3.5 w-3.5 text-[#C0392B]" />
                          {d.name}
                        </span>
                        <span className="text-[#6B4C2A]">
                          × {d.quantity || 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity */}
            <div className="mt-8 flex items-center gap-6">
              <div>
                <label className="text-[10px] uppercase tracking-[0.25em] text-[#C0392B] font-bold mb-3 block">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity((p) => Math.max(1, p - 1))}
                    className="w-9 h-9 rounded-lg bg-[#F5A623]/15 text-[#1A1A1A] font-bold hover:bg-[#F5A623]/25 transition flex items-center justify-center"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="font-bold text-[#1A1A1A] w-8 text-center text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((p) => p + 1)}
                    className="w-9 h-9 rounded-lg bg-[#F5A623]/15 text-[#1A1A1A] font-bold hover:bg-[#F5A623]/25 transition flex items-center justify-center"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="pt-7">
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#6B4C2A] font-semibold">
                  Total
                </p>
                <p className="font-serif text-2xl font-bold text-[#C0392B]">
                  Rs. {total.toLocaleString()}
                </p>
              </div>
            </div>

            <button
              onClick={handleOrder}
              disabled={isAdmin}
              className="mt-8 w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#F5A623] to-[#E8941A] text-[#1A1A1A] py-4 rounded-full font-bold text-sm uppercase tracking-[0.2em] transition-all hover:shadow-[0_8px_25px_rgba(245,166,35,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag className="h-4 w-4" />
              {isAdmin ? 'Ordering Disabled for Admins' : 'Order This Deal'}
            </button>
          </motion.div>
        </div>

        {/* Related deals */}
        {related.length > 0 && (
          <div>
            <div className="mb-8 flex items-center gap-4">
              <span className="h-px w-12 bg-[#F5A623]" />
              <h2 className="font-serif text-3xl font-semibold text-[#1A1A1A]">
                Other Hot Deals
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((r) => (
                <Link
                  key={r._id}
                  to={`/deal/${r._id}`}
                  className="group rounded-2xl overflow-hidden border border-[#F5A623]/20 bg-[#FFFDF7] shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(107,76,42,0.12)] hover:border-[#F5A623]/50"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={r.image || r.items?.[0]?.image}
                      alt={r.title}
                      className="w-full h-44 object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {r.isHot && (
                      <div className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#C0392B] to-[#8B2620] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                        <Flame className="h-2.5 w-2.5" />
                        Hot
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-[#1A1A1A] text-sm truncate">
                      {r.title}
                    </h3>
                    <p className="text-[#C0392B] font-bold text-sm mt-1">
                      Rs. {Number(r.dealPrice).toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DealDetail