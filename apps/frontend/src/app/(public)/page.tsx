import React from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ArrowRight, ShieldCheck, Globe2, Anchor, Award, TrendingUp, Sparkles, Building2 } from 'lucide-react'

export const revalidate = 60 // Revalidate home page at most once per minute (ISR)

async function getHomeData() {
  const supabase = await createClient()

  const [metricsRes, companiesRes] = await Promise.all([
    supabase.from('global_metrics').select('*').order('display_order', { ascending: true }),
    supabase.from('companies').select('*').eq('is_active', true).order('display_order', { ascending: true }).limit(6),
  ])

  return {
    metrics: metricsRes.data || [],
    companies: companiesRes.data || [],
  }
}

export default async function HomePage() {
  const { metrics, companies } = await getHomeData()

  // Default fallback stats if DB is fresh
  const displayMetrics = metrics.length > 0 ? metrics : [
    { label: 'Global Ports Served', value: '45+', suffix: 'Locations', icon: 'Anchor' },
    { label: 'Group Workforce', value: '2,500+', suffix: 'Professionals', icon: 'Globe2' },
    { label: 'Annual Tonnage Handled', value: '1.2M', suffix: 'TEUs', icon: 'TrendingUp' },
    { label: 'Years of Excellence', value: '25+', suffix: 'Track Record', icon: 'Award' },
  ]

  // Default fallback companies if DB is fresh
  const displayCompanies = companies.length > 0 ? companies : [
    {
      id: '1',
      slug: 'ocean-marine',
      title: 'Ocean Marine Services',
      category: 'Marine Engineering',
      description: 'Pioneering ship agency, bunkering, offshore support, and marine salvage across the Indian Ocean.',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: '2',
      slug: 'ceylon-logistics',
      title: 'Ceylon Global Logistics',
      category: 'Supply Chain',
      description: 'End-to-end multi-modal freight forwarding, warehousing, and customs brokerage across 30+ countries.',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: '3',
      slug: 'ocean-energy',
      title: 'Ocean Green Energy',
      category: 'Renewables',
      description: 'Clean energy generation, offshore wind power development, and decarbonization solutions.',
      image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=800'
    }
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#001529] via-[#002845] to-[#001529] text-white py-24 md:py-32 px-4 sm:px-6 lg:px-8">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#2ecc71] mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Next-Generation Global Enterprise
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-tight sm:leading-none">
            Empowering Global Trade, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066d4] via-[#58d68d] to-[#2ecc71]">
              Shaping The Future
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
            OceanLK Holdings drives international commerce through specialized maritime operations, integrated supply chains, sustainable energy, and visionary investments.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/companies"
              className="px-8 py-4 rounded-full bg-[#2ecc71] hover:bg-[#27ae60] text-[#001529] font-bold text-base shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center gap-2 active:scale-95"
            >
              Explore Subsidiaries <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/corporate"
              className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-base border border-white/20 backdrop-blur-md transition-all active:scale-95"
            >
              Our Vision & Board
            </Link>
          </div>
        </div>
      </section>

      {/* GLOBAL METRICS STRIP */}
      <section className="bg-white border-b border-gray-200 py-12 relative -mt-6 rounded-t-3xl max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {displayMetrics.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-4 rounded-2xl hover:bg-gray-50 transition-colors">
              <span className="text-3xl sm:text-5xl font-black text-[#0056b3] tracking-tight mb-1">
                {item.value}
              </span>
              <span className="text-sm font-bold text-gray-900">{item.label}</span>
              <span className="text-xs text-gray-500 mt-0.5">{item.suffix}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CORE SUBSIDIARIES SHOWCASE */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-bold text-[#0056b3] uppercase tracking-widest mb-2">Portfolio Ecosystem</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Industry-Leading Entities</h2>
          </div>
          <Link
            href="/companies"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#0056b3] hover:text-[#004494] group"
          >
            View All Subsidiaries <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayCompanies.map((comp) => (
            <div
              key={comp.id}
              className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="h-52 w-full overflow-hidden relative bg-gray-100">
                <img
                  src={comp.image || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800'}
                  alt={comp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 px-3 py-1 bg-[#001529]/80 backdrop-blur-md text-white text-xs font-semibold rounded-full">
                  {comp.category || 'Holding'}
                </span>
              </div>
              <div className="p-6 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#0056b3] transition-colors">
                    {comp.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-6">
                    {comp.description}
                  </p>
                </div>
                <Link
                  href={`/companies/${comp.slug || comp.id}`}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0056b3] group-hover:text-[#2ecc71] transition-colors"
                >
                  Explore Company <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY OCEANLK SECTION */}
      <section className="bg-gradient-to-tr from-[#001529] to-[#002845] text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#2ecc71] uppercase tracking-widest">Our Strategic Edge</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold mt-2">Built on Integrity, Driven by Excellence</h2>
            <p className="mt-4 text-gray-300 text-base">
              With decades of maritime legacy and international commerce proficiency, we deliver uncompromised value to our partners worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#0056b3] flex items-center justify-center text-white mb-6">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Global Connectivity</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Strategic hubs located at maritime crossroads connecting Asia, Europe, Middle East, and Africa with 24/7 operations.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#2ecc71] flex items-center justify-center text-[#001529] mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Governance & ESG</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Committed to global environmental standards, zero-spill maritime protocols, and community empowerment initiatives.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white mb-6">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Multi-Industry Synergy</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Seamless cross-entity collaboration unlocking unmatched logistical efficiency and capital deployment agility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CAREERS CTA BANNER */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="rounded-3xl bg-gradient-to-r from-[#0056b3] to-[#004494] text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="max-w-xl space-y-2">
            <span className="text-xs font-bold text-[#58d68d] uppercase tracking-widest">Join Our Team</span>
            <h3 className="text-3xl font-extrabold">Build Your Career at OceanLK</h3>
            <p className="text-blue-100 text-sm">
              Discover rewarding opportunities across marine engineering, digital tech, operations, and leadership.
            </p>
          </div>
          <Link
            href="/careers"
            className="whitespace-nowrap px-8 py-4 rounded-full bg-white text-[#0056b3] font-bold text-sm hover:bg-gray-100 transition-all shadow-md active:scale-95"
          >
            Explore Open Roles
          </Link>
        </div>
      </section>
    </div>
  )
}
