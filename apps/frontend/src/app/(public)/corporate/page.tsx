import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { ShieldCheck, Target, Compass, Award, Linkedin, Mail, CheckCircle2 } from 'lucide-react'
import BentoGrid from '@/components/corporate/BentoGrid'
import Timeline from '@/components/corporate/Timeline'

export const metadata = {
  title: 'Corporate Leadership & Governance',
  description: 'Learn about the mission, governance, and leadership team guiding OceanLK Holdings.',
}

export const revalidate = 60

async function getCorporateData() {
  const supabase = await createClient()

  const [categoriesRes, leadersRes] = await Promise.all([
    supabase.from('leadership_categories').select('*').order('display_order', { ascending: true }),
    supabase.from('corporate_leaders').select('*').eq('is_active', true).order('display_order', { ascending: true }),
  ])

  return {
    categories: categoriesRes.data || [],
    leaders: leadersRes.data || [],
  }
}

export default async function CorporatePage() {
  const { categories, leaders } = await getCorporateData()

  const fallbackLeaders = [
    {
      id: '1',
      name: 'Capt. Nishantha Silva',
      designation: 'Group Chairman & Chief Executive Officer',
      bio: 'Master Mariner with over 30 years of global maritime leadership, spearheading OceanLK expansion across ports in Asia and the Middle East.',
      image_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600',
      linkedin_url: 'https://linkedin.com',
      email: 'chairman@ocean.lk'
    },
    {
      id: '2',
      name: 'Dr. Anoma Wijesekara',
      designation: 'Executive Director & Chief Financial Officer',
      bio: 'Fellow Chartered Accountant and PhD in International Finance, overseeing group treasury, cross-border M&A, and governance compliance.',
      image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600',
      linkedin_url: 'https://linkedin.com',
      email: 'cfo@ocean.lk'
    },
    {
      id: '3',
      name: 'Mr. Rohan Perera',
      designation: 'Managing Director - Marine Operations',
      bio: 'Marine Engineer specializing in deep-sea salvage and fleet logistics with extensive experience managing international port agencies.',
      image_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600',
      linkedin_url: 'https://linkedin.com',
      email: 'operations@ocean.lk'
    }
  ]

  const displayLeaders = leaders.length > 0 ? leaders : fallbackLeaders

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="pt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center max-w-3xl mb-4">
        <span className="text-xs font-bold text-[#0056b3] uppercase tracking-widest">About the Enterprise</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mt-2">
          Corporate Governance & Leadership
        </h1>
        <p className="mt-4 text-gray-600 text-base leading-relaxed">
          Guided by ethical governance, maritime mastery, and global vision, our board of directors shapes long-term shareholder value and sustainable progress.
        </p>
      </div>

      {/* Who We Are / Our Journey - dark storytelling band */}
      <div className="bg-navy">
        <BentoGrid />
        <Timeline />
      </div>

      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Mission & Vision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0056b3] flex items-center justify-center mb-6">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-3">Our Mission</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            To provide world-class maritime, logistics, and industrial solutions that drive seamless global trade, uphold environmental integrity, and empower coastal communities.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#2ecc71] flex items-center justify-center mb-6">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-3">Our Vision</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            To be the Indian Ocean Corridor&apos;s most trusted, technologically advanced, and sustainable conglomerate, bridging continents with uncompromised operational excellence.
          </p>
        </div>
      </div>

      {/* Leadership Team Showcase */}
      <div id="leadership" className="mb-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#2ecc71] uppercase tracking-widest">Executive Board</span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-1">Board of Directors & Executives</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayLeaders.map((leader) => (
            <div
              key={leader.id}
              className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="h-72 w-full overflow-hidden bg-gray-100 relative">
                <img
                  src={leader.image_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600'}
                  alt={leader.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-6 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{leader.name}</h3>
                  <p className="text-xs font-semibold text-[#0056b3] mt-0.5 mb-4">{leader.designation}</p>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">{leader.bio}</p>
                </div>

                <div className="flex items-center gap-3 pt-6 mt-6 border-t border-gray-100">
                  {leader.linkedin_url && (
                    <a
                      href={leader.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-gray-50 text-gray-600 hover:text-[#0056b3] hover:bg-blue-50 transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {leader.email && (
                    <a
                      href={`mailto:${leader.email}`}
                      className="p-2 rounded-xl bg-gray-50 text-gray-600 hover:text-[#0056b3] hover:bg-blue-50 transition-colors"
                      aria-label="Email"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sustainability & ESG */}
      <div id="sustainability" className="rounded-3xl bg-[#001529] text-white p-8 sm:p-12 shadow-xl">
        <div className="max-w-3xl">
          <span className="text-xs font-bold text-[#2ecc71] uppercase tracking-widest">Environmental, Social & Governance</span>
          <h2 className="text-3xl font-extrabold mt-2 mb-4">Committed to Green Horizons</h2>
          <p className="text-sm text-gray-300 leading-relaxed mb-6">
            OceanLK Holdings aligns every business line with the United Nations Sustainable Development Goals (UN SDGs). From low-emission vessel routing to zero-single-use plastics across our port offices, we are committed to carbon neutrality by 2040.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2ecc71]" /> 100% IMO 2020 low-sulfur marine compliance
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2ecc71]" /> Solar-powered cold storage logistics hubs
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2ecc71]" /> Maritime scholarship fund for underprivileged youth
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2ecc71]" /> ISO 14001 Environmental Management Certified
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
