'use client'

import React, { useState } from 'react'
import { Download, Search, Mail, Phone, Clock, FileText, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

export default function ApplicationsClient({ initialApplications }: { initialApplications: any[] }) {
  const [applications, setApplications] = useState(initialApplications)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  const filtered = applications.filter((app) => {
    const matchesSearch =
      app.full_name.toLowerCase().includes(search.toLowerCase()) ||
      app.email.toLowerCase().includes(search.toLowerCase()) ||
      app.position.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleDownloadCV = async (app: any) => {
    setDownloadingId(app.id)
    try {
      const supabase = createClient()
      // Generate 60-second signed URL for private resume access
      const { data, error } = await supabase.storage
        .from('resumes')
        .createSignedUrl(app.cv_url, 60)

      if (error || !data?.signedUrl) {
        throw new Error(error?.message || 'Failed to generate secure resume URL')
      }

      window.open(data.signedUrl, '_blank')
    } catch (err: any) {
      toast.error(err.message || 'Error downloading resume')
    } finally {
      setDownloadingId(null)
    }
  }

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const supabase = createClient()
      const { error } = await (supabase.from('talent_pool_applications') as any)
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error

      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      )
      toast.success(`Candidate status updated to ${newStatus}`)
    } catch (err: any) {
      toast.error(err.message || 'Failed to update candidate status')
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search applicants by name, email, role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0056b3]"
          />
        </div>
        <div className="flex gap-2">
          {['ALL', 'PENDING', 'REVIEWED', 'CONTACTED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                statusFilter === st
                  ? 'bg-[#0056b3] text-white'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-4 px-6">Candidate</th>
                <th className="py-4 px-6">Position</th>
                <th className="py-4 px-6">Experience</th>
                <th className="py-4 px-6">Submitted</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No candidate applications matching criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-white text-sm">{app.full_name}</div>
                      <div className="text-slate-400 text-[11px] flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {app.email}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {app.phone}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-200">
                      {app.position}
                    </td>
                    <td className="py-4 px-6 text-slate-300">
                      {app.experience || 'Not specified'}
                    </td>
                    <td className="py-4 px-6 text-slate-400">
                      {app.submitted_date ? format(new Date(app.submitted_date), 'MMM dd, yyyy') : 'Recent'}
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={app.status}
                        onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0056b3]"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="REVIEWED">REVIEWED</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDownloadCV(app)}
                        disabled={downloadingId === app.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 font-semibold transition-colors disabled:opacity-50"
                      >
                        {downloadingId === app.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Download className="w-3.5 h-3.5" />
                        )}
                        <span>View CV</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
