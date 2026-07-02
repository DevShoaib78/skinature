'use client'

import { cn } from '@/lib/utils'
import type { OrderStatus } from '@/lib/domain'

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="font-serif text-3xl md:text-4xl text-forest-900">{title}</h1>
        {description && (
          <p className="text-forest-900/55 text-sm mt-1.5">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3 flex-wrap">{actions}</div>}
    </div>
  )
}

export function Card({
  title,
  children,
  className,
  actions,
}: {
  title?: string
  children: React.ReactNode
  className?: string
  actions?: React.ReactNode
}) {
  return (
    <section className={cn('bg-white rounded-2xl border border-forest-900/10 p-5 md:p-6', className)}>
      {(title || actions) && (
        <div className="flex items-center justify-between gap-4 mb-5">
          {title && (
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-forest-900/70">
              {title}
            </h2>
          )}
          {actions}
        </div>
      )}
      {children}
    </section>
  )
}

/**
 * Status palette: reserved status colors with a text label always present
 * (never color alone). Not reused for chart series.
 */
const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  pending: 'bg-amber-50 text-amber-800 border-amber-200',
  paid: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  shipped: 'bg-sky-50 text-sky-800 border-sky-200',
  delivered: 'bg-forest-50 text-forest-800 border-forest-100',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full border text-[0.68rem] font-semibold uppercase tracking-[0.08em]',
        ORDER_STATUS_STYLES[status]
      )}
    >
      {status}
    </span>
  )
}

export function AdminButton({
  children,
  variant = 'primary',
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'outline' | 'danger'
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-[0.1em] transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        variant === 'primary' && 'bg-forest-900 text-cream hover:bg-forest-800',
        variant === 'outline' &&
          'border border-forest-900/20 text-forest-900 hover:border-forest-900 bg-white',
        variant === 'danger' && 'bg-red-600 text-white hover:bg-red-700',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export const adminInputClass =
  'w-full bg-white border border-forest-900/15 rounded-xl px-3.5 py-2.5 text-sm text-forest-900 outline-none transition-colors focus:border-gold-500 placeholder:text-forest-900/30'

export function AdminField({
  label,
  children,
  hint,
}: {
  label: string
  children: React.ReactNode
  hint?: string
}) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-[0.12em] font-semibold text-forest-900/55 mb-1.5">
        {label}
      </span>
      {children}
      {hint && <span className="block text-forest-900/40 text-xs mt-1">{hint}</span>}
    </label>
  )
}
