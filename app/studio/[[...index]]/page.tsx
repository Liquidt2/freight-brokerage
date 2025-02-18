
'use client'

import { NextStudio } from 'next-sanity/studio'
import { studioConfig } from '@/sanity.config'
import { Suspense, useEffect, useState } from 'react'

export default function StudioPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="sanity-studio-loading">
        <div className="loading-content">
          <h1>Loading Sanity Studio...</h1>
          <p>Initializing studio components...</p>
        </div>
        <style jsx>{`
          .sanity-studio-loading {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #101112;
          }
          .loading-content {
            text-align: center;
            color: #fff;
          }
          h1 {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
          }
        `}</style>
      </div>
    )
  }

  return (
    <NextStudio 
      config={studioConfig}
      unstable_noAuthBoundary
      unstable_globalStyles
    />
  )
}
