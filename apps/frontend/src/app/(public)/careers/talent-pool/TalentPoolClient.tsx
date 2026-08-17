'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, Send, ChevronRight, ChevronLeft, Sparkles, Target, Zap, Users, TrendingUp,
  FileText, BrainCircuit, Bell, Rocket, CheckCircle, AlertCircle, Star,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import AnimatedMeshBackground from '@/components/common/AnimatedMeshBackground'

const benefits = [
  { icon: Target, title: 'Personalized Matching', description: 'We match your skills and aspirations with opportunities across our diverse portfolio of companies.', color: 'from-blue-500 to-blue-600' },
  { icon: Zap, title: 'Early Access', description: "Get priority consideration for new positions before they're publicly advertised.", color: 'from-emerald-500 to-emerald-600' },
  { icon: Users, title: 'Career Development', description: 'Access to training resources, mentorship programs, and professional growth opportunities.', color: 'from-purple-500 to-purple-600' },
  { icon: TrendingUp, title: 'Fast-Track Process', description: 'Streamlined recruitment process for talent pool members with faster response times.', color: 'from-orange-500 to-orange-600' },
]

const journeySteps = [
  { icon: FileText, title: 'Create Profile', desc: 'Share your details & CV' },
  { icon: BrainCircuit, title: 'Skills Review', desc: 'Our team reviews your background' },
  { icon: Bell, title: 'Priority Alerts', desc: 'Get notified when a match arises' },
  { icon: Rocket, title: 'Fast-Track', desc: 'Direct interview access' },
]

interface FormState {
  fullName: string
  email: string
  phone: string
  position: string
  experience: string
  message: string
  file: File | null
}

