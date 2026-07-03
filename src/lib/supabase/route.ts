import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { getSupabaseService } from '@/lib/supabase/server'

/**
 * Reads the current admin's session from cookies (set by the browser client)
 * and confirms they are a registered admin. Returns the admin's user id, or
 * null if the caller is not an authenticated admin.
 */
export async function requireAdmin(): Promise<string | null> {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {
          // Read-only in route handlers; nothing to persist.
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  // Verify admin membership with the service client (RLS-independent, authoritative).
  const { data, error } = await getSupabaseService()
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()
  if (error || !data) return null
  return user.id
}
