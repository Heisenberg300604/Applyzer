import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import {
    LayoutDashboard, Search, RefreshCw, TrendingUp,
    Mail, CheckCircle2, Clock, XCircle, Send, Eye
} from 'lucide-react'

type AppStatus = 'Sent' | 'Replied' | 'No Reply' | 'Follow-up Sent'

interface Application {
    id: number
    company: string
    logo: string
    role: string
    dateSent: string
    emailStatus: 'Delivered' | 'Bounced' | 'Pending'
    replyStatus: AppStatus
    followUps: number
}

const MOCK_APPS: Application[] = [
    { id: 1, company: 'Google', logo: '🔵', role: 'Software Engineer', dateSent: 'Mar 03, 2025', emailStatus: 'Delivered', replyStatus: 'Replied', followUps: 0 },
    { id: 2, company: 'OpenAI', logo: '🟢', role: 'ML Engineer', dateSent: 'Mar 03, 2025', emailStatus: 'Delivered', replyStatus: 'No Reply', followUps: 1 },
    { id: 3, company: 'Vercel', logo: '⚫', role: 'Frontend Engineer', dateSent: 'Mar 02, 2025', emailStatus: 'Delivered', replyStatus: 'Follow-up Sent', followUps: 2 },
    { id: 4, company: 'Stripe', logo: '💳', role: 'Backend Engineer', dateSent: 'Mar 02, 2025', emailStatus: 'Delivered', replyStatus: 'Sent', followUps: 0 },
    { id: 5, company: 'Airbnb', logo: '🏠', role: 'Data Engineer', dateSent: 'Mar 01, 2025', emailStatus: 'Delivered', replyStatus: 'Replied', followUps: 0 },
    { id: 6, company: 'Meta', logo: '📘', role: 'Product Manager, AI', dateSent: 'Mar 01, 2025', emailStatus: 'Pending', replyStatus: 'Sent', followUps: 0 },
    { id: 7, company: 'AWS', logo: '🟠', role: 'DevOps Engineer', dateSent: 'Feb 28, 2025', emailStatus: 'Delivered', replyStatus: 'No Reply', followUps: 1 },
    { id: 8, company: 'Notion', logo: '⬜', role: 'Full Stack Engineer', dateSent: 'Feb 28, 2025', emailStatus: 'Delivered', replyStatus: 'Follow-up Sent', followUps: 1 },
    { id: 9, company: 'Cloudflare', logo: '🔶', role: 'Security Engineer', dateSent: 'Feb 27, 2025', emailStatus: 'Bounced', replyStatus: 'No Reply', followUps: 0 },
    { id: 10, company: 'Apple', logo: '🍎', role: 'iOS Engineer', dateSent: 'Feb 27, 2025', emailStatus: 'Delivered', replyStatus: 'Replied', followUps: 0 },
]

const statusConfig: Record<AppStatus, { color: string; icon: React.ElementType }> = {
    'Sent': { color: 'bg-blue-50 text-blue-700 border-blue-100', icon: Send },
    'Replied': { color: 'bg-green-50 text-green-700 border-green-100', icon: CheckCircle2 },
    'No Reply': { color: 'bg-gray-50 text-gray-500 border-gray-100', icon: Clock },
    'Follow-up Sent': { color: 'bg-amber-50 text-amber-700 border-amber-100', icon: RefreshCw },
}

const emailConfig = {
    'Delivered': 'bg-green-50 text-green-700 border-green-100',
    'Pending': 'bg-yellow-50 text-yellow-600 border-yellow-100',
    'Bounced': 'bg-red-50 text-red-600 border-red-100',
}

export default function Dashboard() {
    const [search, setSearch] = useState('')
    const [statusF, setStatusF] = useState('all')

    const filtered = MOCK_APPS.filter(a => {
        const matchQ = !search || a.company.toLowerCase().includes(search.toLowerCase()) || a.role.toLowerCase().includes(search.toLowerCase())
        const matchS = statusF === 'all' || a.replyStatus === statusF
        return matchQ && matchS
    })

    const stats = {
        total: MOCK_APPS.length,
        replied: MOCK_APPS.filter(a => a.replyStatus === 'Replied').length,
        noReply: MOCK_APPS.filter(a => a.replyStatus === 'No Reply').length,
        sent: MOCK_APPS.filter(a => a.replyStatus === 'Sent').length,
    }
    const replyRate = Math.round((stats.replied / stats.total) * 100)

    const handleCheck = (id: number) => {
        toast.success(`Status checked for App #${id}`, { description: 'No new replies detected.' })
    }

    return (
        <div className="p-8">
            <Toaster />
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-1 flex items-center gap-2">
                        <LayoutDashboard className="w-7 h-7 text-violet-600" /> Application Tracker
                    </h1>
                    <p className="text-gray-500">Monitor your sent applications, replies, and follow-ups.</p>
                </div>
                <Button variant="outline" onClick={() => toast.info('Syncing with Google Sheets...')} className="border-violet-200 text-violet-700 hover:bg-violet-50 rounded-xl gap-2">
                    <RefreshCw className="w-4 h-4" /> Sync Tracker
                </Button>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total Applied', value: stats.total, color: 'bg-violet-50 border-violet-100', text: 'text-violet-700', icon: Send },
                    { label: 'Replies Received', value: stats.replied, color: 'bg-green-50 border-green-100', text: 'text-green-700', icon: CheckCircle2 },
                    { label: 'No Reply', value: stats.noReply, color: 'bg-gray-50 border-gray-100', text: 'text-gray-600', icon: Clock },
                    { label: 'Reply Rate', value: `${replyRate}%`, color: 'bg-amber-50 border-amber-100', text: 'text-amber-700', icon: TrendingUp },
                ].map(({ label, value, color, text, icon: Icon }) => (
                    <div key={label} className={`${color} border rounded-2xl p-5 shadow-sm`}>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-gray-600">{label}</span>
                            <Icon className={`w-5 h-5 ${text}`} />
                        </div>
                        <p className={`text-3xl font-extrabold ${text}`}>{value}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
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

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
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
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">{app.logo}</span>
                                            <span className="font-semibold text-gray-900">{app.company}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-gray-600 text-sm">{app.role}</TableCell>
                                    <TableCell className="text-gray-500 text-sm">{app.dateSent}</TableCell>
                                    <TableCell>
                                        <Badge className={`text-xs border ${emailConfig[app.emailStatus]}`}>
                                            <Mail className="w-3 h-3 mr-1" />{app.emailStatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`text-xs border flex items-center gap-1 w-fit ${sc.color}`}>
                                            <Icon className="w-3 h-3" />{app.replyStatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className={`text-sm font-bold ${app.followUps > 0 ? 'text-amber-600' : 'text-gray-400'}`}>
                                            {app.followUps}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            <button onClick={() => handleCheck(app.id)} className="p-1.5 rounded-lg hover:bg-violet-50 text-gray-400 hover:text-violet-600 transition-colors" title="Check for reply">
                                                <RefreshCw className="w-3.5 h-3.5" />
                                            </button>
                                            <button className="p-1.5 rounded-lg hover:bg-violet-50 text-gray-400 hover:text-violet-600 transition-colors" title="View application">
                                                <Eye className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>

                {filtered.length === 0 && (
                    <div className="text-center py-16 text-gray-400">
                        <XCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p className="font-semibold">No applications match your filter</p>
                    </div>
                )}
            </div>
        </div>
    )
}
