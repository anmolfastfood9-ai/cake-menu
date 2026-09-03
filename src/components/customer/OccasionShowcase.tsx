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
    <section className="w-full my-2 px-1">
      <div
        className="relative overflow-hidden rounded-2xl border border-gold-500/25 bg-gradient-to-b from-[#181512] to-[#100e0c] p-3.5 sm:p-4 shadow-[0_4px_20px_rgba(0,0,0,0.4)] backdrop-blur-md transition-all duration-300"
        style={{
          boxShadow: `0 0 20px ${accentColor}15`,
        }}
      >
        {/* Subtle Accent Glow */}
        <div
          className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full blur-2xl opacity-20"
          style={{ backgroundColor: accentColor }}
        />

        <div className="relative z-10 space-y-2.5">
          {/* Top Badge & Header */}
          <div className="flex items-center justify-between flex-wrap gap-1.5">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase border border-gold-500/30 bg-gold-500/10 text-gold-400"
              style={{
                borderColor: `${accentColor}40`,
                backgroundColor: `${accentColor}15`,
                color: accentColor,
              }}
            >
              <Sparkles className="h-3 w-3 shrink-0" />
              <span>{badgeText}</span>
            </span>

            {isMerged && (
              <span className="text-[10px] font-semibold text-gold-300/80 uppercase tracking-widest bg-gold-500/10 px-2 py-0.5 rounded-full border border-gold-500/20">
                🎉 Double Celebrations
              </span>
            )}
          </div>

          {/* Headline & Description */}
          <div className="space-y-0.5">
            <h3 className="font-serif text-sm sm:text-[15px] font-bold text-[#FBF7EE] tracking-tight">
              {occasion.name} Festive Collection
            </h3>
            <p className="text-[11px] text-[#A69B8D] leading-snug line-clamp-2">
              {occasion.description || "Celebrate the special season with our handcrafted 100% eggless cake creations."}
            </p>
          </div>

          {/* 2-4 Circular / Rounded Preview Cake Cards */}
          <div className="grid grid-cols-4 gap-2 pt-1">
            {previewCakes.map((cake) => {
              const displayPrice = cake.prices?.[0]?.price;
              return (
                <Link
                  key={cake.id}
                  href={`/menu/cake/${cake.slug}`}
                  className="group flex flex-col items-center text-center space-y-1"
                >
                  <div className="relative h-14 w-14 sm:h-16 sm:w-16 overflow-hidden rounded-xl border border-white/10 bg-[#0c0a09] group-hover:border-gold-400/50 transition-all duration-300 shadow-md">
                    <Image
                      src={cake.coverImage}
                      alt={cake.name}
                      fill
                      sizes="64px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {isMerged && cake.occasionBadge && (
                      <div className="absolute top-0 inset-x-0 bg-black/85 backdrop-blur-xs py-0.5 text-[7px] font-bold text-gold-300 uppercase tracking-tighter truncate px-0.5">
                        {cake.occasionBadge.replace(/^[^\w]+/, "").slice(0, 14)}
                      </div>
                    )}
                  </div>
                  <span className="text-[9.5px] font-medium text-cream-200 line-clamp-1 w-full group-hover:text-gold-400 transition-colors">
                    {cake.name}
                  </span>
                  {displayPrice && (
                    <span className="text-[9px] font-semibold text-gold-400">
                      ₹{displayPrice}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Action Links to Occasion Collections */}
          <div className="pt-1.5 flex items-center justify-between flex-wrap gap-2 border-t border-luxury-800/60 mt-1">
            {isMerged && mergedOccasions && mergedOccasions.length > 0 ? (
              <div className="flex items-center gap-1.5 flex-wrap w-full justify-end">
                {mergedOccasions.map((occ) => (
                  <Link
                    key={occ.id}
                    href={`/menu/occasion/${occ.slug}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-gold-500/20 bg-gold-500/5 px-2 py-1 text-[10px] font-semibold text-gold-400 hover:border-gold-500/40 hover:bg-gold-500/15 transition-all"
                  >
                    <span>{occ.name}</span>
                    <ArrowRight className="h-2.5 w-2.5" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="w-full text-right">
                <Link
                  href={`/menu/occasion/${occasion.slug}`}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-gold-400 hover:text-gold-300 transition-colors"
                >
                  <span>Explore {occasion.name} Cakes</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
