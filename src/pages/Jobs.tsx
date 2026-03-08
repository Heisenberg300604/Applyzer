import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import {
  Search, MapPin, Building2, Clock, Bookmark,
  CheckSquare, Square, SlidersHorizontal, ExternalLink,
  Zap, Sparkles, Layers, RefreshCw, Loader2,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getProfileMatchedJobs, getJobsFromSupabase, type SupabaseJobRow } from '@/lib/supabase'
import { useUser } from '@/context/UserContext'

// ── Types ────────────────────────────────────────────────────────────────────

type Job = {
  id: string
  title: string
  company: string
  location: string
  type: string
  salary: string
  tags: string[]
  posted: string
  logo: string
  description?: string
  application_email?: string
  source: 'matched' | 'all'
}

type SourceTab = 'matched' | 'all'

// ── Helpers ───────────────────────────────────────────────────────────────────

const typeColors: Record<string, string> = {
  'Full-time': 'bg-gray-50 text-gray-600 border-gray-200',
  Remote: 'bg-orange-50 text-orange-600 border-orange-200',
  Hybrid: 'bg-orange-50 text-orange-500 border-orange-200',
  'On-site': 'bg-gray-100 text-gray-600 border-gray-200',
}

const inferTags = (value?: string | null) => {
  if (!value) return []
  const tokens = value.toLowerCase().match(/[a-z][a-z0-9+#.-]{2,}/g) || []
  const stop = new Set(['the', 'and', 'for', 'with', 'you', 'your', 'this', 'that', 'are', 'from', 'will', 'our', 'job', 'role', 'team', 'have', 'not', 'but'])
  return [...new Set(tokens.filter(t => !stop.has(t)))].slice(0, 5).map(t => t[0].toUpperCase() + t.slice(1))
}

const makeLogo = (company?: string | null) =>
  (company || 'JB').split(' ').map(w => w[0] || '').join('').slice(0, 2).toUpperCase()

const mapSupabaseJob = (job: SupabaseJobRow, src: 'matched' | 'all'): Job => ({
  id: String(job.id || `${job.title}-${job.company}`),
  title: job.title || 'Untitled Role',
  company: job.company || 'Unknown Company',
  location: job.location || 'Location not specified',
  type: (job.location || '').toLowerCase().includes('remote') ? 'Remote' : 'Full-time',
  salary: 'Not specified',
  tags: inferTags(job.description),
  posted: 'Recently',
  logo: makeLogo(job.company),
  description: job.description || '',
  application_email: job.application_email || '',
  source: src,
})

// ── Component ─────────────────────────────────────────────────────────────────

export default function Jobs() {
  const { userId } = useUser()
  const navigate = useNavigate()

  const [matchedJobs, setMatchedJobs] = useState<Job[]>([])
  const [allJobs, setAllJobs] = useState<Job[]>([])
  const [allLoaded, setAllLoaded] = useState(false)
  const [loadingMatched, setLoadingMatched] = useState(false)
  const [loadingAll, setLoadingAll] = useState(false)

  const [activeTab, setActiveTab] = useState<SourceTab>('matched')
  const [query, setQuery] = useState('')
  const [locationF, setLocationF] = useState('all')
  const [typeF, setTypeF] = useState('all')
  const [selected, setSelected] = useState<string[]>([])
  const [saved, setSaved] = useState<string[]>([])

  // ── Fetch matched on mount ──────────────────────────────────────────────────
  useEffect(() => {
    if (!userId) { setLoadingMatched(false); return }
    setLoadingMatched(true)
    getProfileMatchedJobs(userId, 200)
      .then(rows => {
        const jobs = rows.map(r => mapSupabaseJob(r, 'matched'))
        setMatchedJobs(jobs)
        if (jobs.length === 0) {
          toast.info('No profile-matched jobs yet — showing all available jobs.', {
            description: 'Complete your profile & sync projects to get personalized matches.',
          })
          setActiveTab('all')
          fetchAllJobs()
        } else {
          toast.success(`${jobs.length} job${jobs.length !== 1 ? 's' : ''} matched to your profile.`)
        }
      })
      .catch(err => {
        console.error('getProfileMatchedJobs failed:', err)
        toast.error('Could not load matched jobs. Showing all jobs instead.')
        setActiveTab('all')
        fetchAllJobs()
      })
      .finally(() => setLoadingMatched(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  // ── Fetch all jobs ──────────────────────────────────────────────────────────
  const fetchAllJobs = async () => {
    if (allLoaded) return
    setLoadingAll(true)
    try {
      const rows = await getJobsFromSupabase(500)
      const jobs = rows.map(r => mapSupabaseJob(r, 'all'))
      setAllJobs(jobs)
      setAllLoaded(true)
      if (jobs.length === 0) {
        toast.info('No jobs in the database yet.')
      } else {
        toast.success(`${jobs.length} total job${jobs.length !== 1 ? 's' : ''} loaded.`)
      }
    } catch (err) {
      console.error('getJobsFromSupabase failed:', err)
      toast.error('Could not load all jobs from database.')
    } finally {
      setLoadingAll(false)
    }
  }

  const handleTabChange = (tab: SourceTab) => {
    setActiveTab(tab)
    setSelected([])
    if (tab === 'all' && !allLoaded) fetchAllJobs()
  }

  // ── Derived ─────────────────────────────────────────────────────────────────
  const activeJobs = activeTab === 'matched' ? matchedJobs : allJobs
  const isLoading = (activeTab === 'matched' && loadingMatched) || (activeTab === 'all' && loadingAll)

  const filtered = activeJobs.filter(j => {
    const q = query.toLowerCase()
    const matchQ = !query || j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.tags.some(t => t.toLowerCase().includes(q)) || (j.description || '').toLowerCase().includes(q)
    const matchL = locationF === 'all' || j.location.toLowerCase().includes(locationF.toLowerCase()) || (locationF === 'remote' && j.type === 'Remote')
    const matchT = typeF === 'all' || j.type === typeF
    return matchQ && matchL && matchT
  })

  const toggleSelect = (id: string) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
  const toggleSave   = (id: string) => setSaved(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
  const selectAll    = () => setSelected(filtered.length === selected.length ? [] : filtered.map(j => j.id))

  const handleBulkApply = () => {
    if (!selected.length) return toast.error('Select at least one job first!')
    navigate('/apply', { state: { selectedJobIds: selected, selectedJobs: activeJobs.filter(j => selected.includes(j.id)) } })
  }

  const tabs: { id: SourceTab; label: string; count: number; icon: React.ElementType; desc: string }[] = [
    { id: 'matched', label: 'Matched for You', count: matchedJobs.length, icon: Sparkles, desc: 'Based on your profile & projects' },
    { id: 'all',     label: 'All Jobs',         count: allJobs.length,     icon: Layers,   desc: 'Full database listing' },
  ]

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <Toaster />

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Jobs</h1>
          <p className="text-sm text-gray-500">
            Browse and select roles for bulk apply.{' '}
            <span className="text-orange-500 font-medium">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
            {query || locationF !== 'all' || typeF !== 'all' ? ' (filtered)' : ''}
          </p>
        </div>
        {selected.length > 0 && (
          <InteractiveHoverButton onClick={handleBulkApply} className="rounded-none gap-2 py-2 px-5 text-sm">
            <Zap className="w-4 h-4" /> Apply to {selected.length} Job{selected.length > 1 ? 's' : ''}
          </InteractiveHoverButton>
        )}
      </div>

      {/* Source tabs */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {tabs.map(({ id, label, count, icon: Icon, desc }) => {
          const active = activeTab === id
          const loading = (id === 'matched' && loadingMatched) || (id === 'all' && loadingAll)
          return (
            <button
              key={id}
              onClick={() => handleTabChange(id)}
              className={`flex items-start gap-3 p-4 border rounded-sm shadow-sm text-left transition-all ${
                active ? 'border-orange-400 bg-orange-50/50' : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50'
              }`}
            >
              <div className={`w-8 h-8 rounded-sm flex items-center justify-center shrink-0 mt-0.5 ${active ? 'bg-orange-500' : 'bg-gray-100'}`}>
                {loading
                  ? <Loader2 className="w-4 h-4 animate-spin text-white" />
                  : <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-gray-500'}`} />}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${active ? 'text-orange-600' : 'text-gray-700'}`}>{label}</span>
                  {count > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-sm font-medium ${active ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {count}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5 truncate">{desc}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 p-4 mb-5 flex flex-wrap gap-3 items-center rounded-sm shadow-sm">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input className="pl-9 rounded-sm" placeholder="Search title, company, skill…" value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <Select value={locationF} onValueChange={setLocationF}>
          <SelectTrigger className="w-44 rounded-sm">
            <MapPin className="w-4 h-4 text-gray-400 mr-1" /><SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="remote">Remote</SelectItem>
            <SelectItem value="Bangalore">Bangalore</SelectItem>
            <SelectItem value="Hyderabad">Hyderabad</SelectItem>
            <SelectItem value="Mumbai">Mumbai</SelectItem>
            <SelectItem value="Delhi">Delhi</SelectItem>
            <SelectItem value="Pune">Pune</SelectItem>
            <SelectItem value="San Francisco">San Francisco</SelectItem>
            <SelectItem value="New York">New York</SelectItem>
            <SelectItem value="Seattle">Seattle</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeF} onValueChange={setTypeF}>
          <SelectTrigger className="w-40 rounded-sm">
            <SlidersHorizontal className="w-4 h-4 text-gray-400 mr-1" /><SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Full-time">Full-time</SelectItem>
            <SelectItem value="Remote">Remote</SelectItem>
            <SelectItem value="Hybrid">Hybrid</SelectItem>
            <SelectItem value="On-site">On-site</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-3 ml-auto">
          <button onClick={selectAll} className="text-sm text-gray-500 font-medium hover:text-orange-500 transition-colors whitespace-nowrap">
            {selected.length > 0 && selected.length === filtered.length ? 'Deselect All' : 'Select All'}
          </button>
          {activeTab === 'all' && (
            <button
              onClick={() => { setAllLoaded(false); fetchAllJobs() }}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          )}
        </div>
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white border border-gray-200 rounded-sm p-5 animate-pulse">
              <div className="flex gap-4">
                <div className="w-5 h-5 bg-gray-200 rounded-sm mt-0.5 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded-sm w-3/4" />
                  <div className="h-3 bg-gray-100 rounded-sm w-1/2" />
                  <div className="h-3 bg-gray-100 rounded-sm w-2/3" />
                  <div className="flex gap-2 mt-2">
                    <div className="h-5 bg-gray-100 rounded-sm w-16" />
                    <div className="h-5 bg-gray-100 rounded-sm w-20" />
                    <div className="h-5 bg-gray-100 rounded-sm w-14" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Job grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filtered.map(job => {
            const isSelected = selected.includes(job.id)
            const isSaved    = saved.includes(job.id)
            return (
              <div
                key={job.id}
                onClick={() => toggleSelect(job.id)}
                className={`bg-white border p-5 transition-all duration-150 cursor-pointer rounded-sm shadow-sm ${
                  isSelected ? 'border-orange-400 bg-orange-50/50 shadow-orange-100' : 'border-gray-200 hover:border-gray-400 hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 shrink-0" onClick={e => { e.stopPropagation(); toggleSelect(job.id) }}>
                    {isSelected
                      ? <CheckSquare className="w-5 h-5 text-orange-500" />
                      : <Square className="w-5 h-5 text-gray-300" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-bold text-sm bg-orange-500 text-white px-2 py-0.5 rounded-sm shrink-0">{job.logo}</span>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate text-sm">{job.title}</h3>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                            <Building2 className="w-3 h-3 shrink-0" />
                            <span className="truncate">{job.company}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => toggleSave(job.id)}
                          className={`p-1.5 border rounded-sm transition-colors ${isSaved ? 'text-white bg-orange-500 border-orange-500' : 'text-gray-400 border-gray-200 hover:border-orange-400 hover:text-orange-500'}`}
                        >
                          <Bookmark className="w-3.5 h-3.5" fill={isSaved ? 'currentColor' : 'none'} />
                        </button>
                        {job.application_email && (
                          <a
                            href={`mailto:${job.application_email}`}
                            onClick={e => e.stopPropagation()}
                            className="p-1.5 border border-gray-200 rounded-sm text-gray-400 hover:border-gray-400 hover:text-gray-700 transition-colors"
                            title={`Email: ${job.application_email}`}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-2.5">
                      {job.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>}
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{job.posted}</span>
                      {job.salary !== 'Not specified' && <span className="font-medium text-gray-600">{job.salary}</span>}
                      {job.application_email && <span className="text-green-600 font-medium">Email available</span>}
                    </div>

                    {job.description && (
                      <p className="text-xs text-gray-500 mb-2.5 line-clamp-2 leading-relaxed">{job.description}</p>
                    )}

                    <div className="flex flex-wrap gap-1.5 items-center">
                      <Badge className={`text-xs font-medium border ${typeColors[job.type] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                        {job.type}
                      </Badge>
                      {job.source === 'matched' && (
                        <Badge className="text-xs bg-orange-50 text-orange-500 border-orange-200 font-medium">Matched</Badge>
                      )}
                      {job.tags.slice(0, 4).map((tag, i) => (
                        <Badge key={`${tag}-${i}`} className="text-xs bg-gray-50 text-gray-600 border-gray-200 font-medium">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-20 border border-gray-200 bg-white rounded-sm shadow-sm">
          {activeTab === 'matched' ? (
            <>
              <Sparkles className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="font-semibold text-gray-500">No profile-matched jobs found</p>
              <p className="text-sm text-gray-400 mt-1 max-w-xs mx-auto">Complete your profile and sync GitHub projects so we can match jobs to your skills.</p>
              <button onClick={() => handleTabChange('all')} className="mt-4 text-sm text-orange-500 font-medium hover:underline">
                Browse all jobs instead
              </button>
            </>
          ) : (
            <>
              <Search className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="font-semibold text-gray-500">No jobs match your filters</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search or clearing filters.</p>
            </>
          )}
        </div>
      )}

      {/* Floating selection bar */}
      {selected.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-sm shadow-xl flex items-center gap-4 z-40">
          <span className="text-sm font-medium">{selected.length} job{selected.length > 1 ? 's' : ''} selected</span>
          <InteractiveHoverButton onClick={handleBulkApply} className="rounded-none gap-2 py-1.5 px-4 text-sm">
            <Zap className="w-3.5 h-3.5" /> Apply Now
          </InteractiveHoverButton>
          <button onClick={() => setSelected([])} className="text-gray-400 hover:text-white text-sm transition-colors">Clear</button>
        </div>
      )}
    </div>
  )
}
