import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: process.env.SANITY_STUDIO_API_VERSION,
    tokenStart: process.env.SANITY_API_TOKEN?.substring(0, 10) + '...',
  })
}
