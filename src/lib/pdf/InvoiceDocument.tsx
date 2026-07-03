/* eslint-disable jsx-a11y/alt-text -- <Image> here is a react-pdf PDF primitive, not an HTML img; it has no alt prop. */
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from '@react-pdf/renderer'
import type { Order, StoreSettings } from '@/lib/domain'
import { formatDate } from '@/lib/format'

/**
 * The ₹ (U+20B9) glyph is absent from the 14 standard PDF fonts and renders
 * as a stray superscript, so the PDF uses "Rs." (standard on Indian GST
 * invoices). The rest of the app keeps ₹.
 */
function rs(paise: number): string {
  const hasDecimals = paise % 100 !== 0
  return `Rs. ${(paise / 100).toLocaleString('en-IN', {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0,
  })}`
}

/**
 * PDF invoice, rendered server-side (react-pdf). Uses the 14 standard PDF
 * fonts (Times/Helvetica) so nothing needs downloading at runtime. The logo
 * is passed in as a base64 data URI (react-pdf Image does not read .webp).
 */

const FOREST = '#1A3C34'
const INK = '#2A2A2A'
const MUTED = '#6B7A76'
const HAIRLINE = '#E2E0D8'

const styles = StyleSheet.create({
  page: {
    paddingTop: 44,
    paddingBottom: 48,
    paddingHorizontal: 44,
    fontFamily: 'Helvetica',
    fontSize: 9.5,
    color: INK,
    lineHeight: 1.5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: HAIRLINE,
    paddingBottom: 18,
  },
  logo: { width: 132, marginBottom: 8 },
  bizName: { fontFamily: 'Times-Bold', fontSize: 11, color: FOREST },
  muted: { color: MUTED },
  invoiceTitle: {
    fontFamily: 'Times-Roman',
    fontSize: 24,
    color: FOREST,
    textAlign: 'right',
    marginBottom: 10,
  },
  invoiceMeta: { textAlign: 'right' },
  twoCol: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: HAIRLINE,
  },
  colLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 7.5,
    letterSpacing: 1,
    color: MUTED,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  table: { marginTop: 18 },
  tHead: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: HAIRLINE,
    paddingBottom: 6,
  },
  tHeadCell: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 7.5,
    letterSpacing: 1,
    color: MUTED,
    textTransform: 'uppercase',
  },
  tRow: {
    flexDirection: 'row',
    paddingVertical: 7,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0EEE7',
  },
  cItem: { flex: 3 },
  cNum: { flex: 1, textAlign: 'right' },
  cQty: { width: 44, textAlign: 'right' },
  totals: { marginTop: 16, flexDirection: 'row', justifyContent: 'flex-end' },
  totalsBox: { width: 210 },
  totalsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 },
  grandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: HAIRLINE,
    marginTop: 6,
    paddingTop: 8,
    alignItems: 'center',
  },
  grandLabel: { fontFamily: 'Helvetica-Bold', color: FOREST },
  grandValue: { fontFamily: 'Times-Bold', fontSize: 16, color: FOREST },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 44,
    right: 44,
    textAlign: 'center',
    fontSize: 8,
    color: MUTED,
    borderTopWidth: 1,
    borderTopColor: HAIRLINE,
    paddingTop: 10,
  },
})

export function InvoiceDocument({
  order,
  settings,
  logoDataUri,
}: {
  order: Order
  settings: StoreSettings
  logoDataUri?: string
}) {
  return (
    <Document
      title={`Invoice ${order.invoiceNo ?? order.orderNo}`}
      author={settings.businessName}
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={{ maxWidth: 260 }}>
            {logoDataUri ? (
              <Image src={logoDataUri} style={styles.logo} />
            ) : (
              <Text style={{ fontFamily: 'Times-Bold', fontSize: 18, color: FOREST, marginBottom: 6 }}>
                Skinature
              </Text>
            )}
            <Text style={styles.bizName}>{settings.businessName}</Text>
            <Text style={styles.muted}>{settings.businessAddress}</Text>
            {settings.gstin ? <Text style={styles.muted}>GSTIN: {settings.gstin}</Text> : null}
          </View>
          <View>
            <Text style={styles.invoiceTitle}>Invoice</Text>
            <View style={styles.invoiceMeta}>
              <Text>{order.invoiceNo ?? 'Draft (unpaid)'}</Text>
              <Text style={styles.muted}>{formatDate(order.createdAt)}</Text>
              <Text style={styles.muted}>Order {order.orderNo}</Text>
            </View>
          </View>
        </View>

        {/* Bill to / Ship to */}
        <View style={styles.twoCol}>
          <View style={{ flex: 1, paddingRight: 20 }}>
            <Text style={styles.colLabel}>Billed To</Text>
            <Text>{order.customer.name}</Text>
            <Text style={styles.muted}>{order.customer.email}</Text>
            <Text style={styles.muted}>+91 {order.customer.phone}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.colLabel}>Shipped To</Text>
            <Text>{order.address.line1}</Text>
            {order.address.line2 ? <Text>{order.address.line2}</Text> : null}
            <Text>
              {order.address.city}, {order.address.state} {order.address.pincode}
            </Text>
          </View>
        </View>

        {/* Items */}
        <View style={styles.table}>
          <View style={styles.tHead}>
            <Text style={[styles.tHeadCell, styles.cItem]}>Item</Text>
            <Text style={[styles.tHeadCell, styles.cNum]}>Unit Price</Text>
            <Text style={[styles.tHeadCell, styles.cQty]}>Qty</Text>
            <Text style={[styles.tHeadCell, styles.cNum]}>Amount</Text>
          </View>
          {order.items.map((item, i) => (
            <View style={styles.tRow} key={i}>
              <Text style={styles.cItem}>{item.name}</Text>
              <Text style={[styles.cNum, styles.muted]}>{rs(item.unitPricePaise)}</Text>
              <Text style={[styles.cQty, styles.muted]}>{item.qty}</Text>
              <Text style={styles.cNum}>{rs(item.lineTotalPaise)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.totalsBox}>
            <View style={styles.totalsRow}>
              <Text style={styles.muted}>Subtotal</Text>
              <Text>{rs(order.subtotalPaise)}</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text style={styles.muted}>Shipping</Text>
              <Text>{rs(order.shippingPaise)}</Text>
            </View>
            <View style={styles.grandRow}>
              <Text style={styles.grandLabel}>Total</Text>
              <Text style={styles.grandValue}>{rs(order.totalPaise)}</Text>
            </View>
            {order.paymentId ? (
              <View style={[styles.totalsRow, { marginTop: 4 }]}>
                <Text style={[styles.muted, { fontSize: 7.5 }]}>Payment ID</Text>
                <Text style={[styles.muted, { fontSize: 7.5 }]}>{order.paymentId}</Text>
              </View>
            ) : null}
          </View>
        </View>

        <Text style={styles.footer}>
          Thank you for choosing Skinature. Nurtured by Nature.{'\n'}
          This is a computer-generated invoice and does not require a signature.
        </Text>
      </Page>
    </Document>
  )
}
