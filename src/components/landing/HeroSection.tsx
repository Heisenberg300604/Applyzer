import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
    ArrowUpRight,
    Sparkles,
    CheckCircle2,
    Loader2,
    FileText,
    Send,
    BarChart3,
    Mail,
} from 'lucide-react'
import { motion } from 'framer-motion'

const appliedJobs = [
    { company: 'Google', role: 'Software Engineer II', initials: 'G', color: 'bg-blue-500', status: 'sent' },
    { company: 'Stripe', role: 'Backend Engineer', initials: 'S', color: 'bg-indigo-500', status: 'sent' },
    { company: 'Notion', role: 'Full Stack Dev', initials: 'N', color: 'bg-gray-800', status: 'sent' },
    { company: 'Linear', role: 'Product Engineer', initials: 'L', color: 'bg-violet-500', status: 'sending' },
]

const highlights = [
    { icon: FileText, label: 'AI Resume', sub: 'Tailored per job' },
    { icon: Mail, label: 'Cold Email', sub: 'Sent via Gmail' },
    { icon: BarChart3, label: 'Tracker', sub: 'Reply detection' },
]

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-white">
            {/* Very subtle warm tint */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/40 via-white to-white pointer-events-none" />

            {/* Faint decorative ring top-right */}
            <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full border border-orange-100/60 pointer-events-none" />
            <div className="absolute -top-16 -right-16 w-[400px] h-[400px] rounded-full border border-orange-100/40 pointer-events-none" />

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 lg:py-28 flex flex-col lg:flex-row items-start gap-12 lg:gap-16">

                {/* ── Left: Copy ─────────────────────────────────────── */}
                <div className="flex-1 max-w-xl">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45 }}
                        className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-full px-4 py-1.5 mb-7"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                        <span className="text-xs font-semibold text-orange-700 tracking-wide">
                            AI-Powered Job Applications
                        </span>
                        <span className="text-[10px] font-bold text-white bg-orange-500 rounded-full px-2 py-0.5 leading-tight">
                            NEW
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        className="text-5xl sm:text-6xl lg:text-[4rem] xl:text-[4.5rem] font-extrabold text-gray-900 leading-[1.06] tracking-tight mb-5"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.08 }}
                    >
                        Apply Smarter.
                        <br />
                        <span className="text-orange-500">Land Faster.</span>
                    </motion.h1>

                    {/* Sub-copy */}
                    <motion.p
                        className="text-base lg:text-lg text-gray-500 leading-relaxed mb-8 max-w-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.16 }}
                    >
                        Enter your profile once —&nbsp;Applyzer generates a tailored resume, cover
                        letter &amp; cold email, then sends it all directly from your Gmail.
                        <span className="font-semibold text-gray-700"> 10,248+ jobs auto-applied.</span>
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        className="flex flex-wrap items-center gap-3 mb-10"
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.24 }}
                    >
                        <Link to="/sign-up">
                            <Button
                                size="lg"
                                className="bg-orange-500 hover:bg-orange-600 text-white border-0 shadow-md shadow-orange-200 font-bold rounded-xl px-7 flex items-center gap-2 text-[15px] transition-all duration-200 hover:shadow-orange-300 hover:-translate-y-px"
                            >
                                Start Free Today
                                <ArrowUpRight className="w-4 h-4" />
                            </Button>
                        </Link>
                        <Link to="/sign-in">
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-gray-200 text-gray-700 hover:border-orange-300 hover:text-orange-600 font-semibold rounded-xl text-[15px] transition-all duration-200"
                            >
                                Sign in
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Trust row */}
                    <motion.div
                        className="flex items-center gap-4 flex-wrap"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.55, delay: 0.35 }}
                    >
                        <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-orange-500" />
                            No credit card
                        </div>
                        <div className="w-px h-3 bg-gray-200" />
                        <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-orange-500" />
                            Free forever plan
                        </div>
                        <div className="w-px h-3 bg-gray-200" />
                        <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-orange-500" />
                            2-min setup
                        </div>
                    </motion.div>
                </div>

                {/* ── Right: Product Image ───────────────────────── */}
                <motion.div
                    className="flex-1 w-full max-w-lg"
                    initial={{ opacity: 0, x: 32 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                    {/* Job Image */}
                    <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl shadow-orange-100/40">
                        <img 
                            src="/job-png.png" 
                            alt="Job Application Dashboard" 
                            className="w-full h-auto object-cover rounded-2xl"
                        />
                    </div>

                    {/* Feature pills below image */}
                    <div className="grid grid-cols-3 gap-3 mt-6">
                        {highlights.map((h, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-xl border border-gray-100 shadow-sm px-3 py-3 flex flex-col items-start gap-1.5 hover:border-orange-200 transition-colors"
                            >
                                <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
                                    <h.icon className="w-3.5 h-3.5 text-orange-500" />
                                </div>
                                <p className="text-xs font-bold text-gray-800">{h.label}</p>
                                <p className="text-[11px] text-gray-400">{h.sub}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Hidden: CSS Product Mockup (kept as backup) */}
                <div className="hidden">
                    {/* Main card */}
                    <div className="relative bg-white rounded-2xl border border-gray-100 shadow-2xl shadow-gray-200/60 overflow-hidden">
                        {/* Card header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50 bg-gray-50/60">
                            <div className="flex items-center gap-2.5">
                                <div className="w-6 h-6 rounded-md bg-orange-500 flex items-center justify-center">
                                    <Send className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-sm font-bold text-gray-800">Bulk Apply</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-xs text-gray-400 font-medium">Running</span>
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div className="px-5 pt-4 pb-3">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs text-gray-500 font-medium">Applying to 12 jobs</span>
                                <span className="text-xs font-bold text-orange-500">75%</span>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full w-3/4 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full" />
                            </div>
                        </div>

                        {/* Job list */}
                        <div className="px-4 pb-2 space-y-1.5">
                            {appliedJobs.map((job, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                                >
                                    <div className={`w-8 h-8 rounded-lg ${job.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                                        {job.initials}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-800 truncate">{job.company}</p>
                                        <p className="text-xs text-gray-400 truncate">{job.role}</p>
                                    </div>
                                    {job.status === 'sent' ? (
                                        <div className="flex items-center gap-1.5 flex-shrink-0">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            <span className="text-xs text-green-600 font-semibold">Sent</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 flex-shrink-0">
                                            <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />
                                            <span className="text-xs text-orange-500 font-semibold">Sending…</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Footer stat */}
                        <div className="px-5 py-3 bg-orange-50 border-t border-orange-100/60 flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-orange-500" />
                                <span className="text-xs text-gray-600 font-medium">Via your Gmail · OAuth secured</span>
                            </div>
                            <span className="text-xs font-bold text-orange-600">9 sent today</span>
                        </div>
                    </div>
                </div>
                {/* End hidden mockup */}
            </div>

            {/* Bottom stats band */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 border-t border-gray-100 bg-white/80 backdrop-blur-sm"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
            >
                <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                    {[
                        { value: '45K+', label: 'Applications Sent' },
                        { value: '34%', label: 'Reply Rate' },
                        { value: '186+', label: 'Countries' },
                        { value: '2,400+', label: 'Active Users' },
                    ].map((s, i) => (
                        <div key={i} className="flex items-center gap-3">
                            {i > 0 && <div className="hidden sm:block w-px h-6 bg-gray-100" />}
                            <div>
                                <span className="text-lg font-extrabold text-gray-900">{s.value}</span>
                                <span className="text-sm text-gray-400 ml-2">{s.label}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </section>
    )
}
