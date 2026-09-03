"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { ActiveOccasionResult } from "@/lib/festivals/occasionEngine";

interface OccasionShowcaseProps {
  occasionData: ActiveOccasionResult | null;
}

export default function OccasionShowcase({ occasionData }: OccasionShowcaseProps) {
  // If no active occasion exists or no cakes are attached: render NOTHING
  if (!occasionData || !occasionData.occasion || !occasionData.cakes || occasionData.cakes.length === 0) {
    return null;
  }

  const { occasion, cakes, isMerged, mergedOccasions } = occasionData;
  const accentColor = occasion.accentColor || "#D4AF37";
  const badgeText = occasion.badgeText || `✨ ${occasion.name.toUpperCase()} SPECIAL`;

  // Display between 2 and 4 preview cakes
  const previewCakes = cakes.slice(0, 4);

  return (
    <section className="w-full my-2 sm:my-3 md:my-4 px-0">
      <div
        className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-gold-500/25 bg-gradient-to-b from-[#181512] to-[#100e0c] p-3.5 sm:p-5 md:p-6 lg:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.4)] backdrop-blur-md transition-all duration-300"
        style={{
          boxShadow: `0 0 25px ${accentColor}18`,
        }}
      >
        {/* Subtle Accent Glow */}
        <div
          className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: accentColor }}
        />

        <div className="relative z-10 space-y-3 md:space-y-4">
          {/* Top Badge & Header */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold tracking-wider uppercase border border-gold-500/30 bg-gold-500/10 text-gold-400 shadow-sm"
              style={{
                borderColor: `${accentColor}40`,
                backgroundColor: `${accentColor}15`,
                color: accentColor,
              }}
            >
              <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
              <span>{badgeText}</span>
            </span>

            {isMerged && (
              <span className="text-[10px] sm:text-xs font-semibold text-gold-300/90 uppercase tracking-widest bg-gold-500/10 px-2.5 py-0.5 sm:py-1 rounded-full border border-gold-500/20">
                🎉 Double Celebrations
              </span>
            )}
          </div>

          {/* Headline & Description */}
          <div className="space-y-0.5 sm:space-y-1">
            <h3 className="font-serif text-sm sm:text-base md:text-lg lg:text-xl font-bold text-[#FBF7EE] tracking-tight">
              {occasion.name} Festive Collection
            </h3>
            <p className="text-[11px] sm:text-xs md:text-sm text-[#A69B8D] leading-snug line-clamp-2 max-w-2xl">
              {occasion.description || "Celebrate the special season with our handcrafted 100% eggless cake creations."}
            </p>
          </div>

          {/* 2-4 Circular / Rounded Preview Cake Cards */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6 pt-1">
            {previewCakes.map((cake) => {
              const displayPrice = cake.prices?.[0]?.price;
              return (
                <Link
                  key={cake.id}
                  href={`/menu/cake/${cake.slug}`}
                  className="group flex flex-col items-center text-center space-y-1 sm:space-y-1.5"
                >
                  <div className="relative h-14 w-14 sm:h-18 sm:w-18 md:h-24 md:w-24 lg:h-28 lg:w-28 overflow-hidden rounded-xl md:rounded-2xl border border-white/10 bg-[#0c0a09] group-hover:border-gold-400/60 group-hover:scale-105 transition-all duration-300 shadow-md">
                    <Image
                      src={cake.coverImage}
                      alt={cake.name}
                      fill
                      sizes="(max-width: 640px) 64px, (max-width: 1024px) 120px, 140px"
                      className="object-cover group-hover:scale-108 transition-transform duration-500"
                    />
                    {isMerged && cake.occasionBadge && (
                      <div className="absolute top-0 inset-x-0 bg-black/85 backdrop-blur-xs py-0.5 text-[7px] sm:text-[8.5px] font-bold text-gold-300 uppercase tracking-tighter truncate px-0.5">
                        {cake.occasionBadge.replace(/^[^\w]+/, "").slice(0, 14)}
                      </div>
                    )}
                  </div>
                  <span className="text-[9.5px] sm:text-xs font-medium text-cream-200 line-clamp-1 w-full group-hover:text-gold-400 transition-colors">
                    {cake.name}
                  </span>
                  {displayPrice && (
                    <span className="text-[9px] sm:text-xs font-bold text-gold-400">
                      ₹{displayPrice}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Action Links to Occasion Collections */}
          <div className="pt-2 flex items-center justify-between flex-wrap gap-2 border-t border-luxury-800/60 mt-1">
            {isMerged && mergedOccasions && mergedOccasions.length > 0 ? (
              <div className="flex items-center gap-2 flex-wrap w-full justify-end">
                {mergedOccasions.map((occ) => (
                  <Link
                    key={occ.id}
                    href={`/menu/occasion/${occ.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-gold-500/20 bg-gold-500/5 px-3 py-1.5 text-[10.5px] sm:text-xs font-semibold text-gold-400 hover:border-gold-500/50 hover:bg-gold-500/15 transition-all"
                  >
                    <span>{occ.name}</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="w-full text-right">
                <Link
                  href={`/menu/occasion/${occasion.slug}`}
                  className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs md:text-sm font-semibold text-gold-400 hover:text-gold-300 transition-colors"
                >
                  <span>Explore {occasion.name} Cakes</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
