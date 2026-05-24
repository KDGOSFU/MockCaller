type MetricCardProps = {
  label: string
  value: string
  footnote: string
}

export function MetricCard({ label, value, footnote }: MetricCardProps) {
  return (
    <article className="metric-card">
      <span className="metric-icon">{label.charAt(0)}</span>
      <p>{label}</p>
      <strong>{value}</strong>
      <small>{footnote}</small>
    </article>
  )
}
