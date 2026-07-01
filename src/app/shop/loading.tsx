export default function ShopLoading() {
  return (
    <main className="pt-32 md:pt-40 pb-24 min-h-screen bg-cream" aria-busy="true">
      <div className="max-w-7xl mx-auto px-6 animate-pulse">
        <div className="h-3 w-28 bg-forest-900/10 rounded-full mb-8" />
        <div className="h-12 w-72 max-w-full bg-forest-900/10 rounded-2xl mb-4" />
        <div className="h-4 w-96 max-w-full bg-forest-900/8 rounded-full mb-12" />

        <div className="flex gap-3 mb-12">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 w-28 bg-forest-900/8 rounded-full" />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <div className="aspect-[4/5] bg-forest-900/8 rounded-2xl mb-4" />
              <div className="h-4 w-3/4 bg-forest-900/8 rounded-full mx-auto mb-2" />
              <div className="h-3 w-1/2 bg-forest-900/6 rounded-full mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
