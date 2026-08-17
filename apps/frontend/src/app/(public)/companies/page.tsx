import React from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ArrowRight, Building2, Globe, Users, Calendar } from 'lucide-react'

export const metadata = {
  title: 'Our Companies',
  description: 'Explore the diversified portfolio of subsidiaries and business units under OceanLK Holdings.',
}

export const revalidate = 60

async function getCompanies() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('companies')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  return data || []
}

export default async function CompaniesPage() {
  const companies = await getCompanies()

  const fallbackCompanies = [
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
      logo_url: undefined as string | undefined
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
      logo_url: undefined as string | undefined
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
      logo_url: undefined as string | undefined
    }
  ]

  const items = companies.length > 0 ? companies : fallbackCompanies

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold text-[#0056b3] uppercase tracking-widest">Global Portfolio</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mt-2">
          Our Subsidiary Companies
        </h1>
        <p className="mt-4 text-gray-600 text-base leading-relaxed">
          From deep-sea shipping and cargo logistics to clean energy and technology, OceanLK entities lead their sectors with innovation and excellence.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((comp) => (
          <div
            key={comp.id}
            className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
          >
            <div className="h-56 w-full overflow-hidden relative bg-gray-100">
              <img
                src={comp.image || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800'}
                alt={comp.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {comp.logo_url && (
                <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-sm p-2.5 rounded-xl shadow-lg">
                  <img src={comp.logo_url} alt={`${comp.title} logo`} className="w-10 h-10 object-contain" />
                </div>
              )}
              <span className="absolute top-4 right-4 px-3 py-1 bg-[#001529]/80 backdrop-blur-md text-white text-xs font-semibold rounded-full uppercase tracking-wider">
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

                <div className="h-px w-full bg-gray-100 mb-4" />

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Est.</p>
                      <p className="text-sm font-semibold text-gray-900">{comp.established || '1998'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Team</p>
                      <p className="text-sm font-semibold text-gray-900">{comp.employees || '300+'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                href={`/companies/${comp.slug || comp.id}`}
                className="w-full py-3 rounded-xl bg-blue-50 text-[#0056b3] font-bold text-sm text-center hover:bg-[#0056b3] hover:text-white transition-all flex items-center justify-center gap-2"
              >
                View Profile & Services <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
