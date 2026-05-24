import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

export const metadata: Metadata = {
  title: 'MockCaller',
  description: 'An AI fundraising call simulator',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
          {children}
      </body>
    </html>
  )
}
