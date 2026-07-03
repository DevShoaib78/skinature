import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { renderToBuffer } from '@react-pdf/renderer'
import { createElement } from 'react'
import { InvoiceDocument } from '@/lib/pdf/InvoiceDocument'
import type { Order, StoreSettings } from '@/lib/domain'

let logoDataUriCache: string | undefined

/** logo.png as a base64 data URI (react-pdf Image cannot read .webp). */
async function getLogoDataUri(): Promise<string | undefined> {
  if (logoDataUriCache) return logoDataUriCache
  try {
    const file = await readFile(path.join(process.cwd(), 'public', 'logo.png'))
    logoDataUriCache = `data:image/png;base64,${file.toString('base64')}`
    return logoDataUriCache
  } catch {
    return undefined
  }
}

export async function renderInvoiceBuffer(
  order: Order,
  settings: StoreSettings
): Promise<Buffer> {
  const logoDataUri = await getLogoDataUri()
  // InvoiceDocument returns a <Document>; react-pdf's element typing does not
  // see through the wrapper component, so cast to renderToBuffer's own param type.
  const element = createElement(InvoiceDocument, {
    order,
    settings,
    logoDataUri,
  }) as Parameters<typeof renderToBuffer>[0]
  return renderToBuffer(element)
}
