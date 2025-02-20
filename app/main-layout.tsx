'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ChatWidgetWrapper } from '@/components/chat-widget-wrapper'
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
      <Navbar navigation={navigation} />
      <div className="flex-1 flex flex-col relative pt-[56px]">
        {children}
      </div>
      <Footer footer={footer} className="z-layer-content" />
      <ChatWidgetWrapper />
    </div>
  )
}
