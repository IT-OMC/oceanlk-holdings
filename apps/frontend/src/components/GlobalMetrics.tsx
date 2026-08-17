'use client'

import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Ship, Calendar, Anchor, Globe, MapPin, LucideIcon } from 'lucide-react'

export interface MetricItem {
  id: string
  label: string
  value: string
  icon: string
}

const ICONS: Record<string, LucideIcon> = { Ship, Calendar, Anchor, Globe, MapPin }

function useCountUp(end: number, duration: number, inView: boolean) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return

    let startTime: number | null = null
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(end * easeOutQuart))
      if (progress < 1) animationFrame = requestAnimationFrame(animate)
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration, inView])

  return count
}

function MetricCard({ value, label, icon, index }: { value: string; label: string; icon: string; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const Icon = ICONS[icon] || Globe

  const numericMatch = value.match(/^([\d.]+)(.*)$/)
  const numericValue = numericMatch ? parseFloat(numericMatch[1]) : 0
  const suffix = numericMatch ? numericMatch[2] : value

  const animatedCount = useCountUp(numericValue, 2000, isInView)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6, type: 'spring' }}
      className="relative group h-full p-4 md:p-6 flex flex-col items-center justify-between backdrop-blur-sm rounded-2xl border transition-all duration-500 hover:shadow-xl hover:-translate-y-2 bg-white/80 border-blue-100 bg-blue-50 hover:bg-blue-100"
    >
      <div className="mb-4 p-4 rounded-full bg-white shadow-sm group-hover:scale-110 transition-transform duration-300 text-blue-500">
        <Icon size={32} strokeWidth={1.5} />
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="text-4xl lg:text-5xl font-black tracking-tight text-blue-600">
          <span className="tabular-nums">{isInView ? animatedCount : 0}</span>
          {suffix}
        </div>
        <div className="font-medium text-slate-500 uppercase tracking-widest text-[11px] text-center px-2">{label}</div>
      </div>
    </motion.div>
  )
}

export default function GlobalMetrics({ metrics }: { metrics: MetricItem[] }) {
  if (metrics.length === 0) return null

  return (
    <section className="relative py-20 bg-slate-50/50">
      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-slate-900">Our Global Footprint</h2>
          <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full mb-4" />
          <p className="text-slate-500 text-sm tracking-widest uppercase font-medium">Numbers That Define Us</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {metrics.map((metric, index) => (
            <MetricCard key={metric.id} value={metric.value} label={metric.label} icon={metric.icon} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
