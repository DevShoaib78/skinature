export default function ProductLoading() {
  return (
    <main className="pt-28 md:pt-36 pb-24 min-h-screen bg-cream" aria-busy="true">
      <div className="max-w-7xl mx-auto px-6 animate-pulse">
        <div className="h-3 w-48 bg-forest-900/10 rounded-full mb-10" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
          <div className="aspect-[4/5] bg-forest-900/8 rounded-[2rem]" />
          <div className="pt-4">
            <div className="h-3 w-32 bg-forest-900/8 rounded-full mb-6" />
            <div className="h-10 w-4/5 bg-forest-900/10 rounded-2xl mb-4" />
            <div className="h-3 w-40 bg-forest-900/8 rounded-full mb-8" />
            <div className="h-8 w-28 bg-forest-900/10 rounded-xl mb-8" />
            <div className="space-y-3 mb-10">
              <div className="h-3.5 w-full bg-forest-900/6 rounded-full" />
              <div className="h-3.5 w-5/6 bg-forest-900/6 rounded-full" />
            </div>
            <div className="flex gap-4">
              <div className="h-12 w-32 bg-forest-900/8 rounded-full" />
              <div className="h-12 flex-1 bg-forest-900/10 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
