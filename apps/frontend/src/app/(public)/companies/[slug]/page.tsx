import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Calendar, DollarSign, Building2, Users, ExternalLink, ArrowLeft } from 'lucide-react'
import CompanyHero from '@/components/companies/CompanyHero'
import { CompanyStatCards, CompanyCoreStrengths, CompanyMediaSpotlight, CompanyStat } from '@/components/companies/CompanyStatsAndMedia'

export const revalidate = 60

async function getCompany(slug: string) {
  const supabase = await createClient()
  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .or(`slug.eq.${slug},id.eq.${slug}`)
    .single()

  const fallbackCompanies = [
    {
      id: 'omc',
      slug: 'omc',
      title: 'Ocean Maritime Ceylon',
      category: 'Maritime Operations',
      description: 'Takes orders and delivers supplies for ships in operation side.',
      long_description: 'Ocean Maritime Ceylon is a premier maritime service provider spanning the major ports of Sri Lanka. We specialize in the operational aspect of ship supply, taking orders and ensuring the seamless delivery of essential provisions, spare parts, and technical supplies to vessels in operation. Our 24/7 service ensures that ships face zero downtime due to supply chain delays.',
      image: '/company images for hero section/ocean maritime ceylon.jpg',
      video: 'https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4',
      established: '1998',
      employees: '150+',
      revenue: '$45M',
      logo_url: '/company logos/Ocean Maritime Ceylon logo.png',
      stats: [
        { label: 'Vessels Served', value: '500+', icon: 'Ship' },
        { label: 'Ports', value: '4', icon: 'Anchor' },
        { label: 'Deliveries', value: '10k+', icon: 'Package' }
      ]
    },
    {
      id: 'oec',
      slug: 'oec',
      title: 'Ocean Engineering Ceylon',
      category: 'Marine Engineering',
      description: 'The engineering company which completes the engineering requests of the company.',
      long_description: 'Ocean Engineering Ceylon serves as the technical backbone of our marine operations. We handle all engineering requests, from routine maintenance to complex structural repairs and modifications. Our team of expert marine engineers ensures that every vessel operates at peak performance and meets all safety and compliance rigor.',
      image: '/company images for hero section/ocean engineering ceylon.jpg',
      video: 'https://videos.pexels.com/video-files/2043509/2043509-uhd_2560_1440_25fps.mp4',
      established: '2005',
      employees: '200+',
      revenue: '$60M',
      logo_url: '/company logos/Ocean engineering ceylon.png',
      stats: [
        { label: 'Projects Completed', value: '1k+', icon: 'Wrench' },
        { label: 'Engineers', value: '80+', icon: 'Users' },
        { label: 'Success Rate', value: '99.9%', icon: 'CheckCircle' }
      ]
    },
    {
      id: 'omch',
      slug: 'omch',
      title: 'Ocean Maritime Channel',
      category: 'Maritime Operations',
      description: 'Focuses on the logistics and supply chain of the maritime industry.',
      long_description: 'Ocean Maritime Channel focuses on the logistics and supply chain of the maritime industry.',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1200',
      established: '2010',
      employees: '100+',
      logo_url: '/company logos/ocean maritime channel.png',
    },
    {
      id: 'connecting-cubes',
      slug: 'connecting-cubes',
      title: 'Connecting Cubes',
      category: 'Technology',
      description: 'A technology company focused on building digital solutions.',
      long_description: 'Connecting Cubes is a technology company focused on building digital solutions.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200',
      established: '2015',
      employees: '50+',
      logo_url: '/company logos/connecting cubes logo..png',
    },
    {
      id: 'digital-books',
      slug: 'digital-books',
      title: 'Digital Books',
      category: 'Publishing',
      description: 'Digital publishing and media company.',
      long_description: 'Digital Books is a modern digital publishing and media company.',
      image: 'https://images.unsplash.com/photo-1456953180671-730de08edaa7?auto=format&fit=crop&q=80&w=1200',
      established: '2018',
      employees: '30+',
      logo_url: '/company logos/digital books.png',
    },
    {
      id: '1',
      slug: 'ocean-marine',
      title: 'Ocean Marine Services Ltd',
      category: 'Marine Engineering & Agency',
      description: 'Full-service ship agency, offshore bunkering, vessel repairs, and marine salvage with 24/7 port support.',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800',
      established: '1998',
      employees: '450+',
      website: 'https://marine.ocean.lk',
    },
    {
      id: '2',
      slug: 'ceylon-logistics',
      title: 'Ceylon Global Logistics',
      category: 'Supply Chain & Freight',
      description: 'Multi-modal sea and air freight forwarding, customs clearance, bonded warehousing, and cold chain distribution.',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
      established: '2004',
      employees: '600+',
      website: 'https://logistics.ocean.lk',
    },
    {
      id: '3',
      slug: 'ocean-energy',
      title: 'Ocean Green Energy Systems',
      category: 'Renewables & Infrastructure',
      description: 'Offshore solar installations, port electrification, and eco-friendly marine fuel distribution.',
      image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=800',
      established: '2015',
      employees: '250+',
      website: 'https://energy.ocean.lk',
    }
  ]

  const finalCompany = company || fallbackCompanies.find((c) => c.slug === slug || c.id === slug)
  if (!finalCompany) return { company: null, related: [] }

  const { data: related } = await supabase
    .from('companies')
    .select('*')
    .eq('is_active', true)
    .neq('id', finalCompany.id)
    .order('display_order', { ascending: true })
    .limit(3)

  const finalRelated = related?.length ? related : fallbackCompanies.filter(c => c.id !== finalCompany.id).slice(0, 3)

  return { company: finalCompany, related: finalRelated }
}

