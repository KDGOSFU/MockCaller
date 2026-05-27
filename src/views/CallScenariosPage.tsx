'use client'

import { useMemo, useState } from 'react'
import { ManagerShell } from '@/components/ManagerShell'
import { scenarios as mockScenarios } from '@/data/mockData'
import type { Scenario } from '@/types'
import styles from '@/app/call-scenarios/call-scenarios.module.css'

type CallScenariosPageProps = {
  scenarios: Scenario[]
  filters?: string[]
}

const defaultFilters = ['All Types', 'Objection Handling', 'Closing', 'Empathy Building']

function ScenarioCard({ scenario }: { scenario: Scenario }) {
  return (
    <article className={`${styles.scenarioCard} ${scenario.featured ? styles.featured : ''}`}>
      <div className={styles.scenarioMeta}>
        <span>{scenario.category}</span>
        <span>{scenario.duration}</span>
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

export function CallScenariosPage({ scenarios, filters = defaultFilters }: CallScenariosPageProps) {
  const [filter, setFilter] = useState(filters[0] ?? 'All Types')
  const visibleScenarios = useMemo(
    () => filter === 'All Types' ? scenarios : scenarios.filter((scenario) => scenario.category === filter),
    [filter, scenarios],
  )

  return (
    <ManagerShell title="Call Scenarios">
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
          {filters.map((item) => (
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

        <section className={styles.scenarioGrid}>
          {visibleScenarios.map((scenario) => (
            <ScenarioCard key={scenario.id} scenario={scenario} />
          ))}
          <article className={styles.customCard}>
            <div className={styles.plusBox}>+</div>
            <h2>Custom Challenge?</h2>
            <p>Have a specific donor persona or scenario? Generate a custom AI simulation.</p>
            <button className="link-button" type="button">Request Scenario</button>
          </article>
        </section>
      </div>
    </ManagerShell>
  )
}

export default function CallScenariosPageRoute() {
  return <CallScenariosPage scenarios={mockScenarios} />
}
