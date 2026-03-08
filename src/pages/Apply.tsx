import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useUser } from '@/context/UserContext'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { Zap, CheckCircle, AlertCircle, Loader2, ArrowLeft, Sparkles, Mail, FileText, MessageSquare, CheckSquare, Square, XCircle } from 'lucide-react'
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button'
import { quickApply, approveBatch, rejectBatch, type GeneratedApplicationInfo } from '@/lib/api.ts'
import { getProfileFromSupabase } from '@/lib/supabase'

type SelectedJob = { id: string; title: string; company: string; logo?: string; application_email?: string | null; description?: string | null; location?: string | null }
type Phase = 'configure' | 'generating' | 'review' | 'sending' | 'done'

export default function Apply() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { userId } = useUser()

  const selectedIds: string[] = state?.selectedJobIds ?? []
  const selectedJobs: SelectedJob[] = state?.selectedJobs ?? []

  const [tone, setTone] = useState('professional')
  const [phase, setPhase] = useState<Phase>('configure')
  const [progress, setProgress] = useState(0)

  // Review state
  const [batchId, setBatchId] = useState<string | null>(null)
  const [generatedDocs, setGeneratedDocs] = useState<GeneratedApplicationInfo[]>([])
  const [selectedApps, setSelectedApps] = useState<Set<string>>(new Set())
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())

  const missingEmailCount = selectedJobs.filter(j => !j.application_email).length;

  const handleGenerate = async () => {
    if (!selectedIds.length) return toast.error('No jobs selected.')
    if (!userId) return toast.error('Please log in first.')

    setPhase('generating')
    setProgress(15)

    try {
      // Fetch profile from Supabase to pass inline (backend PostgreSQL doesn't have it)
      const profile = await getProfileFromSupabase(userId)
      if (!profile?.full_name || !profile?.email) {
        setPhase('configure')
        return toast.error('Complete your profile first', { description: 'Go to /profile and save your name and email.' })
      }
      setProgress(35)

      const response = await quickApply({
        user_id: userId,
        jobs: selectedJobs.map(j => ({
          title: j.title,
          company: j.company,
          description: j.description || `${j.title} role at ${j.company}`,
          hr_email: j.application_email ?? undefined,
          location: j.location ?? 'Remote',
        })),
        send_gap_minutes: 2,
        profile_data: {
          ...profile,
          // Normalise key name Supabase uses 'experience', backend expects same
          primary_skills: profile.skills?.[0]?.items?.slice(0, 3) ?? [],
          extra_curricular: [],
          leadership: [],
        },
      })
      setProgress(100)

      setBatchId(response.batch_id)
      setGeneratedDocs(response.generated || [])

      // Auto-select valid applications
      const validIds = new Set<string>()
      response.generated?.forEach((doc: GeneratedApplicationInfo) => {
        if (doc.success && doc.hr_email && doc.application_id) {
          validIds.add(doc.application_id)
        }
      })
      setSelectedApps(validIds)

      setPhase('review')
    } catch (error) {
      console.error(error)
      setPhase('configure')
      toast.error('Document generation failed.', { description: error instanceof Error ? error.message : 'Unknown error' })
      setProgress(0)
    }
  }

  const availableToSelect = generatedDocs.filter(d => d.success && d.hr_email && d.application_id)

  const toggleAppSelection = (appId: string) => {
    const next = new Set(selectedApps)
    if (next.has(appId)) next.delete(appId)
    else next.add(appId)
    setSelectedApps(next)
  }

  const toggleSelectAll = () => {
    if (selectedApps.size === availableToSelect.length) {
      setSelectedApps(new Set())
    } else {
      setSelectedApps(new Set(availableToSelect.map(d => d.application_id!)))
    }
  }

  const toggleExpand = (id: string) => {
    const next = new Set(expandedCards)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setExpandedCards(next)
  }

  const handleApprove = async () => {
    if (!batchId) return
    if (selectedApps.size === 0) return toast.error('No applications selected to send.')

    setPhase('sending')
    try {
      // Reject any docs that were deliberately unchecked
      const uncheckedIds = availableToSelect
        .filter(d => !selectedApps.has(d.application_id!))
        .map(d => d.application_id!)

      if (uncheckedIds.length > 0) {
        await rejectBatch(batchId, { application_ids: uncheckedIds, reason: 'User deselected during review' })
      }

      // Approve selected docs to send asynchronously
      const approveRes = await approveBatch(batchId, {
        application_ids: Array.from(selectedApps),
        send_gap_minutes: 2
      })

      toast.success('Applications queued for sending', { description: approveRes.message })
      setPhase('done')
    } catch (error) {
      console.error(error)
      setPhase('review')
      toast.error('Failed to send applications', { description: error instanceof Error ? error.message : 'Unknown error' })
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
    <div className="p-8 max-w-4xl mx-auto">
      <Toaster />
      <button onClick={() => navigate('/jobs')} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Job Search
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Bulk Apply</h1>
      <p className="text-sm text-gray-500 mb-8 items-center gap-1 flex">
        {phase === 'configure' && 'Review your selections and generate customized documents.'}
        {phase === 'generating' && 'AI is crafting your resume, cover letter, and cold DM...'}
        {phase === 'review' && 'Review the generated documents and approve to send.'}
        {phase === 'sending' && 'Queueing emails for dispatch...'}
        {phase === 'done' && 'All applications have been processed and queued!'}
      </p>

      {/* PHASE: CONFIGURE */}
      {phase === 'configure' && (
        <>
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

          {missingEmailCount > 0 && (
            <div className="bg-orange-50 border border-orange-200 p-4 mb-6 rounded-sm flex gap-3 text-orange-800 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 text-orange-500" />
              <p><strong>Heads up:</strong> {missingEmailCount} selected job(s) do not have an application email listed. AI can generate documents for them, but won't be able to email the employer automatically.</p>
            </div>
          )}

          <div className="bg-white border border-gray-200 overflow-hidden mb-6 rounded-sm shadow-sm">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h2 className="font-semibold text-gray-900 text-sm">Selected Jobs ({selectedIds.length})</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {selectedJobs.map(job => (
                <div key={job.id} className="flex items-center gap-4 px-5 py-4">
                  <span className="font-bold text-xs bg-orange-500 text-white px-2 py-0.5 rounded-sm shrink-0">{job?.logo || 'JB'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{job?.title}</p>
                    <p className="text-xs text-gray-500">{job?.company}</p>
                  </div>
                  {job.application_email ? (
                    <div className="text-xs text-gray-500">{job.application_email}</div>
                  ) : (
                    <Badge className="text-xs bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-50 shadow-none font-medium">No Email</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          <InteractiveHoverButton
            onClick={handleGenerate}
            className="w-full gap-2 py-3 text-base font-semibold"
          >
            <Zap className="w-5 h-5" /> Generate Applications for {selectedIds.length} Jobs
          </InteractiveHoverButton>
        </>
      )}

      {/* PHASE: GENERATING */}
      {phase === 'generating' && (
        <div className="bg-white border border-gray-200 p-12 flex flex-col items-center justify-center rounded-sm text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-6" />
          <h2 className="text-2xl font-bold mb-2">Generating Applications...</h2>
          <p className="text-gray-500 max-w-md mb-6 text-sm">
            Please wait while AI researches each company, tailors your resume, writes cover letters, and composes cold emails.
          </p>
          <div className="w-full max-w-md">
            <Progress value={progress} className="h-2 bg-gray-100" />
            <p className="text-xs text-gray-400 mt-2">This typically takes 30–90 seconds. Do not close this page.</p>
          </div>
        </div>
      )}

      {/* PHASE: REVIEW */}
      {phase === 'review' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={toggleSelectAll} className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black">
                {selectedApps.size === availableToSelect.length ? <CheckSquare className="w-5 h-5 text-orange-500" /> : <Square className="w-5 h-5 text-gray-300" />}
                {selectedApps.size === availableToSelect.length ? 'Deselect All' : 'Select All Valid'}
              </button>
              <Badge className="bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 font-medium">
                {selectedApps.size} Selected
              </Badge>
            </div>
          </div>

          <div className="space-y-4 mb-24">
            {generatedDocs.map((doc, idx) => {
              const isSelected = doc.application_id ? selectedApps.has(doc.application_id) : false
              const canSelect = doc.success && !!doc.hr_email && !!doc.application_id
              const isExpanded = expandedCards.has(doc.application_id || doc.job_id)

              return (
                <div key={idx} className={`bg-white border rounded-sm overflow-hidden transition-colors ${isSelected ? 'border-orange-500 ring-1 ring-orange-500/20' : 'border-gray-200'} ${!canSelect ? 'opacity-70 bg-gray-50' : ''}`}>
                  <div className="p-4 flex gap-4 cursor-pointer" onClick={() => canSelect && doc.application_id && toggleAppSelection(doc.application_id)}>
                    <div className="pt-1">
                      {canSelect ? (
                        isSelected ? <CheckSquare className="w-5 h-5 text-orange-500" /> : <Square className="w-5 h-5 text-gray-300" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-semibold text-gray-900">{doc.job_title} <span className="text-gray-400 font-normal">@ {doc.company}</span></div>
                          <div className="text-sm text-gray-500 mt-0.5">{doc.hr_email || 'No email available'}</div>
                        </div>

                        <div className="flex items-center gap-2">
                          {!doc.success && <Badge className="bg-red-50 text-red-700 border-red-200 hover:bg-red-50 rounded-sm">Generation Failed</Badge>}
                          {doc.success && !doc.hr_email && <Badge className="bg-gray-200 text-gray-600 hover:bg-gray-200 border-none rounded-sm">No Email</Badge>}
                          {doc.success && doc.hr_email && <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50 rounded-sm">Ready</Badge>}
                        </div>
                      </div>

                      {doc.success && (
                        <div className="mt-3">
                          <div className="text-sm text-gray-700 font-medium mb-1">Subject: {doc.email_subject || '-'}</div>
                          <button onClick={(e) => { e.stopPropagation(); toggleExpand(doc.application_id || doc.job_id) }} className="text-xs text-orange-600 font-medium hover:underline mt-1">
                            {isExpanded ? 'Hide Details' : 'View Generated Content & Projects'}
                          </button>
                        </div>
                      )}

                      {!doc.success && doc.error && (
                        <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 border border-red-100 rounded-sm">
                          {doc.error}
                        </div>
                      )}
                    </div>
                  </div>

                  {isExpanded && doc.success && (
                    <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50 space-y-4">
                      {doc.selected_projects && doc.selected_projects.length > 0 && (
                        <div>
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Projects Highlighted</div>
                          <div className="flex flex-wrap gap-2">
                            {doc.selected_projects.map((p, i) => (
                              <Badge key={i} className="bg-white border-gray-200 text-gray-700 hover:bg-white">{p}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Email Preview</div>
                        <div className="bg-white border rounded-sm p-3 text-sm text-gray-700 whitespace-pre-wrap">
                          {doc.email_body_preview || 'No preview available.'}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Cover Letter Snippet</div>
                        <div className="bg-white border rounded-sm p-3 text-sm text-gray-700 whitespace-pre-wrap italic">
                          "{doc.cover_letter_preview || 'No preview available.'}"
                        </div>
                      </div>

                      <div className="flex gap-4 text-xs font-medium text-gray-500 mt-2">
                        <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> PDF Resume Generated</span>
                        <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Cover Letter TXT Generated</span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Sticky Bottom Bar */}
          <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-white border-t border-gray-200 shadow-[0_-4px_24px_-8px_rgba(0,0,0,0.1)] p-4 flex items-center justify-between z-10 px-8">
            <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
              <div className="text-sm font-medium text-gray-700">
                You are about to queue <span className="font-bold text-black">{selectedApps.size}</span> emails.
              </div>
              <div className="flex gap-3">
                <button onClick={() => navigate('/jobs')} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-sm transition-colors">
                  Cancel Action
                </button>
                <InteractiveHoverButton onClick={handleApprove} disabled={selectedApps.size === 0} className="px-6 py-2">
                  Send {selectedApps.size} Applications
                </InteractiveHoverButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PHASE: SENDING */}
      {phase === 'sending' && (
        <div className="bg-orange-50 border border-orange-200 p-8 flex flex-col items-center justify-center rounded-sm text-center">
          <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
          <h2 className="text-xl font-bold mb-2">Queueing Applications</h2>
          <p className="text-sm text-orange-700">Approving and scheduling your selected applications for delivery...</p>
        </div>
      )}

      {/* PHASE: DONE */}
      {phase === 'done' && (
        <div className="bg-green-50 border border-green-200 p-12 flex flex-col items-center justify-center rounded-sm text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mb-6" />
          <h2 className="text-3xl font-bold text-green-900 mb-4">You're All Set!</h2>
          <p className="text-green-700 max-w-md mb-8">
            Your {selectedApps.size} applications have been queued successfully. Emails will be dispatched in the background every 2 minutes.
          </p>
          <InteractiveHoverButton onClick={() => navigate('/dashboard')} className="rounded-none">
            View Application Tracker
          </InteractiveHoverButton>
        </div>
      )}
    </div>
  )
}
