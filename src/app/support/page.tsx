import Link from 'next/link'
import { LanguageToggle } from '@/components/LanguageToggle'
import { SupportContent } from './SupportContent'
import styles from '../legal.module.css'

export const metadata = {
  title: 'Podpora / Support — NaBajk',
}

export default function SupportPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="NaBajk" width={120} height={34} />
        </Link>
        <LanguageToggle />
      </header>

      <main className={styles.main}>
        <SupportContent />
      </main>
    </div>
  )
}
