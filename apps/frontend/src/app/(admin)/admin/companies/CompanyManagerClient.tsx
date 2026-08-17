'use client'

import React, { useState } from 'react'
import { Plus, Edit2, Trash2, Globe, Building2, Check, X, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function CompanyManagerClient({ initialCompanies }: { initialCompanies: any[] }) {
  const [companies, setCompanies] = useState(initialCompanies)
  const [editingCompany, setEditingCompany] = useState<any | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Form state
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [website, setWebsite] = useState('')
  const [image, setImage] = useState('')
  const [established, setEstablished] = useState('1998')
  const [employees, setEmployees] = useState('300+')

  const handleOpenEdit = (comp?: any) => {
    if (comp) {
      setEditingCompany(comp)
      setTitle(comp.title)
      setSlug(comp.slug)
      setCategory(comp.category || '')
      setDescription(comp.description || '')
      setWebsite(comp.website || '')
      setImage(comp.image || '')
      setEstablished(comp.established || '1998')
      setEmployees(comp.employees || '300+')
    } else {
      setEditingCompany({ isNew: true })
      setTitle('')
      setSlug('')
      setCategory('')
      setDescription('')
      setWebsite('')
      setImage('')
      setEstablished('2024')
      setEmployees('100+')
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    const toastId = toast.loading('Saving company entity...')

    try {
      const supabase = createClient()
      const payload = {
        title,
        slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        category,
        description,
        website,
        image: image || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800',
        established,
        employees,
        is_active: true,
      }

      if (editingCompany.isNew) {
        const { data, error } = await (supabase.from('companies') as any).insert(payload).select().single()
        if (error) throw error
        setCompanies((prev) => [...prev, data])
        toast.success('Company added successfully!', { id: toastId })
      } else {
        const { data, error } = await (supabase.from('companies') as any)
          .update(payload)
          .eq('id', editingCompany.id)
          .select()
          .single()
        if (error) throw error
        setCompanies((prev) => prev.map((c) => (c.id === editingCompany.id ? data : c)))
        toast.success('Company updated successfully!', { id: toastId })
      }

      setEditingCompany(null)
    } catch (err: any) {
      toast.error(err.message || 'Failed to save company', { id: toastId })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to deactivate this subsidiary?')) return

    try {
      const supabase = createClient()
      const { error } = await (supabase.from('companies') as any).update({ is_active: false }).eq('id', id)
      if (error) throw error

      setCompanies((prev) => prev.filter((c) => c.id !== id))
      toast.success('Company deactivated successfully')
    } catch (err: any) {
      toast.error(err.message || 'Failed to deactivate')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => handleOpenEdit()}
          className="px-4 py-2.5 rounded-xl bg-[#0056b3] hover:bg-[#004494] text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Subsidiary
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {companies.map((comp) => (
          <div
            key={comp.id}
            className="p-5 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold">
                  {comp.category || 'Subsidiary'}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(comp)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(comp.id)}
                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-base text-white">{comp.title}</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                {comp.description}
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Est: {comp.established || '1998'}</span>
              <span>Team: {comp.employees || '300+'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT / CREATE MODAL */}
      {editingCompany && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8 text-slate-100">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                {editingCompany.isNew ? 'Create New Subsidiary' : `Edit ${editingCompany.title}`}
              </h3>
              <button
                onClick={() => setEditingCompany(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Company Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Ocean Marine Services"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-[#0056b3]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. ocean-marine"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-[#0056b3]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category / Sector</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Marine Engineering"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-[#0056b3]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Official Website</label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-[#0056b3]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Overview Description *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary of core business activities..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-[#0056b3]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Established Year</label>
                  <input
                    type="text"
                    value={established}
                    onChange={(e) => setEstablished(e.target.value)}
                    placeholder="1998"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-[#0056b3]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Team Size</label>
                  <input
                    type="text"
                    value={employees}
                    onChange={(e) => setEmployees(e.target.value)}
                    placeholder="450+"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-[#0056b3]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Image URL</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-[#0056b3]"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingCompany(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-[#0056b3] hover:bg-[#004494] text-white font-bold transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  Save Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
