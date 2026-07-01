'use client'

import { useMemo, useState } from 'react'
import { Star, Check, EyeOff, BadgeCheck, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAdmin } from '@/store/admin'
import { allReviews, type ReviewStatus } from '@/lib/mock/reviews'
import { getProductById } from '@/lib/data'
import { formatDate } from '@/lib/format'
import { PageHeader, Card, AdminButton } from '@/components/admin/ui'

const TABS: { key: ReviewStatus; label: string }[] = [
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'hidden', label: 'Hidden' },
]

export default function ReviewsClient() {
  const reviewStatus = useAdmin((s) => s.reviewStatus)
  const setReviewStatus = useAdmin((s) => s.setReviewStatus)
  const [tab, setTab] = useState<ReviewStatus>('pending')
  const [inviteSent, setInviteSent] = useState(false)

  const reviews = useMemo(
    () =>
      allReviews.map((r) => ({
        ...r,
        status: reviewStatus[r.id] ?? r.status,
      })),
    [reviewStatus]
  )

  const counts = useMemo(() => {
    const c: Record<ReviewStatus, number> = { pending: 0, approved: 0, hidden: 0 }
    for (const r of reviews) c[r.status] += 1
    return c
  }, [reviews])

  const visible = reviews
    .filter((r) => r.status === tab)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))

  return (
    <>
      <PageHeader
        title="Reviews"
        description="Verified-buyer reviews. Approve to publish on the product page."
        actions={
          <AdminButton
            variant="outline"
            onClick={() => {
              setInviteSent(true)
              setTimeout(() => setInviteSent(false), 2500)
            }}
          >
            <Send size={14} aria-hidden="true" />
            {inviteSent ? 'Review links queued ✓' : 'Send review links'}
          </AdminButton>
        }
      />

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            aria-pressed={tab === t.key}
            className={cn(
              'px-4 py-2 rounded-full border text-xs font-semibold uppercase tracking-[0.08em] transition-colors',
              tab === t.key
                ? 'bg-forest-900 text-cream border-forest-900'
                : 'bg-white text-forest-900/60 border-forest-900/15 hover:border-forest-900/50'
            )}
          >
            {t.label} ({counts[t.key]})
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <Card>
          <p className="text-forest-900/50 text-sm py-8 text-center">
            {tab === 'pending'
              ? 'No reviews waiting for moderation. All caught up.'
              : `No ${tab} reviews.`}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {visible.map((review) => {
            const product = getProductById(review.productId)
            return (
              <Card key={review.id}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="text-forest-900 font-semibold text-sm flex items-center gap-2">
                      {review.author}
                      {review.verified && (
                        <span className="inline-flex items-center gap-1 text-forest-700 text-[0.62rem] uppercase tracking-[0.08em] font-semibold">
                          <BadgeCheck size={12} aria-hidden="true" />
                          Verified
                        </span>
                      )}
                    </p>
                    <p className="text-forest-900/45 text-xs mt-0.5">
                      {product?.name ?? 'Unknown product'} · {formatDate(review.createdAt)}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-gold-500 flex-shrink-0">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        size={13}
                        fill={i < review.rating ? 'currentColor' : 'none'}
                        strokeWidth={1.5}
                        className={i < review.rating ? '' : 'text-gold-500/40'}
                        aria-hidden="true"
                      />
                    ))}
                  </span>
                </div>

                <p className="text-forest-900/75 text-sm leading-relaxed mb-5">
                  {review.body}
                </p>

                <div className="flex gap-2.5">
                  {review.status !== 'approved' && (
                    <AdminButton onClick={() => setReviewStatus(review.id, 'approved')}>
                      <Check size={14} aria-hidden="true" />
                      Approve
                    </AdminButton>
                  )}
                  {review.status !== 'hidden' && (
                    <AdminButton
                      variant="outline"
                      onClick={() => setReviewStatus(review.id, 'hidden')}
                    >
                      <EyeOff size={14} aria-hidden="true" />
                      Hide
                    </AdminButton>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <p className="text-forest-900/40 text-xs mt-6 leading-relaxed max-w-2xl">
        At launch, review links go out automatically 21 days after each order, and the
        &ldquo;Send review links&rdquo; action emails a magic link per purchased product.
        Approved reviews appear on the product page immediately.
      </p>
    </>
  )
}
