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
                        <span className="font-bold text-violet-600">10,248+</span> jobs auto-applied. Enter your profile once — Applyzer generates a tailored resume, cover letter & cold email, then sends it all via your Gmail.
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
                        <Link to="/sign-in">
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
                    <div className="w-full max-w-[640px]">
                        <img
                            src="/landing.png"
                            alt="Applyzer product preview"
                            loading="eager"
                            decoding="async"
                            className="w-full h-auto rounded-3xl shadow-2xl shadow-violet-200/70 border border-violet-100/60"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
