import React from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import {
  Building2,
  Briefcase,
  Users,
  MessageSquare,
  GitPullRequest,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle,
} from 'lucide-react'

export const revalidate = 0 // Dynamic admin overview

async function getAdminMetrics() {
  const supabase = await createClient()

  const [companiesCount, jobsCount, applicationsCount, contactsCount, pendingChangesCount, recentContacts] = await Promise.all([
    (supabase.from('companies') as any).select('*', { count: 'exact', head: true }),
    (supabase.from('job_opportunities') as any).select('*', { count: 'exact', head: true }).eq('status', 'ACTIVE'),
    (supabase.from('talent_pool_applications') as any).select('*', { count: 'exact', head: true }),
    (supabase.from('contact_messages') as any).select('*', { count: 'exact', head: true }).eq('status', 'NEW'),
    (supabase.from('pending_changes') as any).select('*', { count: 'exact', head: true }).eq('status', 'PENDING'),
    (supabase.from('contact_messages') as any).select('*').order('created_at', { ascending: false }).limit(5),
  ])

  return {
    companiesCount: companiesCount.count || 0,
    jobsCount: jobsCount.count || 0,
    applicationsCount: applicationsCount.count || 0,
    contactsCount: contactsCount.count || 0,
    pendingChangesCount: pendingChangesCount.count || 0,
    recentContacts: (recentContacts.data || []) as any[],
  }
}

export default async function AdminDashboardPage() {
  const metrics = await getAdminMetrics()

  const statCards = [
    {
      label: 'Subsidiaries',
      value: metrics.companiesCount,
      href: '/admin/companies',
      icon: Building2,
      color: 'from-blue-600 to-indigo-600',
    },
    {
      label: 'Active Job Openings',
      value: metrics.jobsCount,
      href: '/admin/jobs',
      icon: Briefcase,
      color: 'from-emerald-600 to-teal-600',
    },
    {
      label: 'Candidate Applications',
      value: metrics.applicationsCount,
      href: '/admin/applications',
      icon: Users,
      color: 'from-amber-500 to-orange-600',
    },
    {
      label: 'New Inquiries',
      value: metrics.contactsCount,
      href: '/admin/contacts',
      icon: MessageSquare,
      color: 'from-purple-600 to-pink-600',
    },
    {
      label: 'Pending Approvals',
      value: metrics.pendingChangesCount,
      href: '/admin/pending-changes',
      icon: GitPullRequest,
      color: 'from-rose-600 to-red-600',
      badge: metrics.pendingChangesCount > 0 ? 'Requires Action' : undefined,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          Executive Operations Center
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Real-time metrics, content governance, and pending Maker-Checker approvals.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.label}
              href={card.href}
              className="p-5 rounded-3xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${card.color} flex items-center justify-center text-white`}>
                  <Icon className="w-5 h-5" />
                </div>
                {card.badge && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                    {card.badge}
                  </span>
                )}
              </div>
              <div>
                <span className="text-3xl font-black text-white">{card.value}</span>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">{card.label}</p>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Inquiries */}
        <div className="p-6 rounded-3xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#0056b3]" /> Recent Inquiries
            </h3>
            <Link href="/admin/contacts" className="text-xs text-[#2ecc71] hover:underline font-semibold">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {metrics.recentContacts.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No inquiries received yet.</p>
            ) : (
              metrics.recentContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/60 flex items-center justify-between text-xs"
                >
                  <div className="overflow-hidden">
                    <p className="font-bold text-white truncate">{contact.name}</p>
                    <p className="text-slate-400 text-[11px] truncate">{contact.subject}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    contact.status === 'NEW' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {contact.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Governance & Maker-Checker Quick Info */}
        <div className="p-6 rounded-3xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2 mb-4">
              <GitPullRequest className="w-4 h-4 text-rose-400" /> Maker-Checker Workflow
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              All modifications to subsidiaries, executive leadership, or live news posts submitted by editors require two-party authorization before being visible on the public website.
            </p>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 space-y-2">
              <div className="flex items-center justify-between">
                <span>Pending Reviews:</span>
                <strong className="text-white">{metrics.pendingChangesCount}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Security Engine:</span>
                <span className="text-[#2ecc71] font-semibold">PostgreSQL RLS Active</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <Link
              href="/admin/pending-changes"
              className="w-full py-3 rounded-xl bg-[#0056b3] hover:bg-[#004494] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              Review Pending Approvals <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
