import { AdminAuthProvider } from '@/lib/AdminAuthContext'
import './admin.css'

export const metadata = {
  title: 'Admin - NaBajk',
  description: 'NaBajk Admin Dashboard',
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminAuthProvider>{children}</AdminAuthProvider>
}
