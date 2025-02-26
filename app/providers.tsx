'use client'

import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { SanityClientProvider } from '@/lib/sanity/client-wrapper'

export default function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SanityClientProvider>
        {children}
        <Toaster />
      </SanityClientProvider>
    </ThemeProvider>
  )
}
