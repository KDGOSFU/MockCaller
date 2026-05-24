import type { Strength } from '@/types'
import { ProgressBar } from './ProgressBar'

type StrengthCardProps = {
  strengths: Strength[]
}

export function StrengthCard({ strengths }: StrengthCardProps) {
  return (
    <article className="panel">
      <h2>Team Core Strengths</h2>
      <div className="strength-list">
        {strengths.map((strength) => (
          <div key={strength.label}>
            <div className="strength-row">
              <span>{strength.label}</span>
              <strong>{strength.value}%</strong>
            </div>
            <ProgressBar value={strength.value} />
          </div>
        ))}
      </div>
    </article>
  )
}
