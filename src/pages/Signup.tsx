import { SignUp } from '@clerk/react'

export default function SignUpPage() {
  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-6">
      <SignUp forceRedirectUrl="/dashboard" />
    </div>
  )
}
