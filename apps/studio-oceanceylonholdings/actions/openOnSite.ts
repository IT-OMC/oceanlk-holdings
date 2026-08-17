import {EyeOpenIcon} from '@sanity/icons/EyeOpen'
import type {DocumentActionComponent, DocumentActionProps} from 'sanity'

const SITE_URL = process.env.SANITY_STUDIO_SITE_URL || 'https://ocean.lk'

// Lets editors jump straight from a document to its live page on the
// site instead of guessing the URL or asking a developer to check.
export const openOnSiteAction: DocumentActionComponent = (props: DocumentActionProps) => {
  if (props.type !== 'post') return null

  const slug = (props.published as {slug?: {current?: string}} | null)?.slug?.current
  if (!slug) return null

  return {
    label: 'Open on Site',
    icon: EyeOpenIcon,
    onHandle: () => {
      window.open(`${SITE_URL}/news/${slug}`, '_blank', 'noopener,noreferrer')
      props.onComplete()
    },
  }
}
