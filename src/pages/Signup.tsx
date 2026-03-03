import { Link } from 'react-router-dom'
import { Bot, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export default function Signup() {
    const [form, setForm] = useState({ name: '', email: '', phone: '' })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: POST /api/v1/users/ → store user_id in context
        console.log('Signup:', form)
    }

    return (
        <div className="min-h-screen gradient-hero flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 rounded-xl gradient-violet flex items-center justify-center shadow-lg">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-extrabold text-gray-900">Apply<span className="text-gradient-violet">Bot</span></span>
                    </Link>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Create your account</h1>
                    <p className="text-gray-500">Start applying smarter — for free.</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl shadow-violet-100/50 border border-violet-50 p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                            <Input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required className="rounded-xl border-gray-200 focus:border-violet-400" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                            <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" required className="rounded-xl border-gray-200 focus:border-violet-400" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone (optional)</label>
                            <Input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+1 234 567 890" className="rounded-xl border-gray-200 focus:border-violet-400" />
                        </div>
                        <Button type="submit" className="w-full gradient-violet text-white border-0 rounded-xl h-12 font-bold text-base shadow-lg shadow-violet-200 hover:opacity-90 transition-opacity">
                            Create Account
                        </Button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-violet-600 font-semibold hover:underline">Sign in</Link>
                    </p>
                </div>

                <Link to="/" className="flex items-center justify-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors mt-6">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>
            </div>
        </div>
    )
}
