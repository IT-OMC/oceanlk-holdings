import React from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AdminNavClient from './AdminNavClient'

export const metadata = {
  title: 'Admin Control Center | OceanLK',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const { data: profile } = (await (supabase.from('profiles') as any)
    .select('role, full_name, email')
    .eq('id', user.id)
    .single()) as { data: any }

  const currentRole = profile?.role || 'admin'
  const userFullName = profile?.full_name || user.email?.split('@')[0] || 'Administrator'

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      <AdminNavClient currentRole={currentRole} userFullName={userFullName} userEmail={user.email || ''} />
      <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  )
}
