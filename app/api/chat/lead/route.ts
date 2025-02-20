import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity/client'

export async function POST(req: Request) {
  try {
    const { name, email, company } = await req.json()

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
