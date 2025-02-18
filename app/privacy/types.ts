import { PortableTextBlock } from '@portabletext/types'

interface PolicySection {
  sectionTitle: string
  content: PortableTextBlock[]
  subsections?: {
    title: string
    content: PortableTextBlock[]
  }[]
}

interface ContactInformation {
  email?: string
  phone?: string
  address?: string
}

export interface PolicyContent {
  title: string
  lastUpdated: string
  introduction?: string
  content: PolicySection[]
  contactInformation?: ContactInformation
  effectiveDate?: string
  seo: {
    title: string
    description: string
    keywords: string[]
    ogImage: string
  }
}
