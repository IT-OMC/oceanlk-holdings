'use client'

import React, { useState } from 'react'
import { Briefcase, MapPin, Clock, ArrowRight, UploadCloud, CheckCircle, Search, X, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'

interface Job {
  id: string
  title: string
  company_name?: string | null
  location: string
  type: string
  category: string
  level?: string | null
  description: string
  requirements?: string[]
  featured?: boolean
  posted_date: string
}

export default function CareersClientComponent({ jobs }: { jobs: Job[] }) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Application form state
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [experience, setExperience] = useState('1-3 years')
  const [message, setMessage] = useState('')
  const [resumeFile, setResumeFile] = useState<File | null>(null)

  const categories = ['All', ...Array.from(new Set(jobs.map((j) => j.category)))]

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.company_name && job.company_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!resumeFile) {
      toast.error('Please upload your CV / Resume (PDF format)')
      return
    }

    if (resumeFile.size > 5 * 1024 * 1024) {
      toast.error('CV file size must be less than 5MB')
      return
    }

    setIsSubmitting(true)
    const toastId = toast.loading('Submitting your application...')

    try {
      const supabase = createClient()

      // 1. Upload CV to Supabase Storage ('resumes' bucket)
      const fileExt = resumeFile.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`
      const filePath = `applications/${fileName}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, resumeFile, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      // 2. Insert application record into talent_pool_applications table
      const { error: insertError } = await (supabase
        .from('talent_pool_applications') as any)
        .insert({
          job_id: selectedJob ? selectedJob.id : null,
          full_name: fullName,
          email,
          phone,
          position: selectedJob ? selectedJob.title : 'General Talent Pool',
          experience,
          message,
          cv_url: filePath,
          cv_filename: resumeFile.name,
          cv_file_size: resumeFile.size,
          status: 'PENDING',
        })

      if (insertError) {
        throw new Error(`Database error: ${insertError.message}`)
      }

      toast.success('Application submitted successfully! Our HR team will reach out soon.', { id: toastId })
      setSelectedJob(null)
      setFullName('')
      setEmail('')
      setPhone('')
      setMessage('')
      setResumeFile(null)
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Failed to submit application. Please try again.', { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search open positions by role, company, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0056b3] shadow-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#0056b3] text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Job Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <span className="px-3 py-1 bg-blue-50 text-[#0056b3] text-xs font-bold rounded-full">
                  {job.category}
                </span>
                {job.level && (
                  <span className="text-xs text-gray-400 font-medium">{job.level}</span>
                )}
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
              <p className="text-xs font-semibold text-gray-500 mb-4">{job.company_name || 'OceanLK Group'}</p>

              <p className="text-sm text-gray-600 line-clamp-3 mb-6 leading-relaxed">
                {job.description}
              </p>

              <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-6">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" /> {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-gray-400" /> {job.type}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedJob(job)}
              className="w-full py-3 rounded-xl bg-[#0056b3] hover:bg-[#004494] text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              Apply for Role <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Talent Pool Banner if no jobs matched or for general application */}
      <div className="mt-12 rounded-3xl bg-gray-50 border border-gray-200 p-8 text-center max-w-2xl mx-auto">
        <h4 className="text-lg font-bold text-gray-900 mb-2">Can&apos;t find the perfect role right now?</h4>
        <p className="text-sm text-gray-600 mb-6">
          Submit your profile to our Executive Talent Pool. We review resumes constantly for emerging leadership and specialist opportunities.
        </p>
        <button
          onClick={() =>
            setSelectedJob({
              id: 'talent-pool',
              title: 'General Talent Pool Application',
              location: 'Sri Lanka & International',
              type: 'Full-time / Flexible',
              category: 'Talent Network',
              description: 'General submission to OceanLK Holdings talent acquisition repository.',
              posted_date: new Date().toISOString(),
            })
          }
          className="px-6 py-3 rounded-full bg-gray-900 hover:bg-black text-white font-semibold text-sm transition-all"
        >
          Submit to Talent Pool
        </button>
      </div>

      {/* APPLICATION MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-6 right-6 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-xs font-bold text-[#0056b3] uppercase tracking-wider">Job Application</span>
              <h2 className="text-2xl font-black text-gray-900 mt-1">{selectedJob.title}</h2>
              <p className="text-xs text-gray-500 mt-0.5">{selectedJob.location} • {selectedJob.type}</p>
            </div>

            <form onSubmit={handleSubmitApplication} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#0056b3] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#0056b3] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone / Mobile *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+94 77 123 4567"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#0056b3] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Relevant Experience</label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#0056b3] focus:outline-none bg-white"
                >
                  <option value="Entry / Graduate">Entry Level (0-1 year)</option>
                  <option value="1-3 years">1 - 3 years</option>
                  <option value="3-5 years">3 - 5 years</option>
                  <option value="5-10 years">5 - 10 years</option>
                  <option value="10+ years">10+ years (Senior / Executive)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Upload Resume / CV (PDF, max 5MB) *</label>
                <input
                  type="file"
                  required
                  accept=".pdf"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2 rounded-xl border border-dashed border-gray-300 text-sm bg-gray-50 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#0056b3] file:text-white hover:file:bg-[#004494]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Cover Note / Remarks</label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Introduce yourself or highlight why you're a great fit..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#0056b3] focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-[#0056b3] hover:bg-[#004494] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Submitting Application...
                    </>
                  ) : (
                    'Confirm & Send Application'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
