import { SignIn } from '@clerk/nextjs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login | CallDrill',
  description: 'Sign in to CallDrill',
}

export default function LoginPage() {
  return (
    <main className="login-page">
      <header className="login-page-topbar">
        <span className="login-page-brand">MockCaller</span>
      </header>
      <div className="login-page-center">
        <div className="login-page-inner">
          <SignIn path="/login" routing="path" />
        </div>
      </div>
    </main>
  )
}
