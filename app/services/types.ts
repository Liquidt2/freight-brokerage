export interface ServiceContent {
  title: string
  slug: {
    current: string
  }
  description: string
  icon: string
  features: ServiceFeature[]
  benefits: ServiceBenefit[]
  requirements: ServiceRequirement[]
  coverage: {
    areas: string[]
    restrictions: string
  }
  pricing: {
    model: string
    description: string
    factors: string[]
  }
  featured: boolean
  seo?: {
    title: string
    description: string
    keywords: string[]
    ogImage?: string
  }
}

export interface ServiceFeature {
  title: string
  description: string
  details: string[]
}

export interface ServiceBenefit {
  title: string
  description: string
  icon: string
}

export interface ServiceRequirement {
  title: string
  description: string
  items: string[]
}

export interface Certification {
  icon: 'shield' | 'fileCheck' | 'gauge' | 'bell'
  title: string
  items: string[]
}
