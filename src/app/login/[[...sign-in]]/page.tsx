import { SignIn } from '@clerk/nextjs'
import type { Metadata } from 'next'
import styles from '../login-shell.module.css'

export const metadata: Metadata = {
  title: 'Login | MockCaller',
  description: 'Sign in to MockCaller',
}

const clerkAppearance = {
  variables: {
    colorPrimary:         '#004d75',
    colorBackground:      '#ffffff',
    colorText:            '#191c1f',
    colorTextSecondary:   '#707880',
    colorInputBackground: '#f2f3f8',
    colorInputText:       '#191c1f',
    borderRadius:         '12px',
    fontFamily:           'Inter, ui-sans-serif, sans-serif',
    fontSize:             '0.875rem',
  },
  elements: {
    card: {
      boxShadow: '0 4px 24px rgba(0,30,49,0.07)',
      border:    'none',
      padding:   '32px',
    },
    headerTitle: {
      fontFamily: 'Manrope, sans-serif',
      fontWeight: 700,
      color:      '#191c1f',
    },
    headerSubtitle: {
      color: '#707880',
    },
    formButtonPrimary: {
      background:    'linear-gradient(135deg, #004d75, #006699)',
      fontWeight:    600,
      letterSpacing: '0.01em',
      boxShadow:     'none',
    },
    formFieldInput: {
      borderColor:   '#c0c7d0',
      borderRadius:  '10px',
    },
    footerActionLink: {
      color: '#006699',
    },
    identityPreviewText: {
      color: '#191c1f',
    },
  },
}

export default function LoginPage() {
  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <span className={styles.brand}>MockCaller</span>
      </header>
      <div className={styles.center}>
        <div className={styles.inner}>
          <SignIn
            path="/login"
            routing="path"
            signUpUrl="/sign-up"
            fallbackRedirectUrl="/"
            appearance={clerkAppearance}
          />
        </div>
      </div>
    </main>
  )
}
