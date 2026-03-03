import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useUser } from '@/context/UserContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { Zap, CheckCircle, AlertCircle, Loader2, ArrowLeft, Sparkles, Mail, FileText, MessageSquare } from 'lucide-react'

const JOB_MAP: Record<number, { title: string; company: string; logo: string }> = {
    1: { title: 'Software Engineer', company: 'Google', logo: '🔵' },
    2: { title: 'ML Engineer', company: 'OpenAI', logo: '🟢' },
    3: { title: 'Frontend Engineer', company: 'Vercel', logo: '⚫' },
    4: { title: 'Backend Engineer', company: 'Stripe', logo: '💳' },
    5: { title: 'Data Engineer', company: 'Airbnb', logo: '🏠' },
    6: { title: 'Product Manager, AI', company: 'Meta', logo: '📘' },
    7: { title: 'DevOps Engineer', company: 'AWS', logo: '🟠' },
    8: { title: 'Full Stack Engineer', company: 'Notion', logo: '⬜' },
    9: { title: 'Security Engineer', company: 'Cloudflare', logo: '🔶' },
    10: { title: 'iOS Engineer', company: 'Apple', logo: '🍎' },
    11: { title: 'SRE', company: 'Netflix', logo: '🔴' },
    12: { title: 'Research Scientist', company: 'DeepMind', logo: '🧠' },
}

type Status = 'idle' | 'generating' | 'done' | 'error'
interface JobStatus { id: number; status: Status; step: string }

