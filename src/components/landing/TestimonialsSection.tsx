import { useRef } from 'react'
import { useInView, motion } from 'framer-motion'
import { Star } from 'lucide-react'

const testimonials = [
    {
        text: "I applied to 47 companies in a single afternoon. Applyzer handled the resume, cover letter, and cold emails automatically. Got 3 interview calls within 2 weeks — more than I'd gotten in the previous 3 months.",
        name: 'Alex Chen',
        role: 'Software Engineer',
        company: 'ex-Meta',
        initials: 'AC',
        color: 'bg-orange-500',
    },
    {
        text: "The tailored resumes are genuinely impressive. Each one reads like I spent hours on it — but Applyzer generates them in seconds. My response rate went from near-zero to around 28% within the first week.",
        name: 'Priya Sharma',
        role: 'Product Manager',
        company: 'Notion',
        initials: 'PS',
        color: 'bg-emerald-500',
    },
    {
        text: "As a recent grad, the job search felt overwhelming. Applyzer made it systematic. I set up my profile on Sunday night and had applications going out Monday morning. Landed my first role at a Series B startup.",
        name: 'Jordan Lee',
        role: 'UX Designer',
        company: 'Figma',
        initials: 'JL',
        color: 'bg-violet-500',
    },
]

function StarRow() {
    return (
        <div className="flex items-center gap-0.5 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-orange-400 text-orange-400" />
            ))}
        </div>
    )
}

export default function TestimonialsSection() {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-80px' })

    return (
        <section className="py-28 bg-[#0a0a0a]">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-gray-300 rounded-full px-3.5 py-1.5 text-xs font-semibold mb-5 uppercase tracking-wide">
                        <Star className="w-3 h-3 fill-orange-400 text-orange-400" />
                        Social Proof
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4">
                        Real Results from{' '}
                        <span className="text-orange-500">Real Users</span>
                    </h2>
                    <p className="text-lg text-gray-400 max-w-lg mx-auto">
                        Join thousands of job seekers who've accelerated their search with Applyzer.
                    </p>
                </motion.div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={t.name}
                            initial={{ opacity: 0, y: 28 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.55, delay: i * 0.12 }}
                            className="flex flex-col bg-white/5 border border-white/8 rounded-2xl p-7 hover:bg-white/8 hover:border-white/12 transition-colors duration-200"
                        >
                            <StarRow />

                            <blockquote className="text-gray-300 text-sm leading-relaxed flex-1 mb-6">
                                "{t.text}"
                            </blockquote>

                            <div className="flex items-center gap-3 pt-5 border-t border-white/8">
                                <div
                                    className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
                                >
                                    {t.initials}
                                </div>
                                <div>
                                    <p className="text-white font-semibold text-sm">{t.name}</p>
                                    <p className="text-gray-500 text-xs">
                                        {t.role} · {t.company}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Aggregate stat */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-8 pt-10 border-t border-white/5"
                >
                    {[
                        { value: '4.9/5', label: 'Average Rating' },
                        { value: '2,400+', label: 'Active Users' },
                        { value: '98%', label: 'Would Recommend' },
                    ].map((item, i) => (
                        <div key={i} className="text-center">
                            <p className="text-3xl font-extrabold text-white mb-0.5">{item.value}</p>
                            <p className="text-gray-500 text-sm">{item.label}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
