export default function AllCakesLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-[#090807] text-[#FBF7EE] pb-24 md:pb-0">
      {/* Top Header Skeleton */}
      <header className="sticky top-0 z-40 border-b border-gold-500/10 bg-[#090807]/95 px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="h-8 w-8 rounded-full bg-luxury-900/80 animate-pulse" />
          <div className="h-6 w-32 rounded-lg bg-luxury-800/80 animate-pulse" />
          <div className="h-8 w-8 rounded-full bg-luxury-900/80 animate-pulse" />
        </div>
      </header>

      <main className="flex-1 py-4 sm:py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
          {/* Search Bar Skeleton */}
          <div className="h-10 w-full rounded-xl border border-luxury-800 bg-[#12100e] animate-pulse" />

          {/* Category Tabs Skeleton */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-8 w-24 shrink-0 rounded-full border border-luxury-800 bg-[#12100e] animate-pulse"
              />
            ))}
          </div>

          {/* Showing Status Skeleton */}
          <div className="flex items-center justify-between pt-1">
            <div className="h-4 w-40 rounded bg-luxury-900/80 animate-pulse" />
            <div className="h-4 w-16 rounded bg-luxury-900/80 animate-pulse" />
          </div>

          {/* Responsive Cake Cards Grid Skeleton (2-Col Mobile, 4-Col Desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 pt-1">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col overflow-hidden rounded-2xl border border-luxury-800/80 bg-[#12100e] p-3 space-y-3 animate-pulse"
              >
                {/* Cake Image Box */}
                <div className="relative aspect-square w-full rounded-xl bg-gradient-to-tr from-luxury-950 via-luxury-900 to-luxury-850">
                  <div className="absolute top-2.5 left-2.5 h-4 w-14 rounded bg-luxury-800/80" />
                  <div className="absolute top-2.5 right-2.5 h-6 w-6 rounded-full bg-luxury-800/60" />
                </div>

                {/* Cake Title & Desc */}
                <div className="space-y-1.5 pt-1">
                  <div className="h-4 w-3/4 rounded bg-luxury-800/90" />
                  <div className="h-3 w-1/2 rounded bg-luxury-900/80" />
                </div>

                {/* Price & Order Button */}
                <div className="flex items-center justify-between pt-2 border-t border-luxury-800/60">
                  <div className="space-y-1">
                    <div className="h-2.5 w-12 rounded bg-luxury-900/60" />
                    <div className="h-4 w-16 rounded bg-gold-500/20" />
                  </div>
                  <div className="h-7 w-16 rounded-lg bg-gold-500/20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
