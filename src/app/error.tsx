'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Surface for debugging; replace with real error reporting at launch.
    console.error(error)
  }, [error])

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="font-cursive text-6xl text-gold-600/70 mb-4" aria-hidden="true">
          oops
        </p>
        <h1 className="font-serif text-4xl text-forest-900 mb-4">
          Something went wrong
        </h1>
        <p className="text-forest-900/60 leading-relaxed mb-10">
          An unexpected error occurred. It is not you, it is us. Please try again,
          and if it keeps happening, reach out to us.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-9 py-4 bg-forest-900 text-cream rounded-full text-xs uppercase tracking-[0.25em] font-medium hover:bg-forest-800 transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-9 py-4 border border-forest-900 text-forest-900 rounded-full text-xs uppercase tracking-[0.25em] font-medium hover:bg-forest-50 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
