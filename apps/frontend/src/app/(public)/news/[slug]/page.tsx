import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import { client } from '@/sanity/lib/client'
import { urlForImage } from '@/sanity/lib/image'
import { POST_BY_SLUG_QUERY } from '@/sanity/lib/queries'
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react'
import { format } from 'date-fns'

export const revalidate = 60

async function getArticle(slug: string) {
  return client.fetch(POST_BY_SLUG_QUERY, { slug })
}

export default async function NewsArticlePage({
  params,
}: {
  params: { slug: string }
}) {
  const article = await getArticle(params.slug)

  if (!article) {
    notFound()
  }

  const imageUrl = article.mainImage ? urlForImage(article.mainImage)?.width(1200).height(600).url() : null

  return (
    <article className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Back Button */}
      <Link
        href="/news"
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#0056b3] mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Media Center
      </Link>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1.5 font-medium">
            <Calendar className="w-4 h-4 text-[#0056b3]" />
            {article.publishedAt ? format(new Date(article.publishedAt), 'MMMM dd, yyyy') : 'Recent'}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5 font-medium">
            <User className="w-4 h-4 text-[#0056b3]" /> {article.author?.name || 'OceanLK Desk'}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 leading-tight">
          {article.title ?? 'Untitled Article'}
        </h1>

        {article.excerpt && (
          <p className="mt-6 text-lg text-gray-600 font-light leading-relaxed border-l-4 border-[#0056b3] pl-4 italic">
            {article.excerpt}
          </p>
        )}
      </header>

      {/* Cover Image */}
      {imageUrl && (
        <div className="w-full h-80 sm:h-96 rounded-3xl overflow-hidden mb-12 shadow-lg">
          <img src={imageUrl} alt={article.title ?? ''} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Body Content */}
      <div className="prose prose-lg prose-blue max-w-none text-gray-800 leading-relaxed border-b border-gray-200 pb-12">
        {article.body && <PortableText value={article.body} />}
      </div>

      {/* Tags & Footer */}
      {article.categories && article.categories.length > 0 && (
        <div className="pt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="w-4 h-4 text-gray-400" />
            {article.categories.map((cat: { _id: string; title: string | null }) => (
              <span key={cat._id} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                {cat.title}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  )
}
