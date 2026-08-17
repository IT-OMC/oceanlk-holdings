'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Briefcase, ArrowRight, Search, Filter, Sparkles, Star, TrendingUp } from 'lucide-react'
import AnimatedMeshBackground from '@/components/common/AnimatedMeshBackground'

export interface JobOpportunity {
  id: string
  title: string
  company: string
  location: string
  type: string
  category: string
  description: string
  featured: boolean
}

export default function OpportunitiesClient({ jobs }: { jobs: JobOpportunity[] }) {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = ['All', ...Array.from(new Set(jobs.map((j) => j.category)))]

  const filteredJobs = jobs.filter((job) => {
    const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const featuredJobs = filteredJobs.filter((job) => job.featured)
  const regularJobs = filteredJobs.filter((job) => !job.featured)

  const goToApply = (job: JobOpportunity) => {
    router.push(`/careers/talent-pool?job=${encodeURIComponent(job.title)}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1e3a] to-[#1a2847] relative overflow-hidden">
      <AnimatedMeshBackground />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-32 pb-20 relative z-10">
        {/* Hero Section */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8 relative overflow-hidden group bg-white/10 backdrop-blur-md border border-white/20 shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-emerald-400 relative z-10" />
            <span className="text-sm font-semibold text-white relative z-10">Join Our Team</span>
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-6xl md:text-8xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-200 to-blue-200">Shape the Future</span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-emerald-200 to-white">with Ocean Ceylon</span>
          </motion.h1>

          <motion.p
            className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Discover where your talent fits in our ecosystem of innovative companies. We&apos;re building something extraordinary, together.
          </motion.p>

          <motion.div
            className="max-w-6xl mx-auto p-1.5 rounded-3xl relative bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="flex flex-col lg:flex-row gap-4 items-stretch p-3">
              <div className="relative flex-1 w-full lg:w-auto">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
                <input
                  type="text"
                  placeholder="Search for your dream role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-4 pl-14 pr-6 rounded-2xl text-white placeholder-gray-400 focus:outline-none transition-all bg-white/5 backdrop-blur-md border border-white/10"
                />
              </div>

              <div className="flex gap-2.5 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto px-2 lg:px-0 lg:flex-shrink-0">
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                      selectedCategory === category
                        ? 'text-white bg-gradient-to-br from-emerald-500/80 to-emerald-600/80 border border-white/30 shadow-lg'
                        : 'text-gray-300 hover:text-white bg-white/5 backdrop-blur-md border border-white/10'
                    }`}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>
            </div>

            <motion.div className="px-6 pb-3 text-sm text-gray-400" key={filteredJobs.length} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
              Found <span className="text-emerald-400 font-semibold">{filteredJobs.length}</span> {filteredJobs.length === 1 ? 'opportunity' : 'opportunities'}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Featured Jobs - Bento Grid */}
        {featuredJobs.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }} className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <Star className="w-6 h-6 text-yellow-400" />
              <h2 className="text-3xl font-bold text-white">Featured Opportunities</h2>
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-4 md:gap-6 auto-rows-[240px] sm:auto-rows-[260px] md:auto-rows-[280px]">
              <AnimatePresence mode="popLayout">
                {featuredJobs.map((job, index) => {
                  const gridClass =
                    index === 0
                      ? 'sm:col-span-2 md:col-span-6 lg:col-span-7 sm:row-span-2 md:row-span-2'
                      : index === 1
                      ? 'sm:col-span-1 md:col-span-3 lg:col-span-5 sm:row-span-1 md:row-span-1'
                      : 'sm:col-span-1 md:col-span-3 lg:col-span-4 sm:row-span-1 md:row-span-1'

                  return (
                    <motion.div
                      layout
                      key={job.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className={`group relative ${gridClass}`}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-3xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500" />
                      <div className="h-full p-4 sm:p-5 rounded-2xl sm:rounded-3xl relative overflow-hidden transition-all duration-500 bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl">
                        <div className="relative z-10 h-full flex flex-col">
                          <div className="flex items-start justify-between mb-4">
                            <motion.div
                              className="p-2.5 rounded-xl bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30"
                              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                              transition={{ duration: 0.5 }}
                            >
                              <Briefcase className="w-5 h-5 text-emerald-400" />
                            </motion.div>
                            <div className="flex flex-col gap-1.5 items-end">
                              <span className="px-3 py-1 rounded-full text-xs font-semibold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30">
                                {job.type}
                              </span>
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium text-yellow-300 flex items-center gap-1 bg-yellow-500/20 border border-yellow-500/30">
                                <Star className="w-3 h-3" fill="currentColor" />
                                Featured
                              </span>
                            </div>
                          </div>

                          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 text-white group-hover:text-emerald-300 transition-colors duration-300">
                            {job.title}
                          </h3>
                          <p className="text-emerald-400 font-semibold mb-3 text-sm uppercase tracking-wider">{job.company}</p>
                          <p className="text-gray-300 text-sm mb-6 line-clamp-2 leading-relaxed">{job.description}</p>

                          <div className="mt-auto pt-6 border-t border-white/10">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-sm text-gray-300">
                                <MapPin className="w-4 h-4 text-blue-400" />
                                <span>{job.location}</span>
                              </div>
                              <motion.button
                                onClick={() => goToApply(job)}
                                className="px-5 py-2.5 rounded-full text-white flex items-center gap-2 bg-gradient-to-br from-emerald-500/60 to-emerald-600/60 border border-white/20"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <span className="font-semibold text-sm">Apply</span>
                                <ArrowRight className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* All Opportunities */}
        {regularJobs.length > 0 && (
          <div className="mb-20">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">All Opportunities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <AnimatePresence mode="popLayout">
                {regularJobs.map((job, index) => (
                  <motion.div
                    layout
                    key={job.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group relative"
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
                    <div className="h-full p-4 sm:p-5 rounded-2xl relative overflow-hidden transition-all duration-500 bg-white/10 backdrop-blur-2xl border border-white/20 shadow-xl">
                      <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-start justify-between mb-4">
                          <motion.div className="p-2 rounded-xl bg-blue-500/15 border border-blue-500/30" whileHover={{ rotate: [0, -5, 5, 0] }}>
                            <Briefcase className="w-5 h-5 text-blue-400" />
                          </motion.div>
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium text-gray-300 bg-white/10 border border-white/20">{job.type}</span>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-bold mb-2 text-white group-hover:text-blue-300 transition-colors">{job.title}</h3>
                        <p className="text-blue-400 font-semibold mb-4 text-sm uppercase tracking-wide">{job.company}</p>
                        <p className="text-gray-300 text-sm mb-6 line-clamp-2">{job.description}</p>

                        <div className="mt-auto pt-6 border-t border-white/10">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <MapPin className="w-4 h-4" />
                              <span>{job.location}</span>
                            </div>
                            <motion.button
                              onClick={() => goToApply(job)}
                              className="px-4 py-2 rounded-full flex items-center gap-2 bg-blue-500/20 border border-blue-500/30"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <span className="font-semibold text-sm text-blue-400">Apply</span>
                              <ArrowRight className="w-4 h-4 text-blue-400" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {filteredJobs.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="inline-block p-8 rounded-full mb-6 bg-white/5 backdrop-blur-md border border-white/10">
              <Filter className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-300 mb-2">No positions found</h3>
            <p className="text-gray-500">Try adjusting your filters or search criteria.</p>
          </motion.div>
        )}

        {/* Talent Pool CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-24 relative overflow-hidden rounded-3xl group"
          whileHover={{ scale: 1.02 }}
        >
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 opacity-20" />
          </div>
          <div className="absolute inset-0 backdrop-blur-2xl bg-white/10" />

          <div className="relative p-10 sm:p-16 text-center rounded-3xl border border-white/20">
            <motion.div initial={{ scale: 0.9 }} whileInView={{ scale: 1 }} transition={{ duration: 0.5 }}>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-white">Don&apos;t see a perfect fit?</h3>
              <p className="text-lg text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
                We&apos;re always looking for talented individuals to join our diverse portfolio of companies. Submit your CV to our talent pool and
                we&apos;ll contact you when a matching opportunity arises.
              </p>
              <motion.a
                href="/careers/talent-pool"
                className="inline-flex items-center gap-3 px-10 py-5 rounded-full font-bold text-lg transition-all bg-white text-[#0a1628] shadow-2xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Join Our Talent Pool</span>
                <ArrowRight className="w-6 h-6" />
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
