'use client'

import { useEffect, useMemo, useState } from 'react'
import { TraineeSidebar } from '@/components/TraineeSidebar'
import { createClient } from '@/utils/supabase/client'
import styles from '@/app/call-scenarios/call-scenarios.module.css'
import traineeStyles from './TraineeDashboard.module.css'

type Scenario = {
  id: string
  title: string
  description: string
  difficulty: string
  category?: string
  duration?: string
  featured?: boolean
  note?: string
}

const defaultFilters = ['All Types', 'Objection Handling', 'Closing', 'Empathy Building', 'Major Gifts']

function ScenarioCard({ scenario }: { scenario: Scenario }) {
  return (
    <article className={`${styles.scenarioCard} ${scenario.featured ? styles.featured : ''}`}>
      <div className={styles.scenarioMeta}>
        {scenario.category && <span>{scenario.category}</span>}
        {scenario.duration  && <span>{scenario.duration}</span>}
        <span>{scenario.difficulty}</span>
      </div>
      <h2>{scenario.title}</h2>
      <p>{scenario.description}</p>
      {scenario.note ? <small>{scenario.note}</small> : null}
      <button className={scenario.featured ? 'secondary-button' : 'primary-button'} type="button">
        Start Scenario
      </button>
    </article>
  )
}

function TraineeCallScenariosContent() {
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState<string | null>(null)
  const [filter, setFilter]       = useState(defaultFilters[0])

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('scenarios')
      .select('*')
      .then(({ data, error }) => {
        if (error) {
          setError(error.message)
        } else {
          setScenarios(data ?? [])
        }
        setLoading(false)
      })
  }, [])

  const visibleScenarios = useMemo(
    () => filter === 'All Types' ? scenarios : scenarios.filter((s) => s.category === filter),
    [filter, scenarios],
  )

  return (
    <div className="manager-view manager-narrow-view">
      <div className={styles.pageHeading}>
        <div>
          <span className={styles.eyebrow}>Scenario Library</span>
          <h1>Refine your persuasion in a safe space.</h1>
          <p>Choose from curated AI-powered simulations designed to test specific skills.</p>
        </div>
      </div>

      <section className={styles.filterPanel}>
        <span>Filter:</span>
        {defaultFilters.map((item) => (
          <button
            className={`${styles.filterButton} ${filter === item ? styles.active : ''}`}
            key={item}
            onClick={() => setFilter(item)}
            type="button"
          >
            {item}
          </button>
        ))}
        <input placeholder="Search scenarios..." />
      </section>

      {loading && <p style={{ color: 'var(--outline)', padding: '20px 0' }}>Loading scenarios...</p>}
      {error   && <p style={{ color: 'red', padding: '20px 0' }}>Error: {error}</p>}

      {!loading && !error && (
        <section className={styles.scenarioGrid}>
          {visibleScenarios.map((scenario) => (
            <ScenarioCard key={scenario.id} scenario={scenario} />
          ))}
        </section>
      )}
    </div>
  )
}

export default function TraineeCallScenariosPage() {
  return (
    <div className={traineeStyles.page}>
      <TraineeSidebar />
      <div className={traineeStyles.contentWrapper}>
        <TraineeCallScenariosContent />
      </div>
    </div>
  )
}
