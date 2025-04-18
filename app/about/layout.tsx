export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen py-12 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">About Us</h1>
          <p className="text-lg text-muted-foreground">
            Learn about our mission, values, and commitment to excellence in freight logistics
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}