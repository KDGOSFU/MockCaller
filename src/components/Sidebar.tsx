import type { ViewKey } from '@/types'

type SidebarProps = {
  activeView: ViewKey
  onViewChange: (view: ViewKey) => void
}

const navItems: Array<{ id: ViewKey; label: string }> = [
  { id: 'overview', label: 'Team Overview' },
  { id: 'analysis', label: 'Call Analysis' },
  { id: 'scenarios', label: 'Call Scenarios' },
]

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div>
        <div className="brand">
          <div className="brand-mark">M</div>
          <div>
            <strong>MockCaller</strong>
            <span>Fundraiser Pro</span>
          </div>
        </div>
        <nav className="nav-list" aria-label="Primary">
          {navItems.map((item) => (
            <button
              className={activeView === item.id ? 'nav-item active' : 'nav-item'}
              key={item.id}
              onClick={() => onViewChange(item.id)}
              type="button"
            >
              <span className="nav-dot" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="sidebar-actions">
        <button className="primary-button full-width" type="button">Start New Mock Call</button>
        <button className="plain-button" type="button">Help Center</button>
        <button className="plain-button" type="button">Sign Out</button>
      </div>
    </aside>
  )
}
