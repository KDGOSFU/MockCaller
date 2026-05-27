export type Trainee = {
  id: string
  name: string
  joined: string
  level: string
  score: number
  progress: number
}

export type TeamAccount = {
  id: string
  empathyScore: number
  converted: boolean
  trainingHours: number
}

export type Strength = {
  label: string
  value: number
}

export type Activity = {
  id: string
  message: string
}

export type Scenario = {
  id: string
  title: string
  category: string
  duration: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  description: string
  note?: string
  featured?: boolean
}

export type TimelineEventData = {
  id: string
  time: string
  label: string
  tone: 'good' | 'warning' | 'peak'
  title: string
  copy: string
}

export type ScoreMetric = {
  id: string
  label: string
  value: number
  description: string
}

export type CallAnalysis = {
  sessionId: string
  title: string
  description: string
  grade: string
  percentileLabel: string
  metrics: ScoreMetric[]
  timelineEvents: TimelineEventData[]
  coachSuggestion: string
}
