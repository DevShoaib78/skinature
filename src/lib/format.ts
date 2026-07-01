/** Format integer paise as Indian rupees: 49900 → "₹499", 110050 → "₹1,100.50" */
export function formatPaise(paise: number): string {
  const rupees = paise / 100
  const hasDecimals = paise % 100 !== 0
  return `₹${rupees.toLocaleString('en-IN', {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0,
  })}`
}

/** "12 Jun 2026" style date for order lists and reviews. */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
