import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MainLayout from '@/layouts/MainLayout'
import { CompaniesProvider } from '@/components/CompaniesProvider'
import { SocialLinksProvider } from '@/components/SocialLinksProvider'
import { ContactInfoProvider } from '@/components/ContactInfoProvider'
import { getSocialLinks } from '@/lib/socialLinks'
import { getContactInfo } from '@/lib/contactInfo'
import { NEXT_PUBLIC_API_BASE_URL } from '@/utils/api'
import type { Company } from '@/views/companies/CompanySingle'

async function getCompanies(): Promise<Company[]> {
  try {
    const res = await fetch(NEXT_PUBLIC_API_BASE_URL.COMPANIES, { next: { revalidate: 60 } })
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    console.warn("Backend unreachable during build, skipping static generation for layout companies.");
    return []
  }
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  // Fetched in parallel — none of these reads depend on the others.
  const [initialCompanies, socialLinks, contactInfo] = await Promise.all([
    getCompanies(),
    getSocialLinks(),
    getContactInfo(),
  ])

  return (
    <CompaniesProvider initialCompanies={initialCompanies}>
      <SocialLinksProvider socialLinks={socialLinks}>
        <ContactInfoProvider contactInfo={contactInfo}>
          <div className="fixed top-0 left-0 right-0 z-50">
            <Navbar />
          </div>
          <MainLayout>{children}</MainLayout>
          <Footer />
        </ContactInfoProvider>
      </SocialLinksProvider>
    </CompaniesProvider>
  )
}
