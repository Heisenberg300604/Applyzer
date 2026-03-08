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
  is_featured?: boolean // defaults to true — shown on resumes
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

type ProjectSignalRow = {
  title?: string | null
  description?: string | null
  tech_stack?: string[] | string | null
  skills_demonstrated?: string[] | string | null
  github_topics?: string[] | string | null
  features?: string[] | string | null
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

const splitWords = (value: string) =>
  value
    .toLowerCase()
    .split(/[^a-z0-9+#.-]+/)
    .map(token => token.trim())
    .filter(token => token.length >= 3)

const normalizeArrayish = (value: string[] | string | null | undefined) => {
  if (!value) return [] as string[]
  if (Array.isArray(value)) return value.map(String)
  const trimmed = String(value).trim()
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    return trimmed
      .slice(1, -1)
      .split(',')
      .map(item => item.trim().replace(/^"|"$/g, ''))
      .filter(Boolean)
  }
  return trimmed
    .split(/[|,;]/)
    .map(item => item.trim())
    .filter(Boolean)
}

const collectProfileKeywords = (rows: ProjectSignalRow[]) => {
  const stop = new Set(['the', 'and', 'for', 'with', 'from', 'this', 'that', 'api', 'app', 'project', 'application', 'using'])
  const keywords = new Set<string>()
  const expansions: Record<string, string[]> = {
    react: ['frontend', 'javascript', 'typescript', 'web'],
    next: ['frontend', 'web', 'javascript', 'typescript'],
    node: ['backend', 'javascript', 'api'],
    django: ['backend', 'python', 'api'],
    flask: ['backend', 'python', 'api'],
    fastapi: ['backend', 'python', 'api'],
    html: ['frontend', 'web'],
    css: ['frontend', 'web'],
    tailwind: ['frontend', 'css', 'web'],
    javascript: ['frontend', 'web'],
    typescript: ['frontend', 'backend', 'web'],
    postgres: ['database', 'sql', 'backend'],
    supabase: ['database', 'backend', 'sql'],
  }

  for (const row of rows) {
    const signalItems = [
      ...normalizeArrayish(row.tech_stack),
      ...normalizeArrayish(row.skills_demonstrated),
      ...normalizeArrayish(row.github_topics),
      ...normalizeArrayish(row.features),
    ]

    for (const item of signalItems) {
      for (const token of splitWords(String(item))) {
        if (stop.has(token)) continue
        keywords.add(token)
        for (const expanded of expansions[token] || []) {
          if (!stop.has(expanded)) keywords.add(expanded)
        }
      }
    }
    for (const token of splitWords(`${row.title || ''} ${row.description || ''}`)) {
      if (!stop.has(token)) keywords.add(token)
    }
  }

  return [...keywords].slice(0, 12)
}

export async function getProfileMatchedJobs(profileId: string, limit = 100): Promise<SupabaseJobRow[]> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
  }

  const headers = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  }

  const projectSignalsQuery = new URLSearchParams({
    select: 'title,description,tech_stack,skills_demonstrated,github_topics,features',
    profile_id: `eq.${profileId}`,
    limit: '50',
  })

  const projectsResponse = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_PROJECTS_TABLE}?${projectSignalsQuery.toString()}`, {
    headers,
  })

  if (!projectsResponse.ok) {
    const errorText = await projectsResponse.text()
    throw new Error(`Supabase profile-signal fetch failed (${projectsResponse.status}): ${errorText}`)
  }

  const signals = (await projectsResponse.json()) as ProjectSignalRow[]
  const keywords = collectProfileKeywords(signals)
  if (!keywords.length) return []
  const unique = new Map<string, SupabaseJobRow>()
  const perKeywordLimit = Math.max(10, Math.ceil(limit / Math.max(1, keywords.length)))

  for (const keyword of keywords) {
    const safe = keyword.replace(/[%(),]/g, '')
    if (!safe) continue

    const jobsQuery = new URLSearchParams({
      select: 'id,title,company,description,location,application_email',
      limit: String(perKeywordLimit),
      or: `(title.ilike.*${safe}*,description.ilike.*${safe}*,company.ilike.*${safe}*)`,
    })

    const jobsResponse = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_JOBS_TABLE}?${jobsQuery.toString()}`, { headers })
    if (!jobsResponse.ok) continue

    const rows = (await jobsResponse.json()) as SupabaseJobRow[]
    for (const row of rows) {
      const key = String(row.id || `${row.title || ''}-${row.company || ''}-${row.location || ''}`)
      if (!unique.has(key)) unique.set(key, row)
      if (unique.size >= limit) break
    }
    if (unique.size >= limit) break
  }

  return [...unique.values()].slice(0, limit)
}

