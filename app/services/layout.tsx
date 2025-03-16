export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen py-12 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Delivering Reliability with Purpose</h1>
          <p className="text-lg text-muted-foreground">
            Welcome to BKE Logistics Services. We offer a suite of logistics solutions designed to keep your business moving forward. Our services combine practical trucking expertise with a deep commitment to integrity and faith-driven values—ensuring every delivery is handled with care and precision.
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}