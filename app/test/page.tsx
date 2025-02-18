export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Test</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(
          {
            NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
            NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
            SANITY_STUDIO_API_VERSION: process.env.SANITY_STUDIO_API_VERSION,
            SANITY_API_TOKEN: process.env.SANITY_API_TOKEN ? '[PRESENT]' : '[MISSING]',
          },
          null,
          2
        )}
      </pre>
    </div>
  )
}
