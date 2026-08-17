import React from 'react'
import { createClient } from '@/lib/supabase/server'
import CultureHero from '@/components/culture/CultureHero'
import UpcomingEvents, { UpcomingEvent } from '@/components/culture/UpcomingEvents'
import CultureCTA from '@/components/culture/CultureCTA'

export const metadata = {
  title: 'Life at OceanLK Holdings',
  description: 'Discover the culture, values, and everyday experience of working at OceanLK Holdings.',
}

export const revalidate = 60

async function getCultureData() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('events')
    .select('*')
    .eq('is_active', true)
    .gte('date', new Date().toISOString())
    .order('date', { ascending: true })
    .limit(3)

  return { events: data || [] }
}

export default async function CulturePage() {
  const { events } = await getCultureData()

  const displayEvents: UpcomingEvent[] = events.map((e: any) => ({
    id: e.id,
    slug: e.slug,
    title: e.title,
    date: e.date,
    location: e.location || 'OceanLK Premises',
    imageUrl: e.image_url,
    category: e.category || 'SOCIAL',
  }))

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <CultureHero />
      <div className="flex flex-col">
        {displayEvents.length > 0 && <UpcomingEvents events={displayEvents} />}
        <CultureCTA />
      </div>
    </div>
  )
}
