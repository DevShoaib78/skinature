'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Star, CheckCircle2, BadgeCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ReviewFormClient({
  token,
  productName,
  productImage,
}: {
  token: string
  productName: string
  productImage: string
}) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [author, setAuthor] = useState('')
  const [body, setBody] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) return setError('Please tap the stars to rate the product.')
    if (author.trim().length < 2) return setError('Please tell us your name.')
    if (body.trim().length < 10)
      return setError('Tell us a little more about your experience (a sentence or two).')

    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, rating, author: author.trim(), body: body.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Could not submit review. Try again.')
        return
      }
      setDone(true)
    } catch {
      setError('Could not reach the server. Check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <CheckCircle2
          size={56}
          strokeWidth={1.25}
          className="text-forest-700 mx-auto mb-6"
          aria-hidden="true"
        />
        <h1 className="font-serif text-4xl text-forest-900 mb-4">Thank you!</h1>
        <p className="text-forest-900/60 leading-relaxed mb-10 max-w-sm mx-auto">
          Your review of {productName} has been received. It will appear on the
          product page once our team publishes it.
        </p>
        <Link
          href="/shop"
          className="inline-block px-9 py-4 bg-forest-900 text-cream rounded-full text-xs uppercase tracking-[0.25em] font-medium hover:bg-forest-800 transition-colors"
        >
          Continue Shopping
        </Link>
      </motion.div>
    )
  }

  const activeRating = hoverRating || rating

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <header className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 text-forest-700 text-[0.65rem] uppercase tracking-[0.15em] font-semibold mb-4">
          <BadgeCheck size={14} aria-hidden="true" />
          Verified Purchase
        </span>
        <h1 className="font-serif text-4xl text-forest-900 mb-2">How was it?</h1>
        <p className="text-forest-900/55">
          Your honest words help others find their ritual.
        </p>
      </header>

      {/* Product */}
      <div className="flex items-center gap-4 bg-white rounded-2xl border border-forest-900/10 p-4 mb-7">
        <span className="relative w-16 h-20 rounded-xl overflow-hidden bg-forest-50 flex-shrink-0">
          {productImage && (
            <Image src={productImage} alt={productName} fill className="object-cover" sizes="64px" />
          )}
        </span>
        <p className="font-serif text-xl text-forest-900">{productName}</p>
      </div>

      <form onSubmit={submit} className="space-y-6">
        {/* Stars */}
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.15em] font-semibold text-forest-900/60 mb-3">
            Your Rating
          </p>
          <div
            className="inline-flex gap-2"
            role="radiogroup"
            aria-label="Rating out of 5 stars"
            onMouseLeave={() => setHoverRating(0)}
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={rating === value}
                aria-label={`${value} star${value > 1 ? 's' : ''}`}
                onClick={() => setRating(value)}
                onMouseEnter={() => setHoverRating(value)}
                className="p-1.5 transition-transform hover:scale-110"
              >
                <Star
                  size={32}
                  strokeWidth={1.25}
                  className={cn(
                    'transition-colors',
                    value <= activeRating ? 'text-gold-500' : 'text-forest-900/20'
                  )}
                  fill={value <= activeRating ? 'currentColor' : 'none'}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="review-author"
            className="block text-xs uppercase tracking-[0.15em] font-semibold text-forest-900/60 mb-2"
          >
            Your Name
          </label>
          <input
            id="review-author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="How should we credit you?"
            className="w-full bg-white border border-forest-900/15 rounded-xl px-4 py-3.5 text-forest-900 text-sm outline-none transition-colors focus:border-gold-500 placeholder:text-forest-900/30"
          />
        </div>

        <div>
          <label
            htmlFor="review-body"
            className="block text-xs uppercase tracking-[0.15em] font-semibold text-forest-900/60 mb-2"
          >
            Your Review
          </label>
          <textarea
            id="review-body"
            rows={5}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What changed for your skin or hair? How long did you use it?"
            className="w-full bg-white border border-forest-900/15 rounded-xl px-4 py-3.5 text-forest-900 text-sm outline-none transition-colors focus:border-gold-500 placeholder:text-forest-900/30 resize-y min-h-[120px]"
          />
        </div>

        {error && (
          <p role="alert" className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full px-8 py-4 bg-forest-900 text-cream rounded-full text-xs uppercase tracking-[0.25em] font-medium hover:bg-forest-800 transition-colors disabled:opacity-60"
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </motion.div>
  )
}
