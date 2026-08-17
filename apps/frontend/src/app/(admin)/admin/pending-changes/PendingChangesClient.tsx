'use client'

import React, { useState } from 'react'
import { CheckCircle2, XCircle, Clock, AlertTriangle, Eye, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

export default function PendingChangesClient({ initialChanges }: { initialChanges: any[] }) {
  const [changes, setChanges] = useState(initialChanges)
  const [selectedChange, setSelectedChange] = useState<any | null>(null)
  const [reviewComments, setReviewComments] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleDecision = async (changeId: string, decision: 'APPROVED' | 'REJECTED') => {
    setIsProcessing(true)
    const toastId = toast.loading(`Executing ${decision.toLowerCase()} authorization...`)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      // 1. Update pending_changes record
      const { error: updateError } = await (supabase.from('pending_changes') as any)
        .update({
          status: decision,
          reviewed_by: user?.id,
          reviewed_by_name: user?.email,
          reviewed_at: new Date().toISOString(),
          review_comments: reviewComments || null,
        })
        .eq('id', changeId)

      if (updateError) throw updateError

      // 2. Insert into audit_logs
      await (supabase.from('audit_logs') as any).insert({
        user_id: user?.id,
        user_email: user?.email,
        action: `${decision}_PENDING_CHANGE`,
        entity_type: selectedChange?.entity_type,
        entity_id: selectedChange?.entity_id,
        details: { changeId, decision, comments: reviewComments },
      })

      setChanges((prev) =>
        prev.map((c) =>
          c.id === changeId ? { ...c, status: decision, review_comments: reviewComments } : c
        )
      )

      toast.success(`Change has been ${decision.toLowerCase()}!`, { id: toastId })
      setSelectedChange(null)
      setReviewComments('')
    } catch (err: any) {
      toast.error(err.message || 'Failed to process decision', { id: toastId })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-4 px-6">Entity</th>
                <th className="py-4 px-6">Action</th>
                <th className="py-4 px-6">Submitted By</th>
                <th className="py-4 px-6">Timestamp</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Inspection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {changes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No pending change requests in queue.
                  </td>
                </tr>
              ) : (
                changes.map((change) => (
                  <tr key={change.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-4 px-6 font-bold text-white">
                      {change.entity_type}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-0.5 rounded-full font-extrabold text-[10px] ${
                        change.action === 'CREATE' ? 'bg-emerald-500/20 text-emerald-300' :
                        change.action === 'UPDATE' ? 'bg-blue-500/20 text-blue-300' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {change.action}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-300">
                      {change.submitted_by_name || 'Staff Editor'}
                    </td>
                    <td className="py-4 px-6 text-slate-400">
                      {change.submitted_at ? format(new Date(change.submitted_at), 'MMM dd, HH:mm') : 'Recent'}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        change.status === 'PENDING' ? 'bg-amber-500/20 text-amber-300' :
                        change.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {change.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => {
                          setSelectedChange(change)
                          setReviewComments(change.review_comments || '')
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> Inspect Diff
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* INSPECTION MODAL */}
      {selectedChange && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative my-8 text-slate-100">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-[#2ecc71] uppercase tracking-wider">
                  Maker-Checker Inspection
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  {selectedChange.action} {selectedChange.entity_type}
                </h3>
              </div>
              <button
                onClick={() => setSelectedChange(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
              >
                ✕
              </button>
            </div>

            {/* Change JSON Diff */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Proposed Change Payload (JSON)</label>
                <pre className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-emerald-400 text-xs overflow-x-auto max-h-60">
                  {JSON.stringify(selectedChange.change_data, null, 2)}
                </pre>
              </div>

              {selectedChange.original_data && (
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Original Payload (Pre-modification)</label>
                  <pre className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs overflow-x-auto max-h-40">
                    {JSON.stringify(selectedChange.original_data, null, 2)}
                  </pre>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Executive Review Comments</label>
                <textarea
                  rows={2}
                  value={reviewComments}
                  onChange={(e) => setReviewComments(e.target.value)}
                  placeholder="Optional audit notes or feedback..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0056b3]"
                />
              </div>
            </div>

            {/* Actions */}
            {selectedChange.status === 'PENDING' ? (
              <div className="flex gap-3 justify-end pt-4 border-t border-slate-800">
                <button
                  onClick={() => handleDecision(selectedChange.id, 'REJECTED')}
                  disabled={isProcessing}
                  className="px-5 py-2.5 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-bold transition-colors disabled:opacity-50"
                >
                  Reject Proposal
                </button>
                <button
                  onClick={() => handleDecision(selectedChange.id, 'APPROVED')}
                  disabled={isProcessing}
                  className="px-6 py-2.5 rounded-xl bg-[#2ecc71] hover:bg-[#27ae60] text-[#001529] text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  Authorize & Publish
                </button>
              </div>
            ) : (
              <div className="text-right text-xs text-slate-400">
                This change was marked as <strong>{selectedChange.status}</strong>.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
