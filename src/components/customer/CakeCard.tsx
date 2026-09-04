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
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#D4AF37]/30 bg-[#12100e] p-2 transition-all duration-300 hover:border-[#D4AF37]/60 shadow-[0_4px_15px_rgba(0,0,0,0.6)] hover:shadow-[0_4px_20px_rgba(212,175,55,0.25)]">
      {/* Top Image Container */}
      <Link href={`/menu/cake/${cake.slug}`} className="relative block aspect-square w-full overflow-hidden rounded-xl bg-[#090807]">
        <Image
          src={cake.coverImage}
          alt={cake.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Top-Right Green Veg Indicator Symbol */}
        <div className="absolute top-1.5 right-1.5 z-10">
          <span className="flex h-3.5 w-3.5 items-center justify-center rounded-[3px] border border-emerald-500 bg-black/80 p-[1.5px] shadow-md" title="100% Pure Veg">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
        </div>
      </Link>

      {/* Content Details */}
      <div className="flex flex-1 flex-col justify-between pt-1.5 space-y-1.5 text-left">
        {/* Cake Name: 2 Lines Maximum Allowed */}
        <Link href={`/menu/cake/${cake.slug}`} className="block min-h-[32px] sm:min-h-[38px] flex items-center">
          <h3 className="font-serif text-[11.5px] sm:text-xs font-bold text-[#EBD699] transition-colors group-hover:text-gold-300 line-clamp-2 leading-snug">
            {cake.name}
          </h3>
        </Link>

        {/* Bottom Controls Row: Gold Price Pill (Left) & Emerald Order Button (Right) */}
        <div className="flex items-center justify-between pt-0.5">
          {/* Gold Price Box */}
          <span className="inline-flex items-center justify-center rounded-md border border-[#D4AF37]/50 bg-[#1e170d] px-1.5 sm:px-2 py-0.5 text-[10.5px] sm:text-[11px] font-bold font-mono text-[#EBD699] shadow-sm">
            ₹{lowestPrice.toLocaleString("en-IN")}
          </span>

          {/* Emerald Order CTA Button */}
          <Link
            href={`/menu/cake/${cake.slug}`}
            className="inline-flex items-center justify-center rounded-xl border border-emerald-500/70 bg-[#092217] px-2.5 sm:px-3 py-0.5 text-[10.5px] sm:text-[11px] font-semibold text-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.3)] hover:bg-emerald-900/60 active:scale-95 transition-all"
          >
            <span>Order</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
