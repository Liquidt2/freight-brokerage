import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity/client'
import { rateLimit } from '@/lib/rate-limit'
import { headers } from 'next/headers'

// List of allowed queries for security
const ALLOWED_QUERIES = [
  // Add specific query patterns that are allowed
  /^\*\[_type == "post"\]/,
  /^\*\[_type == "service"\]/,
  /^\*\[_type == "form"\]/,
  /^\*\[_type == "navigation"\]/,
  /^\*\[_type == "footer"\]/,
  /^\*\[_type == "homepage"\]/,
  /^\*\[_type == "about"\]/,
  /^\*\[_type == "chatSettings"\]/,
];

// Validate if a query is allowed
function isQueryAllowed(query: string): boolean {
  return ALLOWED_QUERIES.some(pattern => pattern.test(query));
}

export async function POST(request: Request) {
  try {
    // Apply rate limiting
    const headersList = headers()
    const ip = headersList.get('x-forwarded-for') || 'unknown'
    const isRateLimited = await rateLimit(`sanity:${ip}`)
    
    if (isRateLimited) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }
    
    // Parse and validate input
    const body = await request.json()
    const { query, params } = body
    
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      )
    }
    
    // Validate query for security
    if (!isQueryAllowed(query)) {
      console.warn('Blocked unauthorized query:', query);
      return NextResponse.json(
        { error: 'Unauthorized query' },
        { status: 403 }
      )
    }
    
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
