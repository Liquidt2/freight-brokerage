import { draftMode } from 'next/headers'
import { getClient } from '@/lib/sanity/client'
import { termsQuery } from '@/lib/sanity/queries'
import { TermsContent } from './types'
import { PortableText } from '@portabletext/react'
import { format } from 'date-fns'

async function getTerms(preview: boolean): Promise<TermsContent | null> {
  try {
    const client = getClient(preview)
    const terms = await client.fetch(termsQuery)

    if (!terms) {
      console.error('No terms content returned from Sanity')
      throw new Error('No terms content returned')
    }

    return terms
  } catch (error) {
    console.error('Error fetching terms:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return null
  }
}

export default async function TermsPage() {
  const preview = draftMode().isEnabled
  const terms = await getTerms(preview)

  if (!terms) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center py-12 bg-background rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-2">Content Not Found</h2>
          <p className="text-muted-foreground">Please add terms of service content in the Sanity Studio.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{terms.title}</h1>
        {terms.lastUpdated && (
          <p className="text-muted-foreground">
            Last Updated: {format(new Date(terms.lastUpdated), 'MMMM d, yyyy')}
          </p>
        )}
      </div>

      {terms.introduction && (
        <div className="prose dark:prose-invert max-w-none mb-8">
          <p>{terms.introduction}</p>
        </div>
      )}

      <div className="prose dark:prose-invert max-w-none">
        {terms.content?.map((section, index) => (
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

        {terms.serviceTerms && terms.serviceTerms.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Service Terms</h2>
            {terms.serviceTerms.map((term, index) => (
              <div key={index} className="mb-6">
                <h3 className="text-xl font-semibold mb-2">{term.title}</h3>
                <p className="mb-2">{term.description}</p>
                {term.conditions && term.conditions.length > 0 && (
                  <ul className="list-disc pl-6">
                    {term.conditions.map((condition, condIndex) => (
                      <li key={condIndex}>{condition}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {terms.liabilityLimitations && terms.liabilityLimitations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Liability Limitations</h2>
            {terms.liabilityLimitations.map((limitation, index) => (
              <div key={index} className="mb-4">
                <h3 className="text-xl font-semibold mb-2">{limitation.title}</h3>
                <p>{limitation.description}</p>
              </div>
            ))}
          </div>
        )}

        {terms.disputeResolution && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Dispute Resolution</h2>
            {terms.disputeResolution.process && (
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">Resolution Process</h3>
                <p>{terms.disputeResolution.process}</p>
              </div>
            )}
            {terms.disputeResolution.jurisdiction && (
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">Jurisdiction</h3>
                <p>{terms.disputeResolution.jurisdiction}</p>
              </div>
            )}
            {terms.disputeResolution.arbitration && (
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">Arbitration Terms</h3>
                <p>{terms.disputeResolution.arbitration}</p>
              </div>
            )}
          </div>
        )}

        {terms.terminationClauses && terms.terminationClauses.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Termination</h2>
            {terms.terminationClauses.map((clause, index) => (
              <div key={index} className="mb-6">
                <h3 className="text-xl font-semibold mb-2">{clause.title}</h3>
                <div className="mb-2">
                  <h4 className="font-semibold">Conditions:</h4>
                  <p>{clause.conditions}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Consequences:</h4>
                  <p>{clause.consequences}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {terms.contactInformation && (
          <div className="mt-8 p-6 bg-muted rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            {terms.contactInformation.email && (
              <p className="mb-2">Email: {terms.contactInformation.email}</p>
            )}
            {terms.contactInformation.phone && (
              <p className="mb-2">Phone: {terms.contactInformation.phone}</p>
            )}
            {terms.contactInformation.address && (
              <p className="whitespace-pre-line">Address: {terms.contactInformation.address}</p>
            )}
          </div>
        )}

        {terms.effectiveDate && (
          <div className="mt-8 text-muted-foreground">
            <p>Effective Date: {format(new Date(terms.effectiveDate), 'MMMM d, yyyy')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
