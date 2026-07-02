import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let serviceClient: SupabaseClient | undefined

/**
 * Server-only Supabase client using the service-role key (bypasses RLS).
 * NEVER import this from client components. Storefront queries must still
 * filter explicitly (is_active, status = 'approved') to mirror public rules.
 */
export function getSupabaseService(): SupabaseClient {
  if (!serviceClient) {
    serviceClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    )
  }
  return serviceClient
}
