import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity/client'

export async function POST(request: Request) {
  try {
    const { query, params } = await request.json()
    
    const result = await client.fetch(query, params || {})
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Sanity API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch from Sanity' },
      { status: 500 }
    )
  }
}
