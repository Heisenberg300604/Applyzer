import { Link } from 'react-router-dom'
import { Zap, Github, Twitter, Linkedin, Instagram } from 'lucide-react'

const links = {
    Product: [
        { label: 'Features', href: '#features' },
        { label: 'How it Works', href: '#how-it-works' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'API Docs', href: '#docs' },
    ],
    Company: [
        { label: 'About', href: '#about' },
        { label: 'Blog', href: '#blog' },
        { label: 'Careers', href: '#careers' },
        { label: 'Contact', href: '#contact' },
    ],
    Legal: [
        { label: 'Privacy Policy', href: '#privacy' },
        { label: 'Terms & Conditions', href: '#terms' },
        { label: 'Cookie Policy', href: '#cookies' },
        { label: 'GDPR', href: '#gdpr' },
    ],
}

const socials = [
    { Icon: Github, href: '#', label: 'GitHub' },
    { Icon: Twitter, href: '#', label: 'Twitter' },
    { Icon: Linkedin, href: '#', label: 'LinkedIn' },
    { Icon: Instagram, href: '#', label: 'Instagram' },
]

export default function Footer() {
    return (
        <footer className="bg-[#0a0a0a] text-white border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand col */}
                    <div className="md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-5 group">
                            <div className="w-9 h-9 rounded-xl bg-white/10 group-hover:bg-orange-500 flex items-center justify-center transition-colors duration-200">
                                <Zap className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-extrabold text-white">
                                Apply<span className="text-orange-500">zer</span>
                            </span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6">
                            AI-powered job applications that save you hours and land more interviews.
                        </p>
                        <div className="flex items-center gap-2">
                            {socials.map(({ Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="w-9 h-9 rounded-xl bg-white/5 hover:bg-orange-500/20 border border-white/5 hover:border-orange-500/30 transition-all duration-200 flex items-center justify-center group"
                                >
                                    <Icon className="w-4 h-4 text-gray-500 group-hover:text-orange-400 transition-colors" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {Object.entries(links).map(([title, items]) => (
                        <div key={title}>
                            <h4 className="text-gray-400 font-semibold mb-5 text-xs uppercase tracking-widest">
                                {title}
                            </h4>
                            <ul className="space-y-3">
                                {items.map(item => (
                                    <li key={item.label}>
                                        <a
                                            href={item.href}
                                            className="text-gray-500 hover:text-white text-sm transition-colors inline-flex"
                                        >
                                            {item.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-14 pt-8 border-t border-white/5">
                    <p className="text-gray-600 text-sm">
                        © {new Date().getFullYear()} Applyzer. All rights reserved.
                    </p>
                    <p className="text-gray-600 text-sm">Built for job seekers worldwide.</p>
                </div>
            </div>
        </footer>
    )
}
