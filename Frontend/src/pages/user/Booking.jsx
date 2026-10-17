import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  Check,
  ChevronRight,
  Sparkles,
  AlertCircle,
  Star,
  Utensils,
  Plus,
  Minus,
  CupSoda,
  ChefHat,
} from 'lucide-react'
import { createBooking } from '../../api/booking.js'
import { getActivePackages } from '../../api/hallPackages.js'
import { getAllDinners } from '../../api/dinners.js'
import api from '../../api/axios.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { RevealText } from '../../components/Reveal.jsx'
import { COLD_DRINKS } from '../../constants/coldDrinks.js'

const STEPS = [
  { key: 1, label: 'Event' },
  { key: 2, label: 'Hall & Package' },
  { key: 3, label: 'Food & Drinks' },
  { key: 4, label: 'Details' },
  { key: 5, label: 'Review' },
]

const Booking = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const isAdmin = user?.role === 'Admin'

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [packages, setPackages] = useState([])
  const [allFoods, setAllFoods] = useState([])
  const [allDinners, setAllDinners] = useState([])
  const [loadingPackages, setLoadingPackages] = useState(true)
  const [loadingFoods, setLoadingFoods] = useState(true)
  const [loadingDinners, setLoadingDinners] = useState(true)
  const [foodCategory, setFoodCategory] = useState('All')
  const [dinnerCategory, setDinnerCategory] = useState('All')

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    Phone: '',
    eventtype: '',
    eventData: '',
    Eventtime: '',
    guestCount: '',
    HallSection: '',
    decoration: '',
    package: '',
    hallPackage: '',
    message: '',
  })

  const [selectedFoods, setSelectedFoods] = useState({})
  const [selectedDinners, setSelectedDinners] = useState({})
  const [selectedDrinks, setSelectedDrinks] = useState({})

  // Load packages
  useEffect(() => {
    ;(async () => {
      try {
        const res = await getActivePackages()
        if (res.success) setPackages(res.AllPackages || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoadingPackages(false)
      }
    })()
  }, [])

  // Load all foods
  useEffect(() => {
    ;(async () => {
      try {
        const res = await api.get('/AddNewFastFood/AllFoodApi')
        if (res.data.success) setAllFoods(res.data.AllFood || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoadingFoods(false)
      }
    })()
  }, [])

  // Load all dinners
  useEffect(() => {
    ;(async () => {
      try {
        const res = await getAllDinners()
        if (res.success) setAllDinners(res.AllDinners || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoadingDinners(false)
      }
    })()
  }, [])

  const update = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.value }))

  const selectPackage = (pkg) => {
    setForm((p) => ({
      ...p,
      package: pkg.name,
      hallPackage: pkg._id,
      decoration: pkg.decorationOptions?.[0]?.name || p.decoration || '',
    }))
  }

  const next = () => setStep((s) => Math.min(5, s + 1))
  const back = () => setStep((s) => Math.max(1, s - 1))

  const canNext = () => {
    if (step === 1) return form.eventtype && form.eventData && form.Eventtime
    if (step === 2)
      return (
        form.guestCount &&
        Number(form.guestCount) > 0 &&
        form.HallSection &&
        form.hallPackage
      )
    if (step === 3) return true
    if (step === 4) return form.name && form.email && form.Phone
    return true
  }

  /* ============ FOOD ============ */
  const addFood = (food) => {
    setSelectedFoods((prev) => {
      const existing = prev[food._id]
      return {
        ...prev,
        [food._id]: {
          food,
          quantity: existing ? existing.quantity + 1 : 1,
        },
      }
    })
  }

  const updateFoodQty = (foodId, delta) => {
    setSelectedFoods((prev) => {
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

  const removeFood = (foodId) => {
    setSelectedFoods((prev) => {
      const copy = { ...prev }
      delete copy[foodId]
      return copy
    })
  }

  /* ============ DINNERS ============ */
  const addDinner = (dinner) => {
    setSelectedDinners((prev) => {
      const existing = prev[dinner._id]
      return {
        ...prev,
        [dinner._id]: {
          dinner,
          quantity: existing ? existing.quantity + 1 : 1,
        },
      }
    })
  }

  const updateDinnerQty = (dinnerId, delta) => {
    setSelectedDinners((prev) => {
      const item = prev[dinnerId]
      if (!item) return prev
      const newQty = item.quantity + delta
      if (newQty <= 0) {
        const copy = { ...prev }
        delete copy[dinnerId]
        return copy
      }
      return { ...prev, [dinnerId]: { ...item, quantity: newQty } }
    })
  }

  const removeDinner = (dinnerId) => {
    setSelectedDinners((prev) => {
      const copy = { ...prev }
      delete copy[dinnerId]
      return copy
    })
  }

  /* ============ DRINKS ============ */
  const addDrink = (drink) => {
    setSelectedDrinks((prev) => {
      const existing = prev[drink.name]
      return {
        ...prev,
        [drink.name]: {
          drink,
          quantity: existing ? existing.quantity + 1 : 1,
        },
      }
    })
  }

  const updateDrinkQty = (drinkName, delta) => {
    setSelectedDrinks((prev) => {
      const item = prev[drinkName]
      if (!item) return prev
      const newQty = item.quantity + delta
      if (newQty <= 0) {
        const copy = { ...prev }
        delete copy[drinkName]
        return copy
      }
      return { ...prev, [drinkName]: { ...item, quantity: newQty } }
    })
  }

  const removeDrink = (drinkName) => {
    setSelectedDrinks((prev) => {
      const copy = { ...prev }
      delete copy[drinkName]
      return copy
    })
  }

  /* ============ PRICE ============ */
  const selectedPkg = packages.find((p) => p._id === form.hallPackage)
  const guestCount = Number(form.guestCount) || 0
  const basePrice = selectedPkg?.basePrice || 0
  const guestsCost = guestCount * (selectedPkg?.pricePerGuest || 0)

  const selectedDeco = selectedPkg?.decorationOptions?.find(
    (d) => d.name === form.decoration
  )
  const decorationCost = selectedDeco?.price || 0

  const foodCost = Object.values(selectedFoods).reduce(
    (sum, item) => sum + item.food.price * item.quantity,
    0
  )

  const dinnersCost = Object.values(selectedDinners).reduce(
    (sum, item) => sum + item.dinner.price * item.quantity,
    0
  )

  const coldDrinksCost = Object.values(selectedDrinks).reduce(
    (sum, item) => sum + item.drink.price * item.quantity,
    0
  )

  const totalAmount =
    basePrice +
    guestsCost +
    decorationCost +
    foodCost +
    dinnersCost +
    coldDrinksCost

  /* ============ SUBMIT ============ */
  const submit = async () => {
    if (isAdmin) {
      alert('Admins cannot create bookings.')
      return
    }

    setLoading(true)
    try {
      const foodPayload = Object.values(selectedFoods).map(
        ({ food, quantity }) => ({
          foodId: food._id,
          name: food.name,
          price: Number(food.price),
          quantity,
          category: food.category || '',
          image: food.image || '',
        })
      )

      const dinnerPayload = Object.values(selectedDinners).map(
        ({ dinner, quantity }) => ({
          dinnerId: dinner._id,
          name: dinner.name,
          price: Number(dinner.price),
          quantity,
          category: dinner.category || '',
          image: dinner.image || '',
        })
      )

      const drinkPayload = Object.values(selectedDrinks).map(
        ({ drink, quantity }) => ({
          name: drink.name,
          price: Number(drink.price),
          quantity,
        })
      )

      const guestsLabel =
        guestCount <= 100
          ? 'Up to 100'
          : guestCount <= 200
          ? '100 - 200'
          : guestCount <= 300
          ? '200 - 300'
          : guestCount <= 500
          ? '300 - 500'
          : '500+'

      const payload = {
        name: form.name,
        email: form.email,
        Phone: form.Phone,
        eventData: form.eventData,
        eventtype: form.eventtype,
        Eventtime: form.Eventtime,
        HallSection: form.HallSection,
        decoration: form.decoration || '',
        guests: guestsLabel,
        guestCount,
        message: form.message || '',
        hallPackage: form.hallPackage,
        packageName: form.package,
        selectedFoods: foodPayload,
        selectedDinners: dinnerPayload,
        coldDrinks: drinkPayload,
        basePrice,
        guestsCost,
        decorationCost,
        foodCost,
        dinnersCost,
        coldDrinksCost,
        totalAmount,
      }

      const res = await createBooking(payload)
      if (res.success) {
        setSuccess(true)
        setTimeout(() => navigate('/my-bookings'), 2500)
      } else {
        alert(res.msg || 'Failed to submit booking')
      }
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to submit booking')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#FFF8E7] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-md text-center"
        >
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#F5A623]/15 border border-[#F5A623]/40 mb-8">
            <Check className="h-12 w-12 text-[#F5A623]" />
          </div>
          <h1 className="font-serif text-4xl text-[#1A1A1A] font-semibold mb-4">
            Booking Received
          </h1>
          <p className="text-[#6B4C2A] leading-7">
            Your request has been submitted. Our team will review it and
            confirm shortly.
          </p>
        </motion.div>
      </div>
    )
  }

  const filteredFoods =
    foodCategory === 'All'
      ? allFoods
      : allFoods.filter(
          (f) => (f.category || '').toLowerCase() === foodCategory.toLowerCase()
        )

  const foodCategories = ['All', 'Fast Food', 'Sweets', 'Cafe', 'Cakes']

  const dinnerCategoryNames = Array.from(
    new Set(allDinners.map((d) => d.category || 'Main Course'))
  )
  const dinnerCategories = ['All', ...dinnerCategoryNames]

  const filteredDinners =
    dinnerCategory === 'All'
      ? allDinners
      : allDinners.filter(
          (d) =>
            (d.category || 'Main Course').toLowerCase() ===
            dinnerCategory.toLowerCase()
        )

  return (
    <div className="min-h-screen bg-[#FFF8E7] text-[#1A1A1A] pt-28 pb-20">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-10 lg:px-16">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="h-px w-12 bg-[#F5A623]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-[#C0392B]">
              Marriage Hall
            </span>
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.05] max-w-3xl font-semibold text-[#1A1A1A]">
            <RevealText>Reserve the </RevealText>
            <RevealText delay={0.1}>
              <span className="text-[#F5A623]">Grand Hall.</span>
            </RevealText>
          </h1>
        </div>

        {isAdmin && (
          <div className="mb-10 flex items-start gap-4 rounded-2xl border border-[#C0392B]/30 bg-[#C0392B]/5 p-5">
            <AlertCircle className="h-5 w-5 text-[#C0392B] mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-[#C0392B] text-sm uppercase tracking-wider">
                Admin Preview Mode
              </p>
              <p className="mt-1 text-sm text-[#6B4C2A] leading-6">
                You can explore the booking flow but submitting is disabled.
              </p>
            </div>
          </div>
        )}

        {/* Stepper */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-3xl">
            {STEPS.map((s, i) => (
              <div key={s.key} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                      step >= s.key
                        ? 'border-[#F5A623] bg-gradient-to-r from-[#F5A623] to-[#E8941A] text-[#1A1A1A]'
                        : 'border-[#F5A623]/25 text-[#6B4C2A]/50'
                    }`}
                  >
                    {step > s.key ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-semibold">{s.key}</span>
                    )}
                  </div>
                  <span
                    className={`text-[10px] uppercase tracking-[0.2em] font-semibold ${
                      step >= s.key ? 'text-[#C0392B]' : 'text-[#6B4C2A]/40'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 h-px bg-[#F5A623]/20 mx-2 relative overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-[#F5A623]"
                      initial={{ width: 0 }}
                      animate={{ width: step > s.key ? '100%' : '0%' }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#F5A623]/25 bg-[#FFFDF7] p-8 sm:p-12 relative overflow-hidden shadow-[0_15px_45px_rgba(107,76,42,0.06)]">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* STEP 1 */}
            {step === 1 && (
              <StepWrapper
                title="Event Details"
                subtitle="Tell us about your special day."
              >
                <Field
                  label="Event Type"
                  value={form.eventtype}
                  onChange={update('eventtype')}
                  type="select"
                  options={[
                    'Wedding',
                    'Walima',
                    'Engagement',
                    'Mehndi',
                    'Birthday',
                    'Other',
                  ]}
                />
                <Field
                  label="Event Date"
                  value={form.eventData}
                  onChange={update('eventData')}
                  type="date"
                />
                <Field
                  label="Event Time"
                  value={form.Eventtime}
                  onChange={update('Eventtime')}
                  type="select"
                  options={[
                    'Morning - 8:00 AM',
                    'Morning - 10:00 AM',
                    'Afternoon - 1:00 PM',
                    'Evening - 6:00 PM',
                    'Night - 9:00 PM',
                    'Night - 11:00 PM',
                  ]}
                />
              </StepWrapper>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] font-semibold mb-2">
                  Guests & Hall Package
                </h2>
                <p className="text-[#6B4C2A] mb-10">
                  Choose your package and we'll calculate the total.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
                  <Field
                    label="Exact Guest Count"
                    value={form.guestCount}
                    onChange={update('guestCount')}
                    type="number"
                    placeholder="e.g. 250"
                  />
                  <Field
                    label="Hall Section"
                    value={form.HallSection}
                    onChange={update('HallSection')}
                    type="select"
                    options={[
                      'Main Hall',
                      'Male Section',
                      'Female Section',
                      'Both Sections',
                    ]}
                  />
                </div>

                <label className="mb-4 block text-[10px] font-bold uppercase tracking-[0.25em] text-[#C0392B]">
                  Choose Package
                </label>

                {loadingPackages ? (
                  <div className="flex justify-center py-10">
                    <div className="w-8 h-8 border-4 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : packages.length === 0 ? (
                  <div className="rounded-2xl border border-[#F5A623]/25 bg-[#FFF8E7] p-6 text-center text-[#6B4C2A]">
                    No packages available. Please contact admin.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {packages.map((pkg) => {
                      const isSelected = form.hallPackage === pkg._id
                      return (
                        <button
                          type="button"
                          key={pkg._id}
                          onClick={() => selectPackage(pkg)}
                          className={`relative text-left rounded-2xl border-2 p-5 transition-all duration-300 ${
                            isSelected
                              ? 'border-[#F5A623] bg-gradient-to-br from-[#F5A623]/10 to-[#E8941A]/5 shadow-[0_10px_30px_rgba(245,166,35,0.15)]'
                              : 'border-[#F5A623]/25 bg-[#FFFDF7] hover:border-[#F5A623]/60'
                          }`}
                        >
                          {pkg.isPopular && (
                            <div className="absolute -top-2 right-4 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#F5A623] to-[#E8941A] px-3 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#1A1A1A]">
                              <Star className="h-2.5 w-2.5 fill-current" />
                              Popular
                            </div>
                          )}
                          {isSelected && (
                            <div className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#F5A623]">
                              <Check className="h-3.5 w-3.5 text-[#1A1A1A]" />
                            </div>
                          )}
                          <h3 className="font-serif text-xl font-semibold text-[#1A1A1A] pr-8">
                            {pkg.name}
                          </h3>
                          <p className="mt-1 text-xs text-[#6B4C2A] line-clamp-2 min-h-[32px]">
                            {pkg.description}
                          </p>
                          <p className="mt-3 font-serif text-2xl font-bold text-[#C0392B]">
                            Rs. {pkg.basePrice?.toLocaleString()}
                          </p>
                          {pkg.pricePerGuest > 0 && (
                            <p className="text-[10px] text-[#6B4C2A] mt-0.5">
                              + Rs. {pkg.pricePerGuest} / guest
                            </p>
                          )}
                          <p className="text-[10px] uppercase tracking-wider text-[#6B4C2A]/60 font-semibold mt-1">
                            {pkg.capacity}
                          </p>
                        </button>
                      )
                    })}
                  </div>
                )}

                {selectedPkg?.decorationOptions?.length > 0 && (
                  <div className="mt-8">
                    <label className="mb-3 block text-[10px] font-bold uppercase tracking-[0.25em] text-[#C0392B]">
                      Decoration Style
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedPkg.decorationOptions.map((d, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() =>
                            setForm((p) => ({ ...p, decoration: d.name }))
                          }
                          className={`text-left rounded-xl border-2 p-4 transition-all ${
                            form.decoration === d.name
                              ? 'border-[#F5A623] bg-[#F5A623]/10'
                              : 'border-[#F5A623]/25 hover:border-[#F5A623]/60'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-[#1A1A1A]">
                              {d.name}
                            </span>
                            <span className="text-sm font-bold text-[#C0392B]">
                              + Rs. {d.price}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {form.hallPackage && (
                  <div className="mt-8 rounded-2xl border border-[#F5A623]/40 bg-gradient-to-r from-[#F5A623]/10 to-[#E8941A]/5 p-6">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#C0392B] font-semibold mb-3">
                      Price Preview
                    </p>
                    <div className="space-y-1.5 text-sm">
                      <Row label="Base price" value={`Rs. ${basePrice}`} />
                      {guestsCost > 0 && (
                        <Row
                          label={`Guests (${guestCount} × Rs. ${selectedPkg?.pricePerGuest})`}
                          value={`Rs. ${guestsCost}`}
                        />
                      )}
                      {decorationCost > 0 && (
                        <Row
                          label={`Decoration (${form.decoration})`}
                          value={`Rs. ${decorationCost}`}
                        />
                      )}
                    </div>
                    <div className="mt-3 pt-3 border-t border-[#F5A623]/25 flex justify-between">
                      <span className="font-semibold text-[#1A1A1A]">
                        Subtotal
                      </span>
                      <span className="font-serif text-2xl font-bold text-[#C0392B]">
                        Rs. {basePrice + guestsCost + decorationCost}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3 — FOOD + DINNERS + DRINKS */}
            {step === 3 && (
              <div>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] font-semibold mb-2">
                  Food, Dinners & Cold Drinks
                </h2>
                <p className="text-[#6B4C2A] mb-6">
                  Optional — pick dishes, dinners and drinks to serve at your
                  event.
                </p>

                {/* FOOD */}
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-4">
                    <Utensils className="h-5 w-5 text-[#C0392B]" />
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#C0392B] font-bold">
                      Food Menu
                    </p>
                  </div>

                  <div className="mb-6 flex flex-wrap gap-2">
                    {foodCategories.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setFoodCategory(c)}
                        className={`rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition ${
                          foodCategory === c
                            ? 'bg-gradient-to-r from-[#F5A623] to-[#E8941A] text-[#1A1A1A]'
                            : 'border border-[#F5A623]/30 text-[#6B4C2A] hover:border-[#F5A623]'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>

                  {loadingFoods ? (
                    <div className="flex justify-center py-10">
                      <div className="w-8 h-8 border-4 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : filteredFoods.length === 0 ? (
                    <div className="rounded-2xl border border-[#F5A623]/25 bg-[#FFF8E7] p-6 text-center text-[#6B4C2A]">
                      No dishes found in this category.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredFoods.map((food) => {
                        const selected = selectedFoods[food._id]
                        return (
                          <div
                            key={food._id}
                            className={`rounded-2xl border-2 p-4 transition-all ${
                              selected
                                ? 'border-[#F5A623] bg-[#F5A623]/5'
                                : 'border-[#F5A623]/20 bg-[#FFFDF7]'
                            }`}
                          >
                            <div className="flex gap-3 mb-3">
                              {food.image && (
                                <img
                                  src={food.image}
                                  alt={food.name}
                                  className="w-16 h-16 rounded-lg object-cover"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-[#1A1A1A] truncate">
                                  {food.name}
                                </p>
                                <p className="text-xs text-[#6B4C2A] mt-0.5">
                                  Rs. {food.price}
                                </p>
                                <span className="inline-block text-[9px] uppercase tracking-wider mt-1 font-semibold text-[#C0392B]">
                                  {food.category}
                                </span>
                              </div>
                            </div>

                            {selected ? (
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => updateFoodQty(food._id, -1)}
                                    className="w-7 h-7 rounded-lg bg-[#F5A623]/15 text-[#1A1A1A] font-bold hover:bg-[#F5A623]/25 transition flex items-center justify-center"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </button>
                                  <span className="font-bold text-[#1A1A1A] w-6 text-center text-sm">
                                    {selected.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => updateFoodQty(food._id, 1)}
                                    className="w-7 h-7 rounded-lg bg-[#F5A623]/15 text-[#1A1A1A] font-bold hover:bg-[#F5A623]/25 transition flex items-center justify-center"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </button>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeFood(food._id)}
                                  className="text-[10px] text-[#C0392B] hover:underline font-bold uppercase"
                                >
                                  Remove
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => addFood(food)}
                                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#F5A623] to-[#E8941A] text-[#1A1A1A] py-2 text-[11px] font-bold uppercase tracking-wider hover:shadow-[0_4px_15px_rgba(245,166,35,0.4)] transition"
                              >
                                <Plus className="h-3.5 w-3.5" />
                                Add
                              </button>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {Object.keys(selectedFoods).length > 0 && (
                    <div className="mt-6 rounded-2xl border border-[#F5A623]/40 bg-gradient-to-r from-[#F5A623]/10 to-[#E8941A]/5 p-5">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-[#C0392B] font-semibold mb-3">
                        Selected Dishes ({Object.keys(selectedFoods).length})
                      </p>
                      <div className="space-y-1.5">
                        {Object.values(selectedFoods).map(
                          ({ food, quantity }) => (
                            <div
                              key={food._id}
                              className="flex justify-between text-sm"
                            >
                              <span className="text-[#1A1A1A]">
                                {food.name} × {quantity}
                              </span>
                              <span className="font-medium text-[#6B4C2A]">
                                Rs. {food.price * quantity}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                      <div className="mt-3 pt-3 border-t border-[#F5A623]/25 flex justify-between">
                        <span className="font-semibold text-[#1A1A1A]">
                          Food Total
                        </span>
                        <span className="font-serif text-xl font-bold text-[#C0392B]">
                          Rs. {foodCost}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* DINNERS */}
                <div className="mb-10 pt-8 border-t border-[#F5A623]/20">
                  <div className="flex items-center gap-3 mb-4">
                    <ChefHat className="h-5 w-5 text-[#C0392B]" />
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#C0392B] font-bold">
                      Dinner Menu
                    </p>
                  </div>

                  {loadingDinners ? (
                    <div className="flex justify-center py-10">
                      <div className="w-8 h-8 border-4 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : allDinners.length === 0 ? (
                    <div className="rounded-2xl border border-[#F5A623]/25 bg-[#FFF8E7] p-6 text-center text-[#6B4C2A]">
                      No dinners available yet.
                    </div>
                  ) : (
                    <>
                      <div className="mb-6 flex flex-wrap gap-2">
                        {dinnerCategories.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setDinnerCategory(c)}
                            className={`rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition ${
                              dinnerCategory === c
                                ? 'bg-gradient-to-r from-[#F5A623] to-[#E8941A] text-[#1A1A1A]'
                                : 'border border-[#F5A623]/30 text-[#6B4C2A] hover:border-[#F5A623]'
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredDinners.map((dinner) => {
                          const selected = selectedDinners[dinner._id]
                          return (
                            <div
                              key={dinner._id}
                              className={`rounded-2xl border-2 p-4 transition-all ${
                                selected
                                  ? 'border-[#F5A623] bg-[#F5A623]/5'
                                  : 'border-[#F5A623]/20 bg-[#FFFDF7]'
                              }`}
                            >
                              <div className="flex gap-3 mb-3">
                                {dinner.image && (
                                  <img
                                    src={dinner.image}
                                    alt={dinner.name}
                                    className="w-16 h-16 rounded-lg object-cover"
                                  />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-sm text-[#1A1A1A] truncate">
                                    {dinner.name}
                                  </p>
                                  <p className="text-xs text-[#6B4C2A] mt-0.5">
                                    Rs. {dinner.price}
                                  </p>
                                  <span className="inline-block text-[9px] uppercase tracking-wider mt-1 font-semibold text-[#C0392B]">
                                    {dinner.category || 'Main Course'}
                                  </span>
                                </div>
                              </div>

                              {selected ? (
                                <div className="flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        updateDinnerQty(dinner._id, -1)
                                      }
                                      className="w-7 h-7 rounded-lg bg-[#F5A623]/15 text-[#1A1A1A] font-bold hover:bg-[#F5A623]/25 transition flex items-center justify-center"
                                    >
                                      <Minus className="h-3 w-3" />
                                    </button>
                                    <span className="font-bold text-[#1A1A1A] w-6 text-center text-sm">
                                      {selected.quantity}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        updateDinnerQty(dinner._id, 1)
                                      }
                                      className="w-7 h-7 rounded-lg bg-[#F5A623]/15 text-[#1A1A1A] font-bold hover:bg-[#F5A623]/25 transition flex items-center justify-center"
                                    >
                                      <Plus className="h-3 w-3" />
                                    </button>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeDinner(dinner._id)}
                                    className="text-[10px] text-[#C0392B] hover:underline font-bold uppercase"
                                  >
                                    Remove
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => addDinner(dinner)}
                                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#F5A623] to-[#E8941A] text-[#1A1A1A] py-2 text-[11px] font-bold uppercase tracking-wider hover:shadow-[0_4px_15px_rgba(245,166,35,0.4)] transition"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                  Add
                                </button>
                              )}
                            </div>
                          )
                        })}
                      </div>

                      {Object.keys(selectedDinners).length > 0 && (
                        <div className="mt-6 rounded-2xl border border-[#F5A623]/40 bg-gradient-to-r from-[#F5A623]/10 to-[#E8941A]/5 p-5">
                          <p className="text-[10px] uppercase tracking-[0.3em] text-[#C0392B] font-semibold mb-3">
                            Selected Dinners (
                            {Object.keys(selectedDinners).length})
                          </p>
                          <div className="space-y-1.5">
                            {Object.values(selectedDinners).map(
                              ({ dinner, quantity }) => (
                                <div
                                  key={dinner._id}
                                  className="flex justify-between text-sm"
                                >
                                  <span className="text-[#1A1A1A]">
                                    {dinner.name} × {quantity}
                                  </span>
                                  <span className="font-medium text-[#6B4C2A]">
                                    Rs. {dinner.price * quantity}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                          <div className="mt-3 pt-3 border-t border-[#F5A623]/25 flex justify-between">
                            <span className="font-semibold text-[#1A1A1A]">
                              Dinners Total
                            </span>
                            <span className="font-serif text-xl font-bold text-[#C0392B]">
                              Rs. {dinnersCost}
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* COLD DRINKS */}
                <div className="pt-8 border-t border-[#F5A623]/20">
                  <div className="flex items-center gap-3 mb-4">
                    <CupSoda className="h-5 w-5 text-[#C0392B]" />
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#C0392B] font-bold">
                      Cold Drinks
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {COLD_DRINKS.map((drink) => {
                      const selected = selectedDrinks[drink.name]
                      return (
                        <div
                          key={drink.name}
                          className={`rounded-2xl border-2 p-4 transition-all ${
                            selected
                              ? 'border-[#F5A623] bg-[#F5A623]/5'
                              : 'border-[#F5A623]/20 bg-[#FFFDF7]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <p className="font-semibold text-sm text-[#1A1A1A]">
                              {drink.name}
                            </p>
                            <p className="text-xs font-bold text-[#C0392B]">
                              Rs. {drink.price}
                            </p>
                          </div>

                          {selected ? (
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateDrinkQty(drink.name, -1)
                                  }
                                  className="w-7 h-7 rounded-lg bg-[#F5A623]/15 text-[#1A1A1A] font-bold hover:bg-[#F5A623]/25 transition flex items-center justify-center"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="font-bold text-[#1A1A1A] w-6 text-center text-sm">
                                  {selected.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateDrinkQty(drink.name, 1)}
                                  className="w-7 h-7 rounded-lg bg-[#F5A623]/15 text-[#1A1A1A] font-bold hover:bg-[#F5A623]/25 transition flex items-center justify-center"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeDrink(drink.name)}
                                className="text-[10px] text-[#C0392B] hover:underline font-bold uppercase"
                              >
                                Remove
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => addDrink(drink)}
                              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#F5A623] to-[#E8941A] text-[#1A1A1A] py-2 text-[11px] font-bold uppercase tracking-wider hover:shadow-[0_4px_15px_rgba(245,166,35,0.4)] transition"
                            >
                              <Plus className="h-3.5 w-3.5" />
                              Add
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {Object.keys(selectedDrinks).length > 0 && (
                    <div className="mt-6 rounded-2xl border border-[#F5A623]/40 bg-gradient-to-r from-[#F5A623]/10 to-[#E8941A]/5 p-5">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-[#C0392B] font-semibold mb-3">
                        Selected Drinks ({Object.keys(selectedDrinks).length})
                      </p>
                      <div className="space-y-1.5">
                        {Object.values(selectedDrinks).map(
                          ({ drink, quantity }) => (
                            <div
                              key={drink.name}
                              className="flex justify-between text-sm"
                            >
                              <span className="text-[#1A1A1A]">
                                {drink.name} × {quantity}
                              </span>
                              <span className="font-medium text-[#6B4C2A]">
                                Rs. {drink.price * quantity}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                      <div className="mt-3 pt-3 border-t border-[#F5A623]/25 flex justify-between">
                        <span className="font-semibold text-[#1A1A1A]">
                          Drinks Total
                        </span>
                        <span className="font-serif text-xl font-bold text-[#C0392B]">
                          Rs. {coldDrinksCost}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <StepWrapper
                title="Your Details"
                subtitle="So we can reach you."
              >
                <Field
                  label="Full Name"
                  value={form.name}
                  onChange={update('name')}
                />
                <Field
                  label="Email"
                  value={form.email}
                  onChange={update('email')}
                  type="email"
                />
                <Field
                  label="Phone Number"
                  value={form.Phone}
                  onChange={update('Phone')}
                  type="tel"
                />
                <div className="md:col-span-2">
                  <Field
                    label="Special Requirements"
                    value={form.message}
                    onChange={update('message')}
                    type="textarea"
                  />
                </div>
              </StepWrapper>
            )}

            {/* STEP 5 */}
            {step === 5 && (
              <div>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] font-semibold mb-2">
                  Review & Confirm
                </h2>
                <p className="text-[#6B4C2A] mb-10">
                  Please verify your booking before submitting.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <ReviewItem label="Name" value={form.name} />
                  <ReviewItem label="Email" value={form.email} />
                  <ReviewItem label="Phone" value={form.Phone} />
                  <ReviewItem label="Event Type" value={form.eventtype} />
                  <ReviewItem label="Event Date" value={form.eventData} />
                  <ReviewItem label="Event Time" value={form.Eventtime} />
                  <ReviewItem
                    label="Guest Count"
                    value={form.guestCount ? `${form.guestCount} guests` : '—'}
                  />
                  <ReviewItem label="Hall Section" value={form.HallSection} />
                  <ReviewItem label="Package" value={form.package} />
                  <ReviewItem
                    label="Decoration"
                    value={form.decoration || 'Not selected'}
                  />
                </div>

                {Object.keys(selectedFoods).length > 0 && (
                  <div className="mb-4 rounded-2xl border border-[#F5A623]/25 bg-[#FFF8E7] p-5">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-[#C0392B] font-bold mb-3">
                      Selected Dishes
                    </p>
                    <div className="space-y-2">
                      {Object.values(selectedFoods).map(
                        ({ food, quantity }) => (
                          <div
                            key={food._id}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-[#1A1A1A]">
                              {food.name} × {quantity}
                            </span>
                            <span className="text-[#6B4C2A] font-medium">
                              Rs. {food.price * quantity}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {Object.keys(selectedDinners).length > 0 && (
                  <div className="mb-4 rounded-2xl border border-[#F5A623]/25 bg-[#FFF8E7] p-5">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-[#C0392B] font-bold mb-3">
                      Selected Dinners
                    </p>
                    <div className="space-y-2">
                      {Object.values(selectedDinners).map(
                        ({ dinner, quantity }) => (
                          <div
                            key={dinner._id}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-[#1A1A1A]">
                              {dinner.name} × {quantity}
                            </span>
                            <span className="text-[#6B4C2A] font-medium">
                              Rs. {dinner.price * quantity}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {Object.keys(selectedDrinks).length > 0 && (
                  <div className="mb-6 rounded-2xl border border-[#F5A623]/25 bg-[#FFF8E7] p-5">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-[#C0392B] font-bold mb-3">
                      Selected Drinks
                    </p>
                    <div className="space-y-2">
                      {Object.values(selectedDrinks).map(
                        ({ drink, quantity }) => (
                          <div
                            key={drink.name}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-[#1A1A1A]">
                              {drink.name} × {quantity}
                            </span>
                            <span className="text-[#6B4C2A] font-medium">
                              Rs. {drink.price * quantity}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                <div className="rounded-2xl border border-[#F5A623]/40 bg-gradient-to-r from-[#F5A623]/10 to-[#E8941A]/5 p-6">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#C0392B] font-semibold mb-4">
                    Pricing Breakdown
                  </p>
                  <div className="space-y-2 text-sm">
                    <Row label="Base price" value={`Rs. ${basePrice}`} />
                    {guestsCost > 0 && (
                      <Row
                        label={`Guests (${guestCount})`}
                        value={`Rs. ${guestsCost}`}
                      />
                    )}
                    {decorationCost > 0 && (
                      <Row
                        label="Decoration"
                        value={`Rs. ${decorationCost}`}
                      />
                    )}
                    {foodCost > 0 && (
                      <Row label="Food" value={`Rs. ${foodCost}`} />
                    )}
                    {dinnersCost > 0 && (
                      <Row label="Dinners" value={`Rs. ${dinnersCost}`} />
                    )}
                    {coldDrinksCost > 0 && (
                      <Row
                        label="Cold Drinks"
                        value={`Rs. ${coldDrinksCost}`}
                      />
                    )}
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#F5A623]/25 flex justify-between items-center">
                    <span className="font-semibold text-[#1A1A1A] text-lg">
                      Total Amount
                    </span>
                    <span className="font-serif text-3xl font-bold text-[#C0392B]">
                      Rs. {totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {form.message && (
                  <div className="mt-6">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-[#6B4C2A] mb-2 font-semibold">
                      Message
                    </p>
                    <p className="text-[#1A1A1A]/80 leading-7">
                      {form.message}
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Nav */}
          <div className="mt-12 flex items-center justify-between border-t border-[#F5A623]/20 pt-8">
            <button
              onClick={back}
              disabled={step === 1}
              className="rounded-full border border-[#1A1A1A]/20 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.25em] text-[#6B4C2A] transition-all hover:border-[#1A1A1A]/40 hover:text-[#1A1A1A] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Back
            </button>

            {step < 5 ? (
              <button
                onClick={next}
                disabled={!canNext()}
                className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#F5A623] to-[#E8941A] px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.25em] text-[#1A1A1A] transition-all hover:shadow-[0_8px_25px_rgba(245,166,35,0.4)] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            ) : isAdmin ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-[#C0392B]/10 border border-[#C0392B]/30 px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.25em] text-[#C0392B]">
                <AlertCircle className="h-4 w-4" />
                Booking Disabled for Admins
              </div>
            ) : (
              <button
                onClick={submit}
                disabled={loading}
                className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#F5A623] to-[#E8941A] px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.25em] text-[#1A1A1A] transition-all hover:shadow-[0_8px_25px_rgba(245,166,35,0.4)] disabled:opacity-50"
              >
                {loading ? 'Submitting...' : `Confirm · Rs. ${totalAmount}`}
                <Sparkles className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const StepWrapper = ({ title, subtitle, children }) => (
  <div>
    <h2 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] font-semibold mb-2">
      {title}
    </h2>
    <p className="text-[#6B4C2A] mb-10">{subtitle}</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
  </div>
)

const Field = ({
  label,
  value,
  onChange,
  type = 'text',
  options = [],
  placeholder,
}) => {
  const baseCls =
    'w-full rounded-xl border border-[#F5A623]/25 bg-[#FFF8E7] px-4 py-4 text-sm text-[#1A1A1A] outline-none transition-all focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 placeholder:text-[#6B4C2A]/40'

  return (
    <div>
      <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.25em] text-[#C0392B]">
        {label}
      </label>
      {type === 'select' ? (
        <select value={value} onChange={onChange} className={baseCls}>
          <option value="">Select {label}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          rows="4"
          value={value}
          onChange={onChange}
          placeholder="Tell us anything else..."
          className={`${baseCls} resize-none`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          className={baseCls}
        />
      )}
    </div>
  )
}

const ReviewItem = ({ label, value }) => (
  <div className="border-b border-[#F5A623]/20 pb-3">
    <p className="text-[10px] uppercase tracking-[0.25em] text-[#6B4C2A] mb-1 font-semibold">
      {label}
    </p>
    <p className="text-[#1A1A1A] font-medium">{value || '—'}</p>
  </div>
)

const Row = ({ label, value }) => (
  <div className="flex justify-between text-[#6B4C2A]">
    <span>{label}</span>
    <span className="font-medium text-[#1A1A1A]">{value}</span>
  </div>
)

export default Booking