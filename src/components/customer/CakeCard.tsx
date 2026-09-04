"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";

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

export default function CakeCard({ cake }: CakeCardProps) {
  const sortedPrices = [...(cake.prices || [])].sort(
    (a, b) => a.price - b.price
  );

  const lowestPrice = sortedPrices[0]?.price || 1499;

  const cakeHref = `/menu/cake/${cake.slug}`;

  return (
    <article
      className="
        group
        relative
        flex
        min-w-0
        flex-col
        overflow-hidden
        rounded-[15px]
        border
        border-[#D4AF37]/35
        bg-[#100E0B]
        p-[5px]
        shadow-[0_5px_18px_rgba(0,0,0,0.50)]
        transition-all
        duration-300
        hover:border-[#D4AF37]/60
        hover:shadow-[0_6px_22px_rgba(212,175,55,0.18)]
      "
    >
      {/* ======================================================
          IMAGE
          Compact reference-style product area
      ====================================================== */}
      <Link
        href={cakeHref}
        aria-label={`View ${cake.name}`}
        className="
          relative
          block
          w-full
          aspect-[1/1]
          min-h-0
          overflow-hidden
          rounded-[11px]
          bg-[#090807]
        "
      >
        <Image
          src={cake.coverImage}
          alt={cake.name}
          fill
          sizes="
            (max-width: 430px) 44vw,
            (max-width: 640px) 46vw,
            (max-width: 1024px) 30vw,
            240px
          "
          className="
            object-cover
            object-center
            transition-transform
            duration-500
            ease-out
            group-hover:scale-[1.035]
          "
        />

        {/* Very subtle dark bottom fade for text separation */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            h-12
            bg-gradient-to-t
            from-black/35
            to-transparent
          "
        />

        {/* ====================================================
            PURE VEG INDICATOR
        ==================================================== */}
        <div className="absolute left-1.5 top-1.5 z-10">
          <span
            title="100% Pure Veg"
            className="
              flex
              h-[15px]
              w-[15px]
              items-center
              justify-center
              rounded-[3px]
              border
              border-emerald-500/90
              bg-black/80
              p-[2px]
              shadow-[0_0_8px_rgba(16,185,129,0.22)]
            "
          >
            <span className="h-[6px] w-[6px] rounded-full bg-emerald-500" />
          </span>
        </div>

        <button
          type="button"
          aria-label={`Save ${cake.name}`}
          className="absolute right-1.5 top-1.5 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white/90 backdrop-blur-md transition hover:text-[#EBD699]"
        >
          <Heart className="h-3.5 w-3.5" />
        </button>

        {/* Optional availability state */}
        {!cake.available && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50">
            <span
              className="
                rounded-full
                border
                border-white/15
                bg-black/75
                px-2.5
                py-1
                text-[9px]
                font-semibold
                uppercase
                tracking-wider
                text-white/85
              "
            >
              Currently Unavailable
            </span>
          </div>
        )}
      </Link>

      {/* ======================================================
          CARD DETAILS
      ====================================================== */}
      <div className="flex min-w-0 flex-1 flex-col px-0.5 pb-0.5 pt-1.5">
        {/* Cake name */}
        <Link
          href={cakeHref}
          className="
            min-w-0
            min-h-[30px]
            sm:min-h-[34px]
          "
        >
          <h3
            className="
              line-clamp-2
              font-serif
              text-[11px]
              font-semibold
              leading-[1.22]
              tracking-[-0.01em]
              text-[#F0E2B5]
              transition-colors
              group-hover:text-[#F3D477]
              sm:text-[12px]
            "
          >
            {cake.name}
          </h3>
        </Link>

        {/* Price + Order */}
        <div className="mt-1.5 flex min-w-0 items-center justify-between gap-1.5">
          {/* Price */}
          <span
            className="
              inline-flex
              min-w-0
              shrink
              items-center
              justify-center
              rounded-[6px]
              border
              border-[#D4AF37]/55
              bg-[#1B150C]
              px-1.5
              py-[3px]
              font-mono
              text-[9.5px]
              font-bold
              leading-none
              text-[#EBD699]
              shadow-[inset_0_0_8px_rgba(212,175,55,0.04)]
              sm:px-2
              sm:text-[10px]
            "
          >
            ₹{lowestPrice.toLocaleString("en-IN")}
          </span>

          {/* Order */}
          <Link
            href={cakeHref}
            className="
              inline-flex
              h-[25px]
              shrink-0
              items-center
              justify-center
              rounded-[8px]
              border
              border-emerald-500/75
              bg-[#082017]
              gap-1
              px-2
              text-[9.5px]
              font-semibold
              leading-none
              text-emerald-100
              shadow-[0_0_9px_rgba(16,185,129,0.18)]
              transition-all
              hover:bg-[#0B2C1C]
              hover:shadow-[0_0_12px_rgba(16,185,129,0.28)]
              active:scale-[0.96]
              sm:h-[26px]
              sm:px-2.5
              sm:text-[10px]
            "
          >
            <MessageCircle className="h-3 w-3" />
            Order
          </Link>
        </div>
      </div>
    </article>
  );
}
