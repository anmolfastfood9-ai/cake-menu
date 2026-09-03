export default function MenuLoading() {
  return (
    <div className="min-h-screen bg-[#080706] text-[#FBF7EE] pb-24">
      {/* Header Skeleton */}
      <div className="sticky top-0 z-40 border-b border-gold-500/10 bg-[#080706]/95 px-4 py-3">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="h-8 w-44 rounded-lg bg-luxury-900/80 animate-pulse" />
          <div className="h-8 w-24 rounded-full bg-luxury-900/80 animate-pulse" />
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-3.5 sm:px-6 pt-3 space-y-6">
        {/* Hero Card Skeleton */}
        <div className="relative overflow-hidden rounded-3xl border border-gold-500/20 bg-gradient-to-b from-[#161310] to-[#0d0b09] p-6 text-center space-y-3">
          <div className="mx-auto h-4 w-28 rounded-full bg-gold-500/20 animate-pulse" />
          <div className="mx-auto h-8 w-64 rounded-xl bg-luxury-800/60 animate-pulse" />
          <div className="mx-auto h-3 w-40 rounded-lg bg-luxury-800/40 animate-pulse" />
          <div className="mx-auto h-48 w-48 rounded-full bg-luxury-900/80 animate-pulse mt-4" />
        </div>

        {/* Categories Skeleton */}
        <div className="space-y-3 pt-2">
          <div className="h-5 w-36 rounded-lg bg-luxury-800/60 animate-pulse" />
          <div className="grid grid-cols-4 gap-2">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-[#14120f] p-3 space-y-2 animate-pulse"
              >
                <div className="h-12 w-12 rounded-full bg-luxury-900/80" />
                <div className="h-3 w-14 rounded bg-luxury-900/80" />
              </div>
            ))}
          </div>
        </div>

        {/* Cake Grid Skeleton */}
        <div className="space-y-3 pt-2">
          <div className="h-5 w-36 rounded-lg bg-luxury-800/60 animate-pulse" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-luxury-800/80 bg-[#12100e] p-3 space-y-2 animate-pulse"
              >
                <div className="aspect-square w-full rounded-xl bg-luxury-900/80" />
                <div className="h-4 w-3/4 rounded bg-luxury-800/80" />
                <div className="h-3 w-1/2 rounded bg-luxury-900/60" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
