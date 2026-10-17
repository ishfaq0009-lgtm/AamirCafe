import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios.js'

const Cakes = () => {
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    ;(async () => {
      try {
        const res = await api.get('/AddNewFastFood/AllFoodApi')
        if (res.data.success) {
          setFoods(
            (res.data.AllFood || []).filter(
              (f) => (f.category || '').toLowerCase() === 'cakes'
            )
          )
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className="min-h-screen bg-[#FFF8E7] py-16 px-6">
      <div className="text-center mb-10">
        <p className="text-[#C0392B] font-semibold uppercase tracking-[3px] text-sm mb-2">
          Aamir Bakery
        </p>
        <h1 className="text-3xl md:text-4xl font-serif font-semibold text-[#1A1A1A]">
          Freshly Baked Cakes
        </h1>
        <div className="w-16 h-1 bg-[#F5A623] mx-auto mt-4 rounded-full" />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : foods.length === 0 ? (
        <div className="text-center text-[#6B4C2A] py-20">
          No cakes available yet.
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {foods.map((item) => (
            <div
              key={item._id}
              className="group bg-[#FFFDF7] rounded-2xl overflow-hidden border border-[#F5A623]/20 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(107,76,42,0.12)] hover:border-[#F5A623]/50"
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-[#FFFDF7]/95 px-3 py-1 rounded-full text-xs font-semibold text-[#C0392B] shadow">
                  {item.category}
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-[#1A1A1A]">
                    {item.name}
                  </h3>
                  <span className="text-base font-bold text-[#C0392B] whitespace-nowrap">
                    Rs. {item.price}
                  </span>
                </div>
                <p className="text-[#6B4C2A] text-sm leading-6 mt-3 mb-5">
                  {item.description}
                </p>

                <button
                  onClick={() => navigate(`/product/${item._id}`)}
                  className="w-full bg-gradient-to-r from-[#F5A623] to-[#E8941A] text-[#1A1A1A] py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-[0_8px_20px_rgba(245,166,35,0.4)] hover:-translate-y-0.5 active:scale-95"
                >
                  View & Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Cakes