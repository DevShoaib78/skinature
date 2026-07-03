import { NextResponse } from 'next/server'
import { getSupabaseService } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/route'
import { rowToOrder, rowToSettings, ORDER_SELECT } from '@/lib/db/mappers'
import type { OrderRow, SettingsRow } from '@/lib/db/mappers'
import { renderInvoiceBuffer } from '@/lib/pdf/render'

export const runtime = 'nodejs'

/** Admin-only: returns the order's invoice as a real PDF download. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderNo: string }> }
) {
  const adminId = await requireAdmin()
  if (!adminId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { orderNo } = await params
  const db = getSupabaseService()

  const [{ data: orderRow }, { data: settingsRow }] = await Promise.all([
    db.from('orders').select(ORDER_SELECT).eq('order_no', orderNo).maybeSingle(),
    db.from('site_settings').select('*').single(),
  ])

  if (!orderRow) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  const order = rowToOrder(orderRow as unknown as OrderRow)
  const settings = rowToSettings(settingsRow as SettingsRow)
  const pdf = await renderInvoiceBuffer(order, settings)

  const filename = `Skinature-${order.invoiceNo ?? order.orderNo}.pdf`
  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}
