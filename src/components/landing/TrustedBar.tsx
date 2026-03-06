const companies = [
    { name: 'Google', logo: '🔵' },
    { name: 'Meta', logo: '📘' },
    { name: 'Amazon', logo: '🟠' },
    { name: 'Microsoft', logo: '🪟' },
    { name: 'Apple', logo: '🍎' },
    { name: 'Netflix', logo: '🔴' },
    { name: 'Stripe', logo: '💳' },
    { name: 'Figma', logo: '🎨' },
]

export default function TrustedBar() {
    return (
        <section className="py-12 bg-white border-y border-gray-100">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-shrink-0">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest text-center md:text-left">
                            Trusted by
                            <span className="block text-2xl font-extrabold text-gray-900 normal-case tracking-normal mt-0.5">1M+ Users</span>
                        </p>
                    </div>
                    <div className="w-px h-12 bg-gray-200 hidden md:block" />
                    {/* Scrolling logos */}
                    <div className="flex-1 overflow-hidden relative">
                        <div className="flex gap-10 animate-marquee whitespace-nowrap">
                            {[...companies, ...companies].map((c, i) => (
                                <div key={`${c.name}-${i}`} className="flex items-center gap-2 flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                                    <span className="text-2xl">{c.logo}</span>
                                    <span className="font-bold text-gray-700 text-base">{c.name}</span>
                                </div>
                            ))}
                        </div>
                        {/* fade edges */}
                        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent pointer-events-none" />
                        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent pointer-events-none" />
                    </div>
                </div>
            </div>
        </section>
    )
}
