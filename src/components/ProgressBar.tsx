type ProgressBarProps = {
  value: number
}

export function ProgressBar({ value }: ProgressBarProps) {
  const safeValue = Math.min(Math.max(value, 0), 100)

  return (
    <div className="progress-bar" aria-label={`${safeValue}%`}>
      <span style={{ width: `${safeValue}%` }} />
    </div>
  )
}
