'use client'

import Image from 'next/image'
import { Minus, Plus, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { fetchAdminProducts, adjustAdminStock } from '@/lib/db/admin'
import { PageHeader, Card } from '@/components/admin/ui'
import { useAsync, AdminLoading, AdminError } from '@/components/admin/useAsync'

const LOW_STOCK_AT = 10

export default function InventoryClient() {
  const { data: products, error, loading, reload, setData } = useAsync(fetchAdminProducts)

  const adjustStock = async (id: string, delta: number) => {
    if (!products) return
    const product = products.find((p) => p.id === id)
    if (!product) return
    const next = Math.max(0, product.stock + delta)
    // Optimistic update, rolled back on failure.
    setData(products.map((p) => (p.id === id ? { ...p, stock: next } : p)))
    try {
      await adjustAdminStock(id, product.stock, delta)
    } catch {
      setData(products)
    }
  }

  if (loading) return <AdminLoading />
  if (error || !products) return <AdminError message={error} onRetry={reload} />

  const lowStock = products.filter((p) => p.isActive && p.stock <= LOW_STOCK_AT)

  return (
    <>
      <PageHeader
        title="Inventory"
        description="Stock levels across the catalog. Low-stock items surface first."
      />

      {lowStock.length > 0 && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-6">
          <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-amber-900 text-sm">
            <strong className="font-semibold">{lowStock.length}</strong>{' '}
            {lowStock.length === 1 ? 'product is' : 'products are'} at or below{' '}
            {LOW_STOCK_AT} units:{' '}
            {lowStock.map((p) => p.name).join(', ')}.
          </p>
        </div>
      )}

      <Card>
        <div className="overflow-x-auto -mx-5 md:-mx-6 px-5 md:px-6">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="text-left text-forest-900/45 text-xs uppercase tracking-[0.1em] border-b border-forest-900/10">
                <th className="py-3 pr-4 font-semibold">Product</th>
                <th className="py-3 pr-4 font-semibold">Status</th>
                <th className="py-3 pr-4 font-semibold">In Stock</th>
                <th className="py-3 font-semibold text-right">Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-900/6">
              {[...products]
                .sort((a, b) => a.stock - b.stock)
                .map((p) => (
                  <tr key={p.id} className="hover:bg-forest-50/50 transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        <span className="relative w-10 h-12 rounded-lg overflow-hidden bg-forest-50 flex-shrink-0">
                          {p.image && (
                            <Image src={p.image} alt="" fill className="object-cover" sizes="40px" />
                          )}
                        </span>
                        <p className="font-medium text-forest-900">{p.name}</p>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4">
                      <span
                        className={cn(
                          'inline-flex px-2.5 py-1 rounded-full border text-[0.68rem] font-semibold uppercase tracking-[0.08em]',
                          p.stock === 0
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : p.stock <= LOW_STOCK_AT
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-forest-50 text-forest-800 border-forest-100'
                        )}
                      >
                        {p.stock === 0
                          ? 'Out of stock'
                          : p.stock <= LOW_STOCK_AT
                            ? 'Low stock'
                            : 'In stock'}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className="font-serif text-2xl text-forest-900 tabular-nums">
                        {p.stock}
                      </span>
                      <span className="text-forest-900/40 text-xs ml-1.5">units</span>
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => adjustStock(p.id, -1)}
                          disabled={p.stock === 0}
                          aria-label={`Decrease ${p.name} stock`}
                          className="w-9 h-9 rounded-xl border border-forest-900/15 bg-white flex items-center justify-center text-forest-900/60 hover:text-forest-900 hover:border-forest-900/40 transition-colors disabled:opacity-40"
                        >
                          <Minus size={14} strokeWidth={2} />
                        </button>
                        <button
                          onClick={() => adjustStock(p.id, 1)}
                          aria-label={`Increase ${p.name} stock`}
                          className="w-9 h-9 rounded-xl border border-forest-900/15 bg-white flex items-center justify-center text-forest-900/60 hover:text-forest-900 hover:border-forest-900/40 transition-colors"
                        >
                          <Plus size={14} strokeWidth={2} />
                        </button>
                        <button
                          onClick={() => adjustStock(p.id, 10)}
                          aria-label={`Add 10 units of ${p.name}`}
                          className="h-9 px-3 rounded-xl border border-forest-900/15 bg-white text-xs font-semibold text-forest-900/60 hover:text-forest-900 hover:border-forest-900/40 transition-colors"
                        >
                          +10
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}
