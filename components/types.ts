export interface FooterContent {
  companyInfo: {
    name: string
    showName: boolean
    logo?: string
    showLogo: boolean
    logoWidth: number
    address: string
    showAddress: boolean
    phone: string
    showPhone: boolean
    email: string
    showEmail: boolean
  }
  socialLinks: {
    platform: 'linkedin' | 'twitter' | 'facebook' | 'instagram'
    url: string
    show: boolean
  }[]
  links: {
    title: string
    url: string
    show: boolean
  }[]
  copyright: string
  showCopyright: boolean
  seo: {
    title: string
    description: string
    keywords: string[]
    ogImage: string
  }
}
