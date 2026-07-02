'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import type { Session } from '@supabase/supabase-js'
import {
  LayoutDashboard,
  Package,
  Boxes,
  Users,
  Star,
  BarChart3,
  Settings,
  ShoppingCart,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getSupabaseBrowser } from '@/lib/supabase/client'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/inventory', label: 'Inventory', icon: Boxes },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <nav aria-label="Admin navigation" className="flex-1 px-3 space-y-1">
      {NAV.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors',
              active
                ? 'bg-white/10 text-cream font-medium'
                : 'text-cream/60 hover:text-cream hover:bg-white/5'
            )}
          >
            <Icon size={17} strokeWidth={1.75} aria-hidden="true" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

function SidebarFooter({ email }: { email: string | null }) {
  const router = useRouter()
  return (
    <div className="px-3 pb-5 space-y-1 border-t border-white/10 pt-4">
      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-cream/60 hover:text-cream hover:bg-white/5 transition-colors"
      >
        <ExternalLink size={17} strokeWidth={1.75} aria-hidden="true" />
        View Store
      </Link>
      <button
        onClick={async () => {
          await getSupabaseBrowser().auth.signOut()
          router.replace('/admin/login')
        }}
        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-cream/60 hover:text-red-300 hover:bg-white/5 transition-colors"
      >
        <LogOut size={17} strokeWidth={1.75} aria-hidden="true" />
        Sign Out
      </button>
      {email && <p className="px-4 pt-2 text-cream/35 text-xs truncate">{email}</p>}
    </div>
  )
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  // undefined = still resolving, null = signed out
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [mobileNav, setMobileNav] = useState(false)

  const isLogin = pathname === '/admin/login'

  useEffect(() => {
    const supabase = getSupabaseBrowser()
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  // Route guarding
  useEffect(() => {
    if (session === undefined) return
    if (!session && !isLogin) router.replace('/admin/login')
    if (session && isLogin) router.replace('/admin')
  }, [session, isLogin, router])

  // Close the mobile drawer when the route changes (adjust-state-during-render pattern).
  const [prevPath, setPrevPath] = useState(pathname)
  if (prevPath !== pathname) {
    setPrevPath(pathname)
    if (mobileNav) setMobileNav(false)
  }

  if (isLogin) return <>{children}</>

  if (!session) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div
          className="w-9 h-9 border-2 border-forest-900/15 border-t-forest-900 rounded-full animate-spin"
          role="status"
          aria-label="Loading admin"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-beige/40">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-60 bg-forest-950 z-40 print:hidden">
        <div className="px-6 py-6">
          <Image
            src="/logo-nobg.webp"
            alt="Skinature"
            width={130}
            height={42}
            className="h-auto brightness-0 invert opacity-90"
          />
          <p className="text-cream/40 text-[0.6rem] uppercase tracking-[0.3em] mt-2">
            Admin Panel
          </p>
        </div>
        <NavLinks />
        <SidebarFooter email={session.user.email ?? null} />
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden print:hidden sticky top-0 z-40 bg-forest-950 text-cream px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setMobileNav(true)}
          aria-label="Open admin menu"
          className="p-2 -ml-2"
        >
          <Menu size={22} strokeWidth={1.75} />
        </button>
        <Image
          src="/logo-nobg.webp"
          alt="Skinature Admin"
          width={110}
          height={36}
          className="h-8 w-auto brightness-0 invert opacity-90"
        />
        <span className="w-8" aria-hidden="true" />
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileNav && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileNav(false)}
              className="lg:hidden fixed inset-0 z-[90] bg-forest-950/50"
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
              className="lg:hidden fixed inset-y-0 left-0 w-72 bg-forest-950 z-[100] flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-label="Admin menu"
            >
              <div className="px-6 py-5 flex items-center justify-between">
                <Image
                  src="/logo-nobg.webp"
                  alt="Skinature"
                  width={110}
                  height={36}
                  className="h-8 w-auto brightness-0 invert opacity-90"
                />
                <button
                  onClick={() => setMobileNav(false)}
                  aria-label="Close admin menu"
                  className="text-cream/70 hover:text-cream p-2 -mr-2"
                >
                  <X size={22} />
                </button>
              </div>
              <NavLinks onNavigate={() => setMobileNav(false)} />
              <SidebarFooter email={session.user.email ?? null} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="lg:pl-60 print:pl-0">
        <main className="px-4 sm:px-6 lg:px-10 py-6 lg:py-10 max-w-[1400px] print:p-0 print:max-w-none">
          {children}
        </main>
      </div>
    </div>
  )
}
