import { useRef } from 'react'
import { useInView, motion } from 'framer-motion'
import { FileText, Send, BarChart3, Zap, Mail, Globe, ArrowRight } from 'lucide-react'

const features = [
    {
        icon: FileText,
        title: 'AI Resume Generation',
        desc: 'Applyzer generates a perfectly tailored PDF resume for each job — highlighting exactly what matters to that employer.',
        tag: 'Core',
    },
    {
        icon: Send,
        title: 'Bulk Apply in One Click',
        desc: 'Select multiple jobs and fire off personalized applications all at once. Apply to 20 jobs in the time it used to take for 1.',
        tag: 'Power',
    },
    {
        icon: Mail,
        title: 'Gmail Integration',
        desc: 'Applications sent directly from your Gmail via OAuth — keeping your personal sender reputation intact.',
        tag: 'Integration',
    },
    {
        icon: BarChart3,
        title: 'Application Tracker',
        desc: 'Google Sheets-backed tracker logs every application with company, role, email status, reply detection, and follow-up reminders.',
        tag: 'Tracking',
    },
    {
        icon: Zap,
        title: 'Cold DM Generator',
        desc: 'Applyzer crafts personalized LinkedIn cold DMs based on the hiring manager\'s profile and your background.',
        tag: 'Outreach',
    },
    {
        icon: Globe,
        title: 'Global Job Scraping',
        desc: 'Scrapes LinkedIn, Indeed, and niche job boards automatically. New relevant jobs land in your queue every morning.',
        tag: 'Discovery',
    },
]

export default function FeaturesSection() {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-80px' })

    return (
        <section id="features" className="py-28 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="max-w-2xl mb-16"
                >
                    <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 border border-orange-100 rounded-full px-3.5 py-1.5 text-xs font-semibold mb-5 uppercase tracking-wide">
                        <Zap className="w-3 h-3" />
                        Everything You Need
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                        AI-Powered Features,{' '}
                        <span className="text-orange-500">Built to Win</span>
                    </h2>
                    <p className="text-lg text-gray-500 leading-relaxed">
                        Stop spending hours per application. Applyzer handles the entire pipeline — from
                        discovery to inbox delivery.
                    </p>
                </motion.div>

                {/* Features grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100 rounded-2xl overflow-hidden border border-gray-100">
                    {features.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, y: 24 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                            className="group bg-white p-8 hover:bg-gray-50 transition-colors duration-200 cursor-pointer relative"
                        >
                            {/* Icon */}
                            <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center mb-5 group-hover:bg-orange-500 transition-colors duration-200">
                                <f.icon className="w-5 h-5 text-white" />
                            </div>

                            {/* Tag */}
                            <span className="inline-block text-xs font-semibold text-orange-500 bg-orange-50 border border-orange-100 rounded-full px-2.5 py-0.5 mb-3">
                                {f.tag}
                            </span>

                            <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed mb-5">{f.desc}</p>

                            <div className="flex items-center gap-1 text-gray-400 group-hover:text-orange-500 text-sm font-semibold transition-colors duration-200">
                                Learn more
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
