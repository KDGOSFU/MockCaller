import type { Metadata } from 'next'
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
      <body>{children}</body>
    </html>
  )
}
