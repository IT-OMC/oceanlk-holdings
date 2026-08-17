'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarPlus, X, Send } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export interface UpcomingEvent {
  id: string
  slug: string
  title: string
  date: string
  location: string
  imageUrl?: string
  category: string
}

const CATEGORY_COLORS: Record<string, string> = {
  SOCIAL: 'text-blue-500',
  LEARNING: 'text-cyan-500',
  CELEBRATION: 'text-purple-500',
  MEETING: 'text-yellow-500',
}

export default function UpcomingEvents({ events }: { events: UpcomingEvent[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', ideaTitle: '', description: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Not yet wired to a backend — acknowledges the submission locally only.
    toast.success("Thanks! We've noted your idea.")
    setIsModalOpen(false)
    setFormData({ name: '', email: '', ideaTitle: '', description: '' })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <section className="py-20 px-4 md:px-6 w-full max-w-[95%] mx-auto">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">Upcoming Events</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {events.map((event) => (
          <motion.div
            key={event.id}
            whileHover={{ y: -5 }}
            className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group flex flex-col"
          >
            <div className="h-48 overflow-hidden relative">
              {event.imageUrl ? (
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-blue-100 flex items-center justify-center">
                  <span className="text-4xl">📅</span>
                </div>
              )}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                {format(new Date(event.date), 'MMM dd')}
              </div>
            </div>
            <div className="p-6 flex-grow">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{event.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{event.location}</p>
              <span className={`text-[10px] font-bold tracking-wider uppercase ${CATEGORY_COLORS[event.category] || 'text-gray-500'}`}>
                {event.category}
              </span>
            </div>
            <div className="px-6 pb-6 mt-auto">
              <Link
                href={`/careers/culture/events/${event.slug}`}
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                See More
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </motion.div>
        ))}

        <motion.div
          whileHover={{ y: -5 }}
          onClick={() => setIsModalOpen(true)}
          className="relative bg-gray-900 rounded-3xl p-8 flex flex-col justify-center items-center text-center overflow-hidden group cursor-pointer"
        >
          <img
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-70 transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-500" />

          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 mx-auto group-hover:bg-white/30 transition-colors">
              <CalendarPlus className="text-white" size={24} />
            </div>
            <h3 className="font-bold text-white mb-2 shadow-sm">Suggest an Idea</h3>
            <p className="text-sm text-gray-200">Have an idea for a team event? Let us know!</p>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>

              <div className="mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <CalendarPlus className="text-blue-600" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Suggest an Event Idea</h2>
                <p className="text-gray-600">Share your creative ideas with us!</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="ideaTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Event Title
                  </label>
                  <input
                    type="text"
                    id="ideaTitle"
                    name="ideaTitle"
                    value={formData.ideaTitle}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Summer Team Building"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Describe your event idea..."
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Send size={18} />
                    Submit
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
