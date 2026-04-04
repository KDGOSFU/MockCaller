import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CallDrill',
  description: 'An AI fundraising call simulator',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
