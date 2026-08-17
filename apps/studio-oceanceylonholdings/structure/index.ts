import type {StructureResolver} from 'sanity/structure'
import {CogIcon} from '@sanity/icons/Cog'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {EarthGlobeIcon} from '@sanity/icons/EarthGlobe'
import {UserIcon} from '@sanity/icons/User'
import {TagIcon} from '@sanity/icons/Tag'
import {StarIcon} from '@sanity/icons/Star'
import {DocumentsIcon} from '@sanity/icons/Documents'

// Singletons to exclude from auto-generated list
const SINGLETONS = ['siteSettings']

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Ocean Ceylon CMS')
    .items([
      // 1. Global Settings Singleton
      S.listItem()
        .title('Site Settings & Config')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site Settings & Global Config')
        ),

      S.divider(),

      // 2. Editorial & Newsroom Section
      S.listItem()
        .title('Articles & Editorial')
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title('Articles & Newsroom')
            .items([
              S.listItem()
                .title('All Articles')
                .icon(DocumentTextIcon)
                .child(
                  S.documentTypeList('post')
                    .title('All Published & Draft Articles')
                    .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
                    .menuItems(S.documentTypeList('post').getMenuItems())
                ),
              S.listItem()
                .title('⭐ Featured Stories')
                .icon(StarIcon)
                .child(
                  S.documentList()
                    .title('Pinned / Featured Stories')
                    .filter('_type == "post" && isFeatured == true')
                    .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
                ),
              S.listItem()
                .title('Press Releases')
                .icon(EarthGlobeIcon)
                .child(
                  S.documentTypeList('pressRelease')
                    .title('Press Releases & Announcements')
                    .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
                    .menuItems(S.documentTypeList('pressRelease').getMenuItems())
                ),
            ])
        ),

      S.documentTypeListItem('pressRelease')
        .title('Press Releases')
        .icon(EarthGlobeIcon),

      S.divider(),

      // 3. Organization & Taxonomy
      S.documentTypeListItem('author')
        .title('Authors & Team')
        .icon(UserIcon),

      S.documentTypeListItem('category')
        .title('Categories & Topics')
        .icon(TagIcon),

      S.divider(),

      // 4. Any other custom documents (excluding singletons)
      ...S.documentTypeListItems().filter(
        (listItem) =>
          !SINGLETONS.includes(listItem.getId() as string) &&
          !['post', 'pressRelease', 'author', 'category'].includes(listItem.getId() as string)
      ),
    ])
