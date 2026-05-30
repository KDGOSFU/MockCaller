'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, CheckCircle2, Clock } from 'lucide-react'
import { ManagerShell } from '@/components/ManagerShell'
import { ProgressBar } from '@/components/ProgressBar'
import { createClient } from '@/utils/supabase/client'
import styles from '@/app/managers-dashboard/managers-dashboard.module.css'
import modalStyles from './TeamAnalyticsPage.module.css'

type TraineeProfile = {
  id: string
  name: string | null
  email: string
  totalCalls: number
  totalSec: number
  completedScenarios: number
}

type CallLog = {
  id: string
  status: string
  startedAt: string
  durationSec: number | null
  scenarioTitle: string
}

function formatDuration(sec: number) {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function CallLogsModal({ trainee, onClose }: { trainee: TraineeProfile; onClose: () => void }) {
  const router                = useRouter()
  const [logs, setLogs]       = useState<CallLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('call_sessions')
      .select('id, status, startedAt, durationSec, scenarioId')
      .eq('userId', trainee.id)
      .order('startedAt', { ascending: false })
      .then(async ({ data: sessions }) => {
        if (!sessions || sessions.length === 0) { setLoading(false); return }

        const scenarioIds = [...new Set(sessions.map((s) => s.scenarioId))]
        const { data: scenarios } = await supabase
          .from('scenarios')
          .select('id, title')
          .in('id', scenarioIds)

        const titleMap = new Map((scenarios ?? []).map((s) => [s.id, s.title]))

        setLogs(sessions.map((s) => ({
          id:            s.id,
          status:        s.status,
          startedAt:     s.startedAt,
          durationSec:   s.durationSec,
          scenarioTitle: titleMap.get(s.scenarioId) ?? 'Unknown Scenario',
        })))
        setLoading(false)
      })
  }, [trainee.id])

  return (
    <div className={modalStyles.overlay} onClick={onClose}>
      <div className={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={modalStyles.modalHeader}>
          <div>
            <h2 className={modalStyles.modalTitle}>{trainee.name ?? trainee.email}</h2>
            <p className={modalStyles.modalSub}>{trainee.email} · {trainee.totalCalls} total calls</p>
          </div>
          <button className={modalStyles.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>

        {loading && <p className={modalStyles.empty}>Loading call logs...</p>}

        {!loading && logs.length === 0 && (
          <p className={modalStyles.empty}>No call logs found for this trainee.</p>
        )}

        {!loading && logs.length > 0 && (
          <div className={modalStyles.logList}>
            {logs.map((log) => {
              const completed = log.status === 'COMPLETED'
              return (
                <div
                  key={log.id}
                  className={`${modalStyles.logItem} ${modalStyles.logItemClickable}`}
                  onClick={() => { onClose(); router.push(`/feedback-analytics/session?sessionId=${log.id}`) }}
                >
                  <div className={`${modalStyles.logIcon} ${completed ? modalStyles.logIconDone : modalStyles.logIconPending}`}>
                    {completed ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                  </div>
                  <div className={modalStyles.logBody}>
                    <p className={modalStyles.logTitle}>{log.scenarioTitle}</p>
                    <p className={modalStyles.logMeta}>{formatDate(log.startedAt)}</p>
                  </div>
                  <div className={modalStyles.logRight}>
                    <span className={`${modalStyles.statusBadge} ${completed ? modalStyles.statusCompleted : modalStyles.statusIncomplete}`}>
                      {completed ? 'Completed' : 'Incomplete'}
                    </span>
                    {log.durationSec != null && log.durationSec > 0 && (
                      <span className={modalStyles.duration}>{formatDuration(log.durationSec)}</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default function TeamAnalyticsPage() {
  const [trainees, setTrainees]           = useState<TraineeProfile[]>([])
  const [loading, setLoading]             = useState(true)
  const [selected, setSelected]           = useState<TraineeProfile | null>(null)

  useEffect(() => {
    const supabase = createClient()

    Promise.all([
      supabase.from('users').select('id, name, email'),
      supabase.from('call_sessions').select('userId, durationSec, scenarioId').eq('status', 'COMPLETED'),
    ]).then(([usersRes, sessionsRes]) => {
      const users    = usersRes.data    ?? []
      const sessions = sessionsRes.data ?? []

      const profiles: TraineeProfile[] = users.map((u) => {
        const userSessions    = sessions.filter((s) => s.userId === u.id)
        const totalSec        = userSessions.reduce((sum, s) => sum + (s.durationSec ?? 0), 0)
        const uniqueScenarios = new Set(userSessions.map((s) => s.scenarioId)).size
        return {
          id:                 u.id,
          name:               u.name,
          email:              u.email,
          totalCalls:         userSessions.length,
          totalSec,
          completedScenarios: uniqueScenarios,
        }
      })

      setTrainees(profiles.sort((a, b) => b.totalCalls - a.totalCalls))
      setLoading(false)
    })
  }, [])

  return (
    <ManagerShell title="Team Analytics">
      <div className="manager-view">
        <div className={styles.pageHeading}>
          <div>
            <h1>Trainee Profiles</h1>
            <p>Performance overview across all active trainees.</p>
          </div>
        </div>

        {loading && <p style={{ color: 'var(--outline)' }}>Loading...</p>}

        {!loading && (
          <section className={`${styles.panel} ${styles.rosterPanel}`}>
            <div className={styles.panelHeading}>
              <h2>All Trainees</h2>
            </div>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>Trainee</th>
                    <th>Total Calls</th>
                    <th>Total Call Time</th>
                    <th>Scenarios Attempted</th>
                    <th>Activity</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {trainees.length === 0 && (
                    <tr><td colSpan={6} style={{ color: 'var(--outline)', textAlign: 'center', padding: '24px' }}>No trainees found.</td></tr>
                  )}
                  {trainees.map((t) => {
                    const activityPct = Math.min(100, t.totalCalls * 10)
                    return (
                      <tr key={t.id}>
                        <td>
                          <div className={styles.personCell}>
                            <span>{t.name?.[0]?.toUpperCase() ?? '?'}</span>
                            <div>
                              <strong>{t.name ?? '—'}</strong>
                              <small>{t.email}</small>
                            </div>
                          </div>
                        </td>
                        <td><strong>{t.totalCalls}</strong></td>
                        <td><strong>{t.totalSec > 0 ? formatDuration(t.totalSec) : '—'}</strong></td>
                        <td><span className={styles.levelTag}>{t.completedScenarios}</span></td>
                        <td style={{ minWidth: 120 }}><ProgressBar value={activityPct} /></td>
                        <td>
                          <button className="link-button" type="button" onClick={() => setSelected(t)}>
                            View Profile
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>

      {selected && <CallLogsModal trainee={selected} onClose={() => setSelected(null)} />}
    </ManagerShell>
  )
}
