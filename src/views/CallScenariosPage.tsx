'use client'

import { useMemo, useState } from 'react'
import { ScenarioCard } from '@/components/ScenarioCard'
import { scenarios as mockScenarios } from '@/data/mockData'
import type { Scenario } from '@/types'

type CallScenariosPageProps = {
  scenarios: Scenario[]
  filters?: string[]
}

const defaultFilters = ['All Types', 'Objection Handling', 'Closing', 'Empathy Building']

export function CallScenariosPage({ scenarios, filters = defaultFilters }: CallScenariosPageProps) {
  const [filter, setFilter] = useState(filters[0] ?? 'All Types')
  const visibleScenarios = useMemo(
    () => filter === 'All Types' ? scenarios : scenarios.filter((scenario) => scenario.category === filter),
    [filter, scenarios],
  )

  return (
    <div className="view narrow-view">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Scenario Library</span>
          <h1>Refine your persuasion in a safe space.</h1>
          <p>Choose from curated AI-powered simulations designed to test specific skills.</p>
        </div>
      </div>

      <section className="filter-panel">
        <span>Filter:</span>
        {filters.map((item) => (
          <button
            className={filter === item ? 'filter-button active' : 'filter-button'}
            key={item}
            onClick={() => setFilter(item)}
            type="button"
          >
            {item}
          </button>
        ))}
        <input placeholder="Search scenarios..." />
      </section>

      <section className="scenario-grid">
        {visibleScenarios.map((scenario) => (
          <ScenarioCard key={scenario.id} scenario={scenario} />
        ))}
        <article className="custom-card">
          <div className="plus-box">+</div>
          <h2>Custom Challenge?</h2>
          <p>Have a specific donor persona or scenario? Generate a custom AI simulation.</p>
          <button className="link-button" type="button">Request Scenario</button>
        </article>
      </section>
    </div>
  )
}

export default function CallScenariosPageRoute() {
  return <CallScenariosPage scenarios={mockScenarios} />
}
