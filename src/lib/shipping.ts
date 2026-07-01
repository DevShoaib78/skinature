/**
 * Shipping is charged once per order (single package), by delivery state:
 * ₹60 within Telangana, ₹100 for the rest of India. Locked in docs/DECISIONS.md §6.
 * Kept as config so the admin settings screen (and later the DB) can change it.
 */

export const SHIPPING_TELANGANA_PAISE = 6000
export const SHIPPING_REST_OF_INDIA_PAISE = 10000

export function shippingPaiseForState(state: string): number {
  return state.trim().toLowerCase() === 'telangana'
    ? SHIPPING_TELANGANA_PAISE
    : SHIPPING_REST_OF_INDIA_PAISE
}

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
] as const

export type IndianState = (typeof INDIAN_STATES)[number]
