import { useRef } from 'react'
import { useInView, motion } from 'framer-motion'
import { CheckCircle, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'

const bullets = [
    'Apply to jobs in 186+ countries',
    'Gmail OAuth keeps your sender reputation safe',
    'Built-in resume localization support',
    'GDPR-compliant data handling',
    'NDAs and IP agreement templates',
    'Multi-language cold email generation',
]

const cardsData = [
    { flag: '🇺🇸', country: 'United States', sub: 'Top employer hub — FAANG + startups', jobs: '18K+ jobs' },
    { flag: '🇬🇧', country: 'United Kingdom', sub: 'Finance, Tech, Creative industries', jobs: '6K+ jobs' },
    { flag: '🇩🇪', country: 'Germany', sub: 'Engineering & Manufacturing', jobs: '4K+ jobs' },
    { flag: '🇮🇳', country: 'India', sub: 'IT, Startups, MNC offices', jobs: '12K+ jobs' },
]

export default function GlobalReachSection() {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-80px' })

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Left: World map visual */}
                    <motion.div
                        ref={ref}
                        initial={{ opacity: 0, x: -40 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.7 }}
                        className="flex-1 relative"
                    >
                        {/* Decorative circles / map placeholder */}
                        <div className="relative w-full aspect-square max-w-md mx-auto">
                            <div className="absolute inset-0 rounded-full bg-violet-50/50 border border-violet-100 animate-pulse" />
                            <div className="absolute inset-8 rounded-full bg-violet-50 border border-violet-100" />
                            <div className="absolute inset-16 rounded-full bg-violet-100/50 border border-violet-200 flex items-center justify-center">
                                <Globe className="w-16 h-16 text-violet-400 animate-spin-slow" />
                            </div>
                            {/* Country floating cards */}
                            {cardsData.map((c, i) => {
                                const positions = [
                                    'top-2 left-2',
                                    'top-2 right-2',
                                    'bottom-2 left-2',
                                    'bottom-2 right-2',
                                ]
                                return (
                                    <motion.div
                                        key={c.country}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                                        transition={{ delay: 0.3 + i * 0.15, duration: 0.4 }}
                                        className={`absolute ${positions[i]} glass-card rounded-xl px-3 py-2 shadow-md z-10`}
                                    >
                                        <p className="font-bold text-xs text-gray-700">{c.flag} {c.country}</p>
                                        <p className="text-[10px] text-violet-600 font-semibold">{c.jobs}</p>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </motion.div>

                    {/* Right: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="flex-1 max-w-lg"
                    >
                        <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-700 rounded-full px-4 py-1.5 text-sm font-semibold mb-5">
                            <Globe className="w-3.5 h-3.5" /> Global Reach
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-5 leading-tight">
                            Apply to Jobs in{' '}
                            <span className="text-gradient-violet">186+</span>{' '}
                            Countries
                        </h2>
                        <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                            Whether you're targeting Silicon Valley, London's fintech scene, or Berlin's startup ecosystem — ApplyBot has you covered with localized resumes and culturally appropriate outreach.
                        </p>
                        <ul className="space-y-3 mb-8">
                            {bullets.map(b => (
                                <li key={b} className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-violet-500 flex-shrink-0" />
                                    <span className="text-gray-700 font-medium">{b}</span>
                                </li>
                            ))}
                        </ul>
                        <Button size="lg" className="gradient-violet text-white border-0 shadow-lg shadow-violet-200 rounded-xl font-bold px-8">
                            Explore Global Jobs
                        </Button>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
