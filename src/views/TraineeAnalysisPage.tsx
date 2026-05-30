'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { TraineeSidebar } from '@/components/TraineeSidebar'
import { ProgressBar } from '@/components/ProgressBar'
import { createClient } from '@/utils/supabase/client'
import { callAnalysis as mockCallAnalysis } from '@/data/mockData'
import type { CallAnalysis, TimelineEventData } from '@/types'
import styles from '@/app/feedback-analytics/feedback-analytics.module.css'
import traineeStyles from './TraineeDashboard.module.css'

function TimelineEvent({ event }: { event: TimelineEventData }) {
  const toneClass = event.tone === 'peak' ? '' : styles[event.tone]
  return (
    <article className={[styles.timelineItem, toneClass].filter(Boolean).join(' ')}>
      <time>{event.time}</time>
      <div className={styles.timelineCard}>
        <span>{event.label}</span>
        <h3>{event.title}</h3>
        <p>{event.copy}</p>
      </div>
    </article>
  )
}

function AnalysisContent({ analysis, backHref, scenarioId }: { analysis: CallAnalysis; backHref: string; scenarioId: string | null }) {
  const router = useRouter()

  const retakeHref = scenarioId ? `/call?scenarioId=${scenarioId}` : '/call'

  return (
    <div className="manager-view manager-narrow-view">
      <div className={styles.breadcrumb}>Analysis / Session #{analysis.sessionId}</div>
      <div className={styles.analysisHeading}>
        <div>
          <h1>{analysis.title}</h1>
          <p>{analysis.description}</p>
        </div>
        <div className={styles.buttonRow}>
          <button className="secondary-button" type="button" onClick={() => router.push(backHref)}>
            Back to Dashboard
          </button>
          <button className="primary-button" type="button" onClick={() => router.push(retakeHref)}>
            Retake Call
          </button>
        </div>
      </div>

      <section className={styles.analysisGrid}>
        <article className={styles.gradeCard}>
          <span>Overall Grade</span>
          <strong>{analysis.grade}</strong>
          <p>{analysis.percentileLabel}</p>
        </article>
        <article className={`${styles.panel} ${styles.scorePanel}`}>
          {analysis.metrics.map((metric) => (
            <div key={metric.id}>
              <div className={styles.strengthRow}>
                <span>{metric.label}</span>
                <strong>{metric.value}%</strong>
              </div>
              <ProgressBar value={metric.value} />
              <p>{metric.description}</p>
            </div>
          ))}
        </article>
      </section>

      <section className={`${styles.panel} ${styles.timelinePanel}`}>
        <div className={styles.panelHeading}>
          <div>
            <h2>Call Timeline Analysis</h2>
            <p>AI-generated commentary on pivotal moments.</p>
          </div>
        </div>
        <div className={styles.timeline}>
          {analysis.timelineEvents.map((event) => (
            <TimelineEvent event={event} key={event.id} />
          ))}
        </div>
        <div className={styles.coachCallout}>
          <div>
            <strong>AI Coach Suggestion</strong>
            <p>{analysis.coachSuggestion}</p>
          </div>
          <button className="primary-button" type="button">View Module</button>
        </div>
      </section>
    </div>
  )
}

function TraineeAnalysisInner({ backHref }: { backHref: string }) {
  const searchParams              = useSearchParams()
  const sessionId                 = searchParams.get('sessionId')
  const [scenarioId, setScenarioId] = useState<string | null>(null)

  useEffect(() => {
    if (!sessionId) return
    const supabase = createClient()
    supabase
      .from('call_sessions')
      .select('scenarioId')
      .eq('id', sessionId)
      .single()
      .then(({ data }) => { if (data) setScenarioId(data.scenarioId) })
  }, [sessionId])

  const analysis = { ...mockCallAnalysis, ...(sessionId ? { sessionId } : {}) }

  return <AnalysisContent analysis={analysis} backHref={backHref} scenarioId={scenarioId} />
}

export default function TraineeAnalysisPage({ backHref = '/trainee/dashboard' }: { backHref?: string }) {
  return (
    <div className={traineeStyles.page}>
      <TraineeSidebar />
      <div className={traineeStyles.contentWrapper}>
        <Suspense fallback={<p style={{ padding: 40 }}>Loading...</p>}>
          <TraineeAnalysisInner backHref={backHref} />
        </Suspense>
      </div>
    </div>
  )
}
