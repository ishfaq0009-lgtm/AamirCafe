import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Flame, Sparkles, Tag } from 'lucide-react'
import { getActiveDeals } from '../../api/deals.js'
import { useAuth } from '../../context/AuthContext.jsx'

const Deals = () => {
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { user } = useAuth()
  const isAdmin = user?.role === 'Admin'

  useEffect(() => {
    ;(async () => {
      try {
        const res = await getActiveDeals()
        if (res.success) setDeals(res.AllDeals || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className="min-h-screen bg-[#FFF8E7] py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="h-px w-8 bg-[#F5A623]" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#C0392B] font-semibold">
              Special Offers
            </span>
            <span className="h-px w-8 bg-[#F5A623]" />
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#1A1A1A]">
            Today's <span className="text-[#F5A623]">Deals</span>
          </h1>
          <p className="mt-4 text-[#6B4C2A] max-w-xl mx-auto">
            Combos handpicked by our chef — taste more, pay less.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : deals.length === 0 ? (
          <div className="rounded-2xl border border-[#F5A623]/25 bg-[#FFFDF7] p-12 text-center text-[#6B4C2A]">
            No deals available right now. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal) => (
              <Link
                key={deal._id}
                to={`/deal/${deal._id}`}
                className="group rounded-2xl overflow-hidden border border-[#F5A623]/25 bg-[#FFFDF7] shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(107,76,42,0.12)] hover:border-[#F5A623]/60 relative"
              >
                {deal.isHot && (
                  <div className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#C0392B] to-[#8B2620] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                    <Flame className="h-3 w-3" />
                    Hot
                  </div>
                )}
                <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 rounded-full bg-[#FFFDF7]/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#C0392B] shadow">
                  <Tag className="h-3 w-3" />
                  {deal.tag || 'Deal'}
                </div>

                <div className="relative overflow-hidden">
                  <img
                    src={deal.image || deal.items?.[0]?.image}
                    alt={deal.title}
                    className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="p-6">
                  <h3 className="font-serif text-2xl font-semibold text-[#1A1A1A]">
                    {deal.title}
                  </h3>
                  <p className="text-sm text-[#6B4C2A] mt-2 line-clamp-2">
                    {deal.description}
                  </p>

                  <div className="mt-4 space-y-1.5">
                    {deal.items?.slice(0, 3).map((it, i) => (
                      <div
                        key={i}
                        className="flex justify-between text-xs text-[#6B4C2A]"
                      >
                        <span>
                          {it.name} × {it.quantity}
                        </span>
                      </div>
                    ))}
                    {deal.coldDrinks?.length > 0 && (
                      <p className="text-xs text-[#6B4C2A] italic mt-1">
                        + {deal.coldDrinks.length} cold drink
                        {deal.coldDrinks.length > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#F5A623]/20 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#6B4C2A]/60 font-semibold">
                        Deal Price
                      </p>
                      <p className="font-serif text-3xl font-bold text-[#C0392B]">
                        Rs. {Number(deal.dealPrice).toLocaleString()}
                      </p>
                    </div>
                    <Sparkles className="h-6 w-6 text-[#F5A623]" />
                  </div>

                  <div className="mt-5 w-full text-center bg-gradient-to-r from-[#F5A623] to-[#E8941A] text-[#1A1A1A] py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all group-hover:shadow-[0_8px_25px_rgba(245,166,35,0.4)]">
                    View Deal
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Deals