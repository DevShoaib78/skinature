'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Instagram, MapPin, CheckCircle2 } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { cn } from '@/lib/utils'
import { INSTAGRAM_URL } from '@/lib/data'

// TODO(launch): confirm the official support email with the founders.
const SUPPORT_EMAIL = 'care@skinature.org'

const CHANNELS = [
  {
    icon: Mail,
    title: 'Email',
    desc: 'For orders, invoices, and anything detailed',
    value: SUPPORT_EMAIL,
    href: `mailto:${SUPPORT_EMAIL}`,
  },
  {
    icon: Instagram,
    title: 'Instagram',
    desc: 'Fastest replies, usually same day',
    value: '@official.skinature',
    href: INSTAGRAM_URL,
  },
  {
    icon: MapPin,
    title: 'Home Base',
    desc: 'Handcrafted with love in',
    value: 'Hyderabad, Telangana, India',
    href: null,
  },
]

interface FormState {
  name: string
  email: string
  message: string
}

export default function ContactClient() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [sent, setSent] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Partial<FormState> = {}
    if (form.name.trim().length < 2) errs.name = 'Please tell us your name'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      errs.email = 'Enter a valid email address'
    if (form.message.trim().length < 10)
      errs.message = 'Tell us a little more (at least 10 characters)'
    setErrors(errs)
    if (Object.keys(errs).length === 0) {
      setSent(true)
    }
  }

  const fieldClass = (hasError?: string) =>
    cn(
      'w-full bg-white border rounded-xl px-4 py-3.5 text-forest-900 text-sm outline-none transition-colors placeholder:text-forest-900/30',
      hasError
        ? 'border-red-400 focus:border-red-500'
        : 'border-forest-900/15 focus:border-gold-500'
    )

  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-32 md:pt-40 pb-24 min-h-screen bg-cream">
        <div className="max-w-5xl mx-auto px-6">
          <motion.header
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 md:mb-16 text-center"
          >
            <span className="text-gold-600 uppercase tracking-[0.25em] text-xs font-bold mb-4 block">
              Contact
            </span>
            <h1 className="font-serif text-4xl md:text-5xl text-forest-900 mb-4">
              We Would Love to Hear From You
            </h1>
            <p className="text-forest-900/60 leading-relaxed max-w-xl mx-auto">
              Questions about an order, a product, or your skin story? Our small team
              replies personally, usually within a day.
            </p>
          </motion.header>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Channels */}
            <div className="lg:col-span-2 space-y-4">
              {CHANNELS.map(({ icon: Icon, title, desc, value, href }) => {
                const content = (
                  <>
                    <Icon
                      size={22}
                      strokeWidth={1.5}
                      className="text-gold-600 mb-4"
                      aria-hidden="true"
                    />
                    <p className="font-serif text-xl text-forest-900 mb-1">{title}</p>
                    <p className="text-forest-900/50 text-xs mb-2">{desc}</p>
                    <p className="text-forest-900 text-sm font-medium">{value}</p>
                  </>
                )
                return href ? (
                  <a
                    key={title}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="block bg-white rounded-2xl border border-forest-900/10 p-6 hover:border-gold-500/40 hover:-translate-y-0.5 hover:shadow-[0_20px_45px_-25px_rgba(26,60,52,0.3)] transition-all duration-400"
                  >
                    {content}
                  </a>
                ) : (
                  <div
                    key={title}
                    className="bg-white rounded-2xl border border-forest-900/10 p-6"
                  >
                    {content}
                  </div>
                )
              })}
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-[1.75rem] border border-forest-900/10 p-7 md:p-9">
                {sent ? (
                  <div className="text-center py-10">
                    <CheckCircle2
                      size={48}
                      strokeWidth={1.25}
                      className="text-forest-700 mx-auto mb-5"
                      aria-hidden="true"
                    />
                    <p className="font-serif text-3xl text-forest-900 mb-3">
                      Message received
                    </p>
                    <p className="text-forest-900/55 leading-relaxed max-w-sm mx-auto">
                      Thank you, {form.name.split(' ')[0]}. We will get back to you at{' '}
                      <span className="text-forest-900 font-medium">{form.email}</span>{' '}
                      soon.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={submit} noValidate className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="block text-xs uppercase tracking-[0.15em] font-semibold text-forest-900/60 mb-2"
                        >
                          Name
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                          placeholder="Your name"
                          autoComplete="name"
                          className={fieldClass(errors.name)}
                        />
                        {errors.name && (
                          <p role="alert" className="text-red-600 text-xs mt-1.5">
                            {errors.name}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="contact-email"
                          className="block text-xs uppercase tracking-[0.15em] font-semibold text-forest-900/60 mb-2"
                        >
                          Email
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                          placeholder="you@example.com"
                          autoComplete="email"
                          className={fieldClass(errors.email)}
                        />
                        {errors.email && (
                          <p role="alert" className="text-red-600 text-xs mt-1.5">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-message"
                        className="block text-xs uppercase tracking-[0.15em] font-semibold text-forest-900/60 mb-2"
                      >
                        Message
                      </label>
                      <textarea
                        id="contact-message"
                        rows={6}
                        value={form.message}
                        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                        placeholder="Tell us how we can help..."
                        className={cn(fieldClass(errors.message), 'resize-y min-h-[130px]')}
                      />
                      {errors.message && (
                        <p role="alert" className="text-red-600 text-xs mt-1.5">
                          {errors.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full sm:w-auto px-10 py-4 bg-forest-900 text-cream rounded-full text-xs uppercase tracking-[0.25em] font-medium hover:bg-forest-800 hover:shadow-[inset_0_0_0_1px_rgba(197,160,89,0.55),0_8px_30px_rgba(26,60,52,0.25)] transition-all duration-400"
                    >
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
