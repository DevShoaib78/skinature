/**
 * Provisions the real admin accounts and removes the shared demo account.
 *
 *   node scripts/setup-admin-users.mjs           # dry run
 *   node scripts/setup-admin-users.mjs --confirm # apply
 *
 * The founders sign in with a NAME, not an email (their request). Supabase Auth
 * is still the engine underneath — it needs an email identifier — so the login
 * form maps each display name onto the internal address below. Those addresses
 * are identifiers only; no mail is ever delivered to them.
 *
 * The password is passed via ADMIN_PASSWORD so it never lives in the repo:
 *   ADMIN_PASSWORD='...' node scripts/setup-admin-users.mjs --confirm
 */
import { readFileSync } from 'node:fs'

const env = {}
for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
  if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
}
const URL_ = env.NEXT_PUBLIC_SUPABASE_URL
const KEY = env.SUPABASE_SERVICE_ROLE_KEY
const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' }

const CONFIRM = process.argv.includes('--confirm')
const PASSWORD = process.env.ADMIN_PASSWORD

/** Display name -> internal auth identifier. Keep in sync with LoginClient.tsx. */
const ADMINS = [
  { name: 'Syed Adnan Touseef', email: 'adnan@skinature.org' },
  { name: 'Hina Mushfiq', email: 'hina@skinature.org' },
]
/** The shared demo account whose credentials were printed on the login page. */
const RETIRE = 'admin@skinature.org'

const listUsers = async () =>
  ((await (await fetch(`${URL_}/auth/v1/admin/users`, { headers: H })).json()).users || [])

const existing = await listUsers()
console.log(CONFIRM ? '════ APPLYING ════\n' : '════ DRY RUN — nothing changed ════\n')
console.log('current auth users:')
existing.forEach((u) => console.log(`  ${u.email}`))

console.log('\nplan:')
for (const a of ADMINS) {
  const have = existing.find((u) => u.email === a.email)
  console.log(`  ${have ? 'update password for' : 'CREATE'}  ${a.email.padEnd(24)} (login name: "${a.name}")`)
}
console.log(`  DELETE                ${RETIRE.padEnd(24)} (shared demo account)`)

if (!CONFIRM) {
  console.log('\nRe-run with --confirm and ADMIN_PASSWORD set.')
  process.exit(0)
}
if (!PASSWORD || PASSWORD.length < 10) {
  console.error('\nRefusing to run: set a strong ADMIN_PASSWORD env var.')
  process.exit(1)
}

console.log('\napplying...')
for (const a of ADMINS) {
  const have = existing.find((u) => u.email === a.email)
  let userId = have?.id

  if (have) {
    const r = await fetch(`${URL_}/auth/v1/admin/users/${have.id}`, {
      method: 'PUT',
      headers: H,
      body: JSON.stringify({ password: PASSWORD, email_confirm: true }),
    })
    console.log(`  ${r.ok ? 'password updated' : 'FAILED       '}  ${a.email}`)
  } else {
    const r = await fetch(`${URL_}/auth/v1/admin/users`, {
      method: 'POST',
      headers: H,
      body: JSON.stringify({
        email: a.email,
        password: PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: a.name },
      }),
    })
    const d = await r.json()
    userId = d.id
    console.log(`  ${r.ok ? 'created         ' : 'FAILED          '} ${a.email}`)
    if (!r.ok) console.log('   ', JSON.stringify(d).slice(0, 160))
  }

  // admins row is what is_admin() checks for RLS — without it the panel stays empty.
  if (userId) {
    const r = await fetch(`${URL_}/rest/v1/admins`, {
      method: 'POST',
      headers: { ...H, Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({ user_id: userId, email: a.email }),
    })
    console.log(`  ${r.ok ? 'admins row ok   ' : 'admins row FAIL '} ${a.email}`)
  }
}

// Retire the shared demo account last, so we never lock ourselves out mid-run.
const demo = (await listUsers()).find((u) => u.email === RETIRE)
if (demo) {
  await fetch(`${URL_}/rest/v1/admins?user_id=eq.${demo.id}`, {
    method: 'DELETE',
    headers: { ...H, Prefer: 'return=minimal' },
  })
  const r = await fetch(`${URL_}/auth/v1/admin/users/${demo.id}`, { method: 'DELETE', headers: H })
  console.log(`  ${r.ok ? 'demo account DELETED' : 'demo delete FAILED'}  ${RETIRE}`)
} else {
  console.log('  demo account already gone')
}

console.log('\nfinal auth users:')
;(await listUsers()).forEach((u) => console.log(`  ${u.email}`))
