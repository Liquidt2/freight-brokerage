import { PortableTextBlock } from '@portabletext/types'

export interface AboutContent {
  status: 'draft' | 'published' | 'archived'
  publishedAt?: string
  title: string
  mission: string
  history: PortableTextBlock[] // Updated this line
  values: ValueItem[]
  team: TeamMember[]
  stats: StatItem[]
  certifications: CertificationItem[]
  callToAction: CallToAction
  seo: SEO
}

// Remove the HistoryItem interface since we're not using it anymore

export interface ValueItem {
  title: string
  description: string
  icon: 'shield' | 'users' | 'globe' | 'award' | 'star' | 'heart'
}

export interface TeamMember {
  name: string
  role: string
  bio?: string
  image?: {
    asset: {
      url: string
    }
    alt?: string
  }
  socialLinks?: {
    linkedin?: string
    twitter?: string
  }
}

export interface StatItem {
  label: string
  value: string
  description?: string
}

export interface CertificationItem {
  name: string
  issuer?: string
  description?: string
  image?: {
    asset: {
      url: string
    }
  }
}

export interface CallToAction {
  title?: string
  description?: string
  primaryButton?: {
    text: string
    link: string
  }
  secondaryButton?: {
    text: string
    link: string
  }
}

export interface SEO {
  title: string
  description: string
  keywords: string[]
  ogImage?: {
    asset: {
      url: string
    }
  }
}