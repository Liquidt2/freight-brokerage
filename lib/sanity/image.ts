import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from "@sanity/image-url/lib/types/types"
import { config } from './config'

// https://www.sanity.io/docs/image-url
const builder = imageUrlBuilder({
  projectId: config.projectId || '',
  dataset: config.dataset || ''
})

export const urlFor = (source: SanityImageSource | null) => {
  if (!source) {
    console.warn('No image source provided to urlFor')
    return builder.image({})
  }
  return builder.image(source)
}
