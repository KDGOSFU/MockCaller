import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

type ManagerShellProps = {
  children: ReactNode
  title: string
}

export function ManagerShell({ children, title }: ManagerShellProps) {
  return (
    <main className="manager-shell">
      <Sidebar />
      <section className="manager-workspace">
        <Topbar title={title} />
        {children}
      </section>
    </main>
  )
}
