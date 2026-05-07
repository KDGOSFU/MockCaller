import type { TimelineEventData } from '@/types'

type TimelineEventProps = {
  event: TimelineEventData
}

export function TimelineEvent({ event }: TimelineEventProps) {
  return (
    <article className={`timeline-item ${event.tone}`}>
      <time>{event.time}</time>
      <div className="timeline-card">
        <span>{event.label}</span>
        <h3>{event.title}</h3>
        <p>{event.copy}</p>
      </div>
    </article>
  )
}
