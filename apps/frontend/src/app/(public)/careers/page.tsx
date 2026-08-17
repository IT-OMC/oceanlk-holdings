import React from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Briefcase, MapPin, Clock, ArrowRight, UploadCloud, CheckCircle, Sparkles } from 'lucide-react'
import CareersClientComponent from './CareersClient'

export const metadata = {
  title: 'Careers & Talent Network',
  description: 'Explore exciting career opportunities across maritime, logistics, and technology at OceanLK Holdings.',
}

export const revalidate = 60

async function getJobOpportunities() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('job_opportunities')
    .select('*')
    .eq('status', 'ACTIVE')
    .order('posted_date', { ascending: false })

  return data || []
}

export default async function CareersPage() {
  const jobs = await getJobOpportunities()

  const fallbackJobs = [
    {
      id: '1',
      title: 'Senior Marine Engineer',
      company_name: 'Ocean Marine Services',
      location: 'Colombo Port, Sri Lanka',
      type: 'Full-time',
      category: 'Marine Engineering',
      level: 'Senior',
      description: 'Lead ship repair operations, overhaul propulsion systems, and supervise technical dockyard activities.',
      requirements: ['Class 1 Marine Engineer Certificate', '5+ years offshore experience', 'Strong diagnostic skills'],
      posted_date: new Date().toISOString(),
      featured: true,
    },
    {
      id: '2',
      title: 'Global Supply Chain Analyst',
      company_name: 'Ceylon Global Logistics',
      location: 'Colombo / Hybrid',
      type: 'Full-time',
      category: 'Logistics',
      level: 'Mid-Senior',
      description: 'Optimize multi-modal freight routes, evaluate carrier performance, and design automated logistics dashboards.',
      requirements: ['BSc in Supply Chain / Logistics', 'Proficiency in ERP & PowerBI', '3+ years experience'],
      posted_date: new Date().toISOString(),
      featured: false,
    },
    {
      id: '3',
      title: 'Fullstack Software Engineer',
      company_name: 'OceanLK Digital',
      location: 'Colombo / Remote',
      type: 'Full-time',
      category: 'Technology',
      level: 'Mid-Senior',
      description: 'Build mission-critical maritime tracking, IoT sensors integration, and next-gen enterprise web platforms.',
      requirements: ['TypeScript / Next.js / PostgreSQL', 'REST/GraphQL API design', 'Cloud deployment knowledge'],
      posted_date: new Date().toISOString(),
      featured: true,
    },
  ]

  const displayJobs = jobs.length > 0 ? jobs : fallbackJobs

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0056b3] text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" /> Empowering Exceptional Talent
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
          Build Your Career With Us
        </h1>
        <p className="mt-4 text-gray-600 text-base leading-relaxed">
          Join a multidisciplinary team driving the future of global maritime, logistics, clean energy, and high-growth technologies.
        </p>
        <Link
          href="/careers/culture"
          className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#0056b3] hover:text-[#004494] group"
        >
          Discover Life at OceanLK <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Interactive Job Board & Modal */}
      <CareersClientComponent jobs={displayJobs} />
    </div>
  )
}
