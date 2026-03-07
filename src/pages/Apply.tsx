import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useUser } from '@/context/UserContext'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { Zap, CheckCircle, AlertCircle, Loader2, ArrowLeft, Sparkles, Mail, FileText, MessageSquare } from 'lucide-react'
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button'
import { bulkApply } from '@/lib/api'

type Status = 'idle' | 'generating' | 'done' | 'error'
type SelectedJob = { id: string; title: string; company: string; logo?: string }
type JobStatus = { id: string; status: Status; step: string }

export default function Apply() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { userId } = useUser()

  const selectedIds: string[] = state?.selectedJobIds ?? []
  const selectedJobs: SelectedJob[] = state?.selectedJobs ?? []

  const [tone, setTone] = useState('professional')
  const [applyStatus, setApplyStatus] = useState<JobStatus[]>(selectedIds.map(id => ({ id, status: 'idle', step: '' })))
  const [overall, setOverall] = useState<'idle' | 'running' | 'done'>('idle')
  const [progress, setProgress] = useState(0)

  const updateJobStatus = (id: string, patch: Partial<JobStatus>) => {
    setApplyStatus(prev => prev.map(job => (job.id === id ? { ...job, ...patch } : job)))
  }

  const handleApply = async () => {
    if (!selectedIds.length) return toast.error('No jobs selected.')
    if (!userId) return toast.error('Please log in first.')

    setOverall('running')

    try {
      for (let i = 0; i < selectedIds.length; i++) {
        const id = selectedIds[i]
        updateJobStatus(id, { status: 'generating', step: 'Preparing application payload...' })
        setProgress(Math.max(10, Math.round(((i + 1) / selectedIds.length) * 35)))
      }

      const response = await bulkApply({
        profile_id: userId,
        job_ids: selectedIds,
        email_tone: tone,
        send_gap_minutes: 2,
      })

      for (let i = 0; i < selectedIds.length; i++) {
        const id = selectedIds[i]
        updateJobStatus(id, { status: 'done', step: 'Queued successfully' })
        setProgress(Math.round(((i + 1) / selectedIds.length) * 100))
      }

      setOverall('done')
      toast.success('Bulk apply started.', { description: response.message || `Batch ${response.batch_id}` })
    } catch (error) {
      console.error(error)
      for (const id of selectedIds) updateJobStatus(id, { status: 'error', step: 'Failed to queue' })
      setOverall('idle')
      toast.error('Bulk apply failed.', { description: error instanceof Error ? error.message.slice(0, 220) : 'Unknown error' })
    }
  }

  if (!selectedIds.length) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertCircle className="w-12 h-12 text-orange-500 mb-4" />
        <h2 className="text-2xl font-black text-black mb-2 uppercase tracking-tight">No Jobs Selected</h2>
        <p className="text-gray-500 mb-6 text-sm">Go to Job Search and select the jobs you want to apply to.</p>
        <InteractiveHoverButton onClick={() => navigate('/jobs')} className="rounded-none">Browse Jobs</InteractiveHoverButton>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Toaster />
      <button onClick={() => navigate('/jobs')} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Job Search
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Bulk Apply</h1>
      <p className="text-sm text-gray-500 mb-8">Review your selections, configure settings, and let Applyzer apply for you.</p>

      <div className="bg-white border border-gray-200 p-6 mb-6 rounded-sm shadow-sm">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm"><Sparkles className="w-4 h-4 text-orange-500" /> Application Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1.5 uppercase tracking-wider">Email Tone</label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="friendly">Friendly & Warm</SelectItem>
                <SelectItem value="bold">Bold & Direct</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1.5 uppercase tracking-wider">What AI Will Generate</label>
            <div className="flex gap-2 flex-wrap">
              {[{ icon: FileText, label: 'Resume PDF' }, { icon: Mail, label: 'Cover Letter' }, { icon: MessageSquare, label: 'Cold DM' }].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 bg-orange-50 text-orange-600 px-3 py-1.5 text-xs font-medium border border-orange-200 rounded-sm">
                  <Icon className="w-3.5 h-3.5" /> {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {overall === 'running' && (
        <div className="bg-orange-50 border border-orange-200 p-4 mb-6 rounded-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-orange-600">Applying... {progress}% done</span>
            <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />
          </div>
          <Progress value={progress} className="h-2 bg-orange-100" />
        </div>
      )}

      {overall === 'done' && (
        <div className="bg-gray-50 border border-gray-200 p-4 mb-6 flex items-center gap-3 rounded-sm">
          <CheckCircle className="w-6 h-6 text-orange-500 shrink-0" />
          <div>
            <p className="font-semibold text-gray-900 text-sm">Applications queued.</p>
            <p className="text-xs text-gray-500">Check your Application Tracker for updates.</p>
          </div>
          <button onClick={() => navigate('/dashboard')} className="ml-auto border border-orange-300 text-orange-600 hover:bg-orange-500 hover:text-white hover:border-orange-500 px-4 py-1.5 text-xs font-medium transition-all rounded-sm">View Tracker</button>
        </div>
      )}

      <div className="bg-white border border-gray-200 overflow-hidden mb-6 rounded-sm shadow-sm">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <h2 className="font-semibold text-gray-900 text-sm">Selected Jobs ({selectedIds.length})</h2>
          <Badge className="bg-orange-50 text-orange-600 border-orange-200 text-xs font-medium">{tone} tone</Badge>
        </div>
        <div className="divide-y divide-gray-100">
          {applyStatus.map(({ id, status, step }) => {
            const job = selectedJobs.find(row => row.id === id)
            return (
              <div key={id} className="flex items-center gap-4 px-5 py-4">
                <span className="font-bold text-xs bg-orange-500 text-white px-2 py-0.5 rounded-sm shrink-0">{job?.logo || 'JB'}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{job?.title || `Job ${id}`}</p>
                  <p className="text-xs text-gray-500">{job?.company || 'Unknown company'}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {status === 'idle' && <Badge className="text-xs bg-gray-50 text-gray-500 border-gray-200 font-medium">Queued</Badge>}
                  {status === 'generating' && <div className="flex items-center gap-1.5 text-orange-500 text-xs font-medium"><Loader2 className="w-3.5 h-3.5 animate-spin" /> {step}</div>}
                  {status === 'done' && <Badge className="bg-orange-50 text-orange-600 border-orange-200 text-xs font-medium"><CheckCircle className="w-3 h-3 mr-1" />Sent</Badge>}
                  {status === 'error' && <Badge className="bg-gray-100 text-gray-600 border-gray-200 text-xs font-medium">Failed</Badge>}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <InteractiveHoverButton
        onClick={handleApply}
        disabled={overall !== 'idle'}
        className="w-full gap-2 py-3 text-base font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {overall === 'idle' && <><Zap className="w-5 h-5" /> Apply Now to {selectedIds.length} Jobs</>}
        {overall === 'running' && <><Loader2 className="w-5 h-5 animate-spin" /> Applying... {progress}%</>}
        {overall === 'done' && <><CheckCircle className="w-5 h-5" /> All Done!</>}
      </InteractiveHoverButton>
    </div>
  )
}
