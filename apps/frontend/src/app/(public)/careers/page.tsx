import React from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles, Briefcase, Heart, Users } from 'lucide-react'

export const metadata = {
  title: 'Careers & Talent Network',
  description: 'Explore exciting career opportunities across maritime, logistics, and technology at OceanLK Holdings.',
}

const hubLinks = [
  {
    href: '/careers/opportunities',
    icon: Briefcase,
    title: 'Open Opportunities',
    description: 'Browse and apply to active roles across OceanLK Holdings and its subsidiaries.',
  },
  {
    href: '/careers/culture',
    icon: Heart,
    title: 'Life at OceanLK',
    description: 'Discover our culture, values, and what it feels like to grow your career here.',
  },
  {
    href: '/careers/talent-pool',
    icon: Users,
    title: 'Join Our Talent Pool',
    description: "Don't see the right role yet? Submit your CV and we'll reach out when a match arises.",
  },
]

export default function CareersPage() {
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {hubLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0056b3] flex items-center justify-center mb-6 group-hover:bg-[#0056b3] group-hover:text-white transition-colors">
              <link.icon className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{link.title}</h2>
            <p className="text-sm text-gray-600 leading-relaxed flex-grow">{link.description}</p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#0056b3] group-hover:text-[#004494]">
              Explore <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
