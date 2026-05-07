'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { Topbar } from '@/components/Topbar'
import {
  activities,
  callAnalysis,
  scenarios,
  strengths,
  teamAccounts,
  trainees,
} from '@/data/mockData'
import { CallAnalysisPage } from '@/views/CallAnalysisPage'
import { CallScenariosPage } from '@/views/CallScenariosPage'
import { DashboardPage } from '@/views/DashboardPage'
import type { ViewKey } from '@/types'

export default function Home() {
  const [activeView, setActiveView] = useState<ViewKey>('overview')

  return (
    <main className="app-shell">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <section className="workspace">
        <Topbar />
        {activeView === 'overview' ? (
          <DashboardPage
            activities={activities}
            strengths={strengths}
            teamAccounts={teamAccounts}
            trainees={trainees}
          />
        ) : null}
        {activeView === 'analysis' ? <CallAnalysisPage analysis={callAnalysis} /> : null}
        {activeView === 'scenarios' ? <CallScenariosPage scenarios={scenarios} /> : null}
      </section>
    </main>
  )
}
