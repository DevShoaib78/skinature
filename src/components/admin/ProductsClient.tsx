'use client'

import { useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Pencil, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  fetchAdminProducts,
  updateAdminProduct,
  insertAdminProduct,
} from '@/lib/db/admin'
import type { Product, Category } from '@/lib/data'
import { formatPaise } from '@/lib/format'
import {
  PageHeader,
  Card,
  AdminButton,
  AdminField,
  adminInputClass,
} from '@/components/admin/ui'
import { useAsync, AdminLoading, AdminError } from '@/components/admin/useAsync'

const CATEGORIES: Category[] = ['Skin Care', 'Hair Care', 'Hair + Skin']

interface FormState {
  name: string
  category: Category
  priceRupees: string
  saleRupees: string
  stock: string
  badge: string
  benefit: string
  description: string
  isKit: boolean
  isActive: boolean
}

function productToForm(p: Product): FormState {
  return {
    name: p.name,
    category: p.category,
    priceRupees: String(p.pricePaise / 100),
    saleRupees: p.salePricePaise !== null ? String(p.salePricePaise / 100) : '',
    stock: String(p.stock),
    badge: p.badge ?? '',
    benefit: p.benefit,
    description: p.description,
    isKit: p.isKit,
    isActive: p.isActive,
  }
}

