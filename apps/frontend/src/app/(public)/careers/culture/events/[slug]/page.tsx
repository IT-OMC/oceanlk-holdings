import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Calendar, MapPin, ArrowLeft, CalendarPlus } from 'lucide-react'
import { format } from 'date-fns'

export const revalidate = 60

async function getEvent(slug: string) {
  const supabase = await createClient()
  const { data } = await supabase.from('events').select('*').eq('slug', slug).eq('is_active', true).single()
  return data as Record<string, any> | null
}

export default async function EventDetailPage({ params }: { params: { slug: string } }) {
  const event = await getEvent(params.slug)

  if (!event) {
    notFound()
  }

  const startDate = new Date(event.date)
  const gcalDates = `${format(startDate, "yyyyMMdd'T'HHmmss")}/${format(
    event.end_date ? new Date(event.end_date) : startDate,
    "yyyyMMdd'T'HHmmss"
  )}`
  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    event.title
  )}&dates=${gcalDates}&location=${encodeURIComponent(event.location || '')}&details=${encodeURIComponent(
    event.description || ''
  )}`

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="relative h-[60vh] min-h-[500px] w-full">
        {event.image_url ? (
          <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-900 to-indigo-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 lg:p-20">
          <div className="max-w-7xl mx-auto">
            <Link
              href="/careers/culture"
              className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Events
            </Link>
            <span className="inline-block px-4 py-1.5 bg-blue-600 text-white text-xs font-bold tracking-wider uppercase rounded-full mb-4">
              {event.category || 'SOCIAL'}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-4xl leading-tight">
              {event.title}
            </h1>
            <div className="flex flex-wrap gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                <span className="text-lg">{format(startDate, 'MMMM dd, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-400" />
                <span className="text-lg">{event.location || 'OceanLK Premises'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About the Event</h2>
              <div className="prose prose-lg text-gray-600 max-w-none">
                {(event.content || event.description || '').split('\n').map((paragraph: string, i: number) => (
                  <p key={i} className="mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Event Details</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Date</p>
                    <p className="text-gray-900 font-semibold">{format(startDate, 'EEEE, MMM dd, yyyy')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Location</p>
                    <p className="text-gray-900 font-semibold">{event.location || 'OceanLK Premises'}</p>
                  </div>
                </div>

                <hr className="border-gray-100" />

                <a
                  href={gcalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <CalendarPlus size={18} />
                  Add to Google Calendar
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
