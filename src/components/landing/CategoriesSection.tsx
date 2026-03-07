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
        <section className="py-28 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
                >
                    <div>
                        <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 border border-orange-100 rounded-full px-3.5 py-1.5 text-xs font-semibold mb-5 uppercase tracking-wide">
                            Browse by Category
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-2">
                            Popular Job{' '}
                            <span className="text-orange-500">Categories</span>
                        </h2>
                        <p className="text-gray-500 text-lg">
                            Explore thousands of curated positions across every field.
                        </p>
                    </div>
                    <Button className="bg-black hover:bg-orange-500 text-white border-0 rounded-xl transition-colors duration-200 flex items-center gap-2 shrink-0 font-semibold">
                        Browse All Jobs <ArrowUpRight className="w-4 h-4" />
                    </Button>
                </motion.div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {categories.map((cat, i) => (
                        <motion.div
                            key={cat.label}
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={inView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.4, delay: i * 0.05 }}
                            className="group bg-white rounded-xl p-5 border border-gray-100 hover:border-orange-200 hover:shadow-md hover:shadow-orange-50 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                        >
                            <div className="text-2xl mb-3">{cat.emoji}</div>
                            <h3 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-orange-600 transition-colors">
                                {cat.label}
                            </h3>
                            <p className="text-xs text-gray-400 font-medium">{cat.count}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
