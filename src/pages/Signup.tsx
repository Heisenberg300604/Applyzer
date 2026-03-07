import { SignUp } from '@clerk/react'
import { Link } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'

const perks = [
    'Free forever plan — no credit card required',
    'AI resume + cover letter generation',
    'Bulk apply across LinkedIn, Indeed & more',
    'Gmail integration for direct outreach',
    'Smart application tracker included',
]

export default function SignUpPage() {
    return (
        <div className="min-h-screen flex">
            {/* Left branding panel */}
            <div className="hidden lg:flex w-[480px] flex-shrink-0 flex-col justify-between p-12 bg-[#0a0a0a] border-r border-white/5">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <img src="/logo.png" alt="Applyzer" className="w-8 h-8 object-contain rounded-md" onError={e => { e.currentTarget.style.display='none' }} />
                    <span className="text-white font-bold text-lg">
                        Apply<span className="text-orange-500">zer</span>
                    </span>
                </Link>

                {/* Value prop */}
                <div>
                    <h2 className="text-3xl font-extrabold text-white mb-3 leading-tight">
                        Start landing interviews{' '}
                        <span className="text-orange-500">today.</span>
                    </h2>
                    <p className="text-gray-400 text-base mb-8 leading-relaxed">
                        Join 2,400+ job seekers who've automated their entire application pipeline.
                        Set up in under 2 minutes.
                    </p>

                    <ul className="space-y-3 mb-10">
                        {perks.map(perk => (
                            <li key={perk} className="flex items-start gap-3">
                                <CheckCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-300 text-sm">{perk}</span>
                            </li>
                        ))}
                    </ul>

                    {/* Aggregate stat */}
                    <div className="bg-white/5 border border-white/8 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-2">
                                {['AC', 'PS', 'JL', 'MK'].map((init, i) => (
                                    <div
                                        key={i}
                                        className="w-8 h-8 rounded-full border-2 border-[#0a0a0a] flex items-center justify-center text-white text-xs font-bold"
                                        style={{ backgroundColor: ['#f97316', '#10b981', '#8b5cf6', '#3b82f6'][i] }}
                                    >
                                        {init}
                                    </div>
                                ))}
                            </div>
                            <p className="text-gray-400 text-xs">
                                <span className="text-white font-semibold">2,400+</span> users already on board
                            </p>
                        </div>
                    </div>
                </div>

                <p className="text-gray-600 text-xs">© {new Date().getFullYear()} Applyzer</p>
            </div>

            {/* Right auth panel */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#fafafa] min-h-screen">
                {/* Mobile logo */}
                <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
                    <img src="/logo.png" alt="Applyzer" className="w-8 h-8 object-contain rounded-md" onError={e => { e.currentTarget.style.display='none' }} />
                    <span className="text-gray-900 font-bold text-lg">
                        Apply<span className="text-orange-500">zer</span>
                    </span>
                </Link>
                <div className="w-full max-w-[420px]">
                    <SignUp forceRedirectUrl="/dashboard" />
                </div>
            </div>
        </div>
    )
}
