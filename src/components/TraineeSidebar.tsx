'use client';

import { useClerk } from '@clerk/nextjs';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Phone, BarChart2, BookOpen, HelpCircle, LogOut } from 'lucide-react';
import styles from './TraineeSidebar.module.css';

const NAV_ITEMS = [
  { label: 'Dashboard',        icon: LayoutDashboard, href: '/trainee/dashboard' },
  { label: 'Call Scenarios',   icon: Phone,           href: '/trainee/scenarios' },
  { label: 'Analytics',        icon: BarChart2,       href: '/trainee/analytics' },
  { label: 'Training Library', icon: BookOpen,        href: '/trainee/library'   },
];

export function TraineeSidebar() {
  const { signOut } = useClerk();
  const pathname    = usePathname();
  const router      = useRouter();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoArea}>
        <div className={styles.logoIcon}>
          <Phone size={18} color="#ffffff" />
        </div>
        <p className={styles.logoName}>MockCaller</p>
        <p className={styles.logoSub}>Fundraising Academy</p>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map(({ label, icon: Icon, href }) => (
          <button
            key={label}
            className={pathname === href ? styles.navItemActive : styles.navItem}
            onClick={() => router.push(href)}
          >
            <Icon size={17} />
            {label}
          </button>
        ))}
      </nav>

      <div className={styles.bottom}>
        <button className={styles.startCallBtn} onClick={() => router.push('/call')}>
          Start New Mock Call
        </button>
        <button className={styles.link}>
          <HelpCircle size={17} /> Help Center
        </button>
        <button className={styles.link} onClick={() => signOut({ redirectUrl: '/login' })}>
          <LogOut size={17} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
