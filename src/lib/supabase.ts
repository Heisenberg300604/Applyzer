type ClerkUserSyncPayload = {
  id: string
  email?: string | null
  full_name?: string | null
}

export type ProjectUpsertPayload = {
  id?: string
  profile_id: string
  github_repo_name: string
  github_repo_url: string
  primary_language?: string | null
  github_topics?: string[]
  github_stars?: number
  github_updated_at?: string | null
  title?: string | null
  description?: string | null
  tech_stack?: string[]
  features?: string[]
  resume_bullets?: string[]
  category?: string | null
  skills_demonstrated?: string[]
  is_featured?: boolean
  last_synced_at?: string
  llm_processed_at?: string
  readme_raw?: string | null
}

export type SupabaseJobRow = {
  id?: string | null
  title?: string | null
  company?: string | null
  description?: string | null
  location?: string | null
  application_email?: string | null
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
const SUPABASE_USER_TABLE = (import.meta.env.VITE_SUPABASE_USER_TABLE as string | undefined) || 'profiles'
const SUPABASE_PROJECTS_TABLE = (import.meta.env.VITE_SUPABASE_PROJECTS_TABLE as string | undefined) || 'projects'
const SUPABASE_JOBS_TABLE = (import.meta.env.VITE_SUPABASE_JOBS_TABLE as string | undefined) || 'jobs'

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

export async function upsertProjects(payload: ProjectUpsertPayload[]) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !payload.length) return

  const headers = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'resolution=merge-duplicates,return=minimal',
  }

  const upsertResponse = await fetch(
    `${SUPABASE_URL}/rest/v1/${SUPABASE_PROJECTS_TABLE}?on_conflict=profile_id,github_repo_url`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    },
  )

  if (upsertResponse.ok) {
    console.info(`Supabase projects sync succeeded for ${payload.length} repo(s) on table "${SUPABASE_PROJECTS_TABLE}"`)
    return
  }

  const fallbackInsertResponse = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_PROJECTS_TABLE}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  })

  if (!fallbackInsertResponse.ok) {
    const upsertErrorText = await upsertResponse.text()
    const fallbackErrorText = await fallbackInsertResponse.text()
    throw new Error(
      `Supabase projects write failed. Upsert (${upsertResponse.status}): ${upsertErrorText}. Fallback insert (${fallbackInsertResponse.status}): ${fallbackErrorText}`,
    )
  }

  console.info(`Supabase projects fallback insert succeeded for ${payload.length} repo(s) on table "${SUPABASE_PROJECTS_TABLE}"`)
}

export async function getJobsFromSupabase(limit = 100): Promise<SupabaseJobRow[]> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
  }

  const query = new URLSearchParams({
    select: 'id,title,company,description,location,application_email',
    order: 'title.asc',
    limit: String(limit),
  })

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_JOBS_TABLE}?${query.toString()}`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Supabase jobs fetch failed (${response.status}): ${errorText}`)
  }

  return response.json()
}