// ── Profile form types ────────────────────────────────────────────────────────

export type ProfileSkillCategory = { category: string; items: string[] }
export type ProfileEducationItem = { degree: string; institution: string; year: string; start_year?: string; end_year?: string; coursework?: string }
export type ProfileExperienceItem = { role: string; company: string; location: string; duration: string; achievements: string[] }

export type ProfileFormPayload = {
  full_name: string
  email: string
  phone?: string | null
  location?: string | null
  linkedin_url?: string | null
  github_url?: string | null
  github_username?: string | null
  professional_summary?: string | null
  experience_years?: string | null
  skills: ProfileSkillCategory[]
  education: ProfileEducationItem[]
  experience: ProfileExperienceItem[]
}

export type StoredProject = {
  id: string
  profile_id: string
  github_repo_name: string
  github_repo_url: string
  primary_language?: string | null
  github_topics?: string[]
  github_stars?: number
  title?: string | null
  description?: string | null
  tech_stack?: string[]
  resume_bullets?: string[]
  skills_demonstrated?: string[]
  category?: string | null
  is_featured: boolean
  created_at: string
}

// ── Profile save / load ───────────────────────────────────────────────────────

export async function getProfileFromSupabase(userId: string): Promise<ProfileFormPayload | null> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/${SUPABASE_USER_TABLE}?id=eq.${encodeURIComponent(userId)}&select=*`,
    { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } },
  )
  if (!response.ok) return null
  const rows = (await response.json()) as Record<string, unknown>[]
  if (!rows.length) return null
  const r = rows[0]
  return {
    full_name: String(r.full_name || ''),
    email: String(r.email || ''),
    phone: r.phone ? String(r.phone) : null,
    location: r.location ? String(r.location) : null,
    linkedin_url: r.linkedin_url ? String(r.linkedin_url) : null,
    github_url: r.github_url ? String(r.github_url) : null,
    github_username: r.github_username ? String(r.github_username) : null,
    professional_summary: r.professional_summary ? String(r.professional_summary) : null,
    experience_years: r.experience_years ? String(r.experience_years) : null,
    skills: Array.isArray(r.skills) ? (r.skills as ProfileSkillCategory[]) : [],
    education: Array.isArray(r.education) ? (r.education as ProfileEducationItem[]) : [],
    experience: Array.isArray(r.experience) ? (r.experience as ProfileExperienceItem[]) : [],
  }
}

export async function saveProfileToSupabase(userId: string, payload: ProfileFormPayload): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) throw new Error('Supabase not configured')
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
      body: JSON.stringify([{ id: userId, ...payload }]),
    },
  )
  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Profile save failed (${response.status}): ${err}`)
  }
}

// ── Projects load / toggle ────────────────────────────────────────────────────

export async function getProjectsFromSupabase(profileId: string): Promise<StoredProject[]> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return []
  const fields = 'id,profile_id,github_repo_name,github_repo_url,primary_language,github_topics,github_stars,title,description,tech_stack,resume_bullets,skills_demonstrated,category,is_featured,created_at'
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/projects?profile_id=eq.${encodeURIComponent(profileId)}&order=created_at.desc&select=${fields}`,
    { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } },
  )
  if (!response.ok) return []
  return response.json() as Promise<StoredProject[]>
}

export async function toggleProjectFeaturedInSupabase(projectId: string, isFeatured: boolean): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) throw new Error('Supabase not configured')
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/projects?id=eq.${encodeURIComponent(projectId)}`,
    {
      method: 'PATCH',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ is_featured: isFeatured }),
    },
  )
  if (!response.ok) throw new Error(`Toggle featured failed (${response.status})`)
}
