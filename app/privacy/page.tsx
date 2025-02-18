import { draftMode } from 'next/headers'
import { getClient } from '@/lib/sanity/client'
import { policyQuery } from '@/lib/sanity/queries'
import { PolicyContent } from './types'
import { PortableText } from '@portabletext/react'
import { format } from 'date-fns'

async function getPolicy(preview: boolean): Promise<PolicyContent | null> {
  try {
    const client = getClient(preview)
    const policy = await client.fetch(policyQuery)

    if (!policy) {
      console.error('No policy content returned from Sanity')
      throw new Error('No policy content returned')
    }

    return policy
  } catch (error) {
    console.error('Error fetching policy:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return null
  }
}

export default async function PrivacyPage() {
  const preview = draftMode().isEnabled
  const policy = await getPolicy(preview)

  if (!policy) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center py-12 bg-background rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-2">Content Not Found</h2>
          <p className="text-muted-foreground">Please add privacy policy content in the Sanity Studio.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{policy.title}</h1>
        {policy.lastUpdated && (
          <p className="text-muted-foreground">
            Last Updated: {format(new Date(policy.lastUpdated), 'MMMM d, yyyy')}
          </p>
        )}
      </div>

      {policy.introduction && (
        <div className="prose dark:prose-invert max-w-none mb-8">
          <p>{policy.introduction}</p>
        </div>
      )}

      <div className="prose dark:prose-invert max-w-none">
        {policy.content?.map((section, index) => (
          <div key={index} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{section.sectionTitle}</h2>
            <div className="mb-4">
              <PortableText value={section.content} />
            </div>
            {section.subsections?.map((subsection, subIndex) => (
              <div key={subIndex} className="ml-4 mb-4">
                <h3 className="text-xl font-semibold mb-2">{subsection.title}</h3>
                <PortableText value={subsection.content} />
              </div>
            ))}
          </div>
        ))}
      </div>

      {policy.contactInformation && (
        <div className="mt-8 p-6 bg-muted rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          {policy.contactInformation.email && (
            <p className="mb-2">Email: {policy.contactInformation.email}</p>
          )}
          {policy.contactInformation.phone && (
            <p className="mb-2">Phone: {policy.contactInformation.phone}</p>
          )}
          {policy.contactInformation.address && (
            <p className="whitespace-pre-line">Address: {policy.contactInformation.address}</p>
          )}
        </div>
      )}

      {policy.effectiveDate && (
        <div className="mt-8 text-muted-foreground">
          <p>Effective Date: {format(new Date(policy.effectiveDate), 'MMMM d, yyyy')}</p>
        </div>
      )}
    </div>
  )
}
