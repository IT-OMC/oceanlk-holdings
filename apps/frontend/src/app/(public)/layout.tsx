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

function PublicNavbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
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
    {
      label: 'Corporate',
      href: '/corporate',
      subItems: [
        { label: 'Profile', href: '/corporate' },
        { label: 'Leadership', href: '/corporate#leadership' },
      ],
    },
    {
      label: 'Companies',
      href: '/companies',
      subItems: [
        { label: 'All Companies', href: '/companies' },
        { label: 'Ocean Maritime Ceylon', href: '/companies/omc', logo: '/company logos/Ocean Maritime Ceylon logo.png' },
        { label: 'Ocean Engineering Ceylon', href: '/companies/oec', logo: '/company logos/Ocean engineering ceylon.png' },
        { label: 'Ocean Maritime Channel', href: '/companies/omch', logo: '/company logos/ocean maritime channel.png' },
        { label: 'Connecting Cubes', href: '/companies/connecting-cubes', logo: '/company logos/connecting cubes logo..png' },
        { label: 'Digital Books', href: '/companies/digital-books', logo: '/company logos/digital books.png' },
      ],
    },
    {
      label: 'News & Media',
      href: '/news',
      subItems: [
        { label: 'News', href: '/news' },
        { label: 'Media', href: '/news#media' },
      ],
    },
    {
      label: 'Careers',
      href: '/careers',
      subItems: [
        { label: 'Culture', href: '/careers#culture' },
        { label: 'Opportunities', href: '/careers#opportunities' },
        { label: 'Talent Pool', href: '/careers#talent-pool' },
      ],
    },
    { label: 'Contact Us', href: '/contact' },
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
        <div className="hidden lg:flex items-center space-x-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
            const hasDropdown = link.subItems && link.subItems.length > 0

            return (
              <div key={link.label} className="relative group">
                <Link
                  href={link.href}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'text-[#0056b3] bg-blue-50/80 font-bold'
                      : 'text-gray-700 hover:text-[#0056b3] hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                  {hasDropdown && <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />}
                </Link>

                {/* Dropdown Menu */}
                {hasDropdown && (
                  <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-56 transform translate-y-2 group-hover:translate-y-0 z-50">
                    <div className="bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden py-2">
                      {link.subItems.map((subItem) => (
                        <Link
                          key={subItem.label}
                          href={subItem.href}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#0056b3] transition-colors"
                        >
                          {subItem.logo && (
                            <div className="w-6 h-6 flex-shrink-0 bg-gray-50 rounded overflow-hidden">
                              <img src={subItem.logo} alt={subItem.label} className="w-full h-full object-contain mix-blend-multiply" />
                            </div>
                          )}
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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
            className="lg:hidden bg-white border-b border-gray-200 shadow-xl overflow-hidden"
          >
            <div className="px-4 py-6 space-y-2 max-h-[80vh] overflow-y-auto">
              {navLinks.map((link) => {
                const hasDropdown = link.subItems && link.subItems.length > 0
                return (
                  <div key={link.label} className="space-y-1">
                    {hasDropdown ? (
                      <>
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === link.label ? null : link.label)}
                          className="w-full flex items-center justify-between px-4 py-3 text-base font-semibold text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          {link.label}
                          <ChevronDown
                            className={`w-5 h-5 transition-transform duration-300 ${activeDropdown === link.label ? 'rotate-180 text-[#0056b3]' : 'text-gray-400'}`}
                          />
                        </button>
                        <AnimatePresence>
                          {activeDropdown === link.label && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-4 py-2 space-y-1 bg-gray-50/50 rounded-lg mt-1 mx-2">
                                {link.subItems.map((subItem) => (
                                  <Link
                                    key={subItem.label}
                                    href={subItem.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 rounded-lg hover:text-[#0056b3] hover:bg-white transition-colors"
                                  >
                                    {subItem.logo && (
                                      <div className="w-6 h-6 flex-shrink-0 bg-white shadow-sm rounded overflow-hidden">
                                        <img src={subItem.logo} alt={subItem.label} className="w-full h-full object-contain p-0.5 mix-blend-multiply" />
                                      </div>
                                    )}
                                    {subItem.label}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-4 py-3 rounded-lg text-base font-semibold text-gray-800 hover:bg-gray-50 hover:text-[#0056b3] transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </div>
                )
              })}
              <div className="pt-6 mt-4 border-t border-gray-100">
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-3.5 rounded-xl bg-[#0056b3] hover:bg-[#004494] transition-colors text-white font-bold shadow-md"
                >
                  Get in Touch
                </Link>
              </div>
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
