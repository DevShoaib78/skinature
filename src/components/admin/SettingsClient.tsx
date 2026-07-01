'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { useAdmin } from '@/store/admin'
import {
  PageHeader,
  Card,
  AdminButton,
  AdminField,
  adminInputClass,
} from '@/components/admin/ui'

export default function SettingsClient() {
  const settings = useAdmin((s) => s.settings)
  const updateSettings = useAdmin((s) => s.updateSettings)

  const [form, setForm] = useState({
    shippingTelangana: String(settings.shippingTelanganaPaise / 100),
    shippingRest: String(settings.shippingRestPaise / 100),
    businessName: settings.businessName,
    businessAddress: settings.businessAddress,
    gstin: settings.gstin,
    notifyEmail: settings.notifyEmail,
  })
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const save = () => {
    const tg = Math.round(parseFloat(form.shippingTelangana) * 100)
    const rest = Math.round(parseFloat(form.shippingRest) * 100)
    if (!Number.isFinite(tg) || tg < 0 || !Number.isFinite(rest) || rest < 0) {
      setError('Shipping charges must be valid amounts (0 or more).')
      return
    }
    if (!form.businessName.trim()) {
      setError('Business name is required (it appears on invoices).')
      return
    }
    setError('')
    updateSettings({
      shippingTelanganaPaise: tg,
      shippingRestPaise: rest,
      businessName: form.businessName.trim(),
      businessAddress: form.businessAddress.trim(),
      gstin: form.gstin.trim(),
      notifyEmail: form.notifyEmail.trim(),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <>
      <PageHeader
        title="Settings"
        description="Store configuration: shipping charges, business details, and notifications."
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 max-w-4xl">
        <Card title="Shipping Charges">
          <div className="space-y-5">
            <AdminField
              label="Within Telangana (₹)"
              hint="Charged once per order, whatever the item count."
            >
              <input
                type="number"
                min="0"
                value={form.shippingTelangana}
                onChange={(e) =>
                  setForm((f) => ({ ...f, shippingTelangana: e.target.value }))
                }
                className={adminInputClass}
              />
            </AdminField>
            <AdminField label="Rest of India (₹)">
              <input
                type="number"
                min="0"
                value={form.shippingRest}
                onChange={(e) => setForm((f) => ({ ...f, shippingRest: e.target.value }))}
                className={adminInputClass}
              />
            </AdminField>
          </div>
        </Card>

        <Card title="Business Details">
          <div className="space-y-5">
            <AdminField label="Legal / display name" hint="Appears on invoices.">
              <input
                value={form.businessName}
                onChange={(e) => setForm((f) => ({ ...f, businessName: e.target.value }))}
                className={adminInputClass}
              />
            </AdminField>
            <AdminField label="Business address">
              <input
                value={form.businessAddress}
                onChange={(e) =>
                  setForm((f) => ({ ...f, businessAddress: e.target.value }))
                }
                className={adminInputClass}
              />
            </AdminField>
            <AdminField label="GSTIN (optional)" hint="Shown on invoices when set.">
              <input
                value={form.gstin}
                onChange={(e) => setForm((f) => ({ ...f, gstin: e.target.value }))}
                className={adminInputClass}
                placeholder="22AAAAA0000A1Z5"
              />
            </AdminField>
          </div>
        </Card>

        <Card title="Notifications">
          <AdminField
            label="Order notification email"
            hint="New order alerts and admin invoice copies go here."
          >
            <input
              type="email"
              value={form.notifyEmail}
              onChange={(e) => setForm((f) => ({ ...f, notifyEmail: e.target.value }))}
              className={adminInputClass}
            />
          </AdminField>
        </Card>

        <div className="xl:col-span-2">
          {error && (
            <p role="alert" className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4">
              {error}
            </p>
          )}
          <div className="flex items-center gap-4">
            <AdminButton onClick={save}>
              {saved ? (
                <>
                  <Check size={14} aria-hidden="true" />
                  Saved
                </>
              ) : (
                'Save Settings'
              )}
            </AdminButton>
            <p className="text-forest-900/40 text-xs">
              Changes apply to invoices and the checkout shipping calculation at launch.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
