'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Ship, Anchor, Package, Briefcase, PieChart, TrendingUp, Wrench, Users, CheckCircle,
  Globe, Map, Activity, MapPin, Smile, Compass, Layout, BarChart, Award, Play, X,
} from 'lucide-react'

const IconMap: Record<string, any> = {
  Ship, Anchor, Package, Briefcase, PieChart, TrendingUp,
  Wrench, Users, CheckCircle, Globe, Map, Activity,
  MapPin, Smile, Compass, Layout, BarChart, Award,
}

export interface CompanyStat {
  label: string
  value: string
  icon?: string
}

function CountUp({ value, duration = 1.8 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const numeric = parseFloat(value.replace(/[^0-9.]/g, '')) || 0
  const suffix = value.replace(/[0-9.]/g, '')
  const [displayed, setDisplayed] = useState(0)

  useEffect(() => {
    if (!isInView || numeric === 0) return
    let start: number | null = null
    let raf: number
    const step = (timestamp: number) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayed(Math.round(eased * numeric))
      if (progress < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [isInView, numeric, duration])

  return (
    <span ref={ref}>
      {displayed}
      {suffix}
    </span>
  )
}

export function CompanyStatCards({ stats }: { stats: CompanyStat[] }) {
  const statsRef = useRef(null)
  const statsInView = useInView(statsRef, { once: true, margin: '-100px' })

  if (!stats?.length) return null

  return (
    <div ref={statsRef} className="grid sm:grid-cols-3 gap-5">
      {stats.map((stat, index) => {
        const Icon = IconMap[stat.icon || ''] || Award
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="group relative bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-6 text-white overflow-hidden hover:-translate-y-1 transition-transform duration-300"
          >
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            <Icon className="w-7 h-7 text-accent mb-4 relative z-10" />
            <div className="text-4xl font-bold mb-1 relative z-10">
              <CountUp value={stat.value} />
            </div>
            <div className="text-white/70 text-sm font-medium relative z-10">{stat.label}</div>
          </motion.div>
        )
      })}
    </div>
  )
}

export function CompanyCoreStrengths({ stats }: { stats: CompanyStat[] }) {
  const servicesRef = useRef(null)
  const servicesInView = useInView(servicesRef, { once: true, margin: '-100px' })

  if (!stats?.length) return null

  const descriptions = [
    (value: string, label: string) => `Industry-leading performance with ${value} ${label.toLowerCase()} and growing.`,
    () => `A dedicated team committed to quality and operational excellence across every project.`,
    () => `Consistently delivering results that exceed client expectations and industry benchmarks.`,
  ]

  return (
    <section className="py-24 bg-gray-50" ref={servicesRef}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={servicesInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">What We Do</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-2">Core Strengths</h2>
          <div className="w-12 h-1 bg-accent rounded-full mt-4 mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const Icon = IconMap[stat.icon || ''] || Award
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 + index * 0.15 }}
                className="group bg-white border border-gray-100 rounded-3xl p-8 hover:shadow-xl hover:shadow-primary/8 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-primary/8 group-hover:bg-primary rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300">
                  <Icon className="w-7 h-7 text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{stat.label}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{descriptions[index % 3](stat.value, stat.label)}</p>
                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-3xl font-extrabold text-primary">
                    <CountUp value={stat.value} />
                  </span>
                  <span className="text-xs text-gray-400 uppercase tracking-wider">and counting</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function CompanyMediaSpotlight({ title, category, image, video }: { title: string; category: string; image: string; video: string }) {
  const [videoOpen, setVideoOpen] = useState(false)

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">Media</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-2">See Us In Action</h2>
          <div className="w-12 h-1 bg-accent rounded-full mt-4 mx-auto" />
        </motion.div>

        <motion.div
          className="relative rounded-3xl overflow-hidden group cursor-pointer shadow-2xl shadow-gray-900/20"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          onClick={() => setVideoOpen(true)}
        >
          <img src={image} alt={title} className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-gray-900/20 group-hover:from-gray-900/70 transition-colors" />

          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300"
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(255,255,255,0.4)',
                  '0 0 0 20px rgba(255,255,255,0)',
                  '0 0 0 0 rgba(255,255,255,0)',
                ],
              }}
              transition={{ repeat: Infinity, duration: 2.5 }}
            >
              <Play className="w-8 h-8 text-primary ml-1" fill="currentColor" />
            </motion.div>
          </div>

          <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
            <div>
              <p className="text-white text-2xl font-bold">{title}</p>
              <p className="text-white/70 text-sm">{category}</p>
            </div>
            <span className="bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">Watch Video</span>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {videoOpen && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setVideoOpen(false)}
          >
            <motion.div
              className="relative w-full max-w-5xl rounded-2xl overflow-hidden"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setVideoOpen(false)}
                className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/40 backdrop-blur text-white rounded-full p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <video src={video} poster={image} autoPlay controls className="w-full aspect-video" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
