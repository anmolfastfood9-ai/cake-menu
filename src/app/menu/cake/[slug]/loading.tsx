export default function CakeDetailLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-[#090807] text-[#FBF7EE] pb-24 md:pb-0">
      {/* Top Header Skeleton */}
      <header className="sticky top-0 z-40 border-b border-gold-500/10 bg-[#090807]/95 px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="h-8 w-8 rounded-full bg-luxury-900/80 animate-pulse" />
          <div className="h-6 w-44 rounded-lg bg-luxury-800/80 animate-pulse" />
          <div className="h-8 w-8 rounded-full bg-luxury-900/80 animate-pulse" />
        </div>
      </header>

      <main className="flex-1 py-4 sm:py-6 md:py-8">
        <div className="mx-auto max-w-md md:max-w-5xl lg:max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Main Grid: Left Gallery + Right Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 lg:gap-12 items-start">
            {/* Left Column: Image Skeleton */}
            <div className="md:col-span-6 lg:col-span-6 space-y-3">
              <div className="relative aspect-square w-full rounded-2xl md:rounded-3xl border border-gold-500/20 bg-luxury-900/80 animate-pulse" />
              <div className="flex items-center space-x-2.5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-14 w-14 rounded-xl bg-luxury-900/60 animate-pulse" />
                ))}
              </div>
            </div>

            {/* Right Column: Content Skeleton */}
            <div className="md:col-span-6 lg:col-span-6 space-y-4">
              <div className="h-5 w-24 rounded-full bg-gold-500/20 animate-pulse" />
              <div className="h-8 w-3/4 rounded-xl bg-luxury-800/80 animate-pulse" />
              <div className="h-4 w-1/2 rounded bg-emerald-950/80 animate-pulse" />
              <div className="space-y-2 pt-2">
                <div className="h-3 w-full rounded bg-luxury-900/80 animate-pulse" />
                <div className="h-3 w-4/5 rounded bg-luxury-900/80 animate-pulse" />
              </div>

              {/* Weight Selector Skeleton */}
              <div className="space-y-2 pt-3 border-t border-luxury-800">
                <div className="h-4 w-28 rounded bg-luxury-800/80 animate-pulse" />
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-14 rounded-xl bg-luxury-900/80 border border-luxury-800 animate-pulse" />
                  ))}
                </div>
              </div>

              {/* Action Button Skeleton */}
              <div className="space-y-2 pt-3">
                <div className="h-12 w-full rounded-xl bg-emerald-900/40 animate-pulse" />
                <div className="h-10 w-full rounded-xl bg-luxury-900/60 border border-luxury-800 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
