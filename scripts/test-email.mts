/**
 * Verifies the Gmail SMTP setup end to end.
 *
 *   npx tsx scripts/test-email.mts <recipient@example.com>
 *
 * 1. checks GMAIL_USER / GMAIL_APP_PASSWORD are set
 * 2. verifies the SMTP credentials (catches a wrong/expired App Password early)
 * 3. renders a REAL PDF invoice from a sample order
 * 4. sends the customer confirmation (with the PDF attached) + the admin notification
 *
 * Run this before launch and confirm the mail actually lands in the inbox.
 */
import { config } from 'dotenv'
import type { Order, StoreSettings } from '../src/lib/domain'

// .env.local must be loaded BEFORE the mail module is evaluated: send.ts reads
// process.env at module scope, and static `import` is hoisted above this call —
// so the mail/pdf modules are pulled in dynamically further down instead.
config({ path: '.env.local' })

const to = process.argv[2]
if (!to) {
  console.error('Usage: npx tsx scripts/test-email.mts <recipient@example.com>')
  process.exit(1)
}

const settings: StoreSettings = {
  shippingTelanganaPaise: 6000,
  shippingRestPaise: 10000,
  businessName: 'Nurtured by Nature Products',
  businessAddress:
    'Plot No. 509-J-III, Road No. 86, Near Lotus Pond, Jubilee Hills, Hyderabad - 500096, Telangana, India',
  gstin: '36AAZFN8373Q1ZU',
  notifyEmail: to,
}

const order: Order = {
  id: 'test-order',
  orderNo: 'SKN-TEST',
  createdAt: new Date().toISOString(),
  customer: { name: 'Test Customer', email: to, phone: '9999999999' },
  address: {
    line1: 'Plot 1, Test Street',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500096',
  },
  items: [
    { productId: null, name: 'Root Revival Hair Oil', qty: 1, unitPricePaise: 59900, lineTotalPaise: 59900 },
    { productId: null, name: 'Brightening & Cleansing Mask', qty: 1, unitPricePaise: 49900, lineTotalPaise: 49900 },
  ],
  subtotalPaise: 109800,
  shippingPaise: 6000,
  totalPaise: 115800,
  status: 'paid',
  paymentId: 'pay_test',
  invoiceNo: 'INV-2026-TEST',
}

async function main() {
  const { emailEnabled, verifyEmailConnection, sendOrderEmails } = await import('../src/lib/email/send')
  const { renderInvoiceBuffer } = await import('../src/lib/pdf/render')

  console.log('1) configured   :', emailEnabled() ? 'yes' : 'NO — set GMAIL_USER + GMAIL_APP_PASSWORD in .env.local')
  if (!emailEnabled()) process.exit(1)
  console.log('   sending as   :', process.env.EMAIL_FROM || process.env.GMAIL_USER)

  const check = await verifyEmailConnection()
  console.log('2) SMTP auth    :', check.ok ? 'OK' : `FAILED — ${check.error}`)
  if (!check.ok) process.exit(1)

  const pdf = await renderInvoiceBuffer(order, settings)
  console.log('3) PDF invoice  :', `${pdf.length} bytes`)

  const res = await sendOrderEmails(order, settings, pdf)
  console.log('4) send         :', res.skipped ? 'SKIPPED' : `sent to ${to} (+ admin copy)`)
  console.log('\nCheck the inbox — customer confirmation with PDF, and the admin notification.')
}

main().catch((err) => {
  console.error('FAILED:', err)
  process.exit(1)
})
