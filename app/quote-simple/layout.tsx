import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Request a Quote - Simple',
  description: 'Request a freight quote for your shipping needs',
}

export default function QuoteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