const EMPTY_FORM: FormState = {
  name: '',
  category: 'Skin Care',
  priceRupees: '',
  saleRupees: '',
  stock: '0',
  badge: '',
  benefit: '',
  description: '',
  isKit: false,
  isActive: true,
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function ProductsClient() {
  const { data: products, error: loadError, loading, reload } = useAsync(fetchAdminProducts)

  const [editing, setEditing] = useState<Product | 'new' | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const openEdit = (p: Product) => {
    setForm(productToForm(p))
    setError('')
    setEditing(p)
  }

  const openNew = () => {
    setForm(EMPTY_FORM)
    setError('')
    setEditing('new')
  }

  const save = async () => {
    const price = Math.round(parseFloat(form.priceRupees) * 100)
    const sale = form.saleRupees.trim()
      ? Math.round(parseFloat(form.saleRupees) * 100)
      : null

    if (!form.name.trim()) return setError('Product name is required.')
    if (!Number.isFinite(price) || price <= 0)
      return setError('Enter a valid price in rupees.')
    if (sale !== null && (!Number.isFinite(sale) || sale <= 0))
      return setError('Sale price must be a valid amount, or left empty.')
    if (sale !== null && sale >= price)
      return setError('Sale price must be lower than the regular price.')
    const stock = parseInt(form.stock, 10)
    if (!Number.isFinite(stock) || stock < 0)
      return setError('Stock must be 0 or more.')

    const patch = {
      name: form.name.trim(),
      category: form.category,
      pricePaise: price,
      salePricePaise: sale,
      stock,
      badge: form.badge.trim() || undefined,
      benefit: form.benefit.trim(),
      description: form.description.trim(),
      isKit: form.isKit,
      isActive: form.isActive,
    }

    setSaving(true)
    try {
      if (editing === 'new') {
        await insertAdminProduct({
          slug: slugify(form.name),
          gallery: [],
          image: '/new mockups/Hair Care Kit.webp',
          rating: 5,
          reviewCount: 0,
          ingredients: '',
          ritual: '',
          benefits: '',
          sortOrder: (products?.length ?? 0) + 1,
          ...patch,
        })
      } else if (editing) {
        await updateAdminProduct(editing.id, patch)
      }
      setEditing(null)
      reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save. Try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <AdminLoading />
  if (loadError || !products) return <AdminError message={loadError} onRetry={reload} />

  return (
    <>
      <PageHeader
        title="Products"
        description="Manage the catalog: pricing, sale prices, stock, and visibility."
        actions={
          <AdminButton onClick={openNew}>
            <Plus size={14} aria-hidden="true" />
            Add Product
          </AdminButton>
        }
      />

      <Card>
        <div className="overflow-x-auto -mx-5 md:-mx-6 px-5 md:px-6">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="text-left text-forest-900/45 text-xs uppercase tracking-[0.1em] border-b border-forest-900/10">
                <th className="py-3 pr-4 font-semibold">Product</th>
                <th className="py-3 pr-4 font-semibold">Category</th>
                <th className="py-3 pr-4 font-semibold">Price</th>
                <th className="py-3 pr-4 font-semibold">Sale Price</th>
                <th className="py-3 pr-4 font-semibold">Stock</th>
                <th className="py-3 pr-4 font-semibold">Status</th>
                <th className="py-3 font-semibold text-right">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-900/6">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-forest-50/50 transition-colors">
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-3">
                      <span className="relative w-10 h-12 rounded-lg overflow-hidden bg-forest-50 flex-shrink-0">
                        {p.image && (
                          <Image
                            src={p.image}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        )}
                      </span>
                      <div>
                        <p className="font-medium text-forest-900">{p.name}</p>
                        {p.badge && (
                          <p className="text-gold-600 text-[0.65rem] uppercase tracking-[0.1em] font-semibold">
                            {p.badge}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 pr-4 text-forest-900/60">{p.category}</td>
                  <td className="py-3.5 pr-4 text-forest-900 font-medium tabular-nums">
                    {formatPaise(p.pricePaise)}
                  </td>
                  <td className="py-3.5 pr-4 tabular-nums">
                    {p.salePricePaise !== null ? (
                      <span className="text-gold-600 font-semibold">
                        {formatPaise(p.salePricePaise)}
                      </span>
                    ) : (
                      <span className="text-forest-900/30">—</span>
                    )}
                  </td>
                  <td className="py-3.5 pr-4">
                    <span
                      className={cn(
                        'tabular-nums font-medium',
                        p.stock === 0
                          ? 'text-red-600'
                          : p.stock <= 10
                            ? 'text-amber-700'
                            : 'text-forest-900'
                      )}
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4">
                    <span
                      className={cn(
                        'inline-flex px-2.5 py-1 rounded-full border text-[0.68rem] font-semibold uppercase tracking-[0.08em]',
                        p.isActive
                          ? 'bg-forest-50 text-forest-800 border-forest-100'
                          : 'bg-forest-900/5 text-forest-900/45 border-forest-900/10'
                      )}
                    >
                      {p.isActive ? 'Live' : 'Hidden'}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => openEdit(p)}
                      aria-label={`Edit ${p.name}`}
                      className="p-2 text-forest-900/45 hover:text-forest-900 transition-colors"
                    >
                      <Pencil size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit / create panel */}
      <AnimatePresence>
        {editing !== null && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditing(null)}
              className="fixed inset-0 z-[110] bg-forest-950/40"
              aria-hidden="true"
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label={editing === 'new' ? 'Add product' : 'Edit product'}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="fixed top-0 right-0 bottom-0 z-[120] w-full max-w-lg bg-cream shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-forest-900/10">
                <h2 className="font-serif text-2xl text-forest-900">
                  {editing === 'new' ? 'Add Product' : 'Edit Product'}
                </h2>
                <button
                  onClick={() => setEditing(null)}
                  aria-label="Close"
                  className="text-forest-900/60 hover:text-forest-900 p-2 -mr-2"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
                <AdminField label="Name">
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className={adminInputClass}
                    placeholder="Product name"
                  />
                </AdminField>

                <div className="grid grid-cols-2 gap-4">
                  <AdminField label="Category">
                    <select
                      value={form.category}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, category: e.target.value as Category }))
                      }
                      className={adminInputClass}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </AdminField>
                  <AdminField label="Badge (optional)">
                    <input
                      value={form.badge}
                      onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
                      className={adminInputClass}
                      placeholder="Best Seller"
                    />
                  </AdminField>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <AdminField label="Price (₹)">
                    <input
                      type="number"
                      min="0"
                      value={form.priceRupees}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, priceRupees: e.target.value }))
                      }
                      className={adminInputClass}
                      placeholder="499"
                    />
                  </AdminField>
                  <AdminField
                    label="Sale Price (₹)"
                    hint="Leave empty for no sale. Shows the strikethrough on the store."
                  >
                    <input
                      type="number"
                      min="0"
                      value={form.saleRupees}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, saleRupees: e.target.value }))
                      }
                      className={adminInputClass}
                      placeholder="—"
                    />
                  </AdminField>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <AdminField label="Stock">
                    <input
                      type="number"
                      min="0"
                      value={form.stock}
                      onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                      className={adminInputClass}
                    />
                  </AdminField>
                  <AdminField label="Benefit line">
                    <input
                      value={form.benefit}
                      onChange={(e) => setForm((f) => ({ ...f, benefit: e.target.value }))}
                      className={adminInputClass}
                      placeholder="Brightening & Detoxifying"
                    />
                  </AdminField>
                </div>

                <AdminField label="Description">
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                    className={cn(adminInputClass, 'resize-y')}
                  />
                </AdminField>

                <div className="flex items-center gap-6 pt-1">
                  <label className="flex items-center gap-2.5 text-sm text-forest-900 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, isActive: e.target.checked }))
                      }
                      className="w-4 h-4 accent-[#1A3C34]"
                    />
                    Visible on store
                  </label>
                  <label className="flex items-center gap-2.5 text-sm text-forest-900 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isKit}
                      onChange={(e) => setForm((f) => ({ ...f, isKit: e.target.checked }))}
                      className="w-4 h-4 accent-[#1A3C34]"
                    />
                    Kit / combo
                  </label>
                </div>

                {error && (
                  <p role="alert" className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                    {error}
                  </p>
                )}
              </div>

              <div className="px-6 py-5 border-t border-forest-900/10 flex gap-3">
                <AdminButton onClick={save} disabled={saving} className="flex-1">
                  {saving
                    ? 'Saving...'
                    : editing === 'new'
                      ? 'Add Product'
                      : 'Save Changes'}
                </AdminButton>
                <AdminButton variant="outline" onClick={() => setEditing(null)} disabled={saving}>
                  Cancel
                </AdminButton>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
