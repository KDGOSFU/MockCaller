import { Wrench } from 'lucide-react'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.page}>
      <div className={styles.icon}>
        <Wrench aria-hidden="true" size={34} strokeWidth={2.4} />
      </div>
      <h1>We are working on this page</h1>
    </main>
  )
}
