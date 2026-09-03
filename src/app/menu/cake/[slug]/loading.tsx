export default function CakeDetailLoading() {
  return (
    <div className="min-h-screen bg-[#090807] text-[#FBF7EE] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-gold-500/10 bg-[#090807]/95 px-4 py-3 flex items-center justify-between">
        <div className="h-8 w-8 rounded-full bg-luxury-900/80 animate-pulse" />
        <div className="h-6 w-32 rounded bg-luxury-900/80 animate-pulse" />
        <div className="h-8 w-8 rounded-full bg-luxury-900/80 animate-pulse" />
      </div>

      <main className="mx-auto max-w-2xl px-4 pt-4 space-y-6">
        {/* Large Hero Image Skeleton */}
        <div className="relative aspect-square w-full rounded-3xl border border-luxury-800 bg-[#12100e] overflow-hidden animate-pulse">
          <div className="h-full w-full bg-luxury-900/80" />
        </div>

        {/* Title and Badge */}
        <div className="space-y-3">
          <div className="h-4 w-28 rounded-full bg-gold-500/20 animate-pulse" />
          <div className="h-7 w-3/4 rounded-xl bg-luxury-800/80 animate-pulse" />
          <div className="h-5 w-24 rounded-lg bg-gold-500/30 animate-pulse" />
        </div>

        {/* Weight Selector Skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-28 rounded bg-luxury-900 animate-pulse" />
          <div className="grid grid-cols-3 gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-14 rounded-xl border border-luxury-800 bg-luxury-900/60 animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* Order Button Skeleton */}
        <div className="h-12 w-full rounded-2xl bg-gold-500/20 animate-pulse" />
      </main>
    </div>
  );
}
