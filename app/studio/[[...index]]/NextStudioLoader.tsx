'use client'

import { NextStudio } from 'next-sanity/studio'
import { studioConfig } from '@/lib/sanity/studio-config'

export default function NextStudioLoader() {
  return <NextStudio config={studioConfig} />
}
