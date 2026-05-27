import { ManagerShell } from '@/components/ManagerShell'
import { ProgressBar } from '@/components/ProgressBar'
import {
  activities as mockActivities,
  strengths as mockStrengths,
  teamAccounts as mockTeamAccounts,
  trainees as mockTrainees,
} from '@/data/mockData'
import type { Activity, Strength, TeamAccount, Trainee } from '@/types'
import styles from '@/app/managers-dashboard/managers-dashboard.module.css'

type DashboardPageProps = {
  trainees: Trainee[]
  teamAccounts: TeamAccount[]
  strengths: Strength[]
  activities: Activity[]
  lastUpdatedLabel?: string
}

type MetricCardProps = {
  label: string
  value: string
  footnote: string
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

function MetricCard({ label, value, footnote }: MetricCardProps) {
  return (
    <article className={styles.metricCard}>
      <span className={styles.metricIcon}>{label.charAt(0)}</span>
      <p>{label}</p>
      <strong>{value}</strong>
      <small>{footnote}</small>
    </article>
  )
}

function TraineeTable({ trainees }: { trainees: Trainee[] }) {
  return (
    <div className={styles.tableWrap}>
      <table>
        <thead>
          <tr>
            <th>Trainee</th>
            <th>Current Level</th>
            <th>Last Score</th>
            <th>Progress</th>
            <th>Profile</th>
          </tr>
        </thead>
        <tbody>
          {trainees.map((trainee) => (
            <tr key={trainee.id}>
              <td>
                <div className={styles.personCell}>
                  <span>{trainee.id}</span>
                  <div>
                    <strong>{trainee.name}</strong>
                    <small>{trainee.joined}</small>
                  </div>
                </div>
              </td>
              <td><span className={styles.levelTag}>{trainee.level}</span></td>
              <td><strong>{trainee.score}/100</strong></td>
              <td><ProgressBar value={trainee.progress} /></td>
              <td><button className="link-button" type="button">View</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function StrengthCard({ strengths }: { strengths: Strength[] }) {
  return (
    <article className={styles.panel}>
      <h2>Team Core Strengths</h2>
      <div className={styles.strengthList}>
        {strengths.map((strength) => (
          <div key={strength.label}>
            <div className={styles.strengthRow}>
              <span>{strength.label}</span>
              <strong>{strength.value}%</strong>
            </div>
            <ProgressBar value={strength.value} />
          </div>
        ))}
      </div>
    </article>
  )
}

function ActivityFeed({ activities }: { activities: Activity[] }) {
  return (
    <article className={styles.panel}>
      <h2>Recent Activity</h2>
      <ul className={styles.activityList}>
        {activities.map((activity) => (
          <li key={activity.id}>{activity.message}</li>
        ))}
      </ul>
    </article>
  )
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
    <ManagerShell title="Manager Dashboard">
      <div className="manager-view">
        <div className={styles.pageHeading}>
          <div>
            <h1>Team Intelligence Overview</h1>
            <p>Real-time performance metrics across all active training tracks.</p>
          </div>
          <div className={styles.statusRow}>
            <span className={styles.livePill}>Live Feed</span>
            <span className={styles.softPill}>{lastUpdatedLabel}</span>
          </div>
        </div>

        <section className={styles.metricGrid}>
          <article className={styles.heroMetric}>
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

        <section className={styles.dashboardGrid}>
          <article className={`${styles.panel} ${styles.rosterPanel}`}>
            <div className={styles.panelHeading}>
              <h2>Trainee Roster</h2>
              <button className="link-button" type="button">Export Report</button>
            </div>
            <TraineeTable trainees={trainees} />
          </article>

          <aside className={styles.sideStack}>
            <StrengthCard strengths={strengths} />
            <ActivityFeed activities={activities} />
          </aside>
        </section>
      </div>
    </ManagerShell>
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
