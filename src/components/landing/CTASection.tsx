import { useRef } from 'react'
import { useInView, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowUpRight, CheckCircle } from 'lucide-react'

const perks = [
    'No credit card required',
    'Free forever plan available',
    'Setup in under 2 minutes',
]

export default function CTASection() {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-80px' })

    return (
        <section className="py-28 bg-white">
            <div className="max-w-5xl mx-auto px-6">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 24 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.65 }}
                    className="relative overflow-hidden bg-[#0a0a0a] rounded-3xl px-8 py-16 sm:px-16 sm:py-20 text-center"
                >
                    {/* Orange glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-orange-500/12 rounded-full filter blur-[80px] pointer-events-none" />

                    {/* Subtle dot grid */}
                    <div
                        className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{
                            backgroundImage:
                                'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                            backgroundSize: '28px 28px',
                        }}
                    />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-full px-3.5 py-1.5 text-xs font-semibold mb-6 uppercase tracking-wide">
                            Get Started Today
                        </div>

                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-5 leading-tight">
                            Ready to Land Your
                            <br />
                            <span className="text-orange-500">Dream Job?</span>
                        </h2>

                        <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                            Join 2,400+ job seekers who've automated their entire application pipeline
                            with Applyzer. Set up once, apply everywhere.
                        </p>

                        {/* CTA button */}
                        <Link to="/sign-up">
                            <Button
                                size="lg"
                                className="bg-orange-500 hover:bg-orange-600 text-white border-0 shadow-xl shadow-orange-500/20 font-bold rounded-xl px-10 text-base flex items-center gap-2 mx-auto transition-all duration-200 hover:scale-105"
                            >
                                Start Free Today
                                <ArrowUpRight className="w-5 h-5" />
                            </Button>
                        </Link>

                        {/* Perks */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-8">
                            {perks.map(perk => (
                                <div key={perk} className="flex items-center gap-2 text-gray-400 text-sm">
                                    <CheckCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                                    {perk}
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
