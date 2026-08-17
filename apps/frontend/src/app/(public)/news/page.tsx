import React from 'react'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { urlForImage } from '@/sanity/lib/image'
import { POSTS_QUERY } from '@/sanity/lib/queries'
import { Calendar, User, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'

export const metadata = {
  title: 'News & Media Center',
  description: 'Latest corporate press releases, industry insights, and media announcements from OceanLK Holdings.',
}

export const revalidate = 60

type Post = {
  _id: string
  title: string | null
  slug: { current: string }
  publishedAt: string | null
  excerpt?: string | null
  mainImage?: any
  author?: { name?: string | null } | null
}

async function getPosts(): Promise<Post[]> {
  const posts = await client.fetch(POSTS_QUERY)
  return posts.filter((post) => post.slug?.current) as Post[]
}

export default async function NewsPage() {
  const posts = await getPosts()

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold text-[#0056b3] uppercase tracking-widest">Media Center</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mt-2">
          Press Releases & Articles
        </h1>
        <p className="mt-4 text-gray-600 text-base leading-relaxed">
          Stay updated with strategic developments, industry perspectives, and official announcements from OceanLK Holdings.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-center text-gray-500 text-sm">No articles published yet. Check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => {
            const imageUrl = post.mainImage ? urlForImage(post.mainImage)?.width(800).height(480).url() : null

            return (
              <article
                key={post._id}
                className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="h-52 w-full overflow-hidden bg-gray-100 relative">
                  <img
                    src={imageUrl || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800'}
                    alt={post.title ?? ''}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {post.publishedAt ? format(new Date(post.publishedAt), 'MMM dd, yyyy') : 'Recent'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" /> {post.author?.name || 'OceanLK Desk'}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#0056b3] transition-colors line-clamp-2">
                      {post.title}
                    </h2>

                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-6">
                      {post.excerpt}
                    </p>
                  </div>

                  <Link
                    href={`/news/${post.slug.current}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#0056b3] group-hover:text-[#2ecc71] transition-colors"
                  >
                    Read Full Release <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
