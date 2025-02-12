export default function QuoteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen py-12 bg-muted/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Get a Quote</h1>
          <p className="text-lg text-muted-foreground">
            Fill out the form below to receive a competitive freight quote
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}