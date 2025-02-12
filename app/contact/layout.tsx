export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen py-12 bg-muted/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground">
            Get in touch with our team for personalized freight solutions
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}