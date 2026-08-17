'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Particle {
  x: number
  y: number
  scale: number
  duration: number
}

// Shared dark gradient-mesh + floating-particle background used across the
// restored Contact, Opportunities, and Talent Pool pages (all shared this
// exact visual treatment in the pre-migration design). Particle positions
// are generated client-side post-mount to avoid SSR/client hydration
// mismatches from Math.random() during render.
export default function AnimatedMeshBackground() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        scale: Math.random() * 0.5 + 0.5,
        duration: Math.random() * 20 + 10,
      }))
    )
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[120px] animate-pulse"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.4) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[120px] animate-pulse"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)', animationDelay: '1s' }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-[700px] h-[700px] rounded-full blur-[150px] animate-pulse"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)', animationDelay: '2s' }}
        />
      </div>

      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          initial={{ x: p.x, y: p.y, scale: p.scale }}
          animate={{ y: [null, Math.random() * window.innerHeight] as any, x: [null, Math.random() * window.innerWidth] as any }}
          transition={{ duration: p.duration, repeat: Infinity, repeatType: 'reverse' }}
        />
      ))}
    </div>
  )
}
