'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, KeyRound } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getSupabaseBrowser } from '@/lib/supabase/client'

// Demo admin (a real Supabase Auth user). Rotate/remove at launch,
// see docs/DECISIONS.md §11 Pre-Launch Checklist.
const DEMO_ADMIN_EMAIL = 'admin@skinature.org'
const DEMO_ADMIN_PASSWORD = 'skinature@2026'

export default function LoginClient() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setChecking(true)
    const { error: authError } = await getSupabaseBrowser().auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    setChecking(false)
    if (authError) {
      setError('Incorrect email or password. Try the demo credentials below.')
    } else {
      router.replace('/admin')
    }
  }

  const fillDemo = () => {
    setEmail(DEMO_ADMIN_EMAIL)
    setPassword(DEMO_ADMIN_PASSWORD)
    setError('')
  }

  const inputClass = cn(
    'w-full bg-white border border-forest-900/15 rounded-xl px-4 py-3.5 text-sm text-forest-900 outline-none transition-colors focus:border-gold-500 placeholder:text-forest-900/30'
  )

  return (
    <main className="min-h-screen bg-forest-950 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient brand glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 0%, rgba(197,160,89,0.08) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative"
      >
        <div className="text-center mb-8">
          <Image
            src="/logo-nobg.webp"
            alt="Skinature"
            width={170}
            height={56}
            className="h-auto brightness-0 invert opacity-95 mx-auto mb-3"
            priority
          />
          <p className="text-cream/45 text-[0.65rem] uppercase tracking-[0.35em]">
            Admin Panel
          </p>
        </div>

        <div className="bg-cream rounded-3xl p-7 md:p-9 shadow-2xl">
          <h1 className="font-serif text-3xl text-forest-900 mb-1.5">Welcome back</h1>
          <p className="text-forest-900/55 text-sm mb-7">
            Sign in to manage products, orders, and content.
          </p>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs uppercase tracking-[0.15em] font-semibold text-forest-900/60 mb-2"
              >
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@skinature.org"
                autoComplete="username"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs uppercase tracking-[0.15em] font-semibold text-forest-900/60 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  autoComplete="current-password"
                  required
                  className={cn(inputClass, 'pr-12')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-forest-900/40 hover:text-forest-900 transition-colors"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={checking}
              className="w-full flex items-center justify-center gap-2.5 px-8 py-4 bg-forest-900 text-cream rounded-full text-xs uppercase tracking-[0.25em] font-medium hover:bg-forest-800 transition-colors disabled:opacity-60"
            >
              {checking ? (
                <>
                  <span
                    className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin"
                    aria-hidden="true"
                  />
                  Signing In...
                </>
              ) : (
                <>
                  <Lock size={14} aria-hidden="true" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Demo access */}
          <div className="mt-7 pt-6 border-t border-forest-900/10">
            <button
              onClick={fillDemo}
              className="w-full flex items-center justify-center gap-2.5 px-6 py-3 border border-gold-500/50 text-gold-600 rounded-full text-xs uppercase tracking-[0.2em] font-semibold hover:bg-gold-100/40 transition-colors"
            >
              <KeyRound size={14} aria-hidden="true" />
              Use Demo Credentials
            </button>
            <p className="text-forest-900/40 text-xs text-center mt-3 leading-relaxed">
              Authenticated by Supabase. Demo credentials are rotated out at launch.
            </p>
          </div>
        </div>

        <p className="text-center mt-6">
          <Link
            href="/"
            className="text-cream/50 hover:text-cream text-xs uppercase tracking-[0.2em] transition-colors"
          >
            ← Back to Store
          </Link>
        </p>
      </motion.div>
    </main>
  )
}
