import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { UserProvider } from '@/context/UserContext'

// Public pages
import Landing from '@/pages/Landing'
import SignInPage from '@/pages/SignIn'
import SignUpPage from '@/pages/Signup'

// Layout & authenticated pages
import DashboardLayout from '@/components/DashboardLayout'
import Dashboard from '@/pages/Dashboard'
import Profile from '@/pages/Profile'
import Jobs from '@/pages/Jobs'
import Apply from '@/pages/Apply'
import Resume from '@/pages/Resume'

// 404 catch-all
const NotFound = () => (
  <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-center px-6">
    <div>
      <p className="text-7xl font-extrabold text-white/10 mb-2 select-none">404</p>
      <h1 className="text-4xl font-extrabold text-white mb-3">Page Not Found</h1>
      <p className="text-gray-400 mb-8 max-w-sm mx-auto">
        Looks like this page got lost in the job market.
      </p>
      <a
        href="/"
        className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-orange-500/20 transition-colors duration-200"
      >
        ← Back to Home
      </a>
    </div>
  </div>
)

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Public routes ─────────────────────────────────────── */}
          <Route path="/" element={<Landing />} />
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />

          {/* ── Authenticated routes (shared DashboardLayout sidebar) ── */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/apply" element={<Apply />} />
            <Route path="/resume" element={<Resume />} />
          </Route>

          {/* ── 404 ─────────────────────────────────────────────── */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  )
}
