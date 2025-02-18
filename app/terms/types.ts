import { PortableTextBlock } from '@portabletext/types'

interface TermsSection {
  sectionTitle: string
  content: PortableTextBlock[]
  subsections?: {
    title: string
    content: PortableTextBlock[]
  }[]
}

interface ServiceTerm {
  title: string
  description: string
  conditions?: string[]
}

interface LiabilityLimitation {
  title: string
  description: string
}

interface DisputeResolution {
  process?: string
  jurisdiction?: string
  arbitration?: string
}

interface TerminationClause {
  title: string
  conditions: string
  consequences: string
}

interface ContactInformation {
  email?: string
  phone?: string
  address?: string
}

export interface TermsContent {
  title: string
  lastUpdated: string
  introduction?: string
  content: TermsSection[]
  serviceTerms?: ServiceTerm[]
  liabilityLimitations?: LiabilityLimitation[]
  disputeResolution?: DisputeResolution
  terminationClauses?: TerminationClause[]
  contactInformation?: ContactInformation
  effectiveDate?: string
  seo: {
    title: string
    description: string
    keywords: string[]
    ogImage: string
  }
}
