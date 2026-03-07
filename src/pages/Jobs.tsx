import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import {
  Search,
  MapPin,
  Building2,
  Clock,
  Bookmark,
  CheckSquare,
  Square,
  SlidersHorizontal,
  ExternalLink,
  Zap,
  Upload,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getProfileMatchedJobs, type SupabaseJobRow } from '@/lib/supabase'
import { useUser } from '@/context/UserContext'

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
}

const typeColors: Record<string, string> = {
  'Full-time': 'bg-gray-50 text-gray-600 border-gray-200',
  Remote: 'bg-orange-50 text-orange-600 border-orange-200',
  Hybrid: 'bg-orange-50 text-orange-500 border-orange-200',
  'On-site': 'bg-gray-100 text-gray-600 border-gray-200',
}

const normalizeHeader = (header: string) => header.trim().toLowerCase().replace(/[^a-z0-9]/g, '')

const parseCsvRows = (input: string): string[][] => {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < input.length; i++) {
    const char = input[i]
    if (char === '"') {
      const next = input[i + 1]
      if (inQuotes && next === '"') {
        field += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
      continue
    }
    if (char === ',' && !inQuotes) {
      row.push(field.trim())
      field = ''
      continue
    }
    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && input[i + 1] === '\n') i++
      row.push(field.trim())
      field = ''
      if (row.some(cell => cell.length > 0)) rows.push(row)
      row = []
      continue
    }
    field += char
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field.trim())
    if (row.some(cell => cell.length > 0)) rows.push(row)
  }

  return rows
}

const parseJobsFromCsv = (csvText: string): Job[] => {
  const rows = parseCsvRows(csvText)
  if (rows.length < 2) return []

  const headers = rows[0].map(normalizeHeader)
  const idx = (keys: string[]) => headers.findIndex(h => keys.includes(h))
  const titleIdx = idx(['title', 'jobtitle', 'role', 'position'])
  const companyIdx = idx(['company', 'companyname', 'employer'])
  const locationIdx = idx(['location', 'city', 'place'])
  const typeIdx = idx(['type', 'employmenttype', 'jobtype'])
  const salaryIdx = idx(['salary', 'compensation', 'pay', 'ctc'])
  const tagsIdx = idx(['tags', 'skills', 'techstack', 'stack'])
  const postedIdx = idx(['posted', 'postedat', 'date', 'posteddate'])
  const logoIdx = idx(['logo', 'icon', 'emoji'])
  const descriptionIdx = idx(['description', 'jobdescription', 'summary', 'details'])

  return rows
    .slice(1)
    .map((cells, index): Job | null => {
      const title = (titleIdx >= 0 ? cells[titleIdx] : '')?.trim()
      if (!title) return null
      const tagsRaw = (tagsIdx >= 0 ? cells[tagsIdx] : '') || ''
      return {
        id: String(1000 + index),
        title,
        company: (companyIdx >= 0 ? cells[companyIdx] : '')?.trim() || 'Unknown Company',
        location: (locationIdx >= 0 ? cells[locationIdx] : '')?.trim() || 'Location not specified',
        type: (typeIdx >= 0 ? cells[typeIdx] : '')?.trim() || 'Full-time',
        salary: (salaryIdx >= 0 ? cells[salaryIdx] : '')?.trim() || 'Not specified',
        tags: tagsRaw.split(/[|;,]/).map(tag => tag.trim()).filter(Boolean),
        posted: (postedIdx >= 0 ? cells[postedIdx] : '')?.trim() || 'Recently posted',
        logo: (logoIdx >= 0 ? cells[logoIdx] : '')?.trim() || 'JB',
        description: (descriptionIdx >= 0 ? cells[descriptionIdx] : '')?.trim() || '',
      }
    })
    .filter((job): job is Job => Boolean(job))
}

const makeFallbackId = (job: SupabaseJobRow) => `${job.title || 'job'}-${job.company || 'company'}-${job.location || 'location'}`.toLowerCase().replace(/[^a-z0-9]+/g, '-')

