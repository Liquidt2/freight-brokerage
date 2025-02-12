import blockContent from './blockContent'
import category from './category'
import post from './post'
import author from './author'
import seo from './seo'
import media from './media'

export const schemaTypes = [
  // Document types
  post,
  author,
  category,
  // Object types
  blockContent,
  seo,
  media,
]