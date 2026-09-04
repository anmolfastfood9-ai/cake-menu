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
  const lowestPrice = sortedPrices[0]?.price || 799;
  const rating = cake.rating || 4.9;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gold-500/20 bg-[#12100e] transition-all duration-300 hover:border-gold-500/50 hover:shadow-[0_4px_20px_rgba(212,175,55,0.15)]">
      {/* Top Image Container */}
      <Link href={`/menu/cake/${cake.slug}`} className="relative block aspect-square w-full overflow-hidden bg-luxury-950">
        <Image
          src={cake.coverImage}
          alt={cake.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#12100e] via-transparent to-transparent opacity-85" />

        {/* Badges on Top-Left */}
        {(cake.bestseller || cake.featured || cake.isNew) && (
          <div className="absolute top-2 left-2 z-10 flex items-center gap-1 flex-wrap">
            {cake.bestseller ? (
              <span className="rounded-md bg-[#C59B27] px-2 py-0.5 text-[9px] font-bold text-luxury-950 uppercase tracking-wide shadow-md">
                Bestseller
              </span>
            ) : cake.featured ? (
              <span className="rounded-md bg-[#D97706] px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wide shadow-md">
                Signature
              </span>
            ) : cake.isNew ? (
              <span className="rounded-md bg-[#059669] px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wide shadow-md">
                New
              </span>
            ) : null}
          </div>
        )}

        {/* Top Right Rating Badge */}
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-gold-400 backdrop-blur-md border border-gold-500/30">
          <span>★</span>
          <span>{rating}</span>
        </div>
      </Link>

      {/* Content Details */}
      <div className="flex flex-1 flex-col justify-between p-3 sm:p-4 space-y-2">
        <div>
          <Link href={`/menu/cake/${cake.slug}`} className="block">
            <div className="flex items-center gap-1.5">
              {/* Standard Indian Pure Veg Icon (Green Circle in Green Square) */}
              <span className="flex h-3 w-3 shrink-0 items-center justify-center rounded-[2px] border border-emerald-500 p-[1px]" title="100% Pure Veg">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              <h3 className="font-serif text-sm sm:text-base font-bold text-[#FBF7EE] transition-colors group-hover:text-gold-400 line-clamp-1">
                {cake.name}
              </h3>
            </div>
          </Link>
          <p className="mt-0.5 text-[11px] text-luxury-400 leading-snug line-clamp-1 font-light">
            {cake.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-luxury-800/60">
          <div>
            <span className="text-[9.5px] text-luxury-400 block font-normal leading-none">Starting from</span>
            <span className="font-serif text-sm sm:text-base font-bold text-gold-400">
              ₹{lowestPrice.toLocaleString("en-IN")}
            </span>
          </div>

          <Link
            href={`/menu/cake/${cake.slug}`}
            className="inline-flex items-center space-x-1 rounded-xl border border-gold-500/40 bg-gradient-to-r from-gold-500/20 to-gold-500/10 px-3 py-1 text-[11px] font-bold text-gold-300 hover:from-gold-500/30 hover:to-gold-500/20 transition-all active:scale-95 shadow-sm"
          >
            <span>Order</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
