import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Trainee Dashboard | CallDrill',
  description: 'Your practice overview and scenarios',
}

export default function TraineeDashboardPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900">Trainee Dashboard</h1>
      <p className="mt-2 text-slate-600">Scenarios, progress, and recent sessions will go here.</p>
    </main>
  )
}
