'use client'

import React, { useState } from 'react'
import { Send, Loader2, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { submitContactMessage } from '@/app/actions/contact'

export default function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const result = await submitContactMessage({
      name,
      email,
      phone,
      subject,
      message,
    })

    setIsSubmitting(false)

    if (result.success) {
      setIsSuccess(true)
      toast.success('Your message has been sent successfully!')
      setName('')
      setEmail('')
      setPhone('')
      setSubject('')
      setMessage('')
    } else {
      toast.error(result.error || 'Failed to submit inquiry')
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-200 shadow-sm text-center">
        <div className="w-16 h-16 bg-emerald-100 text-[#2ecc71] rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-2">Message Dispatched!</h3>
        <p className="text-sm text-gray-600 max-w-md mx-auto mb-8">
          Thank you for reaching out to OceanLK Holdings. Our management liaison will review your inquiry and connect with you promptly.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="px-6 py-3 rounded-full bg-[#0056b3] text-white text-xs font-bold hover:bg-[#004494] transition-colors"
        >
          Send Another Message
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 mb-1">Send a Message</h3>
      <p className="text-xs text-gray-500 mb-6">
        Fill out the form below to reach the corporate affairs desk.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Your Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alexander Vance"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#0056b3] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Business Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@enterprise.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#0056b3] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Contact Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+94 11 234 5678"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#0056b3] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Inquiry Subject *</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Commercial Port Agency Partnership"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#0056b3] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Message & Context *</label>
          <textarea
            rows={5}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Please detail your commercial requirements or questions..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#0056b3] focus:outline-none"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-[#0056b3] hover:bg-[#004494] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 active:scale-98"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Transmitting Inquiry...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> Send Direct Message
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
