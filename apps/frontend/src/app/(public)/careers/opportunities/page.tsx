import React from 'react'
import { createClient } from '@/lib/supabase/server'
import OpportunitiesClient, { JobOpportunity } from './OpportunitiesClient'

export const metadata = {
  title: 'Open Opportunities',
  description: 'Browse open roles across OceanLK Holdings and its subsidiaries.',
}

export const revalidate = 60

async function getJobs(): Promise<JobOpportunity[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('job_opportunities')
    .select('*')
    .eq('status', 'ACTIVE')
    .order('posted_date', { ascending: false })

  return (data || []).map((j: any) => ({
    id: j.id,
    title: j.title,
    company: j.company_name || 'OceanLK Group',
    location: j.location,
    type: j.type,
    category: j.category,
    description: j.description,
    featured: j.featured,
  }))
}

export default async function OpportunitiesPage() {
  const jobs = await getJobs()
  return <OpportunitiesClient jobs={jobs} />
}
