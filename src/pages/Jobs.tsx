import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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

type Job = {
  id: number
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

const MOCK_JOBS: Job[] = [
  { id: 1, title: 'Software Engineer', company: 'Google', location: 'Mountain View, CA', type: 'Full-time', salary: '$170K-$230K', tags: ['Python', 'Go', 'Kubernetes'], posted: '2h ago', logo: 'GO' },
  { id: 2, title: 'ML Engineer', company: 'OpenAI', location: 'San Francisco, CA', type: 'Full-time', salary: '$200K-$280K', tags: ['PyTorch', 'CUDA', 'LLMs'], posted: '5h ago', logo: 'OA' },
  { id: 3, title: 'Frontend Engineer', company: 'Vercel', location: 'Remote', type: 'Remote', salary: '$120K-$160K', tags: ['React', 'Next.js', 'TypeScript'], posted: '1d ago', logo: 'VE' },
  { id: 4, title: 'Backend Engineer', company: 'Stripe', location: 'New York, NY', type: 'Full-time', salary: '$160K-$210K', tags: ['Ruby', 'Go', 'Postgres'], posted: '2d ago', logo: 'ST' },
  { id: 5, title: 'Data Engineer', company: 'Airbnb', location: 'San Francisco, CA', type: 'Hybrid', salary: '$140K-$180K', tags: ['Spark', 'dbt', 'Airflow'], posted: '3d ago', logo: 'AB' },
  { id: 6, title: 'Product Manager, AI', company: 'Meta', location: 'Menlo Park, CA', type: 'Full-time', salary: '$180K-$250K', tags: ['AI/ML', 'Product Strategy', 'SQL'], posted: '4h ago', logo: 'ME' },
  { id: 7, title: 'DevOps Engineer', company: 'AWS', location: 'Seattle, WA', type: 'Full-time', salary: '$150K-$200K', tags: ['Terraform', 'Kubernetes', 'CI/CD'], posted: '6h ago', logo: 'AW' },
  { id: 8, title: 'Full Stack Engineer', company: 'Notion', location: 'Remote', type: 'Remote', salary: '$130K-$170K', tags: ['React', 'Node.js', 'Postgres'], posted: '1d ago', logo: 'NO' },
  { id: 9, title: 'Security Engineer', company: 'Cloudflare', location: 'Austin, TX', type: 'Hybrid', salary: '$140K-$190K', tags: ['Zero Trust', 'Rust', 'Python'], posted: '2d ago', logo: 'CF' },
  { id: 10, title: 'iOS Engineer', company: 'Apple', location: 'Cupertino, CA', type: 'On-site', salary: '$160K-$220K', tags: ['Swift', 'Objective-C', 'ARKit'], posted: '3d ago', logo: 'AP' },
  { id: 11, title: 'Site Reliability Engineer', company: 'Netflix', location: 'Los Gatos, CA', type: 'Full-time', salary: '$170K-$240K', tags: ['Java', 'Prometheus', 'Spinnaker'], posted: '5d ago', logo: 'NF' },
  { id: 12, title: 'Research Scientist', company: 'DeepMind', location: 'London, UK', type: 'Full-time', salary: 'GBP120K-GBP180K', tags: ['JAX', 'Reinforcement Learning', 'PhD'], posted: '1d ago', logo: 'DM' },
]

const typeColors: Record<string, string> = {
  'Full-time': 'bg-blue-50 text-blue-700 border-blue-100',
  Remote: 'bg-green-50 text-green-700 border-green-100',
  Hybrid: 'bg-amber-50 text-amber-700 border-amber-100',
  'On-site': 'bg-purple-50 text-purple-700 border-purple-100',
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

      const rawType = (typeIdx >= 0 ? cells[typeIdx] : 'Full-time')?.trim() || 'Full-time'
      const normalizedType = ['Full-time', 'Remote', 'Hybrid', 'On-site'].find(option => option.toLowerCase() === rawType.toLowerCase()) || rawType

      const tagsRaw = (tagsIdx >= 0 ? cells[tagsIdx] : '') || ''
      const tags = tagsRaw
        .split(/[|;,]/)
        .map(tag => tag.trim())
        .filter(Boolean)

      return {
        id: 1000 + index,
        title,
        company: (companyIdx >= 0 ? cells[companyIdx] : '')?.trim() || 'Unknown Company',
        location: (locationIdx >= 0 ? cells[locationIdx] : '')?.trim() || 'Location not specified',
        type: normalizedType,
        salary: (salaryIdx >= 0 ? cells[salaryIdx] : '')?.trim() || 'Not specified',
        tags,
        posted: (postedIdx >= 0 ? cells[postedIdx] : '')?.trim() || 'Recently posted',
        logo: (logoIdx >= 0 ? cells[logoIdx] : '')?.trim() || 'JB',
        description: (descriptionIdx >= 0 ? cells[descriptionIdx] : '')?.trim() || '',
      }
    })
    .filter((job): job is Job => Boolean(job))
}

