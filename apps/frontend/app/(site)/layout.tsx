import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MainLayout from '@/layouts/MainLayout'
import { CompaniesProvider } from '@/components/CompaniesProvider'
import { SocialLinksProvider } from '@/components/SocialLinksProvider'
import { getSocialLinks } from '@/lib/socialLinks'
import { NEXT_PUBLIC_API_BASE_URL } from '@/utils/api'
import type { Company } from '@/views/companies/CompanySingle'

async function getCompanies(): Promise<Company[]> {
  const res = await fetch(NEXT_PUBLIC_API_BASE_URL.COMPANIES, { next: { revalidate: 60 } })
  if (!res.ok) return []
  return res.json()
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  // Fetched in parallel — neither read depends on the other.
  const [initialCompanies, socialLinks] = await Promise.all([
    getCompanies(),
    getSocialLinks(),
  ])

  return (
    <CompaniesProvider initialCompanies={initialCompanies}>
      <SocialLinksProvider socialLinks={socialLinks}>
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navbar />
        </div>
        <MainLayout>{children}</MainLayout>
        <Footer />
      </SocialLinksProvider>
    </CompaniesProvider>
  )
}
