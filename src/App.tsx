import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { UserProvider } from '@/context/UserContext'

// Public pages
import Landing from '@/pages/Landing'
import SignInPage from '@/pages/SignIn'
import SignUpPage from '@/pages/SignUp'

// Layout & authenticated pages
import DashboardLayout from '@/components/DashboardLayout'
import Dashboard from '@/pages/Dashboard'
import Profile from '@/pages/Profile'
import Jobs from '@/pages/Jobs'
import Apply from '@/pages/Apply'
import Resume from '@/pages/Resume'
import Notifications from '@/pages/Notifications'

// 404 catch-all
const NotFound = () => (
  <div className="min-h-screen gradient-hero flex items-center justify-center text-center">
    <div>
      <p className="text-8xl mb-4">🤖</p>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-2">404 — Page Not Found</h1>
      <p className="text-gray-500 mb-6">Looks like this page got lost in the job market.</p>
      <a href="/" className="gradient-violet text-white px-6 py-3 rounded-xl font-bold inline-block shadow-lg shadow-violet-200 hover:opacity-90 transition-opacity">
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
            <Route path="/notifications" element={<Notifications />} />
          </Route>

          {/* ── 404 ─────────────────────────────────────────────── */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  )
}
