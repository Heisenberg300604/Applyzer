import { useRef } from 'react'
import { useInView, motion } from 'framer-motion'
import { Calendar, Clock, ArrowRight } from 'lucide-react'

const posts = [
    {
        category: 'Job Search',
        title: 'How to Write a Cold Email That Actually Gets Replies in 2025',
        excerpt: 'Cold emailing HR teams has a reputation for being a waste of time — but with the right structure, it can become your most powerful job search weapon.',
        date: 'Feb 28, 2025',
        readTime: '6 min read',
        gradient: 'from-violet-400 to-purple-600',
        tag: '🔥 Popular',
    },
    {
        category: 'Resume Tips',
        title: 'Why AI-Generated Resumes Now Outperform Human-Written Ones',
        excerpt: 'A study of 10,000 applications found that AI-tailored resumes had a 2.8× higher callback rate than generic templates — here\'s the science behind it.',
        date: 'Mar 1, 2025',
        readTime: '8 min read',
        gradient: 'from-blue-400 to-indigo-600',
        tag: '📊 Data',
    },
    {
        category: 'Career Advice',
        title: 'Bulk Applying: The Controversial Strategy That Actually Lands Jobs',
        excerpt: 'Most career coaches say to personalize every application. We tested the opposite — and the results were surprising.',
        date: 'Mar 3, 2025',
        readTime: '5 min read',
        gradient: 'from-rose-400 to-pink-600',
        tag: '💡 Strategy',
    },
]

export default function InsightsSection() {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-80px' })

    return (
        <section id="blog" className="py-24 bg-[#f8f6ff]">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-14"
                >
                    <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
                        Insights & <span className="text-gradient-violet">Updates</span>
                    </h2>
                    <p className="text-lg text-gray-500 max-w-lg mx-auto">
                        Job search strategies, resume tips, and product updates from the ApplyBot team.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {posts.map((post, i) => (
                        <motion.article
                            key={post.title}
                            initial={{ opacity: 0, y: 28 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.55, delay: i * 0.12 }}
                            className="group bg-white rounded-2xl overflow-hidden border border-violet-50 hover:shadow-xl hover:shadow-violet-100/60 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                        >
                            {/* Image placeholder with gradient */}
                            <div className={`h-48 bg-gradient-to-br ${post.gradient} relative overflow-hidden`}>
                                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full px-3 py-1 border border-white/30">
                                        {post.tag}
                                    </span>
                                </div>
                                <div className="absolute bottom-4 left-4">
                                    <span className="text-white/80 text-xs font-semibold uppercase tracking-widest">{post.category}</span>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                                    <span>·</span>
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                                </div>
                                <h3 className="font-extrabold text-gray-900 text-base leading-snug mb-3 group-hover:text-violet-700 transition-colors">
                                    {post.title}
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed mb-4">{post.excerpt}</p>
                                <div className="flex items-center gap-1 text-violet-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                    Read More <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    )
}
