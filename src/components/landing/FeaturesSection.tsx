import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { motion } from 'framer-motion'
import { FileText, Send, BarChart3, Zap, Mail, Globe } from 'lucide-react'

const features = [
    {
        icon: FileText,
        color: 'from-violet-500 to-purple-600',
        bg: 'bg-violet-50',
        title: 'AI Resume Generation',
        desc: 'ApplyBot generates a perfectly tailored LaTeX-formatted PDF resume for each job — highlighting exactly what matters to that employer.',
        tag: 'Core Feature',
    },
    {
        icon: Send,
        color: 'from-blue-500 to-indigo-600',
        bg: 'bg-blue-50',
        title: 'Bulk Apply in One Click',
        desc: 'Select multiple jobs and fire off perfectly personalized applications all at once. Apply to 20 jobs in the time it used to take to apply to 1.',
        tag: 'Power User',
    },
    {
        icon: Mail,
        color: 'from-pink-500 to-rose-600',
        bg: 'bg-pink-50',
        title: 'Gmail Integration',
        desc: 'Your applications are sent directly from your Gmail account via OAuth — keeping your personal sender reputation intact.',
        tag: 'Integration',
    },
    {
        icon: BarChart3,
        color: 'from-green-500 to-emerald-600',
        bg: 'bg-green-50',
        title: 'Smart Application Tracker',
        desc: 'Google Sheets-backed tracker logs every application with company, role, email status, reply detection, and follow-up reminders.',
        tag: 'Tracking',
    },
    {
        icon: Zap,
        color: 'from-amber-500 to-orange-500',
        bg: 'bg-amber-50',
        title: 'Cold DM Generator',
        desc: 'Beyond emails — ApplyBot crafts personalized LinkedIn cold DMs based on the hiring manager\'s profile and your background.',
        tag: 'Outreach',
    },
    {
        icon: Globe,
        color: 'from-teal-500 to-cyan-600',
        bg: 'bg-teal-50',
        title: 'Global Job Scraping',
        desc: 'Scrapes LinkedIn, Indeed, and niche job boards automatically. New relevant jobs land in your queue every morning.',
        tag: 'Discovery',
    },
]

export default function FeaturesSection() {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-80px' })

    return (
        <section id="features" className="py-24 bg-[#f8f6ff]">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
                        <Zap className="w-3.5 h-3.5" />
                        Everything You Need
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
                        AI-Powered Features,{' '}
                        <span className="text-gradient-violet">Built to Win</span>
                    </h2>
                    <p className="text-lg text-gray-500 max-w-xl mx-auto">
                        Stop spending hours per application. ApplyBot handles the entire pipeline — from discovery to inbox.
                    </p>
                </motion.div>

                {/* Features grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, y: 28 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.55, delay: i * 0.1 }}
                            className="group bg-white rounded-2xl p-6 shadow-sm border border-violet-50 hover:shadow-xl hover:shadow-violet-100/60 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                        >
                            <div className={`inline-flex w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                                <f.icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="text-lg font-bold text-gray-900 leading-snug">{f.title}</h3>
                                <span className="text-xs font-semibold text-violet-500 bg-violet-50 rounded-full px-2 py-0.5 ml-2 shrink-0">{f.tag}</span>
                            </div>
                            <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
