'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { FooterContent } from '@/components/types'
import { NavigationContent } from '@/components/navigation-types'

interface RootLayoutClientProps {
  children: React.ReactNode
  footer: FooterContent | null
  navigation: NavigationContent | null
}

export default function RootLayoutClient({
  children,
  footer,
  navigation,
}: RootLayoutClientProps) {
  const pathname = usePathname()
  const isStudioRoute = pathname?.startsWith('/studio')

  if (isStudioRoute) {
    return children
  }

  const isHomePage = pathname === '/'

  return (
    <div className="flex min-h-screen flex-col relative">
      <Navbar navigation={navigation} className="z-layer-nav" />
      <main className={`flex-1 flex flex-col ${!isHomePage ? 'page-content' : ''} z-layer-content`}>
        {children}
      </main>
      <Footer footer={footer} className="z-layer-base" />
    </div>
  )
}
