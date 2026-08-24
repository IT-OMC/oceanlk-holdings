import AuthGate from '@/components/AuthGate'
import AdminLayout from '@/layouts/AdminLayout'

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <AdminLayout>{children}</AdminLayout>
    </AuthGate>
  )
}
