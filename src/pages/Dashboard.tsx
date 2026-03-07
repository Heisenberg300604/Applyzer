import { useEffect, useMemo, useState } from 'react'
import { useUser as useClerkUser } from '@clerk/react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { Search, RefreshCw, TrendingUp, Mail, CheckCircle2, Clock, XCircle, Send, Eye, Loader2 } from 'lucide-react'
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button'
import { getApplications, getJobs, type ApiApplication, type ApiJob } from '@/lib/api'

type AppStatus = 'Sent' | 'Replied' | 'No Reply' | 'Follow-up Sent'
type EmailStatus = 'Delivered' | 'Bounced' | 'Pending'

type ApplicationRow = {
  id: string
  company: string
  logo: string
  role: string
  dateSent: string
  emailStatus: EmailStatus
  replyStatus: AppStatus
  followUps: number
}

const statusConfig: Record<AppStatus, { color: string; icon: React.ElementType }> = {
  Sent: { color: 'bg-gray-50 text-gray-600 border-gray-200', icon: Send },
  Replied: { color: 'bg-orange-50 text-orange-600 border-orange-200', icon: CheckCircle2 },
  'No Reply': { color: 'bg-gray-100 text-gray-500 border-gray-200', icon: Clock },
  'Follow-up Sent': { color: 'bg-orange-50 text-orange-500 border-orange-200', icon: RefreshCw },
}

const emailConfig = {
  Delivered: 'bg-orange-50 text-orange-600 border-orange-200',
  Pending: 'bg-gray-50 text-gray-500 border-gray-200',
  Bounced: 'bg-gray-100 text-gray-600 border-gray-200',
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

  const loadData = async () => {
    if (!user?.id) {
      setRows([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const [applications, jobs] = await Promise.all([
        getApplications({ user_id: user.id, limit: 200 }),
        getJobs({ limit: 300 }),
      ])

      const jobsById = new Map<string, ApiJob>(jobs.map(job => [job.id, job]))
      const mapped = applications.map((application): ApplicationRow => {
        const job = jobsById.get(application.job_id)
        return {
          id: application.id,
          company: job?.company || 'Unknown Company',
          logo: initials(job?.company || 'UC'),
          role: job?.title || 'Unknown Role',
          dateSent: formatDate(application.sent_at || application.created_at),
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
  const replyRate = stats.total ? Math.round((stats.replied / stats.total) * 100) : 0

  return (
    <div className="p-8">
      <Toaster />
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Application Tracker</h1>
          <p className="text-gray-500 text-sm">Monitor your sent applications, replies, and follow-ups.</p>
        </div>
        <InteractiveHoverButton onClick={() => void loadData()} className="rounded-none text-sm gap-2 px-5 py-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </InteractiveHoverButton>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Applied', value: stats.total, valueColor: 'text-orange-500', icon: Send },
          { label: 'Replies Received', value: stats.replied, valueColor: 'text-gray-900', icon: CheckCircle2 },
          { label: 'No Reply', value: stats.noReply, valueColor: 'text-gray-900', icon: Clock },
          { label: 'Reply Rate', value: `${replyRate}%`, valueColor: 'text-orange-500', icon: TrendingUp },
        ].map(({ label, value, valueColor, icon: Icon }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-sm p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
              <Icon className="w-4 h-4 text-gray-300" />
            </div>
            <p className={`text-3xl font-black ${valueColor}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 p-4 mb-0 flex flex-wrap gap-3 items-center rounded-t-sm border-b-0">
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
        <span className="text-xs text-gray-400 font-medium">{filtered.length} results</span>
      </div>

      <div className="bg-white border border-gray-200 overflow-hidden shadow-sm rounded-b-sm">
        {loading ? (
          <div className="py-16 text-center text-gray-500 flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading applications...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50 border-b border-gray-200">
                <TableHead className="font-semibold text-gray-500 uppercase tracking-wider text-xs">Company</TableHead>
                <TableHead className="font-semibold text-gray-500 uppercase tracking-wider text-xs">Role</TableHead>
                <TableHead className="font-semibold text-gray-500 uppercase tracking-wider text-xs">Date Sent</TableHead>
                <TableHead className="font-semibold text-gray-500 uppercase tracking-wider text-xs">Email</TableHead>
                <TableHead className="font-semibold text-gray-500 uppercase tracking-wider text-xs">Reply Status</TableHead>
                <TableHead className="font-semibold text-gray-500 uppercase tracking-wider text-xs">Follow-ups</TableHead>
                <TableHead className="font-semibold text-gray-500 uppercase tracking-wider text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(app => {
                const sc = statusConfig[app.replyStatus]
                const Icon = sc.icon
                return (
                  <TableRow key={app.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100">
                    <TableCell><div className="flex items-center gap-2"><span className="font-bold text-sm bg-orange-500 text-white px-2 py-0.5 rounded-sm">{app.logo}</span><span className="font-semibold text-gray-900">{app.company}</span></div></TableCell>
                    <TableCell className="text-gray-600 text-sm">{app.role}</TableCell>
                    <TableCell className="text-gray-400 text-sm">{app.dateSent}</TableCell>
                    <TableCell><Badge className={`text-xs border font-medium ${emailConfig[app.emailStatus]}`}><Mail className="w-3 h-3 mr-1" />{app.emailStatus}</Badge></TableCell>
                    <TableCell><Badge className={`text-xs border flex items-center gap-1 w-fit font-medium ${sc.color}`}><Icon className="w-3 h-3" />{app.replyStatus}</Badge></TableCell>
                    <TableCell className="text-center"><span className={`text-sm font-bold ${app.followUps > 0 ? 'text-orange-500' : 'text-gray-300'}`}>{app.followUps}</span></TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <button onClick={() => toast.info(`Checked application ${app.id}`)} className="p-1.5 border border-gray-200 hover:border-gray-400 text-gray-500 hover:text-gray-900 transition-colors rounded-sm" title="Check for reply"><RefreshCw className="w-3.5 h-3.5" /></button>
                        <button className="p-1.5 border border-gray-200 hover:border-gray-400 text-gray-500 hover:text-gray-900 transition-colors rounded-sm" title="View application"><Eye className="w-3.5 h-3.5" /></button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <XCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-semibold text-gray-500">No applications match your filter</p>
          </div>
        )}
      </div>
    </div>
  )
}
