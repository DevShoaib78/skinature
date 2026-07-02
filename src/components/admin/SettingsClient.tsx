'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { fetchAdminSettings, updateAdminSettings } from '@/lib/db/admin'
import {
  PageHeader,
  Card,
  AdminButton,
  AdminField,
  adminInputClass,
} from '@/components/admin/ui'
import { useAsync, AdminLoading, AdminError } from '@/components/admin/useAsync'

interface FormState {
  shippingTelangana: string
  shippingRest: string
  businessName: string
  businessAddress: string
  gstin: string
  notifyEmail: string
}

function SettingsForm({ initial }: { initial: FormState }) {
  const [form, setForm] = useState<FormState>(initial)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const save = async () => {
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
    setSaving(true)
    try {
      await updateAdminSettings({
        shippingTelanganaPaise: tg,
        shippingRestPaise: rest,
        businessName: form.businessName.trim(),
        businessAddress: form.businessAddress.trim(),
        gstin: form.gstin.trim(),
        notifyEmail: form.notifyEmail.trim(),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save settings.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 max-w-4xl">
      <Card title="Shipping Charges">
        <div className="space-y-5">
          <AdminField
            label="Within Telangana (₹)"
            hint="Charged once per order, whatever the item count. Applies live at checkout."
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
            <textarea
              rows={3}
              value={form.businessAddress}
              onChange={(e) =>
                setForm((f) => ({ ...f, businessAddress: e.target.value }))
              }
              className={`${adminInputClass} resize-y`}
            />
          </AdminField>
          <AdminField label="GSTIN" hint="Shown on invoices when set.">
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
          hint="New order alerts and admin invoice copies go here once email goes live."
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
          <AdminButton onClick={save} disabled={saving}>
            {saved ? (
              <>
                <Check size={14} aria-hidden="true" />
                Saved
              </>
            ) : saving ? (
              'Saving...'
            ) : (
              'Save Settings'
            )}
          </AdminButton>
          <p className="text-forest-900/40 text-xs">
            Saved to the live database. Shipping changes apply to new checkouts
            immediately.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SettingsClient() {
  const { data: settings, error, loading, reload } = useAsync(fetchAdminSettings)

  if (loading) return <AdminLoading />
  if (error || !settings) return <AdminError message={error} onRetry={reload} />

  return (
    <>
      <PageHeader
        title="Settings"
        description="Store configuration: shipping charges, business details, and notifications."
      />
      <SettingsForm
        initial={{
          shippingTelangana: String(settings.shippingTelanganaPaise / 100),
          shippingRest: String(settings.shippingRestPaise / 100),
          businessName: settings.businessName,
          businessAddress: settings.businessAddress,
          gstin: settings.gstin,
          notifyEmail: settings.notifyEmail,
        }}
      />
    </>
  )
}
