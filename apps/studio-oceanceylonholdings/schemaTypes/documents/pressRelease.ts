import {defineType, defineField} from 'sanity'
import {EarthGlobeIcon} from '@sanity/icons/EarthGlobe'

export const pressRelease = defineType({
  name: 'pressRelease',
  title: 'Press Release',
  type: 'document',
  icon: EarthGlobeIcon,
  groups: [
    {name: 'content', title: '📢 Announcement', default: true},
    {name: 'meta', title: '🏢 Issuing Unit & Date'},
    {name: 'attachment', title: '📎 Document & PDF'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Press Release Title',
      type: 'string',
      group: 'content',
      placeholder: 'FOR IMMEDIATE RELEASE: OceanLK Secures Regional Bunkering License',
      validation: (rule) => rule.required(),
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
      name: 'summary',
      title: 'Executive Summary',
      type: 'text',
      group: 'content',
      rows: 3,
      placeholder: 'Colombo, Sri Lanka — OceanLK Holdings today announced...',
      validation: (rule) => rule.required().max(400),
    }),
    defineField({
      name: 'body',
      title: 'Full Announcement Details',
      type: 'blockContent',
      group: 'content',
    }),

    // Meta Group
    defineField({
      name: 'publishedAt',
      title: 'Release Date & Time',
      type: 'datetime',
      group: 'meta',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'companyName',
      title: 'Issuing Subsidiary / Business Unit',
      type: 'string',
      group: 'meta',
      placeholder: 'e.g. OceanLK Maritime, Ocean Energy Corp, Ocean Global Logistics',
      initialValue: 'Ocean Ceylon Holdings',
    }),
    defineField({
      name: 'mediaContact',
      title: 'Press / Media Contact Email',
      type: 'string',
      group: 'meta',
      placeholder: 'media@oceanceylon.com',
    }),

    // Attachment Group
    defineField({
      name: 'documentFile',
      title: 'Official Press Release PDF',
      type: 'file',
      group: 'attachment',
      description: 'Upload the official signed PDF for press kits and journalists to download.',
      options: {
        accept: '.pdf,.doc,.docx',
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      company: 'companyName',
      publishedAt: 'publishedAt',
    },
    prepare(selection) {
      const {title, company, publishedAt} = selection
      const dateStr = publishedAt ? new Date(publishedAt).toLocaleDateString() : ''
      return {
        title: title || 'Untitled Press Release',
        subtitle: company && dateStr ? `${company} • ${dateStr}` : company || dateStr || 'Draft',
      }
    },
  },
})
