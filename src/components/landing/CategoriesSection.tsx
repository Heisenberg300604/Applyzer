import { useRef } from 'react'
import { useInView, motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const categories = [
    { label: 'Software Engineering', count: '4.2K jobs', emoji: '💻' },
    { label: 'Product Management', count: '1.8K jobs', emoji: '📋' },
    { label: 'UX / UI Design', count: '2.1K jobs', emoji: '🎨' },
    { label: 'Data Science & AI', count: '3.5K jobs', emoji: '🤖' },
    { label: 'Marketing & Growth', count: '1.4K jobs', emoji: '📈' },
    { label: 'Sales & BizDev', count: '2.0K jobs', emoji: '🤝' },
    { label: 'Finance & Accounting', count: '989 jobs', emoji: '💰' },
    { label: 'Healthcare & MedTech', count: '1.1K jobs', emoji: '🏥' },
    { label: 'DevOps & Cloud', count: '1.6K jobs', emoji: '☁️' },
    { label: 'Cybersecurity', count: '870 jobs', emoji: '🔐' },
    { label: 'Content & Writing', count: '760 jobs', emoji: '✍️' },
    { label: 'Research & Academia', count: '540 jobs', emoji: '🔬' },
]

export default function CategoriesSection() {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-80px' })

    return (
        <section className="py-24 bg-[#f8f6ff]">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
                >
                    <div>
                        <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-3">
                            Popular Job{' '}
                            <span className="text-gradient-violet">Categories</span>
                        </h2>
                        <p className="text-gray-500 text-lg">Explore thousands of curated positions across every field.</p>
                    </div>
                    <Button className="gradient-violet text-white border-0 rounded-xl shadow-lg shadow-violet-200 flex items-center gap-2 shrink-0">
                        Browse All Jobs <ArrowUpRight className="w-4 h-4" />
                    </Button>
                </motion.div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {categories.map((cat, i) => (
                        <motion.div
                            key={cat.label}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={inView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.45, delay: i * 0.06 }}
                            className="group bg-white rounded-2xl p-5 border border-violet-50 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                        >
                            <div className="text-3xl mb-3">{cat.emoji}</div>
                            <h3 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-violet-700 transition-colors">{cat.label}</h3>
                            <p className="text-xs text-gray-400 font-medium">{cat.count}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
