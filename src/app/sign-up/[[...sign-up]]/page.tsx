import { SignUp } from '@clerk/nextjs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up | MockCaller',
  description: 'Create your MockCaller account',
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

export default function SignUpPage() {
  return (
    <main className="login-page">
      <div className="login-page-center">
        <div className="login-page-inner">
          <span className="login-page-brand">MockCaller</span>
          <SignUp
            path="/sign-up"
            routing="path"
            signInUrl="/login"
            fallbackRedirectUrl="/trainee/dashboard"
            appearance={clerkAppearance}
          />
        </div>
      </div>
    </main>
  )
}
