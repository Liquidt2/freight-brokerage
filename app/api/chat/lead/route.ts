import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity/client'
import { rateLimit } from '@/lib/rate-limit'
import { headers } from 'next/headers'

export async function POST(req: Request) {
  try {
    // Apply rate limiting
    const headersList = headers()
    const ip = headersList.get('x-forwarded-for') || 'unknown'
    const isRateLimited = await rateLimit(`lead:${ip}`)
    
    if (isRateLimited) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }
    
    // Parse and validate input
    const body = await req.json()
    const { name, email, company } = body
    
    if (!name || !email || typeof name !== 'string' || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if lead already exists
    const existingLead = await client.fetch(
      `*[_type == "chatLead" && email == $email][0]`,
      { email }
    )

    if (existingLead) {
      return NextResponse.json({ success: true })
    }

    // Create new lead
    await client.create({
      _type: 'chatLead',
      name,
      email,
      company,
      conversations: [],
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Lead API Error:', error)
    return NextResponse.json(
      { error: 'Failed to store lead information' },
      { status: 500 }
    )
  }
}
