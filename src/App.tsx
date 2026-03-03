import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { UserProvider } from '@/context/UserContext'
import Landing from '@/pages/Landing'
import Signup from '@/pages/Signup'
import Login from '@/pages/Login'

// Placeholder pages — to be built in later phases
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="min-h-screen gradient-hero flex items-center justify-center">
    <div className="text-center">
      <div className="text-6xl mb-4">🚧</div>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{title}</h1>
      <p className="text-gray-500">This page is coming soon in the next phase.</p>
      <a href="/" className="mt-6 inline-flex text-violet-600 font-semibold hover:underline">← Back to Home</a>
    </div>
  </div>
)

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          {/* Phase 1 — Landing */}
          <Route path="/" element={<Landing />} />

          {/* Phase 2 — Auth */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Phase 3+ — Placeholders */}
          <Route path="/profile" element={<PlaceholderPage title="Profile Builder" />} />
          <Route path="/jobs" element={<PlaceholderPage title="Job Search" />} />
          <Route path="/apply" element={<PlaceholderPage title="Bulk Apply" />} />
          <Route path="/dashboard" element={<PlaceholderPage title="Application Dashboard" />} />
          <Route path="/resume" element={<PlaceholderPage title="Resume & Cover Letter" />} />

          {/* 404 */}
          <Route path="*" element={<PlaceholderPage title="404 — Page Not Found" />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  )
}
