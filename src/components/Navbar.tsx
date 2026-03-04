import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, Bot, ArrowUpRight } from 'lucide-react'

const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Blog', href: '#blog' },
]

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const location = useLocation()

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-violet-100'
                    : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg gradient-violet flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                        <Bot className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                        Apply<span className="text-gradient-violet">zer</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map(link => (
                        <a
                            key={link.label}
                            href={link.href}
                            className={`text-sm font-medium transition-colors hover:text-violet-600 ${location.pathname === link.href
                                    ? 'text-violet-600'
                                    : 'text-gray-600'
                                }`}
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                {/* Desktop CTA */}
                <div className="hidden md:flex items-center gap-3">
                    <Link to="/login">
                        <Button variant="ghost" className="text-gray-700 hover:text-violet-600 font-medium">
                            Sign In
                        </Button>
                    </Link>
                    <Link to="/signup">
                        <Button className="gradient-violet text-white border-0 shadow-lg shadow-violet-200 hover:shadow-violet-300 hover:scale-105 transition-all duration-200 font-semibold rounded-xl flex items-center gap-1.5">
                            Get Started
                            <ArrowUpRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu */}
                <Sheet>
                    <SheetTrigger asChild className="md:hidden">
                        <Button variant="ghost" size="icon">
                            <Menu className="w-5 h-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-72">
                        <div className="flex flex-col gap-6 mt-8">
                            <Link to="/" className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg gradient-violet flex items-center justify-center">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-lg font-bold">Apply<span className="text-gradient-violet">Bot</span></span>
                            </Link>
                            <nav className="flex flex-col gap-4">
                                {navLinks.map(link => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        className="text-base font-medium text-gray-700 hover:text-violet-600 transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </nav>
                            <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
                                <Link to="/login">
                                    <Button variant="outline" className="w-full">Sign In</Button>
                                </Link>
                                <Link to="/signup">
                                    <Button className="w-full gradient-violet text-white border-0">Get Started</Button>
                                </Link>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    )
}
