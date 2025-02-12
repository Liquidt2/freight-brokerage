'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'

const NextStudioLoader = dynamic(
  () => import('./NextStudioLoader'),
  { ssr: false }
)

export default function StudioPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NextStudioLoader />
    </Suspense>
  )
}