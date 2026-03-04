import { SignIn } from '@clerk/react'

export default function SignInPage() {
  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-6">
      <SignIn />
    </div>
  )
}