import { SignIn } from '@clerk/react'
import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'

const testimonial = {
    text: "I applied to 47 companies in a single afternoon. Got 3 interview calls within 2 weeks — more than I'd gotten in the previous 3 months combined.",
    name: 'Alex Chen',
    role: 'Software Engineer · ex-Meta',
    initials: 'AC',
}

export default function SignInPage() {
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

                {/* Testimonial */}
                <div>
                    <div className="mb-10">
                        <div className="flex items-center gap-0.5 mb-6">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-orange-400 text-orange-400" />
                            ))}
                        </div>
                        <blockquote className="text-white text-xl font-medium leading-relaxed mb-6">
                            "{testimonial.text}"
                        </blockquote>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                {testimonial.initials}
                            </div>
                            <div>
                                <p className="text-white font-semibold text-sm">{testimonial.name}</p>
                                <p className="text-gray-500 text-xs">{testimonial.role}</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/5">
                        {[
                            { value: '45K+', label: 'Applications' },
                            { value: '34%', label: 'Reply Rate' },
                            { value: '2 Min', label: 'Setup' },
                        ].map(s => (
                            <div key={s.label}>
                                <p className="text-white font-extrabold text-xl">{s.value}</p>
                                <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
                            </div>
                        ))}
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
                    <SignIn forceRedirectUrl="/dashboard" />
                </div>
            </div>
        </div>
    )
}
