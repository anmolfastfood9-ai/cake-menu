"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface CakePriceItem {
  id?: string;
  weight: string;
  price: number;
  originalPrice?: number | null;
  isDefault?: boolean;
}

export interface CakeItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  images?: string;
  ingredients?: string | null;
  preparationNotes?: string | null;
  featured: boolean;
  bestseller: boolean;
  isNew: boolean;
  available: boolean;
  rating?: number;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  prices: CakePriceItem[];
}

interface CakeCardProps {
  cake: CakeItem;
  whatsappNumber?: string;
  restaurantName?: string;
}

export default function CakeCard({
  cake,
}: CakeCardProps) {
  const sortedPrices = [...(cake.prices || [])].sort((a, b) => a.price - b.price);
  const lowestPrice = sortedPrices[0]?.price || 1499;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gold-500/25 bg-[#12100e] p-2.5 sm:p-3 transition-all duration-300 hover:border-gold-500/50 hover:shadow-[0_4px_20px_rgba(212,175,55,0.15)]">
      {/* Top Image Container */}
      <Link href={`/menu/cake/${cake.slug}`} className="relative block aspect-square w-full overflow-hidden rounded-xl bg-[#12100e]">
        <Image
          src={cake.coverImage}
          alt={cake.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Top-Right Green Veg Indicator Symbol */}
        <div className="absolute top-2 right-2 z-10">
          <span className="flex h-3.5 w-3.5 items-center justify-center rounded-[2px] border border-emerald-500 bg-black/70 p-[1px] shadow-md" title="100% Pure Veg">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
        </div>
      </Link>

      {/* Content Details */}
      <div className="flex flex-1 flex-col justify-between pt-2 space-y-2 text-left">
        <Link href={`/menu/cake/${cake.slug}`} className="block min-h-[32px]">
          <h3 className="font-serif text-xs sm:text-sm font-medium text-[#FBF7EE] transition-colors group-hover:text-gold-400 line-clamp-2 leading-snug">
            {cake.name}
          </h3>
        </Link>

        {/* Bottom Controls Row: Gold Price Pill (Left) & Emerald Order Button (Right) */}
        <div className="flex items-center justify-between pt-1">
          {/* Gold Price Box */}
          <span className="inline-flex items-center justify-center rounded-lg border border-gold-500/40 bg-[#241c0e] px-2 py-0.5 text-[11px] font-bold font-mono text-gold-300 shadow-sm">
            ₹{lowestPrice.toLocaleString("en-IN")}
          </span>

          {/* Emerald Order CTA Button */}
          <Link
            href={`/menu/cake/${cake.slug}`}
            className="inline-flex items-center justify-center rounded-lg border border-emerald-500/60 bg-[#0c2419] px-3 py-0.5 text-[11px] font-bold text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.3)] hover:bg-emerald-900/40 active:scale-95 transition-all"
          >
            <span>Order</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
