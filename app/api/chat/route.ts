import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { client } from '@/lib/sanity/client'
import { chatSettingsQuery } from '@/lib/sanity/queries'
import { groq } from 'next-sanity'
import { rateLimit } from '@/lib/rate-limit'
import { headers } from 'next/headers'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Query to fetch relevant blog posts and FAQs
const contentQuery = groq`*[_type in ["post"] && defined(content)] {
  title,
  "excerpt": array::join(string::split(pt::text(content), "")[0..255], "") + "..."
}[0...5]`

export async function POST(req: Request) {
  try {
    // Apply rate limiting
    const headersList = headers()
    const ip = headersList.get('x-forwarded-for') || 'unknown'
    const isRateLimited = await rateLimit(`chat:${ip}`)
    
    if (isRateLimited) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }
    
    // Validate input
    const body = await req.json()
    const { message, messages } = body
    
    if (!message || !messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    // Fetch relevant content from Sanity
    const content = await client.fetch(contentQuery)
    const contentContext = content.map((item: any) => 
      `${item.title}\n${item.excerpt}`
    ).join('\n\n')

    // Prepare conversation history
    const conversationHistory = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }))

    // Fetch chatbot settings
    const settings = await client.fetch(chatSettingsQuery)
    
    // Create system message with context and custom prompt
    const systemMessage = {
      role: 'system',
      content: `${settings?.systemPrompt || 'You are a helpful freight brokerage assistant.'}\n\nContext from our content:\n\n${contentContext}`,
    }

    // Get completion from OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        systemMessage,
        ...conversationHistory,
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    return NextResponse.json({
      message: completion.choices[0].message.content,
    })
  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}
