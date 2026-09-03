"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";

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
  const [isFav, setIsFav] = useState(false);
  const sortedPrices = [...(cake.prices || [])].sort((a, b) => a.price - b.price);
  const lowestPrice = sortedPrices[0]?.price || 799;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-luxury-800/80 bg-[#12100e] transition-all duration-300 hover:border-gold-500/40 hover:shadow-gold-md">
      {/* Top Image Container */}
      <Link href={`/menu/cake/${cake.slug}`} className="relative block aspect-square w-full overflow-hidden bg-luxury-950">
        <Image
          src={cake.coverImage}
          alt={cake.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#12100e] via-transparent to-transparent opacity-80" />

        {/* Badges on Top-Left */}
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 flex-wrap">
          <span className="inline-flex items-center gap-1 rounded bg-black/80 backdrop-blur-md px-1.5 py-0.5 text-[8.5px] font-bold text-emerald-400 border border-emerald-500/40 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Pure Veg
          </span>
          {cake.bestseller && (
            <span className="rounded-md bg-[#C59B27] px-2 py-0.5 text-[9.5px] font-bold text-luxury-950 uppercase tracking-wide shadow-md">
              Bestseller
            </span>
          )}
          {cake.featured && !cake.bestseller && (
            <span className="rounded-md bg-[#D97706] px-2 py-0.5 text-[9.5px] font-bold text-white uppercase tracking-wide shadow-md">
              Signature
            </span>
          )}
          {cake.isNew && (
            <span className="rounded-md bg-[#059669] px-2 py-0.5 text-[9.5px] font-bold text-white uppercase tracking-wide shadow-md">
              New
            </span>
          )}
        </div>

        {/* Favorite Heart Button on Top-Right */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsFav(!isFav);
          }}
          className="absolute top-2.5 right-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-colors hover:text-red-400 active:scale-90"
          title="Favorite"
        >
          <Heart className={`h-3.5 w-3.5 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
        </button>
      </Link>

      {/* Content Details */}
      <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4 space-y-2.5">
        <div>
          <Link href={`/menu/cake/${cake.slug}`} className="block">
            <h3 className="font-serif text-sm sm:text-base font-bold text-[#FBF7EE] transition-colors group-hover:text-gold-400 line-clamp-1">
              {cake.name}
            </h3>
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
            className="inline-flex items-center space-x-1 rounded-lg border border-gold-500/30 bg-gold-500/10 px-2.5 py-1 text-[10.5px] font-bold text-gold-300 hover:bg-gold-500/20 transition-all active:scale-95"
          >
            <span>Order</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
