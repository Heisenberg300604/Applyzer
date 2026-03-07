import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, Zap, ArrowUpRight, LayoutDashboard } from 'lucide-react'
import { Show, UserButton } from '@clerk/react'

const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
]

/** Logo mark — uses logo.png if available, falls back to Zap icon */
function LogoMark({ size = 32 }: { size?: number }) {
    const [hasError, setHasError] = useState(false)
    const s = `${size}px`

    if (hasError) {
        return (
            <div
                style={{ width: s, height: s }}
                className="rounded-lg bg-black flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500 transition-colors duration-200"
            >
                <Zap className="w-4 h-4 text-white" />
            </div>
        )
    }

    return (
        <img
            src="/logo.png"
            alt=""
            style={{ width: s, height: s }}
            className="object-contain rounded-md flex-shrink-0"
            onError={() => setHasError(true)}
        />
    )
}

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled
                    ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
                    : 'bg-white/80 backdrop-blur-sm'
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <LogoMark />
                    <span className="text-lg font-bold text-gray-900 tracking-tight">
                        Apply<span className="text-orange-500">zer</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map(link => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="text-sm font-medium text-gray-500 hover:text-orange-500 transition-colors duration-150 relative group/link"
                        >
                            {link.label}
                            {/* Underline slide-in on hover */}
                            <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-orange-500 group-hover/link:w-full transition-all duration-200" />
                        </a>
                    ))}
                </nav>

                {/* Desktop CTA */}
                <div className="hidden md:flex items-center gap-3">
                    <Show when="signed-out">
                        <Link to="/sign-in">
                            <button className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors duration-150 px-3 py-1.5">
                                Sign in
                            </button>
                        </Link>
                        <Link to="/sign-up">
                            <Button className="bg-black hover:bg-orange-500 text-white border-0 rounded-lg transition-all duration-200 font-semibold flex items-center gap-1.5 shadow-sm">
                                Get Started
                                <ArrowUpRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </Show>
                    <Show when="signed-in">
                        <Link to="/dashboard">
                            <Button
                                variant="ghost"
                                className="text-sm font-medium text-gray-600 hover:text-orange-500 flex items-center gap-1.5"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                Dashboard
                            </Button>
                        </Link>
                        <UserButton />
                    </Show>
                </div>

                {/* Mobile Menu */}
                <Sheet>
                    <SheetTrigger asChild className="md:hidden">
                        <Button variant="ghost" size="icon" className="text-gray-600 hover:text-orange-500">
                            <Menu className="w-5 h-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-72 bg-white">
                        <div className="flex flex-col gap-6 mt-8">
                            <Link to="/" className="flex items-center gap-2 group">
                                <LogoMark size={32} />
                                <span className="text-lg font-bold text-gray-900 tracking-tight">
                                    Apply<span className="text-orange-500">zer</span>
                                </span>
                            </Link>
                            <nav className="flex flex-col gap-1">
                                {navLinks.map(link => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        className="text-base font-medium text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg px-3 py-2 transition-colors duration-150"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </nav>
                            <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
                                <Show when="signed-out">
                                    <Link to="/sign-in">
                                        <Button variant="outline" className="w-full font-medium border-gray-200 hover:border-orange-300 hover:text-orange-500">
                                            Sign in
                                        </Button>
                                    </Link>
                                    <Link to="/sign-up">
                                        <Button className="w-full bg-black hover:bg-orange-500 text-white border-0 transition-colors duration-200 font-semibold">
                                            Get Started
                                        </Button>
                                    </Link>
                                </Show>
                                <Show when="signed-in">
                                    <Link to="/dashboard">
                                        <Button variant="outline" className="w-full font-medium hover:border-orange-300 hover:text-orange-500">
                                            Dashboard
                                        </Button>
                                    </Link>
                                    <div className="flex justify-center pt-2">
                                        <UserButton />
                                    </div>
                                </Show>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    )
}
