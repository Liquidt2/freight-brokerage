'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { FooterContent } from '@/components/types'
import { NavigationContent } from '@/components/navigation-types'

interface MainLayoutProps {
  children: React.ReactNode
  footer: FooterContent | null
  navigation: NavigationContent | null
}

export default function MainLayout({
  children,
  footer,
  navigation,
}: MainLayoutProps) {
  const pathname = usePathname()
  const isStudioRoute = pathname?.startsWith('/studio')

  if (isStudioRoute) {
    return children
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar navigation={navigation} className="z-layer-nav" />
      <div className="flex-1 flex flex-col relative z-layer-base pt-20">
        {children}
      </div>
      <Footer footer={footer} className="z-layer-content" />
    </div>
  )
}
