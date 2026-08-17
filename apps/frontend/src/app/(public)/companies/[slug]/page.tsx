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

  if (!company) return { company: null, related: [] }

  const { data: related } = await supabase
    .from('companies')
    .select('*')
    .eq('is_active', true)
    .neq('id', (company as any).id)
    .order('display_order', { ascending: true })
    .limit(3)

  return { company, related: related || [] }
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
