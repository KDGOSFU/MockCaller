import { ProgressBar } from '@/components/ProgressBar'
import { TimelineEvent } from '@/components/TimelineEvent'
import { callAnalysis as mockCallAnalysis } from '@/data/mockData'
import type { CallAnalysis } from '@/types'

type CallAnalysisPageProps = {
  analysis: CallAnalysis
}

export function CallAnalysisPage({ analysis }: CallAnalysisPageProps) {
  return (
    <div className="view narrow-view">
      <div className="breadcrumb">Analysis / Session #{analysis.sessionId}</div>
      <div className="analysis-heading">
        <div>
          <h1>{analysis.title}</h1>
          <p>{analysis.description}</p>
        </div>
        <div className="button-row">
          <button className="secondary-button" type="button">Back to Dashboard</button>
          <button className="primary-button" type="button">Retake Call</button>
        </div>
      </div>

      <section className="analysis-grid">
        <article className="grade-card">
          <span>Overall Grade</span>
          <strong>{analysis.grade}</strong>
          <p>{analysis.percentileLabel}</p>
        </article>
        <article className="panel score-panel">
          {analysis.metrics.map((metric) => (
            <div key={metric.id}>
              <div className="strength-row">
                <span>{metric.label}</span>
                <strong>{metric.value}%</strong>
              </div>
              <ProgressBar value={metric.value} />
              <p>{metric.description}</p>
            </div>
          ))}
        </article>
      </section>

      <section className="panel timeline-panel">
        <div className="panel-heading">
          <div>
            <h2>Call Timeline Analysis</h2>
            <p>AI-generated commentary on pivotal moments.</p>
          </div>
        </div>
        <div className="timeline">
          {analysis.timelineEvents.map((event) => (
            <TimelineEvent event={event} key={event.id} />
          ))}
        </div>
        <div className="coach-callout">
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

export default function CallAnalysisPageRoute() {
  return <CallAnalysisPage analysis={mockCallAnalysis} />
}
