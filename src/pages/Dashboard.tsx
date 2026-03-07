import { useEffect, useMemo, useState } from 'react'
import { useUser as useClerkUser } from '@clerk/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { LayoutDashboard, Search, RefreshCw, TrendingUp, Mail, CheckCircle2, Clock, XCircle, Send, Eye, Loader2 } from 'lucide-react'
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
  Sent: { color: 'bg-blue-50 text-blue-700 border-blue-100', icon: Send },
  Replied: { color: 'bg-green-50 text-green-700 border-green-100', icon: CheckCircle2 },
  'No Reply': { color: 'bg-gray-50 text-gray-500 border-gray-100', icon: Clock },
  'Follow-up Sent': { color: 'bg-amber-50 text-amber-700 border-amber-100', icon: RefreshCw },
}

const emailConfig = {
  Delivered: 'bg-green-50 text-green-700 border-green-100',
  Pending: 'bg-yellow-50 text-yellow-600 border-yellow-100',
  Bounced: 'bg-red-50 text-red-600 border-red-100',
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
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1 flex items-center gap-2"><LayoutDashboard className="w-7 h-7 text-violet-600" /> Application Tracker</h1>
          <p className="text-gray-500">Monitor your sent applications, replies, and follow-ups.</p>
        </div>
        <Button variant="outline" onClick={() => void loadData()} className="border-violet-200 text-violet-700 hover:bg-violet-50 rounded-xl gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Applied', value: stats.total, color: 'bg-violet-50 border-violet-100', text: 'text-violet-700', icon: Send },
          { label: 'Replies Received', value: stats.replied, color: 'bg-green-50 border-green-100', text: 'text-green-700', icon: CheckCircle2 },
          { label: 'No Reply', value: stats.noReply, color: 'bg-gray-50 border-gray-100', text: 'text-gray-600', icon: Clock },
          { label: 'Reply Rate', value: `${replyRate}%`, color: 'bg-amber-50 border-amber-100', text: 'text-amber-700', icon: TrendingUp },
        ].map(({ label, value, color, text, icon: Icon }) => (
          <div key={label} className={`${color} border rounded-2xl p-5 shadow-sm`}>
            <div className="flex items-center justify-between mb-3"><span className="text-sm font-semibold text-gray-600">{label}</span><Icon className={`w-5 h-5 ${text}`} /></div>
            <p className={`text-3xl font-extrabold ${text}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input className="pl-9 rounded-xl border-gray-200" placeholder="Search company or role..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={statusF} onValueChange={setStatusF}>
          <SelectTrigger className="w-44 rounded-xl border-gray-200"><SelectValue placeholder="Filter status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Sent">Sent</SelectItem>
            <SelectItem value="Replied">Replied</SelectItem>
            <SelectItem value="No Reply">No Reply</SelectItem>
            <SelectItem value="Follow-up Sent">Follow-up Sent</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-400 font-medium">{filtered.length} results</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-500 flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading applications...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/60">
                <TableHead className="font-bold text-gray-700">Company</TableHead>
                <TableHead className="font-bold text-gray-700">Role</TableHead>
                <TableHead className="font-bold text-gray-700">Date Sent</TableHead>
                <TableHead className="font-bold text-gray-700">Email</TableHead>
                <TableHead className="font-bold text-gray-700">Reply Status</TableHead>
                <TableHead className="font-bold text-gray-700">Follow-ups</TableHead>
                <TableHead className="font-bold text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(app => {
                const sc = statusConfig[app.replyStatus]
                const Icon = sc.icon
                return (
                  <TableRow key={app.id} className="hover:bg-gray-50/60 transition-colors">
                    <TableCell><div className="flex items-center gap-2"><span className="text-xl">{app.logo}</span><span className="font-semibold text-gray-900">{app.company}</span></div></TableCell>
                    <TableCell className="text-gray-600 text-sm">{app.role}</TableCell>
                    <TableCell className="text-gray-500 text-sm">{app.dateSent}</TableCell>
                    <TableCell><Badge className={`text-xs border ${emailConfig[app.emailStatus]}`}><Mail className="w-3 h-3 mr-1" />{app.emailStatus}</Badge></TableCell>
                    <TableCell><Badge className={`text-xs border flex items-center gap-1 w-fit ${sc.color}`}><Icon className="w-3 h-3" />{app.replyStatus}</Badge></TableCell>
                    <TableCell className="text-center"><span className={`text-sm font-bold ${app.followUps > 0 ? 'text-amber-600' : 'text-gray-400'}`}>{app.followUps}</span></TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <button onClick={() => toast.info(`Checked application ${app.id}`)} className="p-1.5 rounded-lg hover:bg-violet-50 text-gray-400 hover:text-violet-600 transition-colors" title="Check for reply"><RefreshCw className="w-3.5 h-3.5" /></button>
                        <button className="p-1.5 rounded-lg hover:bg-violet-50 text-gray-400 hover:text-violet-600 transition-colors" title="View application"><Eye className="w-3.5 h-3.5" /></button>
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
            <p className="font-semibold">No applications match your filter</p>
          </div>
        )}
      </div>
    </div>
  )
}
