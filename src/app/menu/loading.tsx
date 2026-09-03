export default function MenuLoading() {
  return (
    <div className="min-h-screen bg-[#090807] text-[#FBF7EE] pb-24 md:pb-0">
      {/* Header Skeleton */}
      <div className="sticky top-0 z-40 border-b border-gold-500/10 bg-[#090807]/95 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="h-8 w-44 rounded-lg bg-luxury-900/80 animate-pulse" />
          <div className="h-8 w-24 rounded-full bg-gold-500/20 animate-pulse" />
        </div>
      </div>

      <main className="w-full max-w-md md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-2 sm:pt-4 pb-8 space-y-4 md:space-y-8">
        {/* Hero Card Skeleton */}
        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-gold-500/20 bg-gradient-to-b md:bg-gradient-to-r from-[#161310] to-[#0d0b09] p-6 sm:p-8 md:p-10 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 space-y-3">
              <div className="h-4 w-32 rounded-full bg-gold-500/20 animate-pulse" />
              <div className="h-10 w-3/4 rounded-xl bg-luxury-800/60 animate-pulse" />
              <div className="h-4 w-1/2 rounded bg-luxury-800/40 animate-pulse" />
              <div className="hidden md:flex gap-3 pt-2">
                <div className="h-10 w-32 rounded-xl bg-gold-500/20 animate-pulse" />
                <div className="h-10 w-36 rounded-xl bg-luxury-900/60 animate-pulse" />
              </div>
            </div>
            <div className="md:col-span-5 flex justify-center">
              <div className="h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 rounded-2xl bg-luxury-900/80 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Categories Skeleton */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center px-1">
            <div className="h-5 w-36 rounded-lg bg-luxury-800/60 animate-pulse" />
            <div className="h-4 w-16 rounded bg-gold-500/20 animate-pulse" />
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-1.5 sm:gap-2.5">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-[#14120f] p-2.5 sm:p-3 space-y-2 animate-pulse"
              >
                <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-luxury-900/80" />
                <div className="h-3 w-14 rounded bg-luxury-900/80" />
              </div>
            ))}
          </div>
        </div>

        {/* Signature Cake Grid Skeleton */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center px-1">
            <div className="h-5 w-36 rounded-lg bg-luxury-800/60 animate-pulse" />
            <div className="h-4 w-16 rounded bg-gold-500/20 animate-pulse" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3.5">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-xl md:rounded-2xl border border-luxury-800/80 bg-[#12100e] p-2.5 sm:p-3 space-y-2 animate-pulse"
              >
                <div className="aspect-square w-full rounded-lg md:rounded-xl bg-luxury-900/80" />
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
