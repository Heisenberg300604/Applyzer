import { useRef } from 'react'
import { useInView, motion } from 'framer-motion'
import { UserCircle, Search, Zap, ArrowDown } from 'lucide-react'

const steps = [
    {
        number: '01',
        icon: UserCircle,
        title: 'Build Your Profile Once',
        desc: 'Enter your skills, experience, education, and projects just once. Applyzer remembers everything about you and uses it for every application going forward.',
        tags: ['Skills', 'Education', 'Experience', 'Projects'],
        iconBg: 'bg-gray-900',
    },
    {
        number: '02',
        icon: Search,
        title: 'Select Jobs to Apply',
        desc: 'Browse auto-scraped jobs from LinkedIn, Indeed & niche boards. Filter by role, location, or salary. Pick the ones you want, choose your email tone.',
        tags: ['Search', 'Filter', 'Select', 'Tone'],
        iconBg: 'bg-orange-500',
    },
    {
        number: '03',
        icon: Zap,
        title: 'AI Applies Automatically',
        desc: 'Applyzer generates a tailored resume, cover letter, and cold email per job — then sends everything directly from your Gmail account in one shot.',
        tags: ['Resume', 'Cover Letter', 'Cold Email', 'Gmail'],
        iconBg: 'bg-gray-900',
    },
]

export default function HowItWorks() {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-80px' })

    return (
        <section id="how-it-works" className="py-28 bg-[#fafafa]">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 bg-gray-900 text-white rounded-full px-3.5 py-1.5 text-xs font-semibold mb-5 uppercase tracking-widest">
                        Simple 3 Steps
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                        How <span className="text-orange-500">Applyzer</span> Works
                    </h2>
                    <p className="text-lg text-gray-500 max-w-md mx-auto">
                        From profile to inbox in under 15 minutes — zero manual writing required.
                    </p>
                </motion.div>

                {/* Step cards */}
                <div className="max-w-3xl mx-auto">
                    {steps.map((step, i) => (
                        <div key={step.number}>
                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                animate={inView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: i * 0.14 }}
                                className="flex items-start gap-6 bg-white rounded-2xl border border-gray-100 px-8 py-7 hover:border-orange-100 hover:shadow-sm transition-all duration-200"
                            >
                                {/* Icon + number */}
                                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                                    <div className={`w-12 h-12 rounded-xl ${step.iconBg} flex items-center justify-center shadow-sm`}>
                                        <step.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-[10px] font-black text-gray-300 tracking-[0.25em]">
                                        {step.number}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="flex-1 pt-0.5">
                                    <h3 className="text-lg font-extrabold text-gray-900 mb-2">{step.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-4">{step.desc}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {step.tags.map(tag => (
                                            <span
                                                key={tag}
                                                className="text-xs font-medium text-gray-500 bg-gray-50 border border-gray-100 rounded-full px-3 py-1"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Connector */}
                            {i < steps.length - 1 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={inView ? { opacity: 1 } : {}}
                                    transition={{ duration: 0.4, delay: i * 0.14 + 0.3 }}
                                    className="flex justify-center pl-6 py-2"
                                >
                                    <ArrowDown className="w-4 h-4 text-gray-300" />
                                </motion.div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