export default async function CompanyDetailPage({ params }: { params: { slug: string } }) {
  const { company, related } = await getCompany(params.slug)

  if (!company) {
    notFound()
  }

  const c = company as any
  const stats: CompanyStat[] = Array.isArray(c.stats) ? c.stats : []

  return (
    <div className="min-h-screen bg-white">
      <CompanyHero
        company={{
          title: c.title,
          category: c.category || 'Subsidiary',
          description: c.description || '',
          image: c.image || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1200',
          video: c.video,
          established: c.established,
          employees: c.employees,
          revenue: c.revenue,
        }}
      />

      {/* About Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-5 gap-16 items-start">
            <div className="lg:col-span-2">
              <div className="sticky top-28">
                <div className="bg-gray-50 border border-gray-100 rounded-3xl p-10 shadow-sm mb-8">
                  {c.logo_url && (
                    <img src={c.logo_url} alt={`${c.title} logo`} className="w-28 h-28 object-contain mx-auto mb-8" />
                  )}
                  <div className="space-y-5">
                    {[
                      { icon: Calendar, label: 'Founded', value: c.established },
                      { icon: Users, label: 'Employees', value: c.employees },
                      { icon: DollarSign, label: 'Annual Revenue', value: c.revenue },
                      { icon: Building2, label: 'Industry', value: c.category },
                    ]
                      .filter((item) => item.value)
                      .map((item, i) => (
                        <div key={i} className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0">
                          <div className="p-2.5 bg-primary/8 rounded-xl">
                            <item.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">{item.label}</p>
                            <p className="text-gray-900 font-semibold text-lg">{item.value}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {c.website && (
                  <a
                    href={c.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 group"
                  >
                    Visit Official Website
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                )}
              </div>
            </div>

            <div className="lg:col-span-3">
              <span className="text-accent font-semibold text-sm uppercase tracking-widest">About Us</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-6">Who We Are</h2>
              <div className="w-12 h-1 bg-accent rounded-full mb-8" />
              <p className="text-lg text-gray-600 leading-relaxed mb-12 whitespace-pre-line">
                {c.long_description || c.description}
              </p>

              <CompanyStatCards stats={stats} />
            </div>
          </div>
        </div>
      </section>

      <CompanyCoreStrengths stats={stats} />

      {c.video && (
        <CompanyMediaSpotlight title={c.title} category={c.category || ''} image={c.image} video={c.video} />
      )}

      {/* Related Companies */}
      {related.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <span className="text-accent font-semibold text-sm uppercase tracking-widest">Explore More</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-2">Other Companies</h2>
              <div className="w-12 h-1 bg-accent rounded-full mt-4 mx-auto" />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((rc: any) => (
                <Link key={rc.id} href={`/companies/${rc.slug || rc.id}`} className="group block">
                  <div className="relative h-48 rounded-2xl overflow-hidden mb-4">
                    <img
                      src={rc.image || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800'}
                      alt={rc.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent" />
                    {rc.logo_url && (
                      <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur rounded-xl p-2 shadow">
                        <img src={rc.logo_url} alt={rc.title} className="w-8 h-8 object-contain" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className="bg-primary/90 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {rc.category || 'Subsidiary'}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors mb-1">{rc.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{rc.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Band */}
      <section className="relative py-28 bg-primary overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-light/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 text-center">
          {c.logo_url && (
            <img src={c.logo_url} alt={c.title} className="w-20 h-20 object-contain mx-auto mb-6 brightness-0 invert opacity-80" />
          )}
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Partner with {c.title}</h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-10">
            Ready to explore what we can achieve together? Reach out to our team today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-accent/30 hover:-translate-y-0.5"
            >
              Get In Touch
              <ExternalLink className="w-4 h-4" />
            </Link>
            <Link
              href="/companies"
              className="inline-flex items-center gap-2 border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-xl transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              All Companies
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