export default function TalentPoolClient() {
  const searchParams = useSearchParams()
  const prefillJob = searchParams.get('job') || ''

  const [formData, setFormData] = useState<FormState>({
    fullName: '',
    email: '',
    phone: '',
    position: prefillJob,
    experience: '',
    message: '',
    file: null,
  })
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (prefillJob) {
      setFormData((prev) => ({ ...prev, position: prefillJob }))
    }
  }, [prefillJob])

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.position.trim()) newErrors.position = 'Desired Position is required'
    if (!formData.experience) newErrors.experience = 'Experience level is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (currentStep === 1 && validateStep1()) setCurrentStep(2)
    else if (currentStep === 2 && validateStep2()) setCurrentStep(3)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData((prev) => ({ ...prev, file: e.target.files![0] }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.file) {
      toast.error('Please attach your CV to continue')
      return
    }
    if (formData.file.size > 5 * 1024 * 1024) {
      toast.error('CV file size must be less than 5MB')
      return
    }

    setIsLoading(true)
    try {
      const supabase = createClient()

      const fileExt = formData.file.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`
      const filePath = `applications/${fileName}`

      const { error: uploadError } = await supabase.storage.from('resumes').upload(filePath, formData.file, {
        cacheControl: '3600',
        upsert: false,
      })
      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)

      const { error: insertError } = await (supabase.from('talent_pool_applications') as any).insert({
        job_id: null,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        experience: formData.experience,
        message: formData.message,
        cv_url: filePath,
        cv_filename: formData.file.name,
        cv_file_size: formData.file.size,
        status: 'PENDING',
      })
      if (insertError) throw new Error(`Database error: ${insertError.message}`)

      setIsSubmitted(true)
      toast.success('Application submitted successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit application. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1e3a] to-[#1a2847] relative overflow-hidden">
      <AnimatedMeshBackground />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-32 pb-20 relative z-10">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-semibold text-white">Join Our Talent Community</span>
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-6xl md:text-8xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-200 to-blue-200">Your Future</span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-emerald-200 to-white">Starts Here</span>
          </motion.h1>

          <motion.p
            className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Don&apos;t see the perfect role right now? Join our talent pool and be first in line when opportunities arise across our portfolio of
            innovative companies.
          </motion.p>
        </motion.div>

        {/* Benefits */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.8 }} className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">Why Join Our Talent Pool?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => {
              const Icon = benefit.icon
              return (
                <motion.div key={benefit.title} whileHover={{ y: -8, scale: 1.02 }} className="group relative">
                  <div className={`absolute -inset-1 bg-gradient-to-r ${benefit.color} rounded-3xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500`} />
                  <div className="relative h-full p-6 rounded-3xl overflow-hidden transition-all duration-500 bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl">
                    <div className="relative z-10 flex flex-col h-full">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${benefit.color} p-3 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-lg`}>
                        <Icon className="w-full h-full text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Journey */}
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="mb-20 px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">Your Journey to Success</h2>
          <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">A seamless process designed to connect you with the right opportunities.</p>

          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-emerald-500/20 -translate-y-1/2" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {journeySteps.map((step, index) => (
                <motion.div key={step.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.2 }} className="relative group">
                  <div className="bg-[#0f1e3a] p-6 rounded-2xl border border-white/10 relative z-20 hover:border-emerald-500/50 transition-colors duration-300 h-full flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-white/10">
                      <step.icon className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-400">{step.desc}</p>
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#0a1628] border border-white/10 flex items-center justify-center text-xs font-bold text-emerald-400">
                      {index + 1}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8 }} className="max-w-3xl mx-auto mb-20">
          {!isSubmitted ? (
            <div className="relative group/form">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/30 to-blue-500/30 rounded-3xl opacity-50 blur-lg group-hover/form:opacity-75 transition-opacity duration-500" />
              <div className="relative p-1.5 rounded-3xl overflow-hidden bg-[#0f1e3a]/70 backdrop-blur-2xl border border-white/10 shadow-2xl">
                {/* Progress Indicator */}
                <div className="px-8 pt-10 pb-10 relative overflow-hidden">
                  <div className="flex items-center justify-between relative max-w-lg mx-auto">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-emerald-900/30 rounded-full -z-10" />
                    <div
                      className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full -z-10 transition-all duration-500"
                      style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                    />
                    {[1, 2, 3].map((step) => (
                      <div key={step} className="relative flex flex-col items-center group">
                        <motion.div
                          className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 relative z-10 border-[3px] backdrop-blur-md ${
                            currentStep >= step ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-[#0f1e3a]/80 border-white/10 text-gray-500'
                          }`}
                          animate={{ scale: currentStep === step ? 1.15 : 1 }}
                        >
                          {currentStep > step ? <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-white">✓</motion.span> : step}
                          {currentStep === step && (
                            <motion.div
                              className="absolute inset-0 rounded-full border-2 border-emerald-500"
                              animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            />
                          )}
                        </motion.div>
                        <span className={`absolute -bottom-8 text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${currentStep >= step ? 'text-emerald-400' : 'text-gray-600'}`}>
                          {step === 1 ? 'About' : step === 2 ? 'Experience' : 'CV'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 md:p-10">
                  <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                      <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                        <div className="text-center mb-8">
                          <h3 className="text-3xl font-bold text-white mb-2">Who are you?</h3>
                          <p className="text-gray-400">Let&apos;s get to know each other better.</p>
                        </div>

                        <div className="space-y-6">
                          {[
                            { id: 'fullName', label: 'Full Name', type: 'text', placeholder: 'e.g. Sarah Smith' },
                            { id: 'email', label: 'Email Address', type: 'email', placeholder: 'sarah@example.com' },
                            { id: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+94 71 234 5678' },
                          ].map((field) => (
                            <div key={field.id} className="group">
                              <label htmlFor={field.id} className="block text-sm font-semibold text-gray-300 mb-2 ml-1 group-focus-within:text-emerald-400 transition-colors">
                                {field.label} <span className="text-emerald-500">*</span>
                              </label>
                              <input
                                type={field.type}
                                id={field.id}
                                name={field.id}
                                value={formData[field.id as keyof FormState] as string}
                                onChange={handleChange}
                                required
                                className={`w-full px-6 py-4 rounded-2xl bg-white/5 border text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 transition-all duration-300 ${
                                  errors[field.id] ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-emerald-500/50 hover:border-white/20'
                                }`}
                                placeholder={field.placeholder}
                              />
                              {errors[field.id] && (
                                <div className="flex items-center gap-1 mt-2 text-red-400 text-xs ml-1">
                                  <AlertCircle className="w-3 h-3" />
                                  <span>{errors[field.id]}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-end mt-10">
                          <motion.button
                            type="button"
                            onClick={nextStep}
                            whileHover={{ scale: 1.02, x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all duration-300 bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-lg"
                          >
                            Next Step
                            <ChevronRight className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 2 && (
                      <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                        <div className="text-center mb-8">
                          <h3 className="text-3xl font-bold text-white mb-2">Your Expertise</h3>
                          <p className="text-gray-400">Tell us about your professional background.</p>
                        </div>

                        <div className="space-y-6">
                          <div className="group">
                            <label htmlFor="position" className="block text-sm font-semibold text-gray-300 mb-2 ml-1 group-focus-within:text-emerald-400 transition-colors">
                              Desired Position <span className="text-emerald-500">*</span>
                            </label>
                            <input
                              type="text"
                              id="position"
                              name="position"
                              value={formData.position}
                              onChange={handleChange}
                              required
                              className={`w-full px-6 py-4 rounded-2xl bg-white/5 border text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 transition-all duration-300 ${
                                errors.position ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-emerald-500/50 hover:border-white/20'
                              }`}
                              placeholder="e.g. Senior Software Engineer"
                            />
                            {errors.position && (
                              <div className="flex items-center gap-1 mt-2 text-red-400 text-xs ml-1">
                                <AlertCircle className="w-3 h-3" />
                                <span>{errors.position}</span>
                              </div>
                            )}
                          </div>

                          <div className="group">
                            <label htmlFor="experience" className="block text-sm font-semibold text-gray-300 mb-2 ml-1 group-focus-within:text-emerald-400 transition-colors">
                              Years of Experience <span className="text-emerald-500">*</span>
                            </label>
                            <select
                              id="experience"
                              name="experience"
                              value={formData.experience}
                              onChange={handleChange}
                              required
                              className={`w-full px-6 py-4 rounded-2xl bg-white/5 border text-white focus:outline-none focus:bg-white/10 transition-all duration-300 appearance-none cursor-pointer ${
                                errors.experience ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-emerald-500/50 hover:border-white/20'
                              }`}
                            >
                              <option value="" className="bg-[#0f1e3a] text-gray-400">Select your experience level</option>
                              <option value="0-2" className="bg-[#0f1e3a] text-white">0-2 years (Junior)</option>
                              <option value="3-5" className="bg-[#0f1e3a] text-white">3-5 years (Mid-Level)</option>
                              <option value="6-10" className="bg-[#0f1e3a] text-white">6-10 years (Senior)</option>
                              <option value="10+" className="bg-[#0f1e3a] text-white">10+ years (Expert)</option>
                            </select>
                            {errors.experience && (
                              <div className="flex items-center gap-1 mt-2 text-red-400 text-xs ml-1">
                                <AlertCircle className="w-3 h-3" />
                                <span>{errors.experience}</span>
                              </div>
                            )}
                          </div>

                          <div className="group">
                            <label htmlFor="message" className="block text-sm font-semibold text-gray-300 mb-2 ml-1 group-focus-within:text-emerald-400 transition-colors">
                              Tell us about yourself
                            </label>
                            <textarea
                              id="message"
                              name="message"
                              value={formData.message}
                              onChange={handleChange}
                              rows={4}
                              className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-emerald-500/50 transition-all duration-300 resize-none hover:border-white/20"
                              placeholder="What makes you a great fit for us?"
                            />
                          </div>
                        </div>

                        <div className="flex justify-between mt-10">
                          <motion.button type="button" onClick={prevStep} whileHover={{ scale: 1.02, x: -5 }} whileTap={{ scale: 0.98 }} className="px-6 py-4 rounded-xl font-semibold flex items-center gap-2 text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                            <ChevronLeft className="w-5 h-5" />
                            Back
                          </motion.button>
                          <motion.button
                            type="button"
                            onClick={nextStep}
                            whileHover={{ scale: 1.02, x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all duration-300 bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-lg"
                          >
                            Next Step
                            <ChevronRight className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 3 && (
                      <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                        <div className="text-center mb-8">
                          <h3 className="text-3xl font-bold text-white mb-2">Final Step</h3>
                          <p className="text-gray-400">Attach your CV to complete the application.</p>
                        </div>

                        <div className="mb-10">
                          <div
                            className="relative border-2 border-dashed rounded-3xl p-10 md:p-16 text-center hover:border-emerald-400 transition-all duration-300 cursor-pointer group overflow-hidden bg-white/[0.02]"
                            style={{ borderColor: formData.file ? '#10b981' : 'rgba(255,255,255,0.1)' }}
                          >
                            <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" id="cv-upload" />
                            <label htmlFor="cv-upload" className="cursor-pointer block relative z-10 w-full h-full">
                              {formData.file ? (
                                <div className="flex flex-col items-center">
                                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 mb-6 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                    <CheckCircle className="w-12 h-12 text-emerald-400" />
                                  </motion.div>
                                  <p className="text-2xl font-bold text-white mb-3">CV Uploaded!</p>
                                  <div className="flex items-center gap-3 px-6 py-3 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                                    <FileText className="w-5 h-5 text-emerald-400" />
                                    <p className="text-emerald-300 font-medium truncate max-w-[250px]">{formData.file.name}</p>
                                  </div>
                                  <p className="mt-8 text-sm text-gray-400 hover:text-white transition-colors">Click to change file</p>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center">
                                  <div className="w-24 h-24 mb-8 rounded-full bg-[#0f1e3a] border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-emerald-500/50 transition-all duration-300 shadow-lg">
                                    <Upload className="w-10 h-10 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                                  </div>
                                  <p className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">Drop your resume here</p>
                                  <p className="text-gray-400 mb-8 max-w-xs mx-auto">Upload your CV to help us match you with the right opportunities.</p>
                                  <div className="flex items-center gap-4 text-xs text-gray-500 uppercase tracking-widest font-medium bg-white/5 px-4 py-2 rounded-full">
                                    <span>PDF</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-600" />
                                    <span>DOC</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-600" />
                                    <span>DOCX</span>
                                  </div>
                                </div>
                              )}
                            </label>
                          </div>
                        </div>

                        <div className="flex justify-between mt-10">
                          <motion.button type="button" onClick={prevStep} whileHover={{ scale: 1.02, x: -5 }} whileTap={{ scale: 0.98 }} className="px-6 py-4 rounded-xl font-semibold flex items-center gap-2 text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                            <ChevronLeft className="w-5 h-5" />
                            Back
                          </motion.button>
                          <motion.button
                            type="submit"
                            disabled={!formData.file || isLoading}
                            whileHover={formData.file && !isLoading ? { scale: 1.02, x: 5 } : {}}
                            whileTap={formData.file && !isLoading ? { scale: 0.98 } : {}}
                            className={`px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all duration-300 ${
                              formData.file && !isLoading ? 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-lg' : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
                            }`}
                          >
                            {isLoading ? (
                              <>
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Sending...
                              </>
                            ) : (
                              <>
                                Submit Application
                                <Send className="w-5 h-5" />
                              </>
                            )}
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-24 px-6 relative overflow-hidden bg-[#0f1e3a]/70 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl"
            >
              <div className="absolute top-0 right-0 p-8 opacity-20">
                <Sparkles className="w-32 h-32 text-emerald-400 animate-pulse" />
              </div>
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <Star className="w-12 h-12 text-white" fill="currentColor" />
              </div>
              <h3 className="text-4xl font-bold text-white mb-4">Application Sent!</h3>
              <p className="text-gray-300 text-lg mb-10 max-w-md mx-auto leading-relaxed">
                Thank you for your interest in joining our team. We&apos;ve received your details and will get back to you shortly.
              </p>
              <motion.button
                onClick={() => {
                  setIsSubmitted(false)
                  setCurrentStep(1)
                  setFormData({ fullName: '', email: '', phone: '', position: '', experience: '', message: '', file: null })
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-xl font-semibold bg-white/10 text-white hover:bg-white/20 transition-all border border-white/5"
              >
                Submit Another Application
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Companies in Portfolio', value: '5+' },
            { label: 'Growing Team', value: '500+' },
            { label: 'Sectors Represented', value: '5' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.05 }}
              className="text-center p-8 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/15 shadow-xl"
            >
              <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-400 mb-2">{stat.value}</div>
              <div className="text-gray-300 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
