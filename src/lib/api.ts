export type ApiJob = {
  id: string
  title: string
  company: string
  description?: string | null
  location?: string | null
  salary_range?: string | null
  requirements?: string[]
  application_email?: string | null
  source: string
  external_id?: string | null
  posted_date?: string | null
  fetched_at: string
}

export type ApiApplication = {
  id: string
  job_id: string
  profile_id: string
  status: string
  reply_received: boolean
  followup_count: number
  created_at: string
  sent_at?: string | null
  response_received_at?: string | null
}

export type BulkApplyPayload = {
  profile_id: string
  job_ids: string[]
  email_tone?: string
  send_gap_minutes?: number
}

export type BulkApplyResponse = {
  batch_id: string
  status: string
  total_jobs: number
  docs_generated: number
  send_gap_minutes: number
  message: string
}

const _rawApiUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/+$/, '') ?? ''
const API_BASE_URL = _rawApiUrl && !_rawApiUrl.startsWith('http') ? `http://${_rawApiUrl}` : _rawApiUrl

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_BASE_URL) throw new Error('Missing VITE_API_BASE_URL in .env')

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`API ${response.status} ${path}: ${errorText}`)
  }

  return response.json() as Promise<T>
}

export function getJobs(params?: {
  keywords?: string
  location?: string
  company?: string
  limit?: number
  offset?: number
}) {
  const query = new URLSearchParams()
  if (params?.keywords) query.set('keywords', params.keywords)
  if (params?.location) query.set('location', params.location)
  if (params?.company) query.set('company', params.company)
  if (typeof params?.limit === 'number') query.set('limit', String(params.limit))
  if (typeof params?.offset === 'number') query.set('offset', String(params.offset))
  const suffix = query.toString() ? `?${query.toString()}` : ''
  return apiFetch<ApiJob[]>(`/api/v1/jobs/${suffix}`)
}

export function getApplications(params: {
  user_id: string
  status?: string
  limit?: number
  offset?: number
}) {
  const query = new URLSearchParams({ user_id: params.user_id })
  if (params.status) query.set('status', params.status)
  if (typeof params.limit === 'number') query.set('limit', String(params.limit))
  if (typeof params.offset === 'number') query.set('offset', String(params.offset))
  return apiFetch<ApiApplication[]>(`/api/v1/applications/?${query.toString()}`)
}

export function bulkApply(payload: BulkApplyPayload) {
  return apiFetch<BulkApplyResponse>('/api/v1/applications/bulk-apply', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
