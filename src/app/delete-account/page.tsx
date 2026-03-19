import Link from 'next/link'
import { LanguageToggle } from '@/components/LanguageToggle'
import { DeleteAccountContent } from './DeleteAccountContent'
import styles from '../legal.module.css'

export const metadata = {
  title: 'Izbris računa / Delete Account — NaBajk',
}

export default function DeleteAccountPage() {
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
        <DeleteAccountContent />
      </main>
    </div>
  )
}
