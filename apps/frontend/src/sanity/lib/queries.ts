import { defineQuery } from 'next-sanity'

// 1. Fetch all published posts
export const POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    isFeatured,
    mainImage,
    author->{
      _id,
      name,
      slug,
      role,
      image
    },
    categories[]->{
      _id,
      title,
      slug
    }
  }
`)

// 2. Fetch single post by slug
export const POST_BY_SLUG_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    isFeatured,
    mainImage,
    body,
    author->{
      _id,
      name,
      slug,
      role,
      image,
      bio
    },
    categories[]->{
      _id,
      title,
      slug
    }
  }
`)

// 3. Fetch all press releases
export const PRESS_RELEASES_QUERY = defineQuery(`
  *[_type == "pressRelease" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    companyName,
    summary,
    documentFile {
      asset->{
        url,
        size
      }
    },
    body
  }
`)

// 4. Search published posts by title/excerpt match
export const SEARCH_POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current) && (title match $term + "*" || excerpt match $term + "*")] | order(publishedAt desc) [0...5] {
    _id,
    title,
    slug,
    excerpt
  }
`)

// 5. Fetch featured articles for homepage / news header
export const FEATURED_POSTS_QUERY = defineQuery(`
  *[_type == "post" && isFeatured == true && defined(slug.current)] | order(publishedAt desc)[0...3] {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage,
    author->{
      name,
      image
    }
  }
`)
