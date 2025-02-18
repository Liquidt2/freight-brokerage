interface NavigationLogo {
  text: string
  showText: boolean
  image?: string
  showImage: boolean
  imageHeight?: number
  imageWidth?: number
  logoHeight?: number
  logoWidth?: number
  showIcon: boolean
}

interface SubmenuItem {
  text: string
  href: string
  show: boolean
  description?: string
}

interface MenuItem {
  text: string
  href: string
  show: boolean
  isButton?: boolean
  buttonVariant?: 'default' | 'secondary' | 'outline'
  submenu?: SubmenuItem[]
}

interface MobileSettings {
  breakpoint?: 'sm' | 'md' | 'lg'
  showSocialLinks: boolean
}

interface SocialLink {
  platform: string
  url: string
  show: boolean
}

export interface NavigationContent {
  title: string
  logo: NavigationLogo
  menuItems: MenuItem[]
  mobileSettings: MobileSettings
  socialLinks?: SocialLink[]
}
