'use client'

import { useCallback, useEffect, useState } from 'react'

/**
 * Minimal fetch-on-mount hook with manual reload, for admin data.
 * `fn` must be referentially stable (a module function or useCallback),
 * otherwise every render refetches.
 */
export function useAsync<T>(fn: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let active = true
    fn()
      .then((result) => {
        if (active) setData(result)
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : 'Something went wrong')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [fn, tick])

  const reload = useCallback(() => {
    setLoading(true)
    setError('')
    setTick((t) => t + 1)
  }, [])

  return { data, error, loading, reload, setData }
}

export function AdminLoading() {
  return (
    <div className="py-24 flex justify-center" role="status" aria-label="Loading">
      <span className="w-9 h-9 border-2 border-forest-900/15 border-t-forest-900 rounded-full animate-spin" />
    </div>
  )
}

export function AdminError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="py-16 text-center">
      <p className="text-forest-900 font-serif text-2xl mb-2">Could not load data</p>
      <p className="text-forest-900/55 text-sm mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2.5 bg-forest-900 text-cream rounded-xl text-xs font-semibold uppercase tracking-[0.1em] hover:bg-forest-800 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  )
}
