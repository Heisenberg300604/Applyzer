import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import { useUser } from '@clerk/react'

const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const { isSignedIn } = useUser()
    const navigate = useNavigate()

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const handleAppClick = () => {
        if (isSignedIn) {
            navigate('/dashboard')
        } else {
            navigate('/sign-in')
        }
    }

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled
                    ? 'bg-white/95 backdrop-blur-md border-b border-gray-100'
                    : 'bg-transparent'
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <span className="text-2xl font-black text-gray-900 tracking-tight">
                        APPLYZER
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-10">
                    <nav className="flex items-center gap-10">
                        {navLinks.map(link => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="text-base font-semibold text-gray-900 hover:text-orange-500 transition-colors duration-150"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>
                    
                    <InteractiveHoverButton
                        onClick={handleAppClick}
                        className="text-base px-8 py-3 font-bold"
                    >
                        GO TO APP
                    </InteractiveHoverButton>
                </div>

                {/* Mobile Menu */}
                <Sheet>
                    <SheetTrigger asChild className="md:hidden">
                        <Button variant="ghost" size="icon" className="text-gray-900">
                            <Menu className="w-6 h-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-72 bg-white">
                        <div className="flex flex-col gap-6 mt-8">
                            <Link to="/" className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-black" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-black" />
                                </div>
                                <span className="text-2xl font-black text-gray-900 tracking-tight">
                                    APPLYZER
                                </span>
                            </Link>
                            <nav className="flex flex-col gap-1">
                                {navLinks.map(link => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        className="text-base font-semibold text-gray-900 hover:text-orange-500 rounded-lg px-3 py-2 transition-colors duration-150"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </nav>
                            <div className="mt-4">
                                <InteractiveHoverButton
                                    onClick={handleAppClick}
                                    className="w-full text-base font-bold"
                                >
                                    GO TO APP
                                </InteractiveHoverButton>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    )
}
