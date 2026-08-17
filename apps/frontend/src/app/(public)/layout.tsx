'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronDown, X, Menu, Globe, Phone, Mail, MapPin } from 'lucide-react'

// TopBar component
function TopBar() {
  return (
    <div className="bg-[#001529] text-gray-300 text-xs py-1.5 px-4 hidden md:block border-b border-white/10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <span className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors">
            <MapPin className="w-3.5 h-3.5 text-[#2ecc71]" /> Colombo, Sri Lanka | Global Presence
          </span>
          <span className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors">
            <Mail className="w-3.5 h-3.5 text-[#2ecc71]" /> info@ocean.lk
          </span>
          <span className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors">
            <Phone className="w-3.5 h-3.5 text-[#2ecc71]" /> +94 (11) 234 5678
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/careers" className="hover:text-white transition-colors">Careers</Link>
          <span className="text-gray-600">|</span>
          <Link href="/news" className="hover:text-white transition-colors">Media Center</Link>
          <span className="text-gray-600">|</span>
          <Link href="/admin/login" className="text-[#2ecc71] hover:underline font-medium">Portal Login</Link>
        </div>
      </div>
    </div>
  )
}

// Navbar component
function PublicNavbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Our Companies', href: '/companies' },
    { label: 'Corporate', href: '/corporate' },
    { label: 'Careers', href: '/careers' },
    { label: 'News & Media', href: '/news' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled || !isHome
          ? 'bg-white/95 backdrop-blur-md shadow-md py-3 text-gray-900 border-b border-gray-100'
          : 'bg-white/80 backdrop-blur-sm py-4 text-gray-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0056b3] to-[#2ecc71] flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
            O
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-[#001529] group-hover:text-[#0056b3] transition-colors leading-tight">
              OCEANLK
            </span>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-[#2ecc71]">
              HOLDINGS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center space-x-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? 'text-[#0056b3] bg-blue-50/80 font-bold'
                    : 'text-gray-700 hover:text-[#0056b3] hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* CTA Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/contact"
            className="px-5 py-2.5 rounded-full bg-[#0056b3] hover:bg-[#004494] text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            Get in Touch
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 space-y-2 shadow-xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-base font-medium text-gray-800 hover:bg-blue-50 hover:text-[#0056b3]"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3">
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-3 rounded-xl bg-[#0056b3] text-white font-semibold shadow"
              >
                Get in Touch
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

// Footer Component
function PublicFooter() {
  return (
    <footer className="bg-[#001529] text-gray-400 pt-16 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0056b3] to-[#2ecc71] flex items-center justify-center text-white font-bold text-lg">
                O
              </div>
              <span className="text-xl font-bold tracking-tight text-white">OCEANLK HOLDINGS</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed pr-6">
              A diversified multinational enterprise pioneering excellence across maritime services, global logistics, green energy, industrial trade, and transformative technologies.
            </p>
            <div className="text-xs text-gray-500">
              Registered Office: OceanLK Tower, World Trade Center, Colombo 01, Sri Lanka.
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Enterprise</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/corporate" className="hover:text-[#2ecc71] transition-colors">About the Group</Link></li>
              <li><Link href="/corporate#leadership" className="hover:text-[#2ecc71] transition-colors">Board of Directors</Link></li>
              <li><Link href="/companies" className="hover:text-[#2ecc71] transition-colors">Our Subsidiaries</Link></li>
              <li><Link href="/corporate#sustainability" className="hover:text-[#2ecc71] transition-colors">Sustainability & ESG</Link></li>
            </ul>
          </div>

          {/* Portfolios */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Industries</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/companies?category=marine" className="hover:text-[#2ecc71] transition-colors">Marine Services</Link></li>
              <li><Link href="/companies?category=logistics" className="hover:text-[#2ecc71] transition-colors">Global Logistics</Link></li>
              <li><Link href="/companies?category=energy" className="hover:text-[#2ecc71] transition-colors">Renewable Energy</Link></li>
              <li><Link href="/companies?category=tech" className="hover:text-[#2ecc71] transition-colors">Digital Innovation</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Contact & Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="hover:text-[#2ecc71] transition-colors">Contact Inquiries</Link></li>
              <li><Link href="/careers" className="hover:text-[#2ecc71] transition-colors">Career Opportunities</Link></li>
              <li><Link href="/news" className="hover:text-[#2ecc71] transition-colors">Press & Media</Link></li>
              <li><Link href="/admin/login" className="text-[#2ecc71] hover:underline font-medium">Staff Portal</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} OceanLK Holdings. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-gray-400">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-400">Terms of Service</Link>
            <Link href="/compliance" className="hover:text-gray-400">Compliance & Ethics</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

import ChatWidget from '@/components/chat/ChatWidget'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8F9FA]">
      <TopBar />
      <PublicNavbar />
      <main className="flex-grow">{children}</main>
      <ChatWidget />
      <PublicFooter />
    </div>
  )
}
