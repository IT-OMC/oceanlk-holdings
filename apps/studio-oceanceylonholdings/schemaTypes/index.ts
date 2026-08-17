import {blockContent} from './objects/blockContent'
import {author} from './documents/author'
import {category} from './documents/category'
import {post} from './documents/post'
import {pressRelease} from './documents/pressRelease'
import {siteSettings} from './documents/siteSettings'

export const schemaTypes = [
  // Singletons & Settings
  siteSettings,

  // Documents
  post,
  pressRelease,
  author,
  category,

  // Objects
  blockContent,
]
