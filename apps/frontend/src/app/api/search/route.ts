import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { client as sanityClient } from '@/sanity/lib/client'
import { SEARCH_POSTS_QUERY } from '@/sanity/lib/queries'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q')

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ results: [] })
  }

  const supabase = await createClient()
  const searchQuery = `%${query.trim()}%`

  try {
    const [companiesRes, jobsRes, newsPosts, leadersRes] = await Promise.all([
      (supabase.from('companies') as any)
        .select('id, title, slug, category, description')
        .or(`title.ilike.${searchQuery},description.ilike.${searchQuery}`)
        .eq('is_active', true)
        .limit(5),

      (supabase.from('job_opportunities') as any)
        .select('id, title, company_name, location, type')
        .or(`title.ilike.${searchQuery},description.ilike.${searchQuery}`)
        .eq('status', 'ACTIVE')
        .limit(5),

      sanityClient.fetch(SEARCH_POSTS_QUERY, { term: query.trim() }),

      (supabase.from('corporate_leaders') as any)
        .select('id, name, designation, bio')
        .or(`name.ilike.${searchQuery},designation.ilike.${searchQuery}`)
        .eq('is_active', true)
        .limit(5),
    ])

    const results = [
      ...((companiesRes.data || []) as any[]).map((c) => ({
        type: 'company',
        title: c.title,
        subtitle: c.category,
        url: `/companies/${c.slug || c.id}`,
      })),
      ...((jobsRes.data || []) as any[]).map((j) => ({
        type: 'job',
        title: j.title,
        subtitle: `${j.company_name || 'OceanLK'} • ${j.location}`,
        url: `/careers`,
      })),
      ...((newsPosts || []) as any[]).map((n) => ({
        type: 'news',
        title: n.title,
        subtitle: 'Press Release',
        url: `/news/${n.slug?.current || n._id}`,
      })),
      ...((leadersRes.data || []) as any[]).map((l) => ({
        type: 'leadership',
        title: l.name,
        subtitle: l.designation,
        url: `/corporate#leadership`,
      })),
    ]

    return NextResponse.json({ results })
  } catch (err: any) {
    console.error('Search API Error:', err)
    return NextResponse.json({ results: [] }, { status: 500 })
  }
}
