import { Link } from 'react-router-dom'
import { Bot, Github, Twitter, Linkedin, Instagram, ArrowUpRight, Mail } from 'lucide-react'
import { SignUpButton } from '@clerk/react'

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
        <footer className="bg-[#0f0a1e] text-white">
            {/* CTA Banner */}
            <div className="border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h2 className="text-4xl lg:text-6xl font-extrabold mb-2">
                            Let's{' '}
                            <span className="text-gradient-violet">Connect</span>{' '}
                            <span className="inline-flex w-14 h-14 rounded-full gradient-violet items-center justify-center ml-2 align-middle">
                                <ArrowUpRight className="w-6 h-6 text-white" />
                            </span>
                        </h2>
                        <p className="text-gray-400 text-lg">Have questions? We'd love to hear from you.</p>
                    </div>
                    <SignUpButton>
                        <button
                            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 transition-colors text-white font-bold px-8 py-4 rounded-2xl text-lg shadow-lg shadow-violet-900/40"
                            type="button"
                        >
                            <Mail className="w-5 h-5" /> Get in Touch
                        </button>
                    </SignUpButton>
                </div>
            </div>

            {/* Footer body */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand col */}
                    <div className="md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-5">
                            <div className="w-9 h-9 rounded-xl gradient-violet flex items-center justify-center shadow-lg">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-extrabold text-white">Apply<span className="text-violet-400">zer</span></span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            AI-powered job applications that save you hours and land more interviews.
                        </p>
                        <div className="flex items-center gap-3">
                            {socials.map(({ Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="w-9 h-9 rounded-xl bg-white/10 hover:bg-violet-600 transition-colors flex items-center justify-center group"
                                >
                                    <Icon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {Object.entries(links).map(([title, items]) => (
                        <div key={title}>
                            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-widest">{title}</h4>
                            <ul className="space-y-3">
                                {items.map(item => (
                                    <li key={item.label}>
                                        <a
                                            href={item.href}
                                            className="text-gray-400 hover:text-white text-sm transition-colors hover:translate-x-0.5 inline-flex"
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
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t border-white/10">
                    <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Applyzer. All rights reserved.</p>
                    <p className="text-gray-500 text-sm">Built with ❤️ for job seekers worldwide.</p>
                </div>
            </div>
        </footer>
    )
}
