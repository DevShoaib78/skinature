'use client'

import { useEffect } from 'react'
import { useCart } from '@/store/cart'

/**
 * Rehydrates the persisted cart after mount. Keeping hydration out of the
 * initial render means server HTML and first client render always match.
 */
export default function CartHydration() {
  useEffect(() => {
    useCart.persist.rehydrate()
  }, [])
  return null
}
