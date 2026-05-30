import type {
  Activity,
  CallAnalysis,
  Scenario,
  Strength,
  TeamAccount,
  Trainee,
} from '@/types'

export const trainees: Trainee[] = [
  { id: 'SM', name: 'Sarah Miller', joined: 'Joined 2 weeks ago', level: 'Level 2', score: 92, progress: 83 },
  { id: 'JR', name: 'James Rhodes', joined: 'Joined 1 month ago', level: 'Level 3', score: 78, progress: 44 },
  { id: 'EK', name: 'Elena Kovic', joined: 'Joined 5 days ago', level: 'Level 1', score: 64, progress: 16 },
]

export const teamAccounts: TeamAccount[] = [
  { id: 'acct-100', empathyScore: 92, converted: true, trainingHours: 46 },
  { id: 'acct-101', empathyScore: 88, converted: true, trainingHours: 39 },
  { id: 'acct-102', empathyScore: 84, converted: false, trainingHours: 58 },
]

export const strengths: Strength[] = [
  { label: 'Objection Handling', value: 92 },
  { label: 'Empathy', value: 84 },
  { label: 'Closing', value: 68 },
  { label: 'Script Adherence', value: 95 },
]

export const activities: Activity[] = [
  { id: 'summary-created', message: 'James generated a performance summary.' },
  { id: 'session-started', message: 'Sarah started Upselling Cloud Storage.' },
  { id: 'session-failed', message: 'Elena failed Angry Customer Handling.' },
]

export const scenarios: Scenario[] = [
  {
    id: 'first-time-donor',
    title: 'First-Time Donor Outreach',
    category: 'Objection Handling',
    duration: '10 min',
    difficulty: 'Easy',
    description: 'Connect with a potential donor who has expressed interest but is hesitant about the impact of small monthly contributions.',
  },
  {
    id: 'legacy-foundation',
    title: 'The Legacy Foundation Pitch',
    category: 'Major Gifts',
    duration: '15 min',
    difficulty: 'Hard',
    description: 'Navigate a high-stakes conversation with a board member of a legacy foundation focused on long-term sustainability.',
    featured: true,
  },
  {
    id: 'turning-no-later',
    title: 'Turning No into Later',
    category: 'Closing',
    duration: '12 min',
    difficulty: 'Medium',
    description: 'A donor has said no for this cycle. Practice the art of soft ask while securing a follow-up appointment for next quarter.',
  },
  {
    id: 'thank-you-call',
    title: 'The Thank-You Call',
    category: 'Empathy Building',
    duration: '5 min',
    difficulty: 'Easy',
    description: 'Master the 100% appreciation call. No solicitation allowed, only genuine gratitude and impact storytelling.',
  },
  {
    id: 'media-crisis',
    title: 'Media Crisis Management',
    category: 'Crisis Management',
    duration: '20 min',
    difficulty: 'Hard',
    description: 'A donor calls after negative news cycle about the NGO sector. Rebuild trust while sticking to established talking points.',
    note: 'Recommended for users with 80%+ empathy scores.',
  },
]

export const callAnalysis: CallAnalysis = {
  sessionId: '8429',
  title: 'Deep Inquiry Call Analysis',
  description: 'A high-stakes donation request simulation focusing on objection handling and narrative building.',
  grade: 'A-',
  percentileLabel: 'Top 15% of peers',
  coachSuggestion: 'Focus on The Soft Close module before your next attempt.',
  metrics: [
    {
      id: 'empathy',
      label: 'Empathy',
      value: 92,
      description: 'Exceptional resonance with donor pain points.',
    },
    {
      id: 'clarity',
      label: 'Clarity',
      value: 84,
      description: 'The value proposition was clear, though some technical wording slowed it down.',
    },
    {
      id: 'script-adherence',
      label: 'Script Adherence',
      value: 78,
      description: 'Good flow, but missed the mandatory recurring gift mention.',
    },
    {
      id: 'sentiment',
      label: 'Sentiment',
      value: 88,
      description: 'Maintained a positive, persuasive tone during strict objections.',
    },
  ],
  timelineEvents: [
    {
      id: 'first-objection',
      time: '00:45',
      label: 'Strength',
      tone: 'good',
      title: 'Great job handling the first objection',
      copy: 'You validated the donor concern about timing before pivoting back to the urgency of the mission. This maintained rapport while keeping momentum.',
    },
    {
      id: 'concise-explanation',
      time: '02:15',
      label: 'Improvement',
      tone: 'warning',
      title: 'Try to be more concise here',
      copy: 'The explanation of the scholarship program became overly technical. Aim for 2-3 impact-focused sentences to keep the donor engaged.',
    },
    {
      id: 'narrative-shift',
      time: '05:30',
      label: 'Peak Moment',
      tone: 'peak',
      title: 'Masterful narrative shift',
      copy: 'Using Maria story as a concrete example of impact was timed perfectly after the donor question about efficacy. Sentiment score peaked here.',
    },
  ],
}