const inferTagsFromDescription = (value?: string | null) => {
  if (!value) return []
  const tokens = value
    .toLowerCase()
    .match(/[a-z][a-z0-9+#.-]{2,}/g) || []
  const stop = new Set(['the', 'and', 'for', 'with', 'you', 'your', 'this', 'that', 'are', 'from', 'will', 'our', 'job', 'role', 'team'])
  return [...new Set(tokens.filter(token => !stop.has(token)))].slice(0, 4).map(token => token[0].toUpperCase() + token.slice(1))
}

const mapSupabaseJob = (job: SupabaseJobRow): Job => ({
  id: String(job.id || makeFallbackId(job)),
  title: job.title || 'Untitled Role',
  company: job.company || 'Unknown Company',
  location: job.location || 'Location not specified',
  type: (job.location || '').toLowerCase().includes('remote') ? 'Remote' : 'Full-time',
  salary: 'Not specified',
  tags: inferTagsFromDescription(job.description),
  posted: 'Recently posted',
  logo: (job.company || 'UC').split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase(),
  description: job.description || '',
})

export default function Jobs() {
  const { userId } = useUser()
  const [query, setQuery] = useState('')
  const [locationF, setLocationF] = useState('all')
  const [typeF, setTypeF] = useState('all')
  const [selected, setSelected] = useState<string[]>([])
  const [saved, setSaved] = useState<string[]>([])
  const [csvFileName, setCsvFileName] = useState('')
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const csvInputRef = useRef<HTMLInputElement | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const loadJobs = async () => {
      if (!userId) {
        setJobs([])
        setLoading(false)
        return
      }
      try {
        const supabaseJobs = await getProfileMatchedJobs(userId, 200)
        setJobs(supabaseJobs.map(mapSupabaseJob))
        setSelected([])
        setSaved([])
        if (!supabaseJobs.length) {
          toast.info('No matched jobs found for your profile yet.', {
            description: 'Add/select more projects first so we can match jobs by your extracted skills.',
          })
        } else {
          toast.success(`Found ${supabaseJobs.length} profile-matched job(s).`)
        }
      } catch (error) {
        console.error('Failed to fetch jobs from Supabase:', error)
        toast.error('Could not load profile-matched jobs.')
      } finally {
        setLoading(false)
      }
    }
    void loadJobs()
  }, [userId])

  const filtered = jobs.filter(j => {
    const q = query.toLowerCase()
    const matchQ = !query || j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.tags.some(t => t.toLowerCase().includes(q)) || (j.description || '').toLowerCase().includes(q)
    const matchL = locationF === 'all' || j.location.toLowerCase().includes(locationF.toLowerCase()) || (locationF === 'remote' && j.type === 'Remote')
    const matchT = typeF === 'all' || j.type === typeF
    return matchQ && matchL && matchT
  })

  const toggleSelect = (id: string) => setSelected(p => (p.includes(id) ? p.filter(x => x !== id) : [...p, id]))
  const toggleSave = (id: string) => setSaved(p => (p.includes(id) ? p.filter(x => x !== id) : [...p, id]))
  const selectAll = () => setSelected(filtered.length === selected.length ? [] : filtered.map(j => j.id))

  const handleBulkApply = () => {
    if (!selected.length) return toast.error('Select at least one job first!')
    const selectedJobs = jobs.filter(job => selected.includes(job.id))
    navigate('/apply', { state: { selectedJobIds: selected, selectedJobs } })
  }

  const handleCsvUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const isCsv = file.name.toLowerCase().endsWith('.csv') || file.type === 'text/csv'
    if (!isCsv) return toast.error('Please upload a .csv file only.')
    try {
      const parsedJobs = parseJobsFromCsv(await file.text())
      if (!parsedJobs.length) return toast.error('No valid job rows found in the CSV.')
      setJobs(parsedJobs)
      setSelected([])
      setSaved([])
      setCsvFileName(file.name)
      toast.success(`Loaded ${parsedJobs.length} jobs from ${file.name}`)
    } catch {
      toast.error('Failed to parse CSV file.')
    }
  }

  return (
    <div className="p-8">
      <Toaster />
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Find Jobs</h1>
          <p className="text-sm text-gray-500">Browse and select jobs for bulk apply. <span className="text-orange-500 font-medium">{filtered.length} results</span></p>
        </div>
        <div className="flex items-center gap-3">
          <input ref={csvInputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleCsvUpload} />
          <button onClick={() => csvInputRef.current?.click()} className="flex items-center gap-2 border border-gray-200 bg-white text-gray-600 text-sm font-medium px-4 py-2 hover:border-gray-400 hover:text-gray-900 transition-all duration-200 rounded-sm shadow-sm">
            <Upload className="w-4 h-4" /> Upload CSV
          </button>
          {selected.length > 0 && (
            <InteractiveHoverButton onClick={handleBulkApply} className="rounded-none gap-2 py-2 px-5 text-sm">
              <Zap className="w-4 h-4" /> Apply to {selected.length} Job{selected.length > 1 ? 's' : ''}
            </InteractiveHoverButton>
          )}
        </div>
      </div>

      {loading && <p className="text-xs text-gray-500 mb-4 uppercase tracking-widest font-bold">Loading jobs from backend...</p>}
      {csvFileName && <p className="text-xs text-gray-500 -mt-5 mb-5 uppercase tracking-wider font-bold">CSV: <span className="text-black">{csvFileName}</span></p>}

      <div className="bg-white border border-gray-200 p-4 mb-6 flex flex-wrap gap-3 items-center rounded-sm shadow-sm">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input className="pl-9" placeholder="Search title, company, skill..." value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <Select value={locationF} onValueChange={setLocationF}>
          <SelectTrigger className="w-44"><MapPin className="w-4 h-4 text-gray-400 mr-1" /><SelectValue placeholder="Location" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="remote">Remote</SelectItem>
            <SelectItem value="San Francisco">San Francisco</SelectItem>
            <SelectItem value="New York">New York</SelectItem>
            <SelectItem value="Seattle">Seattle</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeF} onValueChange={setTypeF}>
          <SelectTrigger className="w-40"><SlidersHorizontal className="w-4 h-4 text-gray-400 mr-1" /><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Full-time">Full-time</SelectItem>
            <SelectItem value="Remote">Remote</SelectItem>
            <SelectItem value="Hybrid">Hybrid</SelectItem>
            <SelectItem value="On-site">On-site</SelectItem>
          </SelectContent>
        </Select>
        <button onClick={selectAll} className="text-sm text-gray-500 font-medium hover:text-orange-500 transition-colors whitespace-nowrap">{selected.length === filtered.length ? 'Deselect All' : 'Select All'}</button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filtered.map(job => {
          const isSelected = selected.includes(job.id)
          const isSaved = saved.includes(job.id)
          return (
            <div key={job.id} className={`bg-white border p-5 transition-all duration-200 cursor-pointer rounded-sm shadow-sm ${isSelected ? 'border-orange-400 bg-orange-50 shadow-orange-100' : 'border-gray-200 hover:border-gray-400 hover:shadow-md'}`} onClick={() => toggleSelect(job.id)}>
              <div className="flex items-start gap-4">
                <div className="mt-0.5 shrink-0" onClick={e => { e.stopPropagation(); toggleSelect(job.id) }}>
                  {isSelected ? <CheckSquare className="w-5 h-5 text-orange-500" /> : <Square className="w-5 h-5 text-gray-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm bg-orange-500 text-white px-2 py-0.5 rounded-sm shrink-0">{job.logo}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 truncate">{job.title}</h3>
                        <div className="flex items-center gap-1.5 text-sm text-gray-500"><Building2 className="w-3.5 h-3.5" /><span>{job.company}</span></div>
                      </div>
                    </div>
                    <div className="flex gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
                      <button onClick={() => toggleSave(job.id)} className={`p-1.5 border rounded-sm transition-colors ${isSaved ? 'text-white bg-orange-500 border-orange-500' : 'text-gray-400 border-gray-200 hover:border-orange-400 hover:text-orange-500'}`}><Bookmark className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} /></button>
                      <button className="p-1.5 border border-gray-200 rounded-sm text-gray-400 hover:border-gray-400 hover:text-gray-700 transition-colors"><ExternalLink className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{job.posted}</span>
                    <span className="font-medium text-gray-600">{job.salary}</span>
                  </div>
                  {job.description && <p className="text-xs text-gray-500 mb-3 line-clamp-2">{job.description}</p>}
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <Badge className={`text-xs font-medium border ${typeColors[job.type] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>{job.type}</Badge>
                    {job.tags.map((tag, idx) => <Badge key={`${tag}-${idx}`} className="text-xs bg-gray-50 text-gray-600 border-gray-200 font-medium">{tag}</Badge>)}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 border border-gray-200 bg-white rounded-sm shadow-sm">
          <Search className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p className="font-semibold text-gray-500">No jobs match your filters</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}
