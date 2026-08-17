import React from 'react'
import { MapPin, Phone, Mail, Clock, MessageSquare, ShieldCheck, Send } from 'lucide-react'
import ContactForm from './ContactForm'

export const metadata = {
  title: 'Contact Global Headquarters',
  description: 'Get in touch with OceanLK Holdings corporate management and regional offices.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold text-[#0056b3] uppercase tracking-widest">Connect With Us</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mt-2">
          Global Inquiries & Support
        </h1>
        <p className="mt-4 text-gray-600 text-base leading-relaxed">
          Whether exploring subsidiary partnerships, marine logistics coordination, or media inquiries, our management desk is ready to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Contact Info Col */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#001529] text-white p-8 rounded-3xl shadow-xl space-y-6">
            <h2 className="text-2xl font-bold">OceanLK Global HQ</h2>
            <p className="text-sm text-gray-300 leading-relaxed font-light">
              Centrally located in Colombo’s international business district with direct connectivity to port and airport corridors.
            </p>

            <div className="space-y-4 pt-4 border-t border-white/10 text-sm text-gray-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#2ecc71] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white">Registered Address</strong>
                  Level 28, West Tower, World Trade Center, Echelon Square, Colombo 01, Sri Lanka.
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#2ecc71] flex-shrink-0" />
                <div>
                  <strong className="block text-white">Phone Support</strong>
                  +94 (11) 234 5678 / +94 (11) 234 5679
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#2ecc71] flex-shrink-0" />
                <div>
                  <strong className="block text-white">General Inquiries</strong>
                  info@ocean.lk / commercial@ocean.lk
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#2ecc71] flex-shrink-0" />
                <div>
                  <strong className="block text-white">Operations Desk</strong>
                  24/7/365 Port Dispatch & Bunkering Support
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-blue-50 border border-blue-100 p-6 flex items-start gap-4 text-sm text-blue-900">
            <ShieldCheck className="w-6 h-6 text-[#0056b3] flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Direct Corporate Guarantee</strong>
              All commercial inquiries receive priority routing with guaranteed response within 24 business hours.
            </div>
          </div>
        </div>

        {/* Form Col */}
        <div className="lg:col-span-3">
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
