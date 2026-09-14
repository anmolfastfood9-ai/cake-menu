"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { getNormalizedCakeImageUrl } from "@/lib/imageNormalization";

import { useCakeFavorite } from "@/hooks/useFavorites";

export interface CakePriceItem {
  id?: string;
  weight: string;
  price?: number | null;
  originalPrice?: number | null;
  isDefault?: boolean;
  isCustomQuote?: boolean;
}

export interface CakeItem {
  id: string;
  name: string;
  slug: string;
  productType?: string;
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
  isCustomQuote?: boolean;
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
  const { isFavorite, toggleFavorite } = useCakeFavorite(cake.id || cake.slug);

  const isCustomQuoteCake = Boolean(
    cake.isCustomQuote ||
    (cake.prices && cake.prices.length > 0 && cake.prices.every((p) => p.isCustomQuote || p.price == null || p.price === 0))
  );

  const validPrices = (cake.prices || []).filter(
    (p) => typeof p.price === "number" && !isNaN(p.price) && p.price > 0
  );
  const sortedPrices = [...validPrices].sort(
    (a, b) => (a.price || 0) - (b.price || 0)
  );

  const fallbackImage = "/images/ref_belgian_chocolate.png";
  const normalizedCoverImage = getNormalizedCakeImageUrl(cake.coverImage);
  const [imgSrc, setImgSrc] = useState<string>(normalizedCoverImage || fallbackImage);

  const lowestPriceObj = sortedPrices[0] || { price: 1499, weight: "1 kg" };
  const lowestPrice = lowestPriceObj.price || 1499;

  // Available weights in compact notation: e.g. "0.5 kg • 1 kg • 1.5 kg • 2 kg" or "250 g"
  const availableWeightsText = (cake.prices || [])
    .map((p) => p.weight?.trim())
    .filter(Boolean)
    .join(" • ");

  const cakeHref = `/menu/cake/${cake.slug}`;

  // Bento Detection: Category slug or specific cake slug
  const isBento =
    cake.slug === "bento-celebration-cake" ||
    cake.category?.slug === "mini-bento-cakes";

  // Deterministic Smart Badges (Strictly derived from verified DB attributes)
  const catSlug = (cake.category?.slug || "").toLowerCase();
  const isLargeCelebration = catSlug === "large-celebration-cakes";
  const fullText = `${cake.name} ${cake.description || ""}`.toLowerCase();

  const isSmallCelebration =
    isBento ||
    sortedPrices.some((p) => {
      const w = (p.weight || "").toLowerCase();
      return w.includes("250") || w.includes("bento");
    });

  const isChocolateLover =
    catSlug.includes("chocolate") ||
    ["chocolate", "truffle", "ganache", "hazelnut"].some((term) =>
      fullText.includes(term)
    );

  const isPremiumChoice =
    lowestPrice > 1500 || catSlug === "red-velvet-premium";

  // Promotional badge hierarchy: Exactly ONE badge per card
  let primaryBadge: { label: string; icon: string } | null = null;
  if (isSmallCelebration) {
    primaryBadge = { label: "Small Celebration", icon: "🍰" };
  } else if (isLargeCelebration) {
    primaryBadge = { label: "Grand Celebration", icon: "👑" };
  } else if (isChocolateLover) {
    primaryBadge = { label: "Chocolate Lover", icon: "🍫" };
  } else if (cake.bestseller === true) {
    primaryBadge = { label: "Best Seller", icon: "★" };
  } else if (cake.isNew === true) {
    primaryBadge = { label: "New", icon: "✦" };
  } else if (cake.featured === true) {
    primaryBadge = { label: "Signature", icon: "✦" };
  } else if (isPremiumChoice) {
    primaryBadge = { label: "Premium Choice", icon: "✨" };
  }

