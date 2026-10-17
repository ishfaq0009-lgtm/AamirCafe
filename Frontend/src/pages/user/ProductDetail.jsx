import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowLeft, Check, Minus, Plus, ShoppingBag } from 'lucide-react'
import api from '../../api/axios.js'
import { useAuth } from '../../context/AuthContext.jsx'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const isAdmin = user?.role === 'Admin'

  const [food, setFood] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await api.get(`/AddNewFastFood/OneFoodData?id=${id}`)
        if (res.data.success && res.data.OneFood) {
          const f = res.data.OneFood
          setFood(f)
          setSelectedSize(f.sizes?.[0] || null)

          // Fetch related items from same category
          const all = await api.get('/AddNewFastFood/AllFoodApi')
          if (all.data.success) {
            const rel = (all.data.AllFood || [])
              .filter(
                (x) =>
                  x._id !== f._id &&
                  (x.category || '').toLowerCase() ===
                    (f.category || '').toLowerCase()
              )
              .slice(0, 4)
            setRelated(rel)
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

  if (!food) {
    return (
      <div className="min-h-screen bg-[#FFF8E7] flex flex-col items-center justify-center gap-4 pt-20">
        <p className="text-[#6B4C2A]">Product not found</p>
        <Link
          to="/fast-food"
          className="bg-gradient-to-r from-[#F5A623] to-[#E8941A] text-[#1A1A1A] px-6 py-3 rounded-full font-bold"
        >
          Back to Menu
        </Link>
      </div>
    )
  }

  const basePrice = selectedSize?.price ?? Number(food.price)
  const total = basePrice * quantity

  const handleOrder = () => {
    if (isAdmin) {
      alert('Admins cannot place orders.')
      return
    }
    navigate('/order', {
      state: {
        ...food,
        price: basePrice,
        selectedSize: selectedSize?.name || null,
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
            className="rounded-2xl overflow-hidden border border-[#F5A623]/25 bg-[#FFFDF7]"
          >
            <img
              src={food.image}
              alt={food.name}
              className="w-full h-[450px] object-cover"
            />
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#C0392B] font-semibold mb-3">
              {food.category}
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#1A1A1A] leading-tight">
              {food.name}
            </h1>
            <p className="mt-4 text-[15px] leading-7 text-[#6B4C2A]">
              {food.description || 'A delicious treat from our kitchen.'}
            </p>

            <div className="mt-6">
              <p className="font-serif text-4xl font-bold text-[#C0392B]">
                Rs. {basePrice.toLocaleString()}
              </p>
              {selectedSize && (
                <p className="text-xs uppercase tracking-wider text-[#6B4C2A]/70 mt-1">
                  {selectedSize.name} size
                </p>
              )}
            </div>

            {/* Sizes */}
            {food.sizes?.length > 0 && (
              <div className="mt-8">
                <label className="text-[10px] uppercase tracking-[0.25em] text-[#C0392B] font-bold mb-3 block">
                  Choose Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {food.sizes.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`rounded-xl border-2 px-5 py-3 text-sm font-semibold transition-all ${
                        selectedSize?.name === s.name
                          ? 'border-[#F5A623] bg-[#F5A623]/15 text-[#1A1A1A]'
                          : 'border-[#F5A623]/25 text-[#6B4C2A] hover:border-[#F5A623]/60'
                      }`}
                    >
                      <span className="block">{s.name}</span>
                      <span className="block text-xs mt-0.5 font-normal opacity-80">
                        Rs. {s.price}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

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

            {/* Order button */}
            <button
              onClick={handleOrder}
              disabled={isAdmin}
              className="mt-8 w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#F5A623] to-[#E8941A] text-[#1A1A1A] py-4 rounded-full font-bold text-sm uppercase tracking-[0.2em] transition-all hover:shadow-[0_8px_25px_rgba(245,166,35,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag className="h-4 w-4" />
              {isAdmin ? 'Ordering Disabled for Admins' : 'Order Now'}
            </button>

            {/* Features */}
            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                { label: 'Fresh', icon: '🌿' },
                { label: 'Fast Delivery', icon: '⚡' },
                { label: 'Quality', icon: '★' },
              ].map((f, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-[#F5A623]/25 bg-[#FFFDF7] p-4 text-center"
                >
                  <p className="text-xl">{f.icon}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-[#6B4C2A] font-semibold">
                    {f.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <div className="mb-8 flex items-center gap-4">
              <span className="h-px w-12 bg-[#F5A623]" />
              <h2 className="font-serif text-3xl font-semibold text-[#1A1A1A]">
                You may also like
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((r) => (
                <Link
                  key={r._id}
                  to={`/product/${r._id}`}
                  className="group rounded-2xl overflow-hidden border border-[#F5A623]/20 bg-[#FFFDF7] shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(107,76,42,0.12)] hover:border-[#F5A623]/50"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={r.image}
                      alt={r.name}
                      className="w-full h-40 object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-[#1A1A1A] text-sm truncate">
                      {r.name}
                    </h3>
                    <p className="text-[#C0392B] font-bold text-sm mt-1">
                      Rs. {r.price}
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

export default ProductDetail