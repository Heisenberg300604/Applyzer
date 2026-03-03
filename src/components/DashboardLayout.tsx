import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useUser } from '@/context/UserContext'
import {
    Bot, LayoutDashboard, User, Briefcase, Zap,
    FileText, Bell, LogOut, ChevronRight
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
    DropdownMenu, DropdownMenuContent,
    DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/profile', icon: User, label: 'My Profile' },
    { to: '/jobs', icon: Briefcase, label: 'Find Jobs' },
    { to: '/apply', icon: Zap, label: 'Bulk Apply' },
    { to: '/resume', icon: FileText, label: 'Resume & CL' },
    { to: '/notifications', icon: Bell, label: 'Notifications', badge: '3' },
]

export default function DashboardLayout() {
    const { userId, logout } = useUser()
    const navigate = useNavigate()

    const handleLogout = () => { logout(); navigate('/') }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed inset-y-0 left-0 z-40 shadow-sm">
                {/* Logo */}
                <div className="flex items-center gap-2 px-5 h-16 border-b border-gray-100">
                    <div className="w-8 h-8 rounded-lg gradient-violet flex items-center justify-center shadow">
                        <Bot className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-extrabold text-gray-900">Apply<span className="text-gradient-violet">Bot</span></span>
                </div>

                {/* Nav */}
                <nav className="flex-1 py-6 px-3 space-y-1">
                    {navItems.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === '/dashboard'}
                            className={({ isActive }) => cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                                isActive
                                    ? 'bg-violet-600 text-white shadow-md shadow-violet-200'
                                    : 'text-gray-500 hover:bg-violet-50 hover:text-violet-700'
                            )}
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon className={cn('w-4 h-4', isActive ? 'text-white' : 'text-gray-400')} />
                                    <span className="flex-1">{item.label}</span>
                                    {item.badge && (
                                        <Badge className={cn('text-xs px-1.5 py-0', isActive ? 'bg-white/30 text-white' : 'bg-violet-100 text-violet-700')}>
                                            {item.badge}
                                        </Badge>
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* User footer */}
                <div className="px-4 py-4 border-t border-gray-100">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-3 w-full hover:bg-gray-50 rounded-xl p-2 transition-colors group">
                                <Avatar className="w-8 h-8">
                                    <AvatarFallback className="bg-violet-100 text-violet-700 text-xs font-bold">
                                        {userId ? `U${userId}` : 'AB'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 text-left min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">User #{userId || '—'}</p>
                                    <p className="text-xs text-gray-400">applybot account</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 gap-2">
                                <LogOut className="w-4 h-4" /> Sign Out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </aside>

            {/* Main content area */}
            <main className="flex-1 ml-64 min-h-screen">
                <Outlet />
            </main>
        </div>
    )
}
