import type { Activity } from '@/types'

type ActivityFeedProps = {
  activities: Activity[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <article className="panel">
      <h2>Recent Activity</h2>
      <ul className="activity-list">
        {activities.map((activity) => (
          <li key={activity.id}>{activity.message}</li>
        ))}
      </ul>
    </article>
  )
}
