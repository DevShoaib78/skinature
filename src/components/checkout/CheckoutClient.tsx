'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Lock, X, CheckCircle2, XCircle } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { cn } from '@/lib/utils'
import { useCart, cartSubtotalPaise } from '@/store/cart'
import { formatPaise } from '@/lib/format'
import { INDIAN_STATES, shippingPaiseForState } from '@/lib/shipping'

interface PendingOrder {
  orderId: string
  orderNo: string
  subtotalPaise: number
  shippingPaise: number
  totalPaise: number
}

interface FormState {
  email: string
  phone: string
  fullName: string
  line1: string
  line2: string
  city: string
  state: string
  pincode: string
}

type Errors = Partial<Record<keyof FormState, string>>

const EMPTY_FORM: FormState = {
  email: '',
  phone: '',
  fullName: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
}

function validate(form: FormState): Errors {
  const errors: Errors = {}
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
    errors.email = 'Enter a valid email address'
  if (!/^[6-9]\d{9}$/.test(form.phone.trim()))
    errors.phone = 'Enter a valid 10-digit mobile number'
  if (form.fullName.trim().length < 3) errors.fullName = 'Enter your full name'
  if (form.line1.trim().length < 5) errors.line1 = 'Enter your address'
  if (form.city.trim().length < 2) errors.city = 'Enter your city'
  if (!form.state) errors.state = 'Select your state'
  if (!/^[1-9]\d{5}$/.test(form.pincode.trim()))
    errors.pincode = 'Enter a valid 6-digit PIN code'
  return errors
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.15em] font-semibold text-forest-900/60 mb-2">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="text-red-600 text-xs mt-1.5">
          {error}
        </p>
      )}
    </div>
  )
}

const inputClass = (hasError?: string) =>
  cn(
    'w-full bg-white border rounded-xl px-4 py-3.5 text-forest-900 text-sm outline-none transition-colors placeholder:text-forest-900/30',
    hasError
      ? 'border-red-400 focus:border-red-500'
      : 'border-forest-900/15 focus:border-gold-500'
  )

