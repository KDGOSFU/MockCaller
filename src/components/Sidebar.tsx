'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart2, HelpCircle, LayoutDashboard, LogOut, Phone } from 'lucide-react'

const navItems = [
  { href: '/managers-dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/call-scenarios', label: 'Call Scenarios', icon: Phone },
  { href: '/feedback-analytics', label: 'Analytics', icon: BarChart2 },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="sidebar">
      <div>
        <div className="brand">
          <div className="brand-mark">
            <Phone aria-hidden="true" size={18} strokeWidth={2.4} />
          </div>
          <div>
            <strong>Fundraiser Pro</strong>
            <span>Lumina Academy</span>
          </div>
        </div>
        <nav className="nav-list" aria-label="Primary">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              className={pathname === href ? 'nav-item active' : 'nav-item'}
              href={href}
              key={href}
            >
              <Icon aria-hidden="true" size={17} strokeWidth={2.2} />
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="sidebar-actions">
        <Link className="primary-button full-width" href="/mock-call/active">Start New Mock Call</Link>
        <button className="plain-button" type="button">
          <HelpCircle aria-hidden="true" size={17} strokeWidth={2.2} />
          Help Center
        </button>
        <button className="plain-button" type="button">
          <LogOut aria-hidden="true" size={17} strokeWidth={2.2} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
