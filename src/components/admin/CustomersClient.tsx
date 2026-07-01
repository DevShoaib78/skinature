'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getMockCustomers } from '@/lib/mock/orders'
import { formatPaise, formatDate } from '@/lib/format'
import { PageHeader, Card, adminInputClass } from '@/components/admin/ui'

export default function CustomersClient() {
  const [query, setQuery] = useState('')
  const customers = useMemo(() => getMockCustomers(), [])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return customers
    return customers.filter((c) =>
      [c.name, c.email, c.phone, c.city, c.state].join(' ').toLowerCase().includes(q)
    )
  }, [customers, query])

  const repeatCount = customers.filter((c) => c.ordersCount > 1).length

  return (
    <>
      <PageHeader
        title="Customers"
        description={`${customers.length} customers · ${repeatCount} have ordered more than once.`}
        actions={
          <div className="relative w-full sm:w-72">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-900/35 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, city..."
              aria-label="Search customers"
              className={cn(adminInputClass, 'pl-10')}
            />
          </div>
        }
      />

      <Card>
        {visible.length === 0 ? (
          <p className="text-forest-900/50 text-sm py-10 text-center">
            No customers match this search.
          </p>
        ) : (
          <div className="overflow-x-auto -mx-5 md:-mx-6 px-5 md:px-6">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="text-left text-forest-900/45 text-xs uppercase tracking-[0.1em] border-b border-forest-900/10">
                  <th className="py-3 pr-4 font-semibold">Customer</th>
                  <th className="py-3 pr-4 font-semibold">Contact</th>
                  <th className="py-3 pr-4 font-semibold">Location</th>
                  <th className="py-3 pr-4 font-semibold">Orders</th>
                  <th className="py-3 pr-4 font-semibold">Total Spend</th>
                  <th className="py-3 font-semibold">Last Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest-900/6">
                {visible.map((c) => (
                  <tr key={c.email} className="hover:bg-forest-50/50 transition-colors">
                    <td className="py-3.5 pr-4">
                      <p className="font-medium text-forest-900">{c.name}</p>
                      {c.ordersCount > 1 && (
                        <p className="text-gold-600 text-[0.65rem] uppercase tracking-[0.1em] font-semibold mt-0.5">
                          Repeat customer
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 pr-4">
                      <p className="text-forest-900/70">{c.email}</p>
                      <p className="text-forest-900/40 text-xs">{c.phone}</p>
                    </td>
                    <td className="py-3.5 pr-4 text-forest-900/60 whitespace-nowrap">
                      {c.city}, {c.state}
                    </td>
                    <td className="py-3.5 pr-4 tabular-nums text-forest-900 font-medium">
                      {c.ordersCount}
                    </td>
                    <td className="py-3.5 pr-4 tabular-nums text-forest-900 font-medium">
                      {formatPaise(c.totalSpendPaise)}
                    </td>
                    <td className="py-3.5 text-forest-900/55 whitespace-nowrap">
                      {formatDate(c.lastOrderAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  )
}
