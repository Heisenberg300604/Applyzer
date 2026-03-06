import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { Bell, CheckCircle, Clock, RefreshCw, Mail, AlertTriangle, X, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

type NotifType = 'reply' | 'followup' | 'info' | 'warning'

interface Notification {
    id: number
    type: NotifType
    title: string
    body: string
    company: string
    logo: string
    time: string
    read: boolean
}

const INITIAL_NOTIFS: Notification[] = [
    { id: 1, type: 'reply', title: 'Reply received from Google!', body: 'A recruiter at Google has replied to your application for Software Engineer. Check your Gmail to respond.', company: 'Google', logo: '🔵', time: '2h ago', read: false },
    { id: 2, type: 'reply', title: 'Reply received from Apple!', body: 'Good news! Your iOS Engineer application received a response from Apple\'s hiring team.', company: 'Apple', logo: '🍎', time: '5h ago', read: false },
    { id: 3, type: 'followup', title: 'Follow-up reminder: OpenAI', body: 'It has been 7 days since you applied to ML Engineer at OpenAI with no reply. Consider sending a follow-up.', company: 'OpenAI', logo: '🟢', time: '1d ago', read: false },
    { id: 4, type: 'followup', title: 'Follow-up reminder: AWS', body: 'No reply from AWS DevOps Engineer in 7 days. Applyzer can send an automated follow-up for you.', company: 'AWS', logo: '🟠', time: '2d ago', read: true },
    { id: 5, type: 'reply', title: 'Airbnb replied to your application', body: 'Your Data Engineer application at Airbnb received a positive response! Log in to Gmail to view the full email.', company: 'Airbnb', logo: '🏠', time: '2d ago', read: true },
    { id: 6, type: 'warning', title: 'Cloudflare email bounced', body: 'Your application email to Cloudflare bounced. The HR email address may be invalid. Please verify and retry.', company: 'Cloudflare', logo: '🔶', time: '3d ago', read: true },
    { id: 7, type: 'info', title: '5 new jobs matched your profile', body: 'Applyzer found 5 new roles matching your skills in Software Engineering and Go. Check Job Search to review.', company: '', logo: '🤖', time: '4d ago', read: true },
]

const typeMeta: Record<NotifType, { icon: React.ElementType; color: string; badge: string }> = {
    reply: { icon: Mail, color: 'bg-green-50 border-green-200', badge: 'bg-green-100 text-green-700 border-green-200' },
    followup: { icon: Clock, color: 'bg-amber-50 border-amber-200', badge: 'bg-amber-100 text-amber-700 border-amber-200' },
    info: { icon: Bell, color: 'bg-blue-50 border-blue-200', badge: 'bg-blue-100 text-blue-700 border-blue-200' },
    warning: { icon: AlertTriangle, color: 'bg-red-50 border-red-200', badge: 'bg-red-100 text-red-700 border-red-100' },
}

const typeLabel: Record<NotifType, string> = {
    reply: 'Reply',
    followup: 'Follow-up Needed',
    info: 'Info',
    warning: 'Warning',
}

export default function Notifications() {
    const [notifs, setNotifs] = useState<Notification[]>(INITIAL_NOTIFS)
    const [filter, setFilter] = useState<'all' | NotifType>('all')
    const navigate = useNavigate()

    const unread = notifs.filter(n => !n.read).length

    const filtered = notifs.filter(n => filter === 'all' || n.type === filter)

    const markRead = (id: number) => setNotifs(p => p.map(n => n.id === id ? { ...n, read: true } : n))
    const dismiss = (id: number) => setNotifs(p => p.filter(n => n.id !== id))
    const markAllRead = () => setNotifs(p => p.map(n => ({ ...n, read: true })))

    const handleFollowUp = (company: string) => {
        toast.success(`Follow-up email queued for ${company}!`, { description: 'Will be sent from your Gmail in a few seconds.' })
    }

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <Toaster />
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-1 flex items-center gap-2">
                        <Bell className="w-7 h-7 text-violet-600" /> Notifications
                        {unread > 0 && <Badge className="bg-violet-600 text-white border-0 text-xs ml-1">{unread}</Badge>}
                    </h1>
                    <p className="text-gray-500">Reply alerts, follow-up reminders, and system updates.</p>
                </div>
                {unread > 0 && (
                    <Button variant="outline" onClick={markAllRead} className="rounded-xl border-violet-200 text-violet-700 hover:bg-violet-50 gap-2 text-sm">
                        <CheckCircle className="w-4 h-4" /> Mark all read
                    </Button>
                )}
            </div>

            {/* Filter pills */}
            <div className="flex gap-2 flex-wrap mb-6">
                {(['all', 'reply', 'followup', 'warning', 'info'] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all
              ${filter === f
                                ? 'gradient-violet text-white shadow-md shadow-violet-200'
                                : 'bg-white border border-gray-200 text-gray-600 hover:border-violet-200 hover:text-violet-600'
                            }`}
                    >
                        {f === 'all' ? `All (${notifs.length})` : `${typeLabel[f]}s`}
                    </button>
                ))}
            </div>

            {/* Notification list */}
            <div className="space-y-3">
                {filtered.map(notif => {
                    const meta = typeMeta[notif.type]
                    const Icon = meta.icon
                    return (
                        <div
                            key={notif.id}
                            className={`bg-white rounded-2xl border p-5 shadow-sm transition-all ${notif.read ? 'border-gray-100 opacity-70' : `${meta.color} shadow-sm`}`}
                        >
                            <div className="flex gap-4">
                                {/* Icon */}
                                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white border border-current/10 flex items-center justify-center shadow-sm">
                                    <span className="text-xl">{notif.logo || '🤖'}</span>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className={`font-bold text-sm truncate ${notif.read ? 'text-gray-600' : 'text-gray-900'}`}>{notif.title}</h3>
                                        {!notif.read && <span className="w-2 h-2 rounded-full bg-violet-500 flex-shrink-0" />}
                                    </div>
                                    <div className="flex gap-2 mb-2">
                                        <Badge className={`text-xs border ${meta.badge}`}><Icon className="w-3 h-3 mr-1" />{typeLabel[notif.type]}</Badge>
                                        <span className="text-xs text-gray-400">{notif.time}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 leading-relaxed">{notif.body}</p>

                                    {/* Actions */}
                                    <div className="flex gap-2 mt-3">
                                        {notif.type === 'reply' && (
                                            <Button size="sm" className="gradient-violet text-white border-0 rounded-lg text-xs gap-1 h-7 px-3" onClick={() => navigate('/dashboard')}>
                                                <Mail className="w-3 h-3" /> View in Tracker
                                            </Button>
                                        )}
                                        {notif.type === 'followup' && (
                                            <Button size="sm" className="gradient-violet text-white border-0 rounded-lg text-xs gap-1 h-7 px-3" onClick={() => handleFollowUp(notif.company)}>
                                                <Zap className="w-3 h-3" /> Send Follow-up
                                            </Button>
                                        )}
                                        {notif.type === 'warning' && (
                                            <Button size="sm" variant="outline" className="rounded-lg text-xs gap-1 h-7 px-3 border-red-200 text-red-600" onClick={() => toast.info(`Retrying Cloudflare email...`)}>
                                                <RefreshCw className="w-3 h-3" /> Retry
                                            </Button>
                                        )}
                                        {!notif.read && (
                                            <Button size="sm" variant="ghost" onClick={() => markRead(notif.id)} className="rounded-lg text-xs h-7 px-3 text-gray-400 hover:text-gray-700">
                                                Mark read
                                            </Button>
                                        )}
                                        <Button size="sm" variant="ghost" onClick={() => dismiss(notif.id)} className="rounded-lg text-xs h-7 px-3 text-gray-300 hover:text-red-400 ml-auto">
                                            <X className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                    <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-3" />
                    <p className="font-bold text-gray-700 text-lg">All caught up!</p>
                    <p className="text-gray-400 text-sm">No notifications in this category.</p>
                </div>
            )}
        </div>
    )
}