  return (
    <article
      className="
        group
        relative
        flex
        h-full
        min-w-0
        flex-col
        overflow-hidden
        rounded-[16px]
        border
        border-[#D4AF37]/25
        bg-[#110E0B]
        p-2
        sm:p-2.5
        shadow-[0_4px_16px_rgba(0,0,0,0.55)]
        transition-all
        duration-300
        hover:border-[#D4AF37]/55
        hover:shadow-[0_6px_20px_rgba(212,175,55,0.15)]
        hover:-translate-y-0.5
      "
    >
      {/* ======================================================
          1. CAKE IMAGE AREA
          Refined 4:3 landscape ratio, leaves breathing room below
      ====================================================== */}
      <Link
        href={cakeHref}
        prefetch={true}
        aria-label={`View ${cake.name}`}
        className="
          relative
          block
          w-full
          aspect-[4/3]
          min-h-0
          overflow-hidden
          rounded-[11px]
          bg-[#080706]
        "
      >
        <Image
          src={imgSrc || fallbackImage}
          alt={cake.name}
          fill
          sizes="
            (max-width: 480px) 48vw,
            (max-width: 768px) 46vw,
            (max-width: 1024px) 32vw,
            280px
          "
          onError={() => setImgSrc(fallbackImage)}
          className="
            object-contain
            object-center
            transition-transform
            duration-500
            ease-out
            group-hover:scale-[1.02]
          "
        />

        {/* Subtle dark gradient fade: minimal so bottom of cake is never obscured */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            h-3
            bg-gradient-to-t
            from-[#110E0B]/40
            to-transparent
          "
        />

        {/* ====================================================
            TOP ROW OVERLAYS: Promotional Badge (Left) & Pure Veg (Right)
        ==================================================== */}
        {/* 1. Left Side: Promotional Badge (Crystal-clear luxury pill) */}
        {primaryBadge && (
          <div className="absolute left-2 top-2 sm:left-2.5 sm:top-2.5 z-10 flex items-center pointer-events-none max-w-[calc(100%-28px)] sm:max-w-[calc(100%-32px)]">
            <span
              className="
                inline-flex
                max-w-full
                min-w-0
                h-[18px]
                sm:h-[20px]
                items-center
                gap-1
                sm:gap-1.5
                rounded-full
                border
                border-[#E5C365]
                bg-[#0D0B08]/95
                px-2
                sm:px-2.5
                text-[10px]
                sm:text-[11px]
                font-semibold
                tracking-tight
                text-[#FFF3CD]
                shadow-[0_2px_8px_rgba(0,0,0,0.85)]
              "
            >
              <span className="text-[9.5px] sm:text-[10.5px] text-[#F5C842] leading-none shrink-0" aria-hidden="true">
                {primaryBadge.icon}
              </span>
              <span className="leading-none min-w-0 truncate font-medium text-[#FFF3CD]">
                {primaryBadge.label}
              </span>
            </span>
          </div>
        )}

        {/* 2. Right Side: Pure Veg Indicator (Authentic Indian Veg Symbol: White square with green border & solid green circle) */}
        <div
          title="100% Pure Vegetarian"
          aria-label="100% Pure Vegetarian"
          className="
            absolute
            right-2
            top-2
            sm:right-2.5
            sm:top-2.5
            z-10
            flex
            items-center
            justify-center
            pointer-events-none
          "
        >
          <span
            className="
              flex
              h-[16px]
              w-[16px]
              sm:h-[18px]
              sm:w-[18px]
              items-center
              justify-center
              rounded-[2.5px]
              border-[1.4px]
              sm:border-[1.6px]
              border-[#0F8A3C]
              bg-white
              shadow-[0_1px_4px_rgba(0,0,0,0.6)]
            "
          >
            <span className="h-[7px] w-[7px] sm:h-[8px] sm:w-[8px] rounded-full bg-[#0F8A3C]" />
          </span>
        </div>

        {/* Unavailable overlay if not available */}
        {!cake.available && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
            <span
              className="
                rounded-full
                border
                border-white/20
                bg-black/80
                px-2.5
                py-1
                text-[9px]
                font-semibold
                uppercase
                tracking-wider
                text-white/90
              "
            >
              Currently Unavailable
            </span>
          </div>
        )}
      </Link>

      {/* ======================================================
          CARD CONTENT FLEX COLUMN
          Image → Cake Name + Favorite Heart Row → Price + Order
      ====================================================== */}
      <div className="flex min-w-0 flex-1 flex-col pt-2 pb-0.5 px-0.5">
        {/* Title + Heart Row: Flex items-center justify-between, 2 lines max, heart vertically centered */}
        <div className="h-[37px] sm:h-[41px] flex items-center justify-between gap-1.5 min-w-0">
          <Link
            href={cakeHref}
            prefetch={true}
            className="block min-w-0 flex-1"
          >
            <h3
              className="
                font-sans
                text-[13px]
                sm:text-[14px]
                font-semibold
                leading-[1.25]
                tracking-tight
                text-[#F4EBD2]
                line-clamp-2
                transition-colors
                group-hover:text-[#F5E29D]
              "
            >
              {cake.name}
            </h3>
          </Link>

          {/* 3. Favorite Heart (Far right of name row, minimal champagne-gold, transparent) */}
          <button
            type="button"
            onClick={toggleFavorite}
            aria-label={isFavorite ? `Remove ${cake.name} from favorites` : `Add ${cake.name} to favorites`}
            className="
              shrink-0
              flex
              h-6
              w-6
              sm:h-7
              sm:w-7
              items-center
              justify-center
              bg-transparent
              p-0
              transition-transform
              duration-200
              active:scale-90
              focus:outline-none
              -mr-0.5
            "
          >
            <Heart
              strokeWidth={1.5}
              className={`h-[17px] w-[17px] sm:h-[19px] sm:w-[19px] transition-all duration-200 ${
                isFavorite
                  ? "fill-[#E7C96B] text-[#E7C96B] drop-shadow-[0_0_8px_rgba(231,201,107,0.7)]"
                  : "fill-none text-[#E7C96B]/80 hover:text-[#F7E7B4] hover:drop-shadow-[0_0_6px_rgba(231,201,107,0.6)]"
              }`}
            />
          </button>
        </div>

        {/* Available Weights / Bento Callout / Large Celebration Sub-row */}
        {isBento ? (
          <div className="mt-1 flex items-center justify-between text-[8.5px] sm:text-[9.5px] text-[#E5C365] font-semibold leading-tight">
            <span className="inline-flex items-center gap-1">
              <span>🍱</span>
              <span>250 g Bento</span>
            </span>
            <span className="text-[#C5BAA8] font-medium">1–2 Guests</span>
          </div>
        ) : isCustomQuoteCake ? (
          <div className="mt-1 flex items-center justify-between text-[8.5px] sm:text-[9.5px] text-[#E5C365] font-semibold leading-tight">
            <span className="inline-flex items-center gap-1">
              <span>👑</span>
              <span>3 kg+</span>
            </span>
            <span className="text-[#C5BAA8] font-medium">Large Celebration</span>
          </div>
        ) : isLargeCelebration ? (
          <div className="mt-1 flex items-center justify-between text-[8.5px] sm:text-[9.5px] text-[#E5C365] font-semibold leading-tight">
            <span className="inline-flex items-center gap-1">
              <span>👑</span>
              <span>{lowestPriceObj.weight || "3 kg"}</span>
            </span>
            <span className="text-[#C5BAA8] font-medium">Serves 20–24</span>
          </div>
        ) : (
          availableWeightsText && (
            <div
              className="mt-1 text-[8.5px] sm:text-[9.5px] text-[#A69B8D] font-medium truncate leading-tight"
              title={availableWeightsText}
            >
              {availableWeightsText}
            </div>
          )
        )}

        {/* Price Row (Pinned to bottom with mt-auto, always aligned) */}
        <div className="mt-auto pt-1.5 flex min-w-0 items-center justify-between gap-1 sm:gap-1.5">
          {/* 4. Price Pill: "Custom Quote" or "From ₹..." */}
          <div
            className="
              inline-flex
              min-w-0
              shrink
              items-center
              gap-0.5
              sm:gap-1
              rounded-[6px]
              border
              border-[#D4AF37]/45
              bg-[#18130B]
              px-1.5
              py-[3px]
              sm:px-2.5
              sm:py-[3.5px]
              shadow-[inset_0_0_6px_rgba(212,175,55,0.06)]
            "
          >
            {isCustomQuoteCake ? (
              <span className="font-price text-[10px] sm:text-[11.5px] font-bold leading-none text-[#F5E29D] whitespace-nowrap shrink-0">
                Custom Quote
              </span>
            ) : (
              <>
                <span className="text-[8px] sm:text-[9px] font-medium text-[#B8AA97] whitespace-nowrap shrink-0">
                  From
                </span>
                <span className="font-price text-[10px] sm:text-[11.5px] font-bold leading-none text-[#F5E29D] whitespace-nowrap shrink-0">
                  ₹{lowestPrice.toLocaleString("en-IN")}
                </span>
              </>
            )}
          </div>

          {/* 5. Order Button: +2px taller (27px / 29px), improved alignment and centering */}
          <Link
            href={cakeHref}
            className="
              inline-flex
              h-[26px]
              sm:h-[29px]
              shrink-0
              items-center
              justify-center
              gap-1
              sm:gap-1.5
              rounded-[7px]
              border
              border-emerald-500/75
              bg-[#082017]
              px-2
              sm:px-3
              text-[9px]
              sm:text-[10.5px]
              font-semibold
              leading-none
              text-emerald-100
              shadow-[0_0_8px_rgba(16,185,129,0.18)]
              transition-all
              hover:bg-[#0B2C1C]
              hover:shadow-[0_0_12px_rgba(16,185,129,0.3)]
              hover:border-emerald-400
              active:scale-[0.95]
            "
          >
            <WhatsAppIcon className="h-3 w-3 text-emerald-300 shrink-0" />
            <span className="leading-none pt-[0.5px]">Order</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
