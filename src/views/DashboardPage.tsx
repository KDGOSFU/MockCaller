import { ActivityFeed } from '@/components/ActivityFeed'
import { MetricCard } from '@/components/MetricCard'
import { StrengthCard } from '@/components/StrengthCard'
import { TraineeTable } from '@/components/TraineeTable'
import {
  activities as mockActivities,
  strengths as mockStrengths,
  teamAccounts as mockTeamAccounts,
  trainees as mockTrainees,
} from '@/data/mockData'
import type { Activity, Strength, TeamAccount, Trainee } from '@/types'

type DashboardPageProps = {
  trainees: Trainee[]
  teamAccounts: TeamAccount[]
  strengths: Strength[]
  activities: Activity[]
  lastUpdatedLabel?: string
}

function average(values: number[]) {
  if (values.length === 0) {
    return 0
  }

  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
}

function conversionRate(accounts: TeamAccount[]) {
  if (accounts.length === 0) {
    return 0
  }

  return Math.round((accounts.filter((account) => account.converted).length / accounts.length) * 100)
}

export function DashboardPage({
  trainees,
  teamAccounts,
  strengths,
  activities,
  lastUpdatedLabel = 'Last updated: 2m ago',
}: DashboardPageProps) {
  const teamScore = average(teamAccounts.map((account) => account.empathyScore))
  const trainingHours = teamAccounts.reduce((sum, account) => sum + account.trainingHours, 0)

  return (
    <div className="view">
      <div className="page-heading">
        <div>
          <h1>Team Intelligence Overview</h1>
          <p>Real-time performance metrics across all active training tracks.</p>
        </div>
        <div className="status-row">
          <span className="live-pill">Live Feed</span>
          <span className="soft-pill">{lastUpdatedLabel}</span>
        </div>
      </div>

      <section className="metric-grid">
        <article className="hero-metric">
          <span>Avg. Team Empathy Score</span>
          <strong>{teamScore}%</strong>
          <p>Your team is performing 8% above sector average in emotional intelligence modules.</p>
        </article>
        <MetricCard
          label="Conversion Rate"
          value={`${conversionRate(teamAccounts)}%`}
          footnote="Based on active donor simulations"
        />
        <MetricCard
          label="Training Hours"
          value={trainingHours.toFixed(1)}
          footnote="+18.4 hrs vs last week"
        />
      </section>

      <section className="dashboard-grid">
        <article className="panel roster-panel">
          <div className="panel-heading">
            <h2>Trainee Roster</h2>
            <button className="link-button" type="button">Export Report</button>
          </div>
          <TraineeTable trainees={trainees} />
        </article>

        <aside className="side-stack">
          <StrengthCard strengths={strengths} />
          <ActivityFeed activities={activities} />
        </aside>
      </section>
    </div>
  )
}

export default function DashboardPageRoute() {
  return (
    <DashboardPage
      activities={mockActivities}
      strengths={mockStrengths}
      teamAccounts={mockTeamAccounts}
      trainees={mockTrainees}
    />
  )
}
