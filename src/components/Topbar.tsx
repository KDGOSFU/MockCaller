import { Bell, Settings, User } from 'lucide-react'

type TopbarProps = {
  title: string
}

export function Topbar({ title }: TopbarProps) {
  return (
    <header className="topbar">
      <span className="topbar-title">{title}</span>
      <div className="topbar-actions">
        <button className="icon-button" type="button" aria-label="Notifications">
          <Bell aria-hidden="true" size={16} strokeWidth={2.5} />
        </button>
        <button className="icon-button" type="button" aria-label="Settings">
          <Settings aria-hidden="true" size={16} strokeWidth={2.5} />
        </button>
        <div className="user-chip">
          <div>
            <strong>Alex Thompson</strong>
            <span>Manager</span>
          </div>
          <div className="avatar">
            <User aria-hidden="true" size={18} strokeWidth={2.3} />
          </div>
        </div>
      </div>
    </header>
  )
}
