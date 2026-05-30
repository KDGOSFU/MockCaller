'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { ManagerShell } from '@/components/ManagerShell'
import { ProgressBar } from '@/components/ProgressBar'
import {

  strengths as mockStrengths,
  teamAccounts as mockTeamAccounts,
  trainees as mockTrainees,
} from '@/data/mockData'
import { createClient } from '@/utils/supabase/client'
import type { Strength, TeamAccount, Trainee } from '@/types'
import styles from '@/app/managers-dashboard/managers-dashboard.module.css'

type DashboardPageProps = {
  trainees: Trainee[]
  teamAccounts: TeamAccount[]
  strengths: Strength[]
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

type RecentCall = { id: string; message: string }

function useRecentActivity() {
  const [items, setItems] = useState<RecentCall[]>([])

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('call_sessions')
      .select('id, userId, scenarioId, endedAt')
      .eq('status', 'COMPLETED')
      .order('endedAt', { ascending: false })
      .limit(3)
      .then(async ({ data: sessions }) => {
        if (!sessions || sessions.length === 0) return

        const userIds     = [...new Set(sessions.map((s) => s.userId))]
        const scenarioIds = [...new Set(sessions.map((s) => s.scenarioId))]

        const [{ data: users }, { data: scenarios }] = await Promise.all([
          supabase.from('users').select('id, name').in('id', userIds),
          supabase.from('scenarios').select('id, title').in('id', scenarioIds),
        ])

        const userMap     = new Map((users     ?? []).map((u) => [u.id, u.name]))
        const scenarioMap = new Map((scenarios ?? []).map((s) => [s.id, s.title]))

        setItems(sessions.map((s) => {
          const firstName    = (userMap.get(s.userId) ?? 'A trainee').split(' ')[0]
          const scenarioName = scenarioMap.get(s.scenarioId) ?? 'a scenario'
          return { id: s.id, message: `${firstName} completed "${scenarioName}" with a grade of A-` }
        }))
      })
  }, [])

  return items
}

function ActivityFeed() {
  const activities = useRecentActivity()

  return (
    <article className={styles.panel}>
      <h2>Recent Activity</h2>
      <ul className={styles.activityList}>
        {activities.length === 0 && (
          <li style={{ listStyle: 'none', color: 'var(--outline)' }}>No recent activity yet.</li>
        )}
        {activities.map((a) => (
          <li key={a.id}>{a.message}</li>
        ))}
      </ul>
    </article>
  )
}

function useTotalCallTime() {
  const [totalSec, setTotalSec] = useState<number | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('call_sessions')
      .select('durationSec')
      .eq('status', 'COMPLETED')
      .then(({ data }) => {
        if (!data) return
        const sum = data.reduce((acc, r) => acc + (r.durationSec ?? 0), 0)
        setTotalSec(sum)
      })
  }, [])

  return totalSec
}

function formatTotalTime(sec: number) {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export function DashboardPage({
  trainees,
  teamAccounts,
  strengths,
  lastUpdatedLabel = 'Last updated: 2m ago',
}: DashboardPageProps) {
  const { user } = useUser()
  const firstName = user?.firstName ?? 'there'
  const teamScore = average(teamAccounts.map((account) => account.empathyScore))
  const trainingHours = teamAccounts.reduce((sum, account) => sum + account.trainingHours, 0)
  const totalCallSec = useTotalCallTime()

  return (
    <ManagerShell title="Manager Dashboard">
      <div className="manager-view">
        <div className={styles.pageHeading}>
          <div>
            <h1>Welcome back, {firstName}.</h1>
            <p>Here is how your team is doing.</p>
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
            label="Total Call Time"
            value={totalCallSec === null ? '—' : formatTotalTime(totalCallSec)}
            footnote="Across all trainees, completed calls"
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
            <ActivityFeed />
          </aside>
        </section>
      </div>
    </ManagerShell>
  )
}

export default function DashboardPageRoute() {
  return (
    <DashboardPage
      strengths={mockStrengths}
      teamAccounts={mockTeamAccounts}
      trainees={mockTrainees}
    />
  )
}
