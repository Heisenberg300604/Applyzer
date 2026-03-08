import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useUser } from '@/context/UserContext'
import {
    LayoutDashboard, User, Briefcase, Zap,
    FileText, LogOut, ChevronRight
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
    DropdownMenu, DropdownMenuContent,
    DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/profile', icon: User, label: 'My Profile' },
    { to: '/jobs', icon: Briefcase, label: 'Find Jobs' },
    { to: '/apply', icon: Zap, label: 'Bulk Apply' },
    { to: '/resume', icon: FileText, label: 'Resume & CL' }
]

export default function DashboardLayout() {
    const { userId, logout } = useUser()
    const navigate = useNavigate()

    const handleLogout = () => { logout(); navigate('/') }

    return (
        <div className="min-h-screen bg-white flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed inset-y-0 left-0 z-40">
                {/* Logo */}
                <div className="flex items-center gap-3 px-5 h-16 border-b border-gray-200">
                    <span className="text-xl font-black text-gray-900 tracking-tight">APPLYZER</span>
                </div>

                {/* Nav */}
                <nav className="flex-1 py-4 px-3 space-y-0.5">
                    {navItems.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === '/dashboard'}
                            className={({ isActive }) => cn(
                                'flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-150 rounded-sm',
                                isActive
                                    ? 'bg-orange-500 text-white'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            )}
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-white' : 'text-gray-400')} />
                                    <span className="flex-1">{item.label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* User footer */}
                <div className="px-4 py-4 border-t border-gray-200">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-3 w-full hover:bg-gray-100 p-2 rounded-sm transition-colors duration-200 group">
                                <Avatar className="w-8 h-8">
                                    <AvatarFallback className="bg-orange-500 text-white text-xs font-semibold">
                                        {userId ? `U${userId}` : 'AB'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 text-left min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">User #{userId || '—'}</p>
                                    <p className="text-xs text-gray-400">Applyzer account</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400 transition-colors" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 border border-gray-200 shadow-lg">
                            <DropdownMenuItem onClick={handleLogout} className="text-gray-700 focus:bg-gray-100 focus:text-gray-900 gap-2 font-medium text-sm">
                                <LogOut className="w-4 h-4" /> Sign Out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </aside>

            {/* Main content area */}
            <main className="flex-1 ml-64 min-h-screen bg-white">
                <Outlet />
            </main>
        </div>
    )
}
