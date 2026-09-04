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
  const previewCakes = cakes.slice(0, 4);  return (
    <section className="w-full my-2 sm:my-3 px-0">
      <div className="relative overflow-hidden rounded-2xl border border-gold-500/40 bg-gradient-to-r from-[#21170d] via-[#1a1209] to-[#21170d] p-3.5 sm:p-5 shadow-[0_4px_25px_rgba(212,175,55,0.15)] text-center">
        {/* Gold Ribbon / Decorative Motifs background */}
        <div className="pointer-events-none absolute -left-4 -top-4 h-24 w-24 rounded-full border border-gold-500/20 opacity-30" />
        <div className="pointer-events-none absolute -right-4 -bottom-4 h-24 w-24 rounded-full border border-gold-500/20 opacity-30" />

        <div className="relative z-10 flex flex-col items-center justify-center space-y-2">
          {/* Badges */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            <span className="inline-flex items-center gap-1 rounded-full border border-gold-500/40 bg-gold-500/15 px-2.5 py-0.5 text-[9.5px] font-bold text-gold-300 tracking-wider uppercase">
              <Sparkles className="h-3 w-3 text-gold-400" />
              <span>{badgeText}</span>
            </span>
            {isMerged && (
              <span className="inline-flex items-center rounded-full border border-gold-500/30 bg-gold-500/10 px-2.5 py-0.5 text-[9.5px] font-bold text-gold-400">
                🎉 DOUBLE CELEBRATIONS
              </span>
            )}
          </div>

          {/* Festival Title */}
          <h3 className="font-serif text-base sm:text-xl font-bold text-[#FBF7EE] tracking-tight">
            {occasion.name} Special
          </h3>
          <p className="text-[11px] sm:text-xs text-[#A69B8D] line-clamp-1 max-w-lg">
            {occasion.description || "Celebrate with our handcrafted 100% eggless festive cake collections."}
          </p>

          {/* Category/Occasion Filter Pills */}
          <div className="pt-1 flex items-center justify-center gap-2 flex-wrap">
            {isMerged && mergedOccasions && mergedOccasions.length > 0 ? (
              mergedOccasions.map((occ) => (
                <Link
                  key={occ.id}
                  href={`/menu/occasion/${occ.slug}`}
                  className="inline-flex items-center gap-1 rounded-xl border border-gold-500/40 bg-gold-500/10 px-3 py-1 text-[11px] font-bold text-gold-300 hover:bg-gold-500/20 active:scale-95 transition-all"
                >
                  <span>{occ.name} →</span>
                </Link>
              ))
            ) : (
              <Link
                href={`/menu/occasion/${occasion.slug}`}
                className="inline-flex items-center gap-1 rounded-xl border border-gold-500/40 bg-gold-500/10 px-3 py-1 text-[11px] font-bold text-gold-300 hover:bg-gold-500/20 active:scale-95 transition-all"
              >
                <span>Explore Collection →</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
