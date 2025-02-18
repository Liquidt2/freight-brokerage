export interface AboutContent {
  title: string
  mission: string
  history: HistoryItem[]
  values: ValueItem[]
  seo: {
    title: string
    description: string
    keywords: string[]
    ogImage: string
  }
}

export interface HistoryItem {
  title: string
  description: string
  year: number
}

export interface ValueItem {
  title: string
  description: string
  icon: 'shield' | 'users' | 'globe' | 'award'
}
