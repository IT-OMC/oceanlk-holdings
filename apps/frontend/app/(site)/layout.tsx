import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MainLayout from '@/layouts/MainLayout'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      <MainLayout>{children}</MainLayout>
      <Footer />
    </>
  )
}
