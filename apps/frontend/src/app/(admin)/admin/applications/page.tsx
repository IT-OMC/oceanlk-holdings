import React from 'react'
import { createClient } from '@/lib/supabase/server'
import ApplicationsClient from './ApplicationsClient'

export const metadata = {
  title: 'Applicant & Talent Repository | Admin',
}

export const revalidate = 0

async function getApplications() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('talent_pool_applications')
    .select('*')
    .order('submitted_date', { ascending: false })

  return data || []
}

export default async function ApplicationsPage() {
  const applications = await getApplications()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Talent Pool & Applicant Vault</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review incoming candidate submissions, download verified resumes, and update recruitment pipeline statuses.
        </p>
      </div>

      <ApplicationsClient initialApplications={applications} />
    </div>
  )
}
