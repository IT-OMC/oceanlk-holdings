'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { sectors } from '@/data/sectors'

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % sectors.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + sectors.length) % sectors.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [nextSlide])

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden group">
      <div className="absolute inset-0 overflow-hidden bg-navy">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <motion.img
            src={sectors[currentSlide].image}
            alt={sectors[currentSlide].title}
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: 'easeOut' }}
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

        <div className="absolute inset-x-0 top-20 md:top-24 bottom-32 md:bottom-36 lg:bottom-40 flex flex-col items-center justify-center z-10 px-4 md:px-8 lg:px-12">
          <motion.div
            key={`logo-${currentSlide}`}
            initial={{ scale: 0, rotate: 180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: -180, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 md:mb-5 lg:mb-6 p-4 md:p-5 lg:p-6 bg-white rounded-full shadow-lg"
          >
            <img
              src={sectors[currentSlide].logo}
              alt={`${sectors[currentSlide].title} logo`}
              className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain"
            />
          </motion.div>

          <motion.h1
            key={`title-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white text-center leading-tight mb-3 md:mb-4 lg:mb-5"
          >
            {sectors[currentSlide].title}
          </motion.h1>

          <motion.p
            key={`desc-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-white/90 text-center max-w-sm md:max-w-md lg:max-w-2xl mb-6 md:mb-8 lg:mb-9 px-2 md:px-4"
          >
            {sectors[currentSlide].desc}
          </motion.p>

          <motion.a
            href="/companies"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="px-5 md:px-6 lg:px-8 py-2.5 md:py-3 lg:py-3.5 bg-white/10 backdrop-blur-sm text-white text-sm lg:text-base font-medium rounded-full border border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:scale-105"
          >
            Explore Our World
          </motion.a>
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-6 lg:left-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/20 transition-all duration-300 group opacity-0 group-hover:opacity-100"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 lg:w-7 lg:h-7 text-white group-hover:scale-110 transition-transform" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-6 lg:right-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/20 transition-all duration-300 group opacity-0 group-hover:opacity-100"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 lg:w-7 lg:h-7 text-white group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Bottom Navigation Circles */}
      <div className="absolute bottom-16 lg:bottom-24 left-0 right-0 z-20 px-4 lg:px-6">
        <div className="w-full max-w-[98%] mx-auto flex flex-wrap justify-center items-center gap-4 md:gap-8 lg:gap-12 pb-2 lg:pb-0">
          {sectors.map((sector, index) => {
            const isActive = currentSlide === index
            return (
              <button
                key={sector.id}
                onClick={() => setCurrentSlide(index)}
                className="group flex items-center gap-2 md:gap-4 focus:outline-none"
              >
                <div className="relative">
                  {isActive && (
                    <motion.div
                      layoutId="activeRing"
                      className="absolute -inset-2 rounded-full border-2 border-dotted border-secondary"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <motion.div
                    animate={{ scale: isActive ? 1 : 0.6, opacity: isActive ? 1 : 0.5 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className={`relative ${
                      isActive ? 'w-14 h-14 lg:w-16 lg:h-16' : 'w-10 h-10 lg:w-12 lg:h-12'
                    } rounded-full overflow-hidden border-2 ${
                      isActive ? 'border-secondary' : 'border-white/50 group-hover:opacity-100'
                    } bg-white flex items-center justify-center p-2`}
                  >
                    <img src={sector.logo} alt={sector.title} className="w-full h-full object-contain" />
                  </motion.div>
                </div>
                <span
                  className={`font-medium text-sm lg:text-base whitespace-nowrap transition-colors duration-300 hidden lg:block ${
                    isActive ? 'text-white' : 'text-white/60 group-hover:text-white/90'
                  }`}
                >
                  {sector.title}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-4 lg:bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1.5 h-1.5 bg-white rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
