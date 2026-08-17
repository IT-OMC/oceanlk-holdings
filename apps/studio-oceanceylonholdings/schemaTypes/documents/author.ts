import {defineType, defineField} from 'sanity'
import {UserIcon} from '@sanity/icons/User'

export const author = defineType({
  name: 'author',
  title: 'Author / Contributor',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      placeholder: 'e.g. Captain Samantha Perera',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role / Designation',
      type: 'string',
      placeholder: 'e.g. Head of Maritime Operations, Industry Analyst',
    }),
    defineField({
      name: 'image',
      title: 'Author Portrait / Avatar',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          initialValue: 'Author profile photo',
        }),
      ],
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      placeholder: 'samantha.p@oceanceylon.com',
    }),
    defineField({
      name: 'bio',
      title: 'Short Biography',
      type: 'array',
      of: [
        {
          title: 'Block',
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'image',
    },
  },
})
