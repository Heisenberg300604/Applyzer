import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import {
    Search, MapPin, Building2, Clock, Bookmark,
    CheckSquare, Square, SlidersHorizontal, ExternalLink, Zap
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// ─── Mock job data (replace with GET /api/v1/jobs/search) ────────────────────
const MOCK_JOBS = [
    { id: 1, title: 'Software Engineer', company: 'Google', location: 'Mountain View, CA', type: 'Full-time', salary: '$170K–$230K', tags: ['Python', 'Go', 'Kubernetes'], posted: '2h ago', logo: '🔵' },
    { id: 2, title: 'ML Engineer', company: 'OpenAI', location: 'San Francisco, CA', type: 'Full-time', salary: '$200K–$280K', tags: ['PyTorch', 'CUDA', 'LLMs'], posted: '5h ago', logo: '🟢' },
    { id: 3, title: 'Frontend Engineer', company: 'Vercel', location: 'Remote', type: 'Remote', salary: '$120K–$160K', tags: ['React', 'Next.js', 'TypeScript'], posted: '1d ago', logo: '⚫' },
    { id: 4, title: 'Backend Engineer', company: 'Stripe', location: 'New York, NY', type: 'Full-time', salary: '$160K–$210K', tags: ['Ruby', 'Go', 'Postgres'], posted: '2d ago', logo: '💳' },
    { id: 5, title: 'Data Engineer', company: 'Airbnb', location: 'San Francisco, CA', type: 'Hybrid', salary: '$140K–$180K', tags: ['Spark', 'dbt', 'Airflow'], posted: '3d ago', logo: '🏠' },
    { id: 6, title: 'Product Manager, AI', company: 'Meta', location: 'Menlo Park, CA', type: 'Full-time', salary: '$180K–$250K', tags: ['AI/ML', 'Product Strategy', 'SQL'], posted: '4h ago', logo: '📘' },
    { id: 7, title: 'DevOps Engineer', company: 'AWS', location: 'Seattle, WA', type: 'Full-time', salary: '$150K–$200K', tags: ['Terraform', 'Kubernetes', 'CI/CD'], posted: '6h ago', logo: '🟠' },
    { id: 8, title: 'Full Stack Engineer', company: 'Notion', location: 'Remote', type: 'Remote', salary: '$130K–$170K', tags: ['React', 'Node.js', 'Postgres'], posted: '1d ago', logo: '⬜' },
    { id: 9, title: 'Security Engineer', company: 'Cloudflare', location: 'Austin, TX', type: 'Hybrid', salary: '$140K–$190K', tags: ['Zero Trust', 'Rust', 'Python'], posted: '2d ago', logo: '🔶' },
    { id: 10, title: 'iOS Engineer', company: 'Apple', location: 'Cupertino, CA', type: 'On-site', salary: '$160K–$220K', tags: ['Swift', 'Objective-C', 'ARKit'], posted: '3d ago', logo: '🍎' },
    { id: 11, title: 'Site Reliability Engineer', company: 'Netflix', location: 'Los Gatos, CA', type: 'Full-time', salary: '$170K–$240K', tags: ['Java', 'Prometheus', 'Spinnaker'], posted: '5d ago', logo: '🔴' },
    { id: 12, title: 'Research Scientist', company: 'DeepMind', location: 'London, UK', type: 'Full-time', salary: '£120K–£180K', tags: ['JAX', 'Reinforcement Learning', 'PhD'], posted: '1d ago', logo: '🧠' },
]

const typeColors: Record<string, string> = {
    'Full-time': 'bg-blue-50 text-blue-700 border-blue-100',
    'Remote': 'bg-green-50 text-green-700 border-green-100',
    'Hybrid': 'bg-amber-50 text-amber-700 border-amber-100',
    'On-site': 'bg-purple-50 text-purple-700 border-purple-100',
}

export default function Jobs() {
    const [query, setQuery] = useState('')
    const [locationF, setLocationF] = useState('all')
    const [typeF, setTypeF] = useState('all')
    const [selected, setSelected] = useState<number[]>([])
    const [saved, setSaved] = useState<number[]>([])
    const navigate = useNavigate()

    const filtered = MOCK_JOBS.filter(j => {
        const matchQ = !query || j.title.toLowerCase().includes(query.toLowerCase()) || j.company.toLowerCase().includes(query.toLowerCase()) || j.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
        const matchL = locationF === 'all' || j.location.toLowerCase().includes(locationF.toLowerCase()) || (locationF === 'remote' && j.type === 'Remote')
        const matchT = typeF === 'all' || j.type === typeF
        return matchQ && matchL && matchT
    })

    const toggleSelect = (id: number) =>
        setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
    const toggleSave = (id: number) =>
        setSaved(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
    const selectAll = () =>
        setSelected(filtered.length === selected.length ? [] : filtered.map(j => j.id))

    const handleBulkApply = () => {
        if (!selected.length) { toast.error('Select at least one job first!'); return }
        // Pass selected IDs to the apply page via state
        navigate('/apply', { state: { selectedJobIds: selected } })
    }

    return (
        <div className="p-8">
            <Toaster />
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Find Jobs</h1>
                    <p className="text-gray-500">Browse and select jobs for bulk apply. <span className="font-semibold text-violet-600">{filtered.length} results</span></p>
                </div>
                {selected.length > 0 && (
                    <Button onClick={handleBulkApply} className="gradient-violet text-white border-0 rounded-xl shadow-lg shadow-violet-200 gap-2 animate-pulse-glow">
                        <Zap className="w-4 h-4" />
                        Apply to {selected.length} Job{selected.length > 1 ? 's' : ''}
                    </Button>
                )}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-48">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input className="pl-9 rounded-xl border-gray-200" placeholder="Search title, company, skill..." value={query} onChange={e => setQuery(e.target.value)} />
                </div>
                <Select value={locationF} onValueChange={setLocationF}>
                    <SelectTrigger className="w-44 rounded-xl border-gray-200"><MapPin className="w-4 h-4 text-gray-400 mr-1" /><SelectValue placeholder="Location" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                        <SelectItem value="San Francisco">San Francisco</SelectItem>
                        <SelectItem value="New York">New York</SelectItem>
                        <SelectItem value="Seattle">Seattle</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={typeF} onValueChange={setTypeF}>
                    <SelectTrigger className="w-40 rounded-xl border-gray-200"><SlidersHorizontal className="w-4 h-4 text-gray-400 mr-1" /><SelectValue placeholder="Type" /></SelectTrigger>
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

            {/* Job Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {filtered.map(job => {
                    const isSelected = selected.includes(job.id)
                    const isSaved = saved.includes(job.id)
                    return (
                        <div
                            key={job.id}
                            className={`bg-white rounded-2xl border shadow-sm p-5 transition-all duration-200 cursor-pointer
                ${isSelected ? 'border-violet-400 shadow-violet-100 bg-violet-50/30 ring-2 ring-violet-200' : 'border-gray-100 hover:border-violet-200 hover:shadow-md hover:-translate-y-0.5'}`}
                            onClick={() => toggleSelect(job.id)}
                        >
                            <div className="flex items-start gap-4">
                                {/* Checkbox */}
                                <div className="mt-0.5 flex-shrink-0" onClick={e => { e.stopPropagation(); toggleSelect(job.id) }}>
                                    {isSelected ? <CheckSquare className="w-5 h-5 text-violet-600" /> : <Square className="w-5 h-5 text-gray-300" />}
                                </div>

                                {/* Logo + Info */}
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

                                    <div className="flex flex-wrap gap-1.5 items-center">
                                        <Badge className={`text-xs font-semibold border ${typeColors[job.type] || ''}`}>{job.type}</Badge>
                                        {job.tags.map(tag => (
                                            <Badge key={tag} variant="secondary" className="text-xs bg-gray-100 text-gray-600 border-0">{tag}</Badge>
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
