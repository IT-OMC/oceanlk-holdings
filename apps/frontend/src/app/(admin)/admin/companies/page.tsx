import React from 'react'
import { createClient } from '@/lib/supabase/server'
import CompanyManagerClient from './CompanyManagerClient'

export const metadata = {
  title: 'Subsidiary & Portfolio Manager | Admin',
}

export const revalidate = 0

async function getCompanies() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('companies')
    .select('*')
    .order('display_order', { ascending: true })

  return data || []
}

export default async function AdminCompaniesPage() {
  const companies = await getCompanies()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Subsidiaries & Portfolios Manager</h1>
        <p className="text-xs text-slate-400 mt-1">
          Create, edit, or stage revisions to group operating entities and subsidiaries.
        </p>
      </div>

      <CompanyManagerClient initialCompanies={companies} />
    </div>
  )
}
