import type { Scenario } from '@/types'

type ScenarioCardProps = {
  scenario: Scenario
}

export function ScenarioCard({ scenario }: ScenarioCardProps) {
  return (
    <article className={scenario.featured ? 'scenario-card featured' : 'scenario-card'}>
      <div className="scenario-meta">
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