export default function Apply() {
    const { state } = useLocation()
    const navigate = useNavigate()
    const { userId } = useUser()

    const selectedIds: number[] = state?.selectedJobIds ?? []
    const [tone, setTone] = useState('professional')
    const [applyStatus, setApplyStatus] = useState<JobStatus[]>(
        selectedIds.map(id => ({ id, status: 'idle', step: '' }))
    )
    const [overall, setOverall] = useState<'idle' | 'running' | 'done'>('idle')
    const [progress, setProgress] = useState(0)

    const updateJobStatus = (id: number, patch: Partial<JobStatus>) =>
        setApplyStatus(p => p.map(j => j.id === id ? { ...j, ...patch } : j))

    const handleApply = async () => {
        if (!selectedIds.length) { toast.error('No jobs selected.'); return }
        if (!userId) { toast.error('Please log in first.'); return }

        setOverall('running')

        // Simulate sequential generation (replace with POST /api/v1/applications/bulk-apply)
        for (let i = 0; i < selectedIds.length; i++) {
            const id = selectedIds[i]
            updateJobStatus(id, { status: 'generating', step: 'Generating resume...' })
            await delay(900)
            updateJobStatus(id, { step: 'Writing cover letter...' })
            await delay(700)
            updateJobStatus(id, { step: 'Crafting cold email...' })
            await delay(600)
            updateJobStatus(id, { step: 'Sending via Gmail...' })
            await delay(500)
            updateJobStatus(id, { status: 'done', step: 'Sent!' })
            setProgress(Math.round(((i + 1) / selectedIds.length) * 100))
        }

        setOverall('done')
        toast.success('Applications sent!', { description: `Successfully applied to ${selectedIds.length} jobs.` })
    }

    if (!selectedIds.length) {
        return (
            <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
                <AlertCircle className="w-12 h-12 text-violet-300 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No Jobs Selected</h2>
                <p className="text-gray-500 mb-6">Go to Job Search and select the jobs you want to apply to.</p>
                <Button onClick={() => navigate('/jobs')} className="gradient-violet text-white border-0 rounded-xl">Browse Jobs</Button>
            </div>
        )
    }

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <Toaster />

            {/* Back */}
            <button onClick={() => navigate('/jobs')} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-6">
                <ArrowLeft className="w-4 h-4" /> Back to Job Search
            </button>

            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Bulk Apply</h1>
            <p className="text-gray-500 mb-8">Review your selections, configure settings, and let ApplyBot apply for you.</p>

            {/* Config card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4 text-violet-500" /> Application Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1.5">Email Tone</label>
                        <Select value={tone} onValueChange={setTone}>
                            <SelectTrigger className="rounded-xl border-gray-200"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="professional">Professional</SelectItem>
                                <SelectItem value="friendly">Friendly & Warm</SelectItem>
                                <SelectItem value="bold">Bold & Direct</SelectItem>
                                <SelectItem value="creative">Creative</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1.5">What AI Will Generate</label>
                        <div className="flex gap-2 flex-wrap">
                            {[
                                { icon: FileText, label: 'Resume PDF' },
                                { icon: Mail, label: 'Cover Letter' },
                                { icon: MessageSquare, label: 'Cold DM' },
                            ].map(({ icon: Icon, label }) => (
                                <div key={label} className="flex items-center gap-1.5 bg-violet-50 text-violet-700 rounded-lg px-3 py-1.5 text-xs font-semibold border border-violet-100">
                                    <Icon className="w-3.5 h-3.5" /> {label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress bar (while running) */}
            {overall === 'running' && (
                <div className="bg-violet-50 rounded-2xl border border-violet-100 p-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-violet-700">Applying... {progress}% done</span>
                        <Loader2 className="w-4 h-4 text-violet-500 animate-spin" />
                    </div>
                    <Progress value={progress} className="h-2 bg-violet-100" />
                </div>
            )}

            {/* Done summary */}
            {overall === 'done' && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <div>
                        <p className="font-bold text-green-800">All applications sent!</p>
                        <p className="text-sm text-green-600">Check your Application Tracker to monitor replies.</p>
                    </div>
                    <Button onClick={() => navigate('/dashboard')} variant="outline" className="ml-auto border-green-300 text-green-700 hover:bg-green-100 rounded-xl">
                        View Tracker
                    </Button>
                </div>
            )}

            {/* Selected jobs list */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-bold text-gray-900">Selected Jobs ({selectedIds.length})</h2>
                    <Badge className="bg-violet-100 text-violet-700 border-0">{tone} tone</Badge>
                </div>
                <div className="divide-y divide-gray-50">
                    {applyStatus.map(({ id, status, step }) => {
                        const job = JOB_MAP[id]
                        if (!job) return null
                        return (
                            <div key={id} className="flex items-center gap-4 px-5 py-4">
                                <span className="text-xl flex-shrink-0">{job.logo}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 text-sm truncate">{job.title}</p>
                                    <p className="text-xs text-gray-500">{job.company}</p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {status === 'idle' && <Badge variant="secondary" className="text-xs">Queued</Badge>}
                                    {status === 'generating' && (
                                        <div className="flex items-center gap-1.5 text-violet-600 text-xs font-medium">
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> {step}
                                        </div>
                                    )}
                                    {status === 'done' && <Badge className="bg-green-50 text-green-700 border-green-200 text-xs"><CheckCircle className="w-3 h-3 mr-1" />Sent</Badge>}
                                    {status === 'error' && <Badge className="bg-red-50 text-red-600 border-red-200 text-xs">Failed</Badge>}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Fire button */}
            <Button
                onClick={handleApply}
                disabled={overall !== 'idle'}
                className="w-full gradient-violet text-white border-0 rounded-xl h-14 text-lg font-bold shadow-xl shadow-violet-200 hover:opacity-90 transition-all flex items-center gap-3 justify-center disabled:opacity-60"
            >
                {overall === 'idle' && <><Zap className="w-5 h-5" /> Apply Now to {selectedIds.length} Jobs</>}
                {overall === 'running' && <><Loader2 className="w-5 h-5 animate-spin" /> Applying... {progress}%</>}
                {overall === 'done' && <><CheckCircle className="w-5 h-5" /> All Done!</>}
            </Button>
            <p className="text-xs text-center text-gray-400 mt-3">
                AI generation takes ~15–30 seconds per job. Emails will be sent from your connected Gmail account.
            </p>
        </div>
    )
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms))
