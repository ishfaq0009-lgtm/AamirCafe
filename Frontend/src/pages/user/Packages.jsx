import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Star } from 'lucide-react'
import { getActivePackages } from '../../api/hallPackages.js'

const Packages = () => {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    ;(async () => {
      try {
        const res = await getActivePackages()
        if (res.success) setPackages(res.AllPackages || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className="min-h-screen bg-[#FFF8E7] px-5 py-16 text-[#1A1A1A] sm:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14">
          <p className="text-xs uppercase tracking-[0.35em] text-[#C0392B] font-semibold">
            Aamir Marriage Hall
          </p>
          <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <h1 className="font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl font-semibold text-[#1A1A1A]">
              Choose Your
              <span className="block text-[#F5A623]">Perfect Package</span>
            </h1>
            <p className="max-w-md text-sm leading-7 text-[#6B4C2A]">
              Choose the package that suits your celebration and let us take
              care of every important detail.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : packages.length === 0 ? (
          <div className="bg-[#FFFDF7] rounded-2xl border border-[#F5A623]/25 p-12 text-center text-[#6B4C2A]">
            No packages available yet. Please check back later.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {packages.map((pkg) => (
              <div
                key={pkg._id}
                className={`relative flex flex-col p-8 sm:p-10 transition-all duration-300 rounded-2xl ${
                  pkg.isPopular
                    ? 'bg-[#1A1A1A] text-white shadow-xl'
                    : 'border border-[#F5A623]/25 bg-[#FFFDF7] hover:-translate-y-1 hover:border-[#F5A623]/60 hover:shadow-[0_15px_40px_rgba(107,76,42,0.12)]'
                }`}
              >
                {pkg.isPopular && (
                  <div className="absolute right-6 top-6 inline-flex items-center gap-1 bg-gradient-to-r from-[#F5A623] to-[#E8941A] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A] rounded-full">
                    <Star className="h-3 w-3 fill-current" />
                    Popular
                  </div>
                )}

                <h2 className="mt-2 font-serif text-4xl font-semibold">
                  {pkg.name}
                </h2>
                <p
                  className={`mt-4 text-sm leading-7 ${
                    pkg.isPopular ? 'text-white/60' : 'text-[#6B4C2A]'
                  }`}
                >
                  {pkg.description}
                </p>

                <p className="mt-6 font-serif text-3xl font-bold text-[#F5A623]">
                  Rs. {pkg.price?.toLocaleString()}
                </p>
                <p
                  className={`text-[10px] uppercase tracking-wider font-semibold mt-1 ${
                    pkg.isPopular ? 'text-white/40' : 'text-[#6B4C2A]/60'
                  }`}
                >
                  {pkg.capacity}
                </p>

                <div
                  className={`my-8 h-px ${
                    pkg.isPopular ? 'bg-[#F5A623]/20' : 'bg-[#F5A623]/30'
                  }`}
                />

                {pkg.features?.length > 0 && (
                  <>
                    <p
                      className={`mb-6 text-xs uppercase tracking-[0.2em] font-semibold ${
                        pkg.isPopular ? 'text-[#F5A623]' : 'text-[#C0392B]'
                      }`}
                    >
                      Includes
                    </p>
                    <div
                      className={`flex-1 space-y-4 text-sm ${
                        pkg.isPopular ? 'text-white/70' : 'text-[#6B4C2A]'
                      }`}
                    >
                      {pkg.features.map((f, k) => (
                        <p key={k} className="flex gap-3 items-start">
                          <Check
                            className={`h-4 w-4 shrink-0 mt-0.5 ${
                              pkg.isPopular ? 'text-[#F5A623]' : 'text-[#C0392B]'
                            }`}
                          />
                          {f}
                        </p>
                      ))}
                    </div>
                  </>
                )}

                <button
                  onClick={() => navigate('/booking')}
                  className={`mt-10 w-full px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 rounded-full ${
                    pkg.isPopular
                      ? 'bg-gradient-to-r from-[#F5A623] to-[#E8941A] text-[#1A1A1A] hover:shadow-[0_8px_25px_rgba(245,166,35,0.4)]'
                      : 'border border-[#F5A623] text-[#1A1A1A] hover:bg-[#F5A623]'
                  }`}
                >
                  Book This Package
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Packages