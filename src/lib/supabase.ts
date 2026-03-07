type ClerkUserSyncPayload = {
  id: string
  email?: string | null
  full_name?: string | null
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
const SUPABASE_USER_TABLE = (import.meta.env.VITE_SUPABASE_USER_TABLE as string | undefined) || 'profiles'

export async function upsertClerkUser(payload: ClerkUserSyncPayload) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Supabase sync skipped: missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
    return
  }

  console.info(`Supabase sync attempt -> table "${SUPABASE_USER_TABLE}", id "${payload.id}"`)

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/${SUPABASE_USER_TABLE}?on_conflict=id`,
    {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify([payload]),
    },
  )

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Supabase upsert failed (${response.status}): ${errorText}`)
  }

  console.info(`Supabase user sync succeeded for table "${SUPABASE_USER_TABLE}" and id "${payload.id}"`)
}
