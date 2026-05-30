'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { CheckCircle2, Clock, ChevronRight } from 'lucide-react'
import { TraineeSidebar } from '@/components/TraineeSidebar'
import { createClient } from '@/utils/supabase/client'
import { callAnalysis as mockAnalysis } from '@/data/mockData'
import traineeStyles from './TraineeDashboard.module.css'
import styles from './TraineeAnalyticsListPage.module.css'

type CallEntry = {
  id: string
  scenarioTitle: string
  scenarioId: string
  startedAt: string
  durationSec: number | null
  status: string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-CA', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

function formatDuration(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

export default function TraineeAnalyticsListPage() {
  const router               = useRouter()
  const { user }             = useUser()
  const firstName            = user?.firstName ?? 'there'
  const [calls, setCalls]    = useState<CallEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return
    const supabase = createClient()

    supabase
      .from('call_sessions')
      .select('id, status, startedAt, durationSec, scenarioId')
      .eq('userId', user.id)
      .order('startedAt', { ascending: false })
      .then(async ({ data: sessions }) => {
        if (!sessions || sessions.length === 0) { setLoading(false); return }

        const scenarioIds = [...new Set(sessions.map((s) => s.scenarioId))]
        const { data: scenarios } = await supabase
          .from('scenarios')
          .select('id, title')
          .in('id', scenarioIds)

        const titleMap = new Map((scenarios ?? []).map((s) => [s.id, s.title]))

        setCalls(sessions.map((s) => ({
          id:             s.id,
          scenarioTitle:  titleMap.get(s.scenarioId) ?? 'Unknown Scenario',
          scenarioId:     s.scenarioId,
          startedAt:      s.startedAt,
          durationSec:    s.durationSec,
          status:         s.status,
        })))
        setLoading(false)
      })
  }, [user?.id])

  return (
    <div className={traineeStyles.page}>
      <TraineeSidebar />
      <div className={traineeStyles.contentWrapper}>
        <div className={styles.inner}>
          <div className={styles.heading}>
            <h1>Here are the analytics of your calls, {firstName}.</h1>
            <p>Click on any session to view your full performance breakdown.</p>
          </div>

          {loading && <p className={styles.empty}>Loading your calls...</p>}
          {!loading && calls.length === 0 && (
            <p className={styles.empty}>No calls yet. Complete a mock call to see your analytics here.</p>
          )}

          {!loading && calls.length > 0 && (
            <div className={styles.list}>
              {calls.map((call) => {
                const completed = call.status === 'COMPLETED'
                return (
                  <div
                    key={call.id}
                    className={`${styles.card} ${completed ? styles.cardClickable : styles.cardIncomplete}`}
                    onClick={() => completed && router.push(`/trainee/results?sessionId=${call.id}`)}
                  >
                    <div className={`${styles.iconWrap} ${completed ? styles.iconDone : styles.iconPending}`}>
                      {completed ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                    </div>

                    <div className={styles.cardBody}>
                      <p className={styles.scenarioTitle}>{call.scenarioTitle}</p>
                      <p className={styles.meta}>
                        {formatDate(call.startedAt)}
                        {call.durationSec != null && call.durationSec > 0 && ` · ${formatDuration(call.durationSec)}`}
                      </p>
                    </div>

                    <div className={styles.cardRight}>
                      {completed ? (
                        <>
                          <span className={styles.grade}>{mockAnalysis.grade}</span>
                          <ChevronRight size={16} className={styles.chevron} />
                        </>
                      ) : (
                        <span className={styles.incompleteBadge}>Incomplete</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
