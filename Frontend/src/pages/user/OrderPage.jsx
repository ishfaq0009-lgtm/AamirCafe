import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  AlertCircle,
  ShoppingBag,
  MapPin,
  CreditCard,
  Minus,
  Plus,
  Check,
  Loader2,
  Phone,
} from 'lucide-react'
import api from '../../api/axios.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { reverseGeocode } from '../../utils/reverseGeocode.js'

const PAYMENT_METHODS = [
  { id: 'Cash', label: 'Cash on Delivery', desc: 'Pay when your order arrives' },
  { id: 'Easypaisa', label: 'Easypaisa', desc: 'Send to 03XX-XXXXXXX' },
  { id: 'JazzCash', label: 'JazzCash', desc: 'Send to 03XX-XXXXXXX' },
  { id: 'Bank Transfer', label: 'Bank Transfer', desc: 'Transfer to our account' },
]

const OrderPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const isAdmin = user?.role === 'Admin'
  const item = location.state

  const [quantity, setQuantity] = useState(item?.initialQuantity || 1)
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [paymentReference, setPaymentReference] = useState('')
  const [step, setStep] = useState(1)
  const [locationCoords, setLocationCoords] = useState(null)
  const [detecting, setDetecting] = useState(false)
  const [autoFilling, setAutoFilling] = useState(false)
  const [phone, setPhone] = useState(user?.phone || '')

  const [address, setAddress] = useState({
    label: 'Home',
    street: '',
    city: '',
    zipCode: '',
  })

  if (!item) {
    return (
      <div className="min-h-screen bg-[#FFF8E7] flex flex-col items-center justify-center gap-4 pt-20">
        <h1 className="text-xl font-bold text-[#1A1A1A]">
          No food item selected
        </h1>
        <button
          onClick={() => navigate('/fast-food')}
          className="bg-gradient-to-r from-[#F5A623] to-[#E8941A] text-[#1A1A1A] px-6 py-3 rounded-full font-bold"
        >
          Back to Fast Food
        </button>
      </div>
    )
  }

  const deliveryCharges = 200
  const subtotal = Number(item.price) * quantity
  const total = subtotal + deliveryCharges

  /* ============ DETECT LOCATION + AUTO-FILL ============ */
  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      return
    }

    setDetecting(true)

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        setLocationCoords({ lat: latitude, lng: longitude })

        setAutoFilling(true)
        const addr = await reverseGeocode(latitude, longitude)
        setAutoFilling(false)

        if (addr) {
          setAddress((prev) => ({
            ...prev,
            street: addr.street || prev.street,
            city: addr.city || prev.city,
            zipCode: addr.zipCode || prev.zipCode,
          }))
        }

        setDetecting(false)
      },
      (err) => {
        alert('Location error: ' + err.message)
        setDetecting(false)
      },
      { enableHighAccuracy: true, timeout: 15000 }
    )
  }

  /* ============ PLACE ORDER ============ */
  const placeOrder = async () => {
    if (isAdmin) {
      alert('Admins cannot place orders.')
      return
    }
    if (!locationCoords) {
      alert('Please attach your delivery location')
      return
    }
    if (!address.street || !address.city) {
      alert('Please fill in street and city')
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/Order/CreateOrderApi', {
        userId: user?._id,
        items: [
          {
            foodId: item._id,
            foodName: item.name,
            price: Number(item.price),
            quantity,
            subtotal,
            image: item.image,
          },
        ],
        subtotal,
        deliveryCharges,
        total,
        customerName: user?.name || '',
        phone: phone || '',
        email: user?.email || '',
        address: {
          label: address.label,
          street: address.street,
          city: address.city,
          zipCode: address.zipCode,
          lat: locationCoords.lat,
          lng: locationCoords.lng,
        },
        paymentMethod,
        paymentReference,
      })

      if (res.data.success) {
        navigate(`/track-order/${res.data.order._id}`)
      }
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  const canGoToStep2 = locationCoords && address.street && address.city
  const canSubmit = paymentMethod === 'Cash' || paymentReference.trim()

  return (
    <div className="min-h-screen bg-[#FFF8E7] py-16 px-6">
      <div className="max-w-5xl mx-auto">
        {isAdmin && (
          <div className="mb-6 flex items-start gap-4 rounded-2xl border border-[#C0392B]/30 bg-[#C0392B]/5 p-5">
            <AlertCircle className="h-5 w-5 text-[#C0392B] mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-[#C0392B] text-sm uppercase tracking-wider">
                Admin Preview Mode
              </p>
              <p className="mt-1 text-sm text-[#6B4C2A] leading-6">
                You can view the order flow, but placing orders is disabled.
              </p>
            </div>
          </div>
        )}

        <div className="mb-10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#C0392B] font-semibold mb-2">
            Checkout · Step {step} of 2
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#1A1A1A]">
            {step === 1 ? 'Delivery Details' : 'Payment Method'}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#FFFDF7] rounded-2xl border border-[#F5A623]/25 p-6 sm:p-8 shadow-sm"
              >
                {/* Location */}
                <div className="mb-6">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#C0392B] font-bold mb-3">
                    Step 1 — Attach Location
                  </p>
                  <button
                    onClick={detectLocation}
                    disabled={detecting || autoFilling}
                    className={`w-full flex items-center justify-center gap-3 rounded-xl border-2 border-dashed py-6 transition-all ${
                      locationCoords
                        ? 'border-green-500/40 bg-green-500/5 text-green-700'
                        : 'border-[#F5A623]/40 bg-[#F5A623]/5 text-[#C97D12] hover:bg-[#F5A623]/10'
                    } disabled:opacity-50`}
                  >
                    {detecting || autoFilling ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="font-semibold">
                          {autoFilling
                            ? 'Filling address...'
                            : 'Detecting location...'}
                        </span>
                      </>
                    ) : locationCoords ? (
                      <>
                        <Check className="h-5 w-5" />
                        <span className="font-semibold">
                          Location attached · {locationCoords.lat.toFixed(4)},{' '}
                          {locationCoords.lng.toFixed(4)}
                        </span>
                      </>
                    ) : (
                      <>
                        <MapPin className="h-5 w-5" />
                        <span className="font-semibold">
                          Click to detect my location
                        </span>
                      </>
                    )}
                  </button>
                  <p className="text-xs text-[#6B4C2A]/60 mt-2 text-center">
                    We'll auto-fill your address. You can edit it below.
                  </p>
                </div>

                {/* Address fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Label"
                    value={address.label}
                    onChange={(e) =>
                      setAddress({ ...address, label: e.target.value })
                    }
                    placeholder="Home, Office, etc."
                  />
                  <Input
                    label="City"
                    value={address.city}
                    onChange={(e) =>
                      setAddress({ ...address, city: e.target.value })
                    }
                    placeholder="City name"
                  />
                  <div className="sm:col-span-2">
                    <Input
                      label="Street Address"
                      value={address.street}
                      onChange={(e) =>
                        setAddress({ ...address, street: e.target.value })
                      }
                      placeholder="House #, street, area"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Input
                      label="Zip Code (optional)"
                      value={address.zipCode}
                      onChange={(e) =>
                        setAddress({ ...address, zipCode: e.target.value })
                      }
                      placeholder="Postal code"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#C0392B] font-bold mb-2">
                      Contact Phone (optional)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C0392B]" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Add a phone number for delivery (optional)"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#F5A623]/25 bg-[#FFF8E7] text-sm text-[#1A1A1A] outline-none transition focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 placeholder:text-[#6B4C2A]/40"
                      />
                    </div>
                    <p className="text-xs text-[#6B4C2A]/60 mt-2">
                      Optional — helps the rider reach you faster.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  disabled={!canGoToStep2}
                  className="mt-8 w-full bg-gradient-to-r from-[#F5A623] to-[#E8941A] text-[#1A1A1A] py-3.5 rounded-full font-bold text-sm uppercase tracking-[0.2em] transition-all hover:shadow-[0_8px_25px_rgba(245,166,35,0.4)] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue to Payment
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#FFFDF7] rounded-2xl border border-[#F5A623]/25 p-6 sm:p-8 shadow-sm"
              >
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#C0392B] font-bold mb-3">
                  Step 2 — Choose Payment Method
                </p>

                <div className="space-y-3 mb-6">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      className={`w-full text-left rounded-xl border-2 p-4 transition-all ${
                        paymentMethod === m.id
                          ? 'border-[#F5A623] bg-[#F5A623]/10'
                          : 'border-[#F5A623]/25 hover:border-[#F5A623]/60 bg-[#FFFDF7]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${
                              paymentMethod === m.id
                                ? 'bg-gradient-to-br from-[#F5A623] to-[#E8941A]'
                                : 'bg-[#F5A623]/15'
                            }`}
                          >
                            <CreditCard
                              className={`h-5 w-5 ${
                                paymentMethod === m.id
                                  ? 'text-[#1A1A1A]'
                                  : 'text-[#C0392B]'
                              }`}
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-[#1A1A1A]">
                              {m.label}
                            </p>
                            <p className="text-xs text-[#6B4C2A]">{m.desc}</p>
                          </div>
                        </div>
                        {paymentMethod === m.id && (
                          <Check className="h-5 w-5 text-[#C0392B]" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {paymentMethod !== 'Cash' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-6"
                  >
                    <Input
                      label="Payment Reference / Transaction ID"
                      value={paymentReference}
                      onChange={(e) => setPaymentReference(e.target.value)}
                      placeholder="Enter the transaction ID you received"
                    />
                    <p className="text-xs text-[#6B4C2A]/70 mt-2">
                      Send payment to <strong>03XX-XXXXXXX</strong> and enter
                      the reference number above.
                    </p>
                  </motion.div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="rounded-full border border-[#1A1A1A]/20 px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-[#6B4C2A] hover:bg-[#F5A623]/10 transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={placeOrder}
                    disabled={loading || !canSubmit || isAdmin}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#F5A623] to-[#E8941A] text-[#1A1A1A] py-3.5 rounded-full font-bold text-sm uppercase tracking-[0.2em] transition-all hover:shadow-[0_8px_25px_rgba(245,166,35,0.4)] disabled:opacity-40"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    {loading ? 'Placing...' : `Place Order · Rs. ${total}`}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#FFFDF7] rounded-2xl border border-[#F5A623]/25 p-6 sticky top-24 shadow-sm">
              <h3 className="font-serif text-xl font-semibold text-[#1A1A1A] mb-4">
                Order Summary
              </h3>

              <div className="flex items-center gap-3 pb-4 border-b border-[#F5A623]/20">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1A1A1A] text-sm truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-[#6B4C2A]">
                    Rs. {item.price} each
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between py-4 border-b border-[#F5A623]/20">
                <span className="text-sm text-[#6B4C2A] font-medium">
                  Quantity
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity((p) => Math.max(1, p - 1))}
                    disabled={isAdmin}
                    className="w-7 h-7 rounded-lg bg-[#F5A623]/15 text-[#1A1A1A] font-bold hover:bg-[#F5A623]/25 transition disabled:opacity-40"
                  >
                    <Minus className="h-3 w-3 mx-auto" />
                  </button>
                  <span className="font-bold text-[#1A1A1A] w-6 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((p) => p + 1)}
                    disabled={isAdmin}
                    className="w-7 h-7 rounded-lg bg-[#F5A623]/15 text-[#1A1A1A] font-bold hover:bg-[#F5A623]/25 transition disabled:opacity-40"
                  >
                    <Plus className="h-3 w-3 mx-auto" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 py-4 text-sm">
                <Row label="Subtotal" value={`Rs. ${subtotal}`} />
                <Row label="Delivery" value={`Rs. ${deliveryCharges}`} />
              </div>

              <div className="flex justify-between items-center border-t border-[#F5A623]/20 pt-4">
                <span className="font-semibold text-[#1A1A1A]">Total</span>
                <span className="font-serif text-2xl font-bold text-[#C0392B]">
                  Rs. {total}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const Input = ({ label, value, onChange, placeholder = '' }) => (
  <div>
    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#C0392B] font-bold mb-2">
      {label}
    </label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-xl border border-[#F5A623]/25 bg-[#FFF8E7] px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 placeholder:text-[#6B4C2A]/40"
    />
  </div>
)

const Row = ({ label, value }) => (
  <div className="flex justify-between text-[#6B4C2A]">
    <span>{label}</span>
    <span className="font-medium">{value}</span>
  </div>
)

export default OrderPage