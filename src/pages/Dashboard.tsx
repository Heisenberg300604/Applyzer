import { useEffect, useMemo, useState } from 'react'
import { useUser as useClerkUser } from '@clerk/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Toaster } from '@/components/ui/sonner'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Search, RefreshCw, Mail, CheckCircle2, Clock, XCircle, Send, Eye, Loader2, Reply, Bot, Copy } from 'lucide-react'
import { AnimatedDashboardCard } from '@/components/ui/animated-dashboard-card'
import { checkRepliesManual, generateFollowupEmail, getApplications, getJobs, sendAutoFollowups, type ApiApplication, type ApiJob, type FollowUpResponse } from '@/lib/api'

type AppStatus = 'Sent' | 'Replied' | 'No Reply' | 'Follow-up Sent'
type EmailStatus = 'Delivered' | 'Bounced' | 'Pending'

type ApplicationRow = {
  id: string
  jobId: string
  company: string
  logo: string
  role: string
  dateSent: string
  sentAtRaw: string
  emailStatus: EmailStatus
  replyStatus: AppStatus
  followUps: number
}

const statusConfig: Record<AppStatus, { color: string; icon: React.ElementType }> = {
  Sent: { color: 'bg-slate-100 text-slate-700 border-slate-200', icon: Send },
  Replied: { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircle2 },
  'No Reply': { color: 'bg-amber-100 text-amber-800 border-amber-200', icon: Clock },
  'Follow-up Sent': { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: RefreshCw },
}

const emailConfig = {
  Delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Pending: 'bg-amber-100 text-amber-800 border-amber-200',
  Bounced: 'bg-rose-100 text-rose-800 border-rose-200',
}

const initials = (value: string) => value.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()

const toReplyStatus = (application: ApiApplication): AppStatus => {
  const status = String(application.status || '').toLowerCase()
  if (application.reply_received || status.includes('replied')) return 'Replied'
  if (application.followup_count > 0 || status.includes('follow')) return 'Follow-up Sent'
  if (status.includes('sent') || status.includes('submitted')) return 'Sent'
  return 'No Reply'
}

const toEmailStatus = (application: ApiApplication): EmailStatus => {
  const status = String(application.status || '').toLowerCase()
  if (status.includes('bounce') || status.includes('failed')) return 'Bounced'
  if (status.includes('pending') || status.includes('queue')) return 'Pending'
  return 'Delivered'
}

const formatDate = (value?: string | null) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function Dashboard() {
  const { user } = useClerkUser()
  const [search, setSearch] = useState('')
  const [statusF, setStatusF] = useState('all')
  const [loading, setLoading] = useState(true)
  const [rows, setRows] = useState<ApplicationRow[]>([])
  const [manualFollowupLoadingId, setManualFollowupLoadingId] = useState<string | null>(null)
  const [autoFollowupLoading, setAutoFollowupLoading] = useState(false)
  const [checkRepliesLoading, setCheckRepliesLoading] = useState(false)
  const [followupPreview, setFollowupPreview] = useState<(FollowUpResponse & { jobTitle: string; company: string }) | null>(null)

  const loadData = async () => {
    if (!user?.id) {
      setRows([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const [applications, jobs] = await Promise.all([
        getApplications({ user_id: user.id, limit: 100 }),
        getJobs({ limit: 100 }),
      ])

      const jobsById = new Map<string, ApiJob>(jobs.map(job => [job.id, job]))
      const mapped = applications.map((application): ApplicationRow => {
        const job = jobsById.get(application.job_id)
        return {
          id: application.id,
          jobId: application.job_id,
          company: job?.company || 'Unknown Company',
          logo: initials(job?.company || 'UC'),
          role: job?.title || 'Unknown Role',
          dateSent: formatDate(application.sent_at || application.created_at),
          sentAtRaw: application.sent_at || application.created_at,
          emailStatus: toEmailStatus(application),
          replyStatus: toReplyStatus(application),
          followUps: application.followup_count || 0,
        }
      })

      setRows(mapped)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      toast.error('Could not load dashboard data from backend.')
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [user?.id])

  const filtered = useMemo(() => rows.filter(a => {
    const matchQ = !search || a.company.toLowerCase().includes(search.toLowerCase()) || a.role.toLowerCase().includes(search.toLowerCase())
    const matchS = statusF === 'all' || a.replyStatus === statusF
    return matchQ && matchS
  }), [rows, search, statusF])

  const stats = {
    total: rows.length,
    replied: rows.filter(a => a.replyStatus === 'Replied').length,
    noReply: rows.filter(a => a.replyStatus === 'No Reply').length,
    sent: rows.filter(a => a.replyStatus === 'Sent').length,
  }

  const daysSince = (value: string) => {
    const time = new Date(value).getTime()
    if (Number.isNaN(time)) return 3
    const diff = Date.now() - time
    return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)))
  }

  const handleManualFollowup = async (app: ApplicationRow) => {
    setManualFollowupLoadingId(app.id)
    try {
      const response = await generateFollowupEmail({
        original_subject: `Re: ${app.role} at ${app.company}`,
        job_title: app.role,
        company_name: app.company,
        followup_count: app.followUps + 1,
        user_name: user?.fullName || 'Candidate',
        days_since_sent: daysSince(app.sentAtRaw),
      })
      setFollowupPreview({ ...response, jobTitle: app.role, company: app.company })
    } catch (error) {
      console.error(error)
      toast.error('Failed to generate manual follow-up.', { description: error instanceof Error ? error.message.slice(0, 180) : 'Unknown error' })
    } finally {
      setManualFollowupLoadingId(null)
    }
  }

  const handleAutoFollowups = async () => {
    setAutoFollowupLoading(true)
    try {
      const response = await sendAutoFollowups()
      toast.success('Automatic follow-up generation triggered.', { description: response?.message || 'Backend accepted the request.' })
      await loadData()
    } catch (error) {
      console.error(error)
      toast.error('Auto follow-up trigger failed.', { description: error instanceof Error ? error.message.slice(0, 180) : 'Unknown error' })
    } finally {
      setAutoFollowupLoading(false)
    }
  }

  const handleCheckReplies = async () => {
    setCheckRepliesLoading(true)
    try {
      const response = await checkRepliesManual()
      toast.success('Reply check completed.', { description: response?.message || 'Backend scanned inbox replies.' })
      await loadData()
    } catch (error) {
      console.error(error)
      toast.error('Reply check failed.', { description: error instanceof Error ? error.message.slice(0, 180) : 'Unknown error' })
    } finally {
      setCheckRepliesLoading(false)
    }
  }

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen">
      <Toaster />
      <div className="mb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <CardTitle className="text-2xl">Application Tracker</CardTitle>
            <CardDescription>Monitor sent applications, incoming replies, and follow-backs.</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleCheckReplies} disabled={checkRepliesLoading}>
              {checkRepliesLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} Check Replies
            </Button>
            <Button variant="outline" onClick={handleAutoFollowups} disabled={autoFollowupLoading}>
              {autoFollowupLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />} Auto Followbacks
            </Button>
            <Button variant="default" onClick={() => void loadData()}>
              <RefreshCw className="w-4 h-4" /> Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Animated Dashboard Card - Takes 1 column */}
        <div className="lg:col-span-1 h-80">
          <AnimatedDashboardCard
            leftLabel="Total Applied"
            rightLabel="Replies Received"
            leftValue={stats.total}
            rightValue={stats.replied}
            leftDotColor="#f97316"
            rightDotColor="#0a0a0a"
          />
        </div>

        {/* Banner Image - Takes 2 columns */}
        <div className="lg:col-span-2 h-80 bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg">
          <img
            src="/dashbanner.png"
            alt="Application Dashboard Banner"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-4 flex flex-wrap gap-3 items-center rounded-t-xl border-b-0">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input className="pl-9" placeholder="Search company or role..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={statusF} onValueChange={setStatusF}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Filter status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Sent">Sent</SelectItem>
            <SelectItem value="Replied">Replied</SelectItem>
            <SelectItem value="No Reply">No Reply</SelectItem>
            <SelectItem value="Follow-up Sent">Follow-up Sent</SelectItem>
          </SelectContent>
        </Select>
        <Badge variant="outline" className="text-xs">{filtered.length} results</Badge>
      </div>

      <div className="bg-white border border-gray-200 overflow-hidden shadow-sm rounded-b-xl">
        {loading ? (
          <div className="py-20 text-center text-gray-500 flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading applications...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-gray-200">
                <TableHead className="font-medium text-muted-foreground text-xs">Company</TableHead>
                <TableHead className="font-medium text-muted-foreground text-xs">Role</TableHead>
                <TableHead className="font-medium text-muted-foreground text-xs">Date Sent</TableHead>
                <TableHead className="font-medium text-muted-foreground text-xs">Email</TableHead>
                <TableHead className="font-medium text-muted-foreground text-xs">Reply Status</TableHead>
                <TableHead className="font-medium text-muted-foreground text-xs">Follow-ups</TableHead>
                <TableHead className="font-medium text-muted-foreground text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(app => {
                const sc = statusConfig[app.replyStatus]
                const Icon = sc.icon
                return (
                  <TableRow key={app.id} className="hover:bg-slate-50 transition-colors border-b border-gray-100">
                    <TableCell><div className="flex items-center gap-2.5"><span className="font-semibold text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded">{app.logo}</span><span className="font-medium text-gray-900">{app.company}</span></div></TableCell>
                    <TableCell className="text-gray-600 text-sm">{app.role}</TableCell>
                    <TableCell className="text-gray-400 text-sm">{app.dateSent}</TableCell>
                    <TableCell><Badge className={`text-xs rounded-full border font-medium ${emailConfig[app.emailStatus]}`}><Mail className="w-3 h-3 mr-1" />{app.emailStatus}</Badge></TableCell>
                    <TableCell><Badge className={`text-xs rounded-full border flex items-center gap-1 w-fit font-medium ${sc.color}`}><Icon className="w-3 h-3" />{app.replyStatus}</Badge></TableCell>
                    <TableCell className="text-center"><span className={`text-sm font-semibold ${app.followUps > 0 ? 'text-slate-700' : 'text-gray-300'}`}>{app.followUps}</span></TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon-sm" onClick={() => toast.info(`Checked application ${app.id}`)} className="text-gray-500" title="Check for reply"><RefreshCw className="w-3.5 h-3.5" /></Button>
                        <button
                          onClick={() => void handleManualFollowup(app)}
                          disabled={manualFollowupLoadingId === app.id || app.replyStatus !== 'Replied'}
                          className="p-2 rounded-md hover:bg-accent text-gray-500 hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          title={app.replyStatus === 'Replied' ? 'Generate manual follow-back' : 'Manual follow-back available after reply'}
                        >
                          {manualFollowupLoadingId === app.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Reply className="w-3.5 h-3.5" />}
                        </button>
                        <Button variant="ghost" size="icon-sm" className="text-gray-500" title="View application"><Eye className="w-3.5 h-3.5" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <XCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-semibold text-gray-500">No applications match your filter</p>
          </div>
        )}
      </div>

      <Dialog open={!!followupPreview} onOpenChange={open => { if (!open) setFollowupPreview(null) }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manual Follow-back Draft</DialogTitle>
            <DialogDescription>
              Review this follow-back for {followupPreview?.jobTitle} at {followupPreview?.company}, then send it manually.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Subject</p>
              <div className="border border-gray-200 rounded-md p-3 text-sm bg-gray-50">{followupPreview?.subject || ''}</div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Body</p>
              <textarea readOnly value={followupPreview?.body || ''} className="w-full h-52 border border-gray-200 rounded-md p-3 text-sm bg-gray-50" />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                if (!followupPreview) return
                navigator.clipboard.writeText(`Subject: ${followupPreview.subject}\n\n${followupPreview.body}`)
                toast.success('Follow-back copied to clipboard.')
              }}
            >
              <Copy className="w-4 h-4" /> Copy Follow-back
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
