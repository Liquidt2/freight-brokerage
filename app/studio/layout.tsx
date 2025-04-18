export const metadata = {
  title: 'Sanity Studio',
  description: 'FreightFlow Pro CMS',
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen">
      {children}
    </div>
  )
}
