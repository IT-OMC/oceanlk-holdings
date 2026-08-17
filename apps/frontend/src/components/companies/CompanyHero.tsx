'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowLeft, Calendar, Users, DollarSign, ChevronDown } from 'lucide-react'

export interface CompanyHeroData {
  title: string
  category: string
  description: string
  image: string
  video?: string | null
  established?: string
  employees?: string
  revenue?: string
}

export default function CompanyHero({ company }: { company: CompanyHeroData }) {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <div ref={heroRef} className="relative h-screen overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y: heroY }}>
        {company.video ? (
          <video src={company.video} autoPlay loop muted playsInline className="w-full h-full object-cover scale-110" />
        ) : (
          <img src={company.image} alt={company.title} className="w-full h-full object-cover scale-110" />
        )}
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-gray-900/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/50 to-transparent" />

      <motion.div className="absolute inset-0 flex flex-col justify-end pb-24" style={{ opacity: heroOpacity }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Link
              href="/companies"
              className="inline-flex items-center gap-2 text-white/70 hover:text-accent transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium tracking-wider uppercase">All Companies</span>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <span className="inline-flex items-center gap-2 bg-accent/20 border border-accent/40 text-accent text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-6 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
              {company.category}
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold text-white mb-5 leading-tight"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            {company.title}
          </motion.h1>

          <motion.p
            className="text-xl text-white/80 max-w-2xl leading-relaxed mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            {company.description}
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            {[
              { icon: Calendar, label: 'Founded', value: company.established },
              { icon: Users, label: 'Team', value: company.employees },
              { icon: DollarSign, label: 'Revenue', value: company.revenue },
            ]
              .filter((item) => item.value)
              .map((item) => (
                <div key={item.label} className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-5 py-3">
                  <item.icon className="w-4 h-4 text-accent" />
                  <span className="text-white/60 text-sm">{item.label}:</span>
                  <span className="text-white font-bold">{item.value}</span>
                </div>
              ))}
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.8 }}
      >
        <ChevronDown className="w-7 h-7" />
      </motion.div>
    </div>
  )
}
