import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
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
    reply: { icon: Mail, color: 'border-orange-300 bg-orange-50', badge: 'bg-orange-50 text-orange-600 border-orange-200' },
    followup: { icon: Clock, color: 'border-gray-200', badge: 'bg-gray-50 text-gray-600 border-gray-200' },
    info: { icon: Bell, color: 'border-gray-200', badge: 'bg-gray-50 text-gray-600 border-gray-200' },
    warning: { icon: AlertTriangle, color: 'border-amber-200 bg-amber-50', badge: 'bg-amber-50 text-amber-600 border-amber-200' },
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
            <div className="flex items-start justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                        <Bell className="w-6 h-6 text-orange-500" /> Notifications
                        {unread > 0 && <Badge className="bg-orange-500 text-white border-orange-500 text-xs font-medium ml-1">{unread}</Badge>}
                    </h1>
                    <p className="text-sm text-gray-500">Reply alerts, follow-up reminders, and system updates.</p>
                </div>
                {unread > 0 && (
                    <button onClick={markAllRead} className="flex items-center gap-2 border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-all shrink-0 rounded-sm shadow-sm">
                        <CheckCircle className="w-4 h-4" /> Mark all read
                    </button>
                )}
            </div>

            {/* Filter pills */}
            <div className="flex gap-2 flex-wrap mb-6">
                {(['all', 'reply', 'followup', 'warning', 'info'] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-1.5 text-xs font-medium rounded-full border transition-all
                            ${filter === f
                                ? 'bg-orange-500 text-white border-orange-500'
                                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900'
                            }`}
                    >
                        {f === 'all' ? `All (${notifs.length})` : typeLabel[f]}
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
                            className={`bg-white border p-5 rounded-sm shadow-sm transition-all ${notif.read ? 'border-gray-100 opacity-70' : meta.color}`}
                        >
                            <div className="flex gap-4">
                                {/* Icon */}
                                <div className="shrink-0 w-10 h-10 border border-gray-200 bg-white rounded-sm flex items-center justify-center">
                                    <span className="text-xl">{notif.logo || '🤖'}</span>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className={`font-semibold text-sm truncate ${notif.read ? 'text-gray-500' : 'text-gray-900'}`}>{notif.title}</h3>
                                        {!notif.read && <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />}
                                    </div>
                                    <div className="flex gap-2 mb-2">
                                        <Badge className={`text-xs border font-medium ${meta.badge}`}><Icon className="w-3 h-3 mr-1" />{typeLabel[notif.type]}</Badge>
                                        <span className="text-xs text-gray-400">{notif.time}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 leading-relaxed">{notif.body}</p>

                                    {/* Actions */}
                                    <div className="flex gap-2 mt-3 flex-wrap">
                                        {notif.type === 'reply' && (
                                            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1.5 bg-orange-500 text-white border border-orange-500 hover:bg-orange-600 px-3 py-1.5 text-xs font-medium rounded-sm transition-all">
                                                <Mail className="w-3 h-3" /> View in Tracker
                                            </button>
                                        )}
                                        {notif.type === 'followup' && (
                                            <button onClick={() => handleFollowUp(notif.company)} className="flex items-center gap-1.5 bg-orange-500 text-white border border-orange-500 hover:bg-orange-600 px-3 py-1.5 text-xs font-medium rounded-sm transition-all">
                                                <Zap className="w-3 h-3" /> Send Follow-up
                                            </button>
                                        )}
                                        {notif.type === 'warning' && (
                                            <button onClick={() => toast.info(`Retrying Cloudflare email...`)} className="flex items-center gap-1.5 border border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900 px-3 py-1.5 text-xs font-medium rounded-sm transition-all">
                                                <RefreshCw className="w-3 h-3" /> Retry
                                            </button>
                                        )}
                                        {!notif.read && (
                                            <button onClick={() => markRead(notif.id)} className="border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700 px-3 py-1.5 text-xs font-medium rounded-sm transition-all">
                                                Mark read
                                            </button>
                                        )}
                                        <button onClick={() => dismiss(notif.id)} className="flex items-center border border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-600 px-2.5 py-1.5 text-xs rounded-sm transition-all ml-auto">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-20 bg-white border border-gray-200 rounded-sm shadow-sm">
                    <CheckCircle className="w-12 h-12 text-orange-500 mx-auto mb-3" />
                    <p className="font-semibold text-gray-900 text-lg">All caught up!</p>
                    <p className="text-gray-400 text-sm mt-1">No notifications in this category.</p>
                </div>
            )}
        </div>
    )
}
