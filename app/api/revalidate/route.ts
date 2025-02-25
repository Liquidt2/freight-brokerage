import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

export async function POST(req: NextRequest) {
  try {
    const { body, isValidSignature } = await parseBody<{
      _type: string
      slug?: string | undefined
    }>(req, process.env.SANITY_REVALIDATE_SECRET)

    if (!isValidSignature) {
      return new Response('Invalid signature', { status: 401 })
    }

    if (!body?._type) {
      return new Response('Bad Request', { status: 400 })
    }

    // Always revalidate homepage when any content changes
    revalidateTag('homepage')
    
    // Special handling for forms
    if (body._type === 'form') {
      console.log('Revalidating form content:', body)
      revalidateTag('form')
      
      // If we have a slug, revalidate that specific form
      if (body.slug) {
        console.log(`Revalidating specific form: ${body.slug}`)
        revalidateTag(`form:${body.slug}`)
      } else {
        // If no slug, revalidate all known form types
        console.log('Revalidating all form types')
        revalidateTag('form:request-quote')
        revalidateTag('form:contact-us')
      }
    } else {
      // Revalidate the specific content type
      revalidateTag(body._type)
      if (body.slug) {
        revalidateTag(`${body._type}:${body.slug}`)
      }
    }

    // Revalidate navigation and footer
    revalidateTag('navigation')
    revalidateTag('footer')
    
    // Force revalidation of all pages that might use forms
    revalidateTag('quote')
    revalidateTag('contact')

    return NextResponse.json({
      status: 200,
      revalidated: true,
      now: Date.now(),
      body,
    })
  } catch (err: any) {
    console.error('Revalidation error:', err)
    return new Response(err.message, { status: 500 })
  }
}
