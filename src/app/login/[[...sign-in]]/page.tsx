import { SignIn } from '@clerk/nextjs'
import type { Metadata } from 'next'
import styles from '../login-shell.module.css'

export const metadata: Metadata = {
  title: 'Login | CallDrill',
  description: 'Sign in to CallDrill',
}

export default function LoginPage() {
  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <span className={styles.brand}>MockCaller</span>
      </header>
      <div className={styles.center}>
        <div className={styles.inner}>
          <SignIn path="/login" routing="path" />
        </div>
      </div>
    </main>
  )
}
