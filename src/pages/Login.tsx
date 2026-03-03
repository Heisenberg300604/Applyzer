import { Link } from 'react-router-dom'
import { Bot, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export default function Login() {
    const [userId, setUserId] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: store user_id in context/localStorage — no JWT in current backend
        localStorage.setItem('applybot_user_id', userId)
        console.log('Login with user_id:', userId)
    }

    return (
        <div className="min-h-screen gradient-hero flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 rounded-xl gradient-violet flex items-center justify-center shadow-lg">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-extrabold text-gray-900">Apply<span className="text-gradient-violet">Bot</span></span>
                    </Link>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome back</h1>
                    <p className="text-gray-500">Enter your User ID to continue.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl shadow-violet-100/50 border border-violet-50 p-8">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                        <p className="text-sm text-amber-700 font-medium">
                            ⚠️ Note: The backend currently uses <code className="bg-amber-100 px-1 rounded">user_id</code> as authentication (no JWT yet). Enter the ID you received when signing up.
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">User ID</label>
                            <Input
                                value={userId}
                                onChange={e => setUserId(e.target.value)}
                                placeholder="e.g. 1"
                                required
                                className="rounded-xl border-gray-200 focus:border-violet-400"
                            />
                        </div>
                        <Button type="submit" className="w-full gradient-violet text-white border-0 rounded-xl h-12 font-bold text-base shadow-lg shadow-violet-200">
                            Sign In
                        </Button>
                    </form>
                    <p className="text-center text-sm text-gray-500 mt-6">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-violet-600 font-semibold hover:underline">Create one</Link>
                    </p>
                </div>

                <Link to="/" className="flex items-center justify-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors mt-6">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>
            </div>
        </div>
    )
}
