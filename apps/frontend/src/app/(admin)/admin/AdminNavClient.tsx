'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Building2,
  Newspaper,
  Briefcase,
  Users,
  MessageSquare,
  GitPullRequest,
  LogOut,
  Shield,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface AdminNavProps {
  currentRole: string
  userFullName: string
  userEmail: string
}

export default function AdminNavClient({ currentRole, userFullName, userEmail }: AdminNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Companies & Subsidiaries', href: '/admin/companies', icon: Building2 },
    { label: 'Job Postings', href: '/admin/jobs', icon: Briefcase },
    { label: 'Talent Pool & Resumes', href: '/admin/applications', icon: Users },
    { label: 'Contact Inquiries', href: '/admin/contacts', icon: MessageSquare },
    { label: 'Pending Approvals', href: '/admin/pending-changes', icon: GitPullRequest, highlight: true },
  ]

  const sanityStudioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'http://localhost:3333'

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('Signed out successfully')
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-slate-950 border-b border-slate-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0056b3] to-[#2ecc71] flex items-center justify-center font-bold text-white text-sm">
            O
          </div>
          <span className="font-extrabold text-sm tracking-tight text-white">ADMIN PORTAL</span>
        </div>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-lg text-slate-400 hover:text-white"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between p-4 transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand */}
          <div className="flex items-center gap-3 px-2 py-4 mb-6 border-b border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0056b3] to-[#2ecc71] flex items-center justify-center font-bold text-white">
              O
            </div>
            <div>
              <h2 className="font-black text-sm tracking-tight text-white leading-tight">OCEANLK</h2>
              <span className="text-[10px] font-semibold text-[#2ecc71] uppercase tracking-wider">
                Staff Control Hub
              </span>
            </div>
          </div>

          {/* User Profile Pill */}
          <div className="mb-6 p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#0056b3] text-white flex items-center justify-center font-bold text-xs">
              {userFullName.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{userFullName}</p>
              <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#2ecc71]/20 text-[#2ecc71] uppercase">
                {currentRole}
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#0056b3] text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <a
            href={sanityStudioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900"
          >
            <span className="flex items-center gap-2">
              <Newspaper className="w-3.5 h-3.5" /> Manage News in Sanity
            </span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900"
          >
            <span>Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>
    </>
  )
}
