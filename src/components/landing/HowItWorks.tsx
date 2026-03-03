import { useRef } from 'react'
import { useInView, motion } from 'framer-motion'
import { UserCircle, Search, Zap, ArrowRight } from 'lucide-react'

const steps = [
    {
        number: '01',
        icon: UserCircle,
        color: 'from-violet-500 to-purple-600',
        title: 'Build Your Profile Once',
        desc: 'Enter your skills, experience, education, and projects just once. ApplyBot remembers everything about you.',
        detail: 'Skills · Education · Experience · Projects · LinkedIn',
    },
    {
        number: '02',
        icon: Search,
        color: 'from-blue-500 to-indigo-600',
        title: 'Select Jobs to Apply',
        desc: 'Browse scraped jobs from LinkedIn, Indeed & niche boards. Select the ones you want and pick your tone.',
        detail: 'Search · Filter · Select · Choose Email Tone',
    },
    {
        number: '03',
        icon: Zap,
        color: 'from-amber-500 to-orange-500',
        title: 'AI Applies Automatically',
        desc: 'ApplyBot generates a tailored resume + cover letter + cold email per job, then fires them all from your Gmail.',
        detail: 'Resume · Cover Letter · Cold DM · Gmail · Tracker',
    },
]

export default function HowItWorks() {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-80px' })

    return (
        <section id="how-it-works" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
                        Simple 3 Steps
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
                        How <span className="text-gradient-violet">ApplyBot</span> Works
                    </h2>
                    <p className="text-lg text-gray-500 max-w-lg mx-auto">
                        From profile to inbox in under 15 minutes — zero manual writing required.
                    </p>
                </motion.div>

                <div className="relative flex flex-col lg:flex-row items-stretch gap-0">
                    {/* Connector line (desktop) */}
                    <div className="hidden lg:block absolute top-16 left-[16.5%] right-[16.5%] h-0.5 bg-gradient-to-r from-violet-300 via-blue-300 to-amber-300 z-0" />

                    {steps.map((step, i) => (
                        <motion.div
                            key={step.number}
                            initial={{ opacity: 0, y: 32 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: i * 0.18 }}
                            className="flex-1 flex flex-col items-center text-center relative z-10 px-6"
                        >
                            {/* Step circle icon */}
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg shadow-violet-200/50 mb-4`}>
                                <step.icon className="w-7 h-7 text-white" />
                            </div>
                            <span className="text-xs font-black text-gray-300 tracking-widest mb-2">{step.number}</span>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-4">{step.desc}</p>
                            <div className="flex flex-wrap justify-center gap-1.5">
                                {step.detail.split(' · ').map(tag => (
                                    <span key={tag} className="text-xs bg-violet-50 text-violet-600 font-medium rounded-full px-2.5 py-0.5 border border-violet-100">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Arrow between steps (mobile) */}
                            {i < steps.length - 1 && (
                                <div className="lg:hidden mt-6 mb-2">
                                    <ArrowRight className="w-5 h-5 text-gray-300 rotate-90" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
