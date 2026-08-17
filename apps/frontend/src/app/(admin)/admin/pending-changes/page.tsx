import React from 'react'
import { createClient } from '@/lib/supabase/server'
import PendingChangesClient from './PendingChangesClient'

export const metadata = {
  title: 'Maker-Checker Approval Portal | Admin',
}

export const revalidate = 0

async function getPendingChanges() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('pending_changes')
    .select('*')
    .order('submitted_at', { ascending: false })

  return data || []
}

export default async function PendingChangesPage() {
  const changes = await getPendingChanges()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Maker-Checker Authorization Engine</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review staged entity mutations, inspect change diffs, and authorize production publishing.
        </p>
      </div>

      <PendingChangesClient initialChanges={changes} />
    </div>
  )
}
