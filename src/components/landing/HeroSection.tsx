import { Link } from 'react-router-dom'
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button'
import { FloatingIconsBackground } from '@/components/ui/floating-icons-hero'

// Define company icons with their positions - tighter circle around center
const companyIcons = [
    { id: 1, iconSrc: '/icon/google.png', className: 'top-[20%] left-[20%]' },
    { id: 2, iconSrc: '/icon/amazon.png', className: 'top-[20%] right-[20%]' },
    { id: 3, iconSrc: '/icon/meta.png', className: 'top-[35%] left-[12%]' },
    { id: 4, iconSrc: '/icon/salesforce.png', className: 'top-[35%] right-[12%]' },
    { id: 5, iconSrc: '/icon/oracle.png', className: 'top-[50%] left-[8%]' },
    { id: 6, iconSrc: '/icon/samsung.png', className: 'top-[50%] right-[8%]' },
    { id: 7, iconSrc: '/icon/gmail.png', className: 'bottom-[35%] left-[12%]' },
    { id: 8, iconSrc: '/icon/google.png', className: 'bottom-[35%] right-[12%]' },
    { id: 9, iconSrc: '/icon/meta.png', className: 'bottom-[20%] left-[20%]' },
    { id: 10, iconSrc: '/icon/amazon.png', className: 'bottom-[20%] right-[20%]' },
]

export default function HeroSection() {
    return (
        <FloatingIconsBackground icons={companyIcons} className="bg-white min-h-screen">
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Subtle gradient blob - top right */}
                <div 
                    className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full opacity-30 pointer-events-none"
                    style={{
                        background: 'radial-gradient(circle, rgba(255, 180, 162, 0.3) 0%, rgba(255, 237, 213, 0.2) 40%, transparent 70%)',
                        transform: 'translate(30%, -30%)',
                        zIndex: 5,
                    }}
                />

                <div className="relative w-full max-w-7xl mx-auto px-6 py-24">
                {/* Headline only - larger size, full width */}
                <div className="flex flex-col items-center text-center mb-12">
                    {/* Headline - larger, no line break, full width */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 leading-[1.05] tracking-tight w-full max-w-6xl">
                        THE AI-POWERED JOB APPLICATION CLOSER.
                    </h1>
                </div>

                {/* SPOTLIGHT BEAM - Static Orange Light from Top (positioned lower) */}
                <div className="relative">
                    {/* Spotlight beam effect - always visible */}
                    <div 
                        className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
                        style={{
                            top: '20px',
                            width: '400px',
                            height: '900px',
                            background: 'linear-gradient(180deg, rgba(249, 115, 22, 0.4) 0%, rgba(249, 115, 22, 0.25) 20%, rgba(249, 115, 22, 0.15) 40%, rgba(249, 115, 22, 0.08) 60%, rgba(249, 115, 22, 0.03) 80%, transparent 100%)',
                            filter: 'blur(40px)',
                            zIndex: 1,
                        }}
                    />
                    
                    {/* Secondary glow for more dramatic effect */}
                    <div 
                        className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
                        style={{
                            top: '40px',
                            width: '600px',
                            height: '800px',
                            background: 'linear-gradient(180deg, rgba(249, 115, 22, 0.2) 0%, rgba(249, 115, 22, 0.12) 30%, rgba(249, 115, 22, 0.06) 50%, transparent 70%)',
                            filter: 'blur(60px)',
                            zIndex: 0,
                        }}
                    />

                    {/* Product Image - CENTER STAGE (illuminated by spotlight) */}
                    <div className="relative z-10 flex justify-center mb-16">
                        <div className="relative w-full max-w-3xl">
                            <img 
                                src="/job-png.png" 
                                alt="APPLYZERDashboard - AI-Powered Job Applications" 
                                className="w-full h-auto object-contain rounded-lg"
                            />
                        </div>
                    </div>
                </div>

                {/* Tagline + CTA below image */}
                <div className="flex flex-col items-center text-center mb-16">
                    {/* Tagline */}
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-8 max-w-2xl">
                        We don't just build resumes. We close applications. Automate the tedious parts of your job search while maintaining a human-level touch.
                    </p>

                    {/* CTA Button */}
                    <Link to="/sign-up">
                        <InteractiveHoverButton className="text-sm uppercase tracking-wider">
                            START FREE TODAY
                        </InteractiveHoverButton>
                    </Link>
                </div>

                {/* Supporting text at bottom - compact */}
                <div className="flex flex-col md:flex-row items-start justify-center gap-8 lg:gap-12 max-w-6xl mx-auto pt-12 border-t border-gray-200">
                    <div className="flex-1 max-w-xs">
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-3">
                            THE PROBLEM
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            High-quality candidates spend 10+ hours a week tailoring resumes and cover letters. 75% of resumes are rejected by ATS before a human ever sees them.
                        </p>
                    </div>

                    <div className="flex-1 max-w-xs">
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-3">
                            THE SOLUTION
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            APPLYZERuses AI-driven project matching and generates professional LaTeX resumes. We send personalized cold emails directly via your Gmail and track every interaction.
                        </p>
                    </div>

                    <div className="flex-1 max-w-xs">
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-3">
                            THE EDGE
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            WhatsApp-first pipeline for one-click apply. Autonomous follow-ups ensure you never drop the ball. Built for the Indian tech market.
                        </p>
                    </div>
                </div>
            </div>
            </section>
        </FloatingIconsBackground>
    )
}
