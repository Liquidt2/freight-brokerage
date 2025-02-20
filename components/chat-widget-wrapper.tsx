'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Dynamically import the ChatWidget component
const ChatWidget = dynamic(
  () => import('./chat-widget').then((mod) => mod.ChatWidget),
  {
    ssr: false, // Disable server-side rendering
    loading: () => null, // Don't show a loading state
  }
)

export function ChatWidgetWrapper() {
  return (
    <Suspense fallback={null}>
      <ChatWidget />
    </Suspense>
  )
}
