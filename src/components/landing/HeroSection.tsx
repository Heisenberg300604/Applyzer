import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, Sparkles, ArrowUpRight, Play } from 'lucide-react'
import { motion } from 'framer-motion'

const popularTags = ['Software Engineer', 'Product Manager', 'UX Designer', 'Data Analyst', 'Marketing']

export default function HeroSection() {
    const [query, setQuery] = useState('')

    return (
        <section className="relative min-h-screen pt-24 pb-16 overflow-hidden gradient-hero">
            {/* Background blobs */}
            <div className="hero-blob w-96 h-96 bg-violet-300 -top-24 -left-24" />
            <div className="hero-blob w-72 h-72 bg-purple-200 top-32 right-0" />
            <div className="hero-blob w-56 h-56 bg-indigo-200 bottom-16 left-1/3" />

            {/* Decorative grid lines */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(#7C3AED 1px, transparent 1px), linear-gradient(to right, #7C3AED 1px, transparent 1px)', backgroundSize: '72px 72px' }}
            />

            <div className="relative max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-0">
                {/* Left Content */}
                <motion.div
                    className="flex-1 max-w-2xl"
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                >
                    {/* Pill badge */}
                    <div className="inline-flex items-center gap-2 bg-white border border-violet-200 rounded-full px-4 py-1.5 mb-6 shadow-sm">
                        <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                        <span className="text-xs font-semibold text-violet-600 tracking-wide uppercase">AI-Powered Job Applications</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight text-gray-900 mb-6">
                        <span className="flex items-center gap-3">
                            <span className="text-amber-400 text-5xl lg:text-6xl">✳</span>
                            Apply Smarter,
                        </span>
                        Land{' '}
                        <span className="text-gradient-violet">Faster</span>
                        <span className="inline-flex ml-3">
                            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="14" cy="14" r="14" fill="#7C3AED" /><path d="M9 14.5l3.5 3.5 7-7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </span>
                    </h1>

                    {/* Sub-copy */}
                    <p className="text-lg text-gray-500 mb-8 leading-relaxed max-w-lg">
                        <span className="font-bold text-violet-600">10,248+</span> jobs auto-applied. Enter your profile once — ApplyBot generates a tailored resume, cover letter & cold email, then sends it all via your Gmail.
                    </p>

                    {/* Search bar */}
                    <div className="flex items-center gap-2 bg-white rounded-2xl shadow-xl shadow-violet-100 border border-violet-100 p-2 mb-6 max-w-xl">
                        <Search className="w-5 h-5 text-gray-400 ml-2 flex-shrink-0" />
                        <Input
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Search job title, company, keyword..."
                            className="border-0 shadow-none focus-visible:ring-0 text-base flex-1 bg-transparent placeholder:text-gray-400"
                        />
                        <Button className="gradient-violet text-white border-0 rounded-xl px-5 py-2.5 font-semibold shrink-0 hover:opacity-90 transition-opacity">
                            Search
                        </Button>
                    </div>

                    {/* Popular tags */}
                    <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-sm text-gray-400 font-medium">Popular Jobs:</span>
                        {popularTags.map(tag => (
                            <Badge
                                key={tag}
                                variant="secondary"
                                className="cursor-pointer bg-white border border-violet-100 text-violet-700 hover:bg-violet-50 hover:border-violet-300 transition-colors font-medium px-3 py-1 rounded-full"
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>

                    {/* CTA Row */}
                    <div className="flex items-center gap-4 mt-8">
                        <Link to="/signup">
                            <Button size="lg" className="gradient-violet text-white border-0 shadow-lg shadow-violet-300 hover:shadow-violet-400 hover:scale-105 transition-all duration-200 font-bold rounded-xl px-8 flex items-center gap-2">
                                Start Free Today
                                <ArrowUpRight className="w-4 h-4" />
                            </Button>
                        </Link>
                        <button className="flex items-center gap-2 text-gray-600 font-medium hover:text-violet-600 transition-colors text-sm group">
                            <span className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center group-hover:shadow-violet-200 transition-shadow">
                                <Play className="w-4 h-4 text-violet-600 ml-0.5" />
                            </span>
                            Watch Demo
                        </button>
                    </div>
                </motion.div>

                {/* Right — Illustration */}
                <motion.div
                    className="flex-1 flex justify-center lg:justify-end relative"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                >
                    {/* Floating hero card */}
                    <div className="relative animate-float">
                        {/* Main illustration box */}
                        <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-3xl gradient-violet shadow-2xl shadow-violet-300/50 flex items-center justify-center relative overflow-hidden">
                            {/* Inner glow rings */}
                            <div className="absolute w-64 h-64 rounded-full border-2 border-white/20 animate-spin-slow" />
                            <div className="absolute w-48 h-48 rounded-full border border-white/10 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '8s' }} />

                            {/* Bot illustration */}
                            <div className="relative z-10 flex flex-col items-center gap-4">
                                <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-inner">
                                    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="8" y="16" width="36" height="28" rx="6" fill="white" fillOpacity="0.9" />
                                        <rect x="18" y="8" width="16" height="12" rx="4" fill="white" fillOpacity="0.7" />
                                        <circle cx="19" cy="28" r="3" fill="#7C3AED" />
                                        <circle cx="33" cy="28" r="3" fill="#7C3AED" />
                                        <rect x="20" y="35" width="12" height="3" rx="1.5" fill="#7C3AED" fillOpacity="0.5" />
                                        <rect x="4" y="24" width="4" height="8" rx="2" fill="white" fillOpacity="0.6" />
                                        <rect x="44" y="24" width="4" height="8" rx="2" fill="white" fillOpacity="0.6" />
                                    </svg>
                                </div>
                                <div className="text-center">
                                    <p className="text-white font-bold text-lg">ApplyBot AI</p>
                                    <p className="text-violet-200 text-xs">Applying to 12 jobs now...</p>
                                </div>
                                {/* Progress bar */}
                                <div className="w-48 h-2 bg-white/20 rounded-full overflow-hidden">
                                    <div className="h-full w-3/4 bg-white rounded-full animate-pulse" />
                                </div>
                            </div>
                        </div>

                        {/* Floating stat cards */}
                        <div className="absolute -top-6 -left-12 glass-card rounded-2xl px-4 py-3 shadow-lg animate-slide-up" style={{ animationDelay: '0.5s' }}>
                            <p className="text-xs text-gray-500 font-medium">Applications Sent</p>
                            <p className="text-2xl font-extrabold text-violet-600">10,248</p>
                        </div>
                        <div className="absolute -bottom-4 -right-8 glass-card rounded-2xl px-4 py-3 shadow-lg animate-slide-up" style={{ animationDelay: '0.7s' }}>
                            <p className="text-xs text-gray-500 font-medium">⚡ Avg Apply Time</p>
                            <p className="text-2xl font-extrabold text-green-500">15 min</p>
                        </div>
                        <div className="absolute top-1/2 -right-16 glass-card rounded-2xl px-3 py-2 shadow-lg animate-slide-up" style={{ animationDelay: '0.9s' }}>
                            <p className="text-xs text-gray-500">Reply Rate</p>
                            <p className="text-lg font-extrabold text-violet-600">34%</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