export default function CheckoutClient() {
  const router = useRouter()
  const items = useCart((s) => s.items)
  const clear = useCart((s) => s.clear)

  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<Errors>({})
  const [payOpen, setPayOpen] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [placing, setPlacing] = useState(false)
  const [apiError, setApiError] = useState('')
  const [pendingOrder, setPendingOrder] = useState<PendingOrder | null>(null)

  const subtotal = cartSubtotalPaise(items)
  const shipping = form.state ? shippingPaiseForState(form.state) : null
  const total = subtotal + (shipping ?? 0)

  const set = (key: keyof FormState) => (value: string) => {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    const validation = validate(form)
    setErrors(validation)
    if (Object.keys(validation).length > 0) {
      document
        .querySelector('[role="alert"]')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setApiError('')
    setPlacing(true)
    try {
      // Creates the pending order with server-computed totals.
      // The Razorpay order is created in this same call at launch.
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
          customer: {
            email: form.email.trim(),
            phone: form.phone.trim(),
            fullName: form.fullName.trim(),
          },
          address: {
            line1: form.line1.trim(),
            line2: form.line2.trim() || undefined,
            city: form.city.trim(),
            state: form.state,
            pincode: form.pincode.trim(),
          },
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setApiError(data.error ?? 'Something went wrong. Please try again.')
        return
      }
      setPendingOrder(data)
      setPayOpen(true)
    } catch {
      setApiError('Could not reach the server. Check your connection and try again.')
    } finally {
      setPlacing(false)
    }
  }

  const simulate = async (outcome: 'success' | 'failure') => {
    if (!pendingOrder) return
    setProcessing(true)
    try {
      const res = await fetch('/api/checkout/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: pendingOrder.orderId, outcome }),
      })
      const data = await res.json()
      setProcessing(false)
      setPayOpen(false)
      if (outcome === 'success' && res.ok && data.order) {
        sessionStorage.setItem('skinature-last-order', JSON.stringify(data.order))
        clear()
        router.push('/checkout/success')
      } else {
        router.push('/checkout/failure')
      }
    } catch {
      setProcessing(false)
      setPayOpen(false)
      router.push('/checkout/failure')
    }
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main
          id="main-content"
          className="pt-32 pb-24 min-h-screen bg-cream flex items-center justify-center"
        >
          <div className="text-center px-6">
            <h1 className="font-serif text-4xl text-forest-900 mb-4">
              Nothing to check out
            </h1>
            <p className="text-forest-900/55 mb-8">
              Your cart is empty. Add something nature made first.
            </p>
            <Link
              href="/shop"
              className="inline-block px-10 py-4 bg-forest-900 text-cream rounded-full text-xs uppercase tracking-[0.25em] font-medium hover:bg-forest-800 transition-colors"
            >
              Shop the Collection
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-32 md:pt-40 pb-24 min-h-screen bg-cream">
        <div className="max-w-6xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-xs text-forest-900/45 uppercase tracking-[0.15em]">
              <li>
                <Link href="/cart" className="hover:text-forest-900 transition-colors">
                  Cart
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-forest-900/75">
                Checkout
              </li>
            </ol>
          </nav>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-serif text-forest-900 mb-10"
          >
            Checkout
          </motion.h1>

          <form onSubmit={placeOrder} noValidate className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Form */}
            <div className="lg:col-span-3 space-y-10">
              {/* Contact */}
              <section aria-labelledby="contact-heading">
                <h2
                  id="contact-heading"
                  className="font-serif text-2xl text-forest-900 mb-5"
                >
                  Contact
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Email" error={errors.email}>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => set('email')(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className={inputClass(errors.email)}
                    />
                  </Field>
                  <Field label="Mobile Number" error={errors.phone}>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={form.phone}
                      onChange={(e) =>
                        set('phone')(e.target.value.replace(/\D/g, '').slice(0, 10))
                      }
                      placeholder="10-digit mobile"
                      autoComplete="tel-national"
                      className={inputClass(errors.phone)}
                    />
                  </Field>
                </div>
                <p className="text-forest-900/45 text-xs mt-3">
                  Your order confirmation and invoice will be sent to this email.
                </p>
              </section>

              {/* Shipping */}
              <section aria-labelledby="shipping-heading">
                <h2
                  id="shipping-heading"
                  className="font-serif text-2xl text-forest-900 mb-5"
                >
                  Shipping Address
                </h2>
                <div className="space-y-5">
                  <Field label="Full Name" error={errors.fullName}>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) => set('fullName')(e.target.value)}
                      placeholder="Name of the recipient"
                      autoComplete="name"
                      className={inputClass(errors.fullName)}
                    />
                  </Field>
                  <Field label="Address Line 1" error={errors.line1}>
                    <input
                      type="text"
                      value={form.line1}
                      onChange={(e) => set('line1')(e.target.value)}
                      placeholder="House number, building, street"
                      autoComplete="address-line1"
                      className={inputClass(errors.line1)}
                    />
                  </Field>
                  <Field label="Address Line 2 (optional)">
                    <input
                      type="text"
                      value={form.line2}
                      onChange={(e) => set('line2')(e.target.value)}
                      placeholder="Area, landmark"
                      autoComplete="address-line2"
                      className={inputClass()}
                    />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <Field label="City" error={errors.city}>
                      <input
                        type="text"
                        value={form.city}
                        onChange={(e) => set('city')(e.target.value)}
                        placeholder="City"
                        autoComplete="address-level2"
                        className={inputClass(errors.city)}
                      />
                    </Field>
                    <Field label="State" error={errors.state}>
                      <select
                        value={form.state}
                        onChange={(e) => set('state')(e.target.value)}
                        autoComplete="address-level1"
                        className={cn(inputClass(errors.state), 'appearance-none cursor-pointer')}
                      >
                        <option value="">Select state</option>
                        {INDIAN_STATES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="PIN Code" error={errors.pincode}>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={form.pincode}
                        onChange={(e) =>
                          set('pincode')(e.target.value.replace(/\D/g, '').slice(0, 6))
                        }
                        placeholder="6-digit PIN"
                        autoComplete="postal-code"
                        className={inputClass(errors.pincode)}
                      />
                    </Field>
                  </div>
                </div>
              </section>
            </div>

            {/* Summary */}
            <aside
              aria-label="Order summary"
              className="lg:col-span-2 lg:sticky lg:top-32 h-fit"
            >
              <div className="bg-white rounded-[1.75rem] border border-forest-900/10 p-7">
                <h2 className="font-serif text-2xl text-forest-900 mb-6">
                  Your Order
                </h2>

                <ul className="space-y-4 mb-6">
                  {items.map((item) => (
                    <li key={item.productId} className="flex items-center gap-4">
                      <span className="relative w-14 h-16 rounded-lg overflow-hidden bg-forest-50 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                        <span className="absolute top-0 right-0 bg-forest-900 text-cream text-[10px] font-bold w-5 h-5 rounded-bl-lg flex items-center justify-center tabular-nums">
                          {item.qty}
                        </span>
                      </span>
                      <span className="flex-1 text-sm text-forest-900 leading-snug">
                        {item.name}
                      </span>
                      <span className="text-sm font-medium text-forest-900 tabular-nums">
                        {formatPaise(item.unitPricePaise * item.qty)}
                      </span>
                    </li>
                  ))}
                </ul>

                <dl className="space-y-2.5 text-sm border-t border-forest-900/10 pt-5">
                  <div className="flex justify-between">
                    <dt className="text-forest-900/60">Subtotal</dt>
                    <dd className="font-medium text-forest-900 tabular-nums">
                      {formatPaise(subtotal)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-forest-900/60">Shipping</dt>
                    <dd className="font-medium text-forest-900 tabular-nums">
                      {shipping === null ? (
                        <span className="text-forest-900/45 font-normal">
                          Select state
                        </span>
                      ) : (
                        formatPaise(shipping)
                      )}
                    </dd>
                  </div>
                </dl>

                <div className="border-t border-forest-900/10 mt-5 pt-5 flex justify-between items-baseline mb-6">
                  <span className="text-forest-900 font-semibold">Total</span>
                  <span className="font-serif text-3xl text-forest-900">
                    {formatPaise(total)}
                  </span>
                </div>

                {apiError && (
                  <p
                    role="alert"
                    className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4"
                  >
                    {apiError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={placing}
                  className="w-full px-8 py-4 bg-forest-900 text-cream rounded-full text-xs uppercase tracking-[0.25em] font-medium hover:bg-forest-800 hover:shadow-[inset_0_0_0_1px_rgba(197,160,89,0.55),0_8px_30px_rgba(26,60,52,0.25)] transition-all duration-400 flex items-center justify-center gap-2.5 disabled:opacity-60"
                >
                  {placing ? (
                    <>
                      <span
                        className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin"
                        aria-hidden="true"
                      />
                      Preparing Order...
                    </>
                  ) : (
                    <>
                      <Lock size={14} strokeWidth={2} aria-hidden="true" />
                      Pay {formatPaise(total)}
                    </>
                  )}
                </button>

                <p className="flex items-center justify-center gap-2 text-forest-900/45 text-xs mt-4">
                  <ShieldCheck size={14} aria-hidden="true" />
                  Secure prepaid payment via UPI, cards, netbanking
                </p>
              </div>
            </aside>
          </form>
        </div>
      </main>

      {/* Mock payment sheet */}
      <AnimatePresence>
        {payOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[130] bg-forest-950/50 backdrop-blur-[2px]"
              onClick={() => !processing && setPayOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Payment"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="fixed z-[140] inset-x-4 bottom-4 sm:inset-x-auto sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[420px] bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="bg-forest-900 text-cream px-6 py-5 flex items-center justify-between">
                <div>
                  <p className="font-semibold">Skinature</p>
                  <p className="text-cream/60 text-xs mt-0.5">
                    Test Mode · Razorpay goes live at launch
                  </p>
                </div>
                {!processing && (
                  <button
                    onClick={() => setPayOpen(false)}
                    aria-label="Close payment"
                    className="text-cream/70 hover:text-cream p-1"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              <div className="p-6">
                <div className="text-center mb-6">
                  <p className="text-forest-900/50 text-xs uppercase tracking-[0.2em] mb-1">
                    Amount Payable
                  </p>
                  <p className="font-serif text-4xl text-forest-900">
                    {formatPaise(pendingOrder?.totalPaise ?? total)}
                  </p>
                  {pendingOrder && (
                    <p className="text-forest-900/40 text-xs mt-1.5">
                      Order {pendingOrder.orderNo}
                    </p>
                  )}
                </div>

                {processing ? (
                  <div className="py-8 text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-10 h-10 border-2 border-forest-900/15 border-t-forest-900 rounded-full mx-auto mb-4"
                      aria-hidden="true"
                    />
                    <p className="text-forest-900/60 text-sm" role="status">
                      Processing payment...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={() => simulate('success')}
                      className="w-full flex items-center justify-center gap-2.5 px-6 py-4 bg-forest-900 text-cream rounded-2xl text-sm font-medium hover:bg-forest-800 transition-colors"
                    >
                      <CheckCircle2 size={17} aria-hidden="true" />
                      Simulate Successful Payment
                    </button>
                    <button
                      onClick={() => simulate('failure')}
                      className="w-full flex items-center justify-center gap-2.5 px-6 py-4 border border-forest-900/15 text-forest-900/70 rounded-2xl text-sm font-medium hover:border-red-300 hover:text-red-600 transition-colors"
                    >
                      <XCircle size={17} aria-hidden="true" />
                      Simulate Failed Payment
                    </button>
                    <p className="text-forest-900/40 text-[0.7rem] text-center leading-relaxed pt-1">
                      This is a demonstration payment sheet. At launch this step opens
                      the real Razorpay checkout with UPI, cards, and netbanking.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </>
  )
}