export default function Jobs() {
  const [query, setQuery] = useState('')
  const [locationF, setLocationF] = useState('all')
  const [typeF, setTypeF] = useState('all')
  const [selected, setSelected] = useState<number[]>([])
  const [saved, setSaved] = useState<number[]>([])
  const [csvFileName, setCsvFileName] = useState('')
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS)
  const csvInputRef = useRef<HTMLInputElement | null>(null)
  const navigate = useNavigate()

  const filtered = jobs.filter(j => {
    const q = query.toLowerCase()
    const matchQ = !query
      || j.title.toLowerCase().includes(q)
      || j.company.toLowerCase().includes(q)
      || j.tags.some(t => t.toLowerCase().includes(q))
      || (j.description || '').toLowerCase().includes(q)

    const matchL = locationF === 'all' || j.location.toLowerCase().includes(locationF.toLowerCase()) || (locationF === 'remote' && j.type === 'Remote')
    const matchT = typeF === 'all' || j.type === typeF
    return matchQ && matchL && matchT
  })

  const toggleSelect = (id: number) => setSelected(p => (p.includes(id) ? p.filter(x => x !== id) : [...p, id]))
  const toggleSave = (id: number) => setSaved(p => (p.includes(id) ? p.filter(x => x !== id) : [...p, id]))
  const selectAll = () => setSelected(filtered.length === selected.length ? [] : filtered.map(j => j.id))

  const handleBulkApply = () => {
    if (!selected.length) {
      toast.error('Select at least one job first!')
      return
    }

    const selectedJobs = jobs.filter(job => selected.includes(job.id))
    navigate('/apply', { state: { selectedJobIds: selected, selectedJobs } })
  }

  const handleCsvUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const isCsv = file.name.toLowerCase().endsWith('.csv') || file.type === 'text/csv'
    if (!isCsv) {
      toast.error('Please upload a .csv file only.')
      e.target.value = ''
      return
    }

    try {
      const csvText = await file.text()
      const parsedJobs = parseJobsFromCsv(csvText)

      if (!parsedJobs.length) {
        toast.error('No valid job rows found in the CSV.')
        e.target.value = ''
        return
      }

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

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Find Jobs</h1>
          <p className="text-gray-500">
            Browse and select jobs for bulk apply. <span className="font-semibold text-violet-600">{filtered.length} results</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input ref={csvInputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleCsvUpload} />
          <Button variant="outline" className="rounded-xl border-gray-200 gap-2" onClick={() => csvInputRef.current?.click()}>
            <Upload className="w-4 h-4" />
            Upload CSV
          </Button>
          {selected.length > 0 && (
            <Button onClick={handleBulkApply} className="gradient-violet text-white border-0 rounded-xl shadow-lg shadow-violet-200 gap-2 animate-pulse-glow">
              <Zap className="w-4 h-4" />
              Apply to {selected.length} Job{selected.length > 1 ? 's' : ''}
            </Button>
          )}
        </div>
      </div>

      {csvFileName && (
        <p className="text-sm text-gray-500 -mt-3 mb-5">
          Selected CSV: <span className="font-medium text-gray-700">{csvFileName}</span>
        </p>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input className="pl-9 rounded-xl border-gray-200" placeholder="Search title, company, skill..." value={query} onChange={e => setQuery(e.target.value)} />
        </div>

        <Select value={locationF} onValueChange={setLocationF}>
          <SelectTrigger className="w-44 rounded-xl border-gray-200">
            <MapPin className="w-4 h-4 text-gray-400 mr-1" />
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="remote">Remote</SelectItem>
            <SelectItem value="San Francisco">San Francisco</SelectItem>
            <SelectItem value="New York">New York</SelectItem>
            <SelectItem value="Seattle">Seattle</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeF} onValueChange={setTypeF}>
          <SelectTrigger className="w-40 rounded-xl border-gray-200">
            <SlidersHorizontal className="w-4 h-4 text-gray-400 mr-1" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Full-time">Full-time</SelectItem>
            <SelectItem value="Remote">Remote</SelectItem>
            <SelectItem value="Hybrid">Hybrid</SelectItem>
            <SelectItem value="On-site">On-site</SelectItem>
          </SelectContent>
        </Select>

        <button onClick={selectAll} className="text-sm text-violet-600 font-semibold hover:underline whitespace-nowrap">
          {selected.length === filtered.length ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filtered.map(job => {
          const isSelected = selected.includes(job.id)
          const isSaved = saved.includes(job.id)

          return (
            <div
              key={job.id}
              className={`bg-white rounded-2xl border shadow-sm p-5 transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'border-violet-400 shadow-violet-100 bg-violet-50/30 ring-2 ring-violet-200'
                  : 'border-gray-100 hover:border-violet-200 hover:shadow-md hover:-translate-y-0.5'
              }`}
              onClick={() => toggleSelect(job.id)}
            >
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex-shrink-0" onClick={e => { e.stopPropagation(); toggleSelect(job.id) }}>
                  {isSelected ? <CheckSquare className="w-5 h-5 text-violet-600" /> : <Square className="w-5 h-5 text-gray-300" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl flex-shrink-0">{job.logo}</span>
                      <div>
                        <h3 className="font-bold text-gray-900 truncate">{job.title}</h3>
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>{job.company}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-1.5 flex-shrink-0" onClick={e => e.stopPropagation()}>
                      <button onClick={() => toggleSave(job.id)} className={`p-1.5 rounded-lg transition-colors ${isSaved ? 'text-violet-600 bg-violet-50' : 'text-gray-300 hover:text-violet-400'}`}>
                        <Bookmark className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
                      </button>
                      <button className="p-1.5 rounded-lg text-gray-300 hover:text-gray-500 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{job.posted}</span>
                    <span className="font-semibold text-green-600">{job.salary}</span>
                  </div>

                  {job.description && <p className="text-xs text-gray-500 mb-3 line-clamp-2">{job.description}</p>}

                  <div className="flex flex-wrap gap-1.5 items-center">
                    <Badge className={`text-xs font-semibold border ${typeColors[job.type] || ''}`}>{job.type}</Badge>
                    {job.tags.map((tag, idx) => (
                      <Badge key={`${tag}-${idx}`} variant="secondary" className="text-xs bg-gray-100 text-gray-600 border-0">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="font-semibold text-lg">No jobs match your filters</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}
