import {defineType, defineField, defineArrayMember} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'

export const post = defineType({
  name: 'post',
  title: 'Post / Article',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    {name: 'content', title: '✍️ Content', default: true},
    {name: 'media', title: '🖼️ Media'},
    {name: 'meta', title: '⚙️ Publishing & Taxonomy'},
    {name: 'seo', title: '🔍 SEO & Social'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Article Title',
      type: 'string',
      group: 'content',
      placeholder: 'e.g. OceanLK Expands Maritime Fleet with Eco-Friendly Tankers',
      validation: (rule) => rule.required().min(10).warning('Titles should be at least 10 characters for better engagement'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL path)',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Short Excerpt / Teaser',
      type: 'text',
      group: 'content',
      rows: 3,
      description: 'Used for newsfeed cards, search snippets, and social previews.',
      placeholder: 'A concise summary highlighting the key announcement or takeaway...',
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: 'body',
      title: 'Article Body',
      type: 'blockContent',
      group: 'content',
    }),

    // Media Group
    defineField({
      name: 'mainImage',
      title: 'Featured Hero Image',
      type: 'image',
      group: 'media',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative Text (Accessibility & SEO)',
          description: 'Describe the image for screen readers and search engines.',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'caption',
          type: 'string',
          title: 'Image Caption / Credit',
          placeholder: 'e.g. Photo courtesy of Port of Colombo Authority',
        }),
      ],
    }),

    // Meta Group
    defineField({
      name: 'publishedAt',
      title: 'Publication Date',
      type: 'datetime',
      group: 'meta',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author / Contributor',
      type: 'reference',
      group: 'meta',
      to: [{type: 'author'}],
    }),
    defineField({
      name: 'categories',
      title: 'Categories & Topics',
      type: 'array',
      group: 'meta',
      of: [defineArrayMember({type: 'reference', to: [{type: 'category'}]})],
    }),
    defineField({
      name: 'isFeatured',
      title: 'Pin as Featured Story',
      type: 'boolean',
      group: 'meta',
      initialValue: false,
      description: 'When enabled, this story will be highlighted at the top of the Newsroom and Homepage.',
    }),

    // SEO Group
    defineField({
      name: 'seoTitle',
      title: 'Custom Meta Title',
      type: 'string',
      group: 'seo',
      description: 'Overrides default title for Google search results (recommended: 50-60 characters).',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Custom Meta Description',
      type: 'text',
      rows: 2,
      group: 'seo',
      description: 'Overrides default excerpt for search engines (recommended: 120-160 characters).',
      validation: (rule) => rule.max(160),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
      publishedAt: 'publishedAt',
      isFeatured: 'isFeatured',
    },
    prepare(selection) {
      const {title, author, publishedAt, isFeatured} = selection
      const dateStr = publishedAt ? new Date(publishedAt).toLocaleDateString() : ''
      const badge = isFeatured ? ' ⭐ [FEATURED]' : ''
      return {
        title: `${title || 'Untitled'}${badge}`,
        media: selection.media,
        subtitle: author && dateStr ? `by ${author} • ${dateStr}` : author || dateStr || 'Draft',
      }
    },
  },
})
