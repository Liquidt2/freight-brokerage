import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { getFooterData } from './footer'
import { getNavigationData } from './navigation'
import Providers from './providers'
import MainLayout from './main-layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'FreightFlow Pro - Modern Freight Brokerage Solutions',
    template: '%s | FreightFlow Pro',
  },
  description: 'Professional freight brokerage services with cutting-edge technology and personalized solutions for your logistics needs.',
  keywords: ['freight brokerage', 'logistics', 'shipping', 'transportation', 'supply chain'],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''
  const isStudioRoute = pathname.startsWith('/studio')
  
  if (isStudioRoute) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body>{children}</body>
      </html>
    )
  }
  
  const [footer, navigation] = await Promise.all([
    getFooterData(),
    getNavigationData(),
  ])

  console.log('Navigation data:', navigation)
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <MainLayout footer={footer} navigation={navigation}>
            {children}
          </MainLayout>
        </Providers>
      </body>
    </html>
  )
}
