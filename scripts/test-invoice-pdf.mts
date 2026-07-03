import { writeFileSync } from 'node:fs'
import { renderInvoiceBuffer } from '../src/lib/pdf/render'
import type { Order, StoreSettings } from '../src/lib/domain'

const order: Order = {
  id: 'test-id',
  orderNo: 'SKN-1101',
  createdAt: '2026-06-20T10:30:00+05:30',
  customer: { name: 'Ayesha Tabassum', email: 'ayesha.tabassum@gmail.com', phone: '9848012345' },
  address: {
    line1: 'Flat 302, Sri Sai Residency',
    line2: 'Banjara Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500034',
  },
  items: [
    { productId: '1', name: 'Root Revival Hair Oil', qty: 2, unitPricePaise: 55000, lineTotalPaise: 110000 },
    { productId: '2', name: 'Brightening & Cleansing Mask', qty: 1, unitPricePaise: 49900, lineTotalPaise: 49900 },
  ],
  subtotalPaise: 159900,
  shippingPaise: 6000,
  totalPaise: 165900,
  status: 'paid',
  paymentId: 'pay_mock_1101x4832',
  invoiceNo: 'INV-2026-1101',
}

const settings: StoreSettings = {
  shippingTelanganaPaise: 6000,
  shippingRestPaise: 10000,
  businessName: 'Nurtured by Nature Products',
  businessAddress:
    'Plot No. 509-J-III, Road No. 86, Near Lotus Pond, Jubilee Hills, Hyderabad - 500096, Telangana, India',
  gstin: '36AAZFN8373Q1ZU',
  notifyEmail: 'admin@skinature.org',
}

const buf = await renderInvoiceBuffer(order, settings)
const out = process.argv[2] ?? 'invoice-test.pdf'
writeFileSync(out, buf)
const header = buf.subarray(0, 5).toString('latin1')
console.log('bytes:', buf.length, '| header:', JSON.stringify(header), '| valid PDF:', header === '%PDF-')
console.log('written to:', out)
