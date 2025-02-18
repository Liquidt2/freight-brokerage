'use client'

import { useEffect, useState } from 'react'

export function useDraftMode() {
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    // Check if we're in draft mode by looking for the __prerender_bypass cookie
    const cookies = document.cookie.split(';')
    const hasDraftMode = cookies.some(cookie => 
      cookie.trim().startsWith('__prerender_bypass=')
    )
    setIsEnabled(hasDraftMode)
  }, [])

  return { isEnabled }
}
