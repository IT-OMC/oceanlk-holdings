import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft, Globe, Building, CheckCircle2, Phone, Mail, ExternalLink } from 'lucide-react'

export const revalidate = 60

async function getCompany(slug: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('companies')
    .select('*')
    .or(`slug.eq.${slug},id.eq.${slug}`)
    .single()

  return data
}

export default async function CompanyDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const company = await getCompany(params.slug)

  // Fallback if local or fresh DB
  const currentCompany = company || {
    id: params.slug,
    title: 'Ocean Marine Services Ltd',
    category: 'Marine Engineering & Port Agency',
    description: 'Comprehensive maritime solutions serving international ship owners, charterers, and operators navigating the Indian Ocean corridor.',
    long_description: 'Ocean Marine Services Ltd represents the flagship maritime arm of OceanLK Holdings. With state-of-the-art repair facilities, specialized crew management, high-seas bunkering, and emergency tugboat response teams, we operate with a zero-compromise safety mandate.\n\nOur certified marine engineers and port agents coordinate seamless vessel turnarounds in major Sri Lankan and regional ports, guaranteeing minimum demurrage and maximum operational security.',
    established: '1998',
    employees: '450+ Professionals',
    website: 'https://marine.ocean.lk',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1200',
    stats: [
      { label: 'Vessel Calls Managed', value: '1,800+' },
      { label: 'Bunker Delivery Volume', value: '450K MT' },
      { label: 'Port Coverage', value: '100%' },
      { label: 'Safety Incident Rate', value: '0.00%' },
    ]
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Back Button */}
      <Link
        href="/companies"
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#0056b3] mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Subsidiaries
      </Link>

      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-[#001529] text-white p-8 sm:p-12 mb-12 shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-block px-3 py-1 rounded-full bg-[#2ecc71]/20 text-[#2ecc71] text-xs font-bold uppercase tracking-wider mb-4">
            {currentCompany.category}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">{currentCompany.title}</h1>
          <p className="mt-4 text-base sm:text-lg text-gray-300 leading-relaxed font-light">
            {currentCompany.description}
          </p>

          {currentCompany.website && (
            <div className="mt-8">
              <a
                href={currentCompany.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0056b3] hover:bg-[#004494] text-white font-bold text-sm shadow-md transition-all active:scale-95"
              >
                Visit Official Website <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Main Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Company Overview</h2>
            <div className="prose prose-blue text-gray-700 leading-relaxed whitespace-pre-line">
              {currentCompany.long_description || currentCompany.description}
            </div>
          </div>

          <div className="rounded-2xl bg-gray-50 border border-gray-200 p-6 sm:p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Key Capabilities & Standards</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2ecc71]" /> ISO 9001:2015 Certified
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2ecc71]" /> 24/7 Rapid Response Unit
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2ecc71]" /> Full Customs Clearance
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2ecc71]" /> Environmental Compliance (IMO 2020)
              </li>
            </ul>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
              Enterprise Profile
            </h3>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-gray-400 text-xs uppercase font-semibold">Established</dt>
                <dd className="text-gray-800 font-bold mt-0.5">{currentCompany.established || '1998'}</dd>
              </div>
              <div>
                <dt className="text-gray-400 text-xs uppercase font-semibold">Workforce</dt>
                <dd className="text-gray-800 font-bold mt-0.5">{currentCompany.employees || '400+'}</dd>
              </div>
              <div>
                <dt className="text-gray-400 text-xs uppercase font-semibold">Headquarters</dt>
                <dd className="text-gray-800 font-bold mt-0.5">Colombo, Sri Lanka</dd>
              </div>
              <div>
                <dt className="text-gray-400 text-xs uppercase font-semibold">Parent Group</dt>
                <dd className="text-gray-800 font-bold mt-0.5">OceanLK Holdings</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-[#0056b3] to-[#001529] text-white p-6 shadow-md">
            <h4 className="font-bold text-base mb-2">Engage with this Entity</h4>
            <p className="text-xs text-blue-100 mb-4">
              Connect with the management team for commercial partnerships and service inquiries.
            </p>
            <Link
              href="/contact"
              className="block w-full py-2.5 rounded-xl bg-[#2ecc71] text-[#001529] text-center font-bold text-xs hover:bg-[#27ae60] transition-colors"
            >
              Submit Business Inquiry
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
