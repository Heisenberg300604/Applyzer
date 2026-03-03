import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { motion } from 'framer-motion'

const stats = [
    { value: '45K+', label: 'Applications Sent', sub: 'Automated every day, worldwide' },
    { value: '15 min', label: 'Average Apply Time', sub: 'From zero to sent, blazing fast' },
    { value: '2,000+', label: 'Companies Reached', sub: 'Top-tier employers and startups' },
    { value: '34%', label: 'Reply Rate', sub: 'Better than average cold emails' },
]

function StatCard({ value, label, sub, delay }: { value: string; label: string; sub: string; delay: number }) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true })
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay }}
            className="text-center group"
        >
            <p className="text-5xl xl:text-6xl font-extrabold text-gradient-violet mb-2 group-hover:scale-105 transition-transform inline-block">{value}</p>
            <p className="font-bold text-gray-900 mb-1">{label}</p>
            <p className="text-sm text-gray-500">{sub}</p>
        </motion.div>
    )
}

export default function StatsSection() {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 divide-x-0 lg:divide-x divide-violet-100">
                    {stats.map((s, i) => (
                        <div key={s.label} className="relative">
                            {i > 0 && <div className="hidden lg:block absolute left-0 inset-y-4 w-px bg-violet-100" />}
                            <StatCard {...s} delay={i * 0.12} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
