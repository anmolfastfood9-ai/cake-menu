"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/customer/Footer";
import { DEFAULT_BRAND_NAME, getCleanBrandData } from "@/components/customer/BrandIdentity";
import {
  ArrowLeft,
  ArrowRight,
  Phone,
  Heart,
  Sparkles,
  ChevronRight,
  Leaf,
  Clock,
  Check,
  ChefHat,
  Crown,
  Gem,
  Ruler,
  UtensilsCrossed,
} from "lucide-react";
import { generateWhatsAppLink, normalizeWhatsAppNumber } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { useCakeFavorite } from "@/hooks/useFavorites";
import { getNormalizedCakeImageUrl, getCleanOriginalCakeImageUrl } from "@/lib/imageNormalization";

const FALLBACK_IMAGE = "/images/ref_belgian_chocolate.png";

interface CakeDetailClientProps {
  cake: any;
  relatedCakes?: any[];
  settings?: any;
  whatsappSetting?: any;
}

/**
 * Parses a weight string into a serving guide estimate.
 */
function getServingGuide(weight: string): string | null {
  if (!weight) return null;
  const lower = weight.toLowerCase().replace(/\s+/g, "");

  if (lower.includes("10kg") || lower.includes("10 kg")) return "Large Celebration";

  let kg: number | null = null;
  const gMatch = lower.match(/^([\d.]+)g$/);
  const kgMatch = lower.match(/^([\d.]+)kg/);

  if (gMatch) {
    kg = parseFloat(gMatch[1]) / 1000;
  } else if (kgMatch) {
    kg = parseFloat(kgMatch[1]);
  } else if (lower.includes("half") || lower.includes("1/2") || lower.includes("0.5") || lower.includes(".5")) {
    kg = 0.5;
  }

  if (kg === null || isNaN(kg) || kg <= 0) return null;

  // Exact guest serving guide
  if (kg <= 0.3) return "Serves 1–2 Guests";
  if (kg <= 0.5) return "Serves 3–4 Guests";
  if (kg <= 1.0) return "Serves 6–8 Guests";
  if (kg <= 1.5) return "Serves 10–14 Guests";
  if (kg <= 2.0) return "Serves 16–20 Guests";
  if (kg <= 3.0) return "Serves 20–24 Guests";
  if (kg <= 4.0) return "Serves 26–32 Guests";
  if (kg <= 5.0) return "Serves 34–40 Guests";
  if (kg <= 7.0) return "Serves 48–56 Guests";
  return "Large Celebration";
}

/**
 * Returns a compact rating label for ultra-narrow mobile viewports (<= 340px)
 */
function getCompactRatingLabel(label: string): string {
  if (!label) return "";
  if (label === "Popular Choice") return "Popular";
  if (label.endsWith(" Choice")) return label.replace(/\s+Choice$/, "");
  return label;
}

function parseJsonImageArray(raw: any): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.filter((img) => typeof img === "string" && img.trim().length > 0);
  }
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (!trimmed || trimmed === "[]") return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.filter((img) => typeof img === "string" && img.trim().length > 0);
      }
    } catch {
      return [];
    }
  }
  return [];
}

export default function CakeDetailClient({
  cake,
  relatedCakes = [],
  settings,
  whatsappSetting,
}: CakeDetailClientProps) {
  // Normalized brand identity
  const brandData = getCleanBrandData({
    restaurantName: settings?.restaurantName,
    tagline: settings?.tagline,
    logo: settings?.logo,
  });

  // Prices and selected weight
  const sortedPrices = [...(cake.prices || [])].sort((a, b) => (a.price ?? 999999) - (b.price ?? 999999));
  const defaultIndex = sortedPrices.findIndex((p) => p.isDefault);
  const [selectedWeightIndex, setSelectedWeightIndex] = useState<number>(
    defaultIndex !== -1 ? defaultIndex : 0
  );

  const activePriceObj = sortedPrices[selectedWeightIndex] || {
    weight: "1 kg",
    price: 1399,
  };

  const isPhotoCake = cake.slug === "custom-bespoke-photo-cake";

  // Weight-Specific Active Tier Gallery Logic
  // Priority:
  // 1. activePriceObj.images if array.length > 0
  // 2. activePriceObj.image if valid
  // 3. general Cake gallery (cake.images)
  // 4. coverImage (cake.coverImage)
  // 5. standard fallback image (FALLBACK_IMAGE)
  const tierGallery = parseJsonImageArray(activePriceObj?.images);
  const tierLegacyImage = activePriceObj?.image ? [activePriceObj.image] : [];
  const generalGallery = parseJsonImageArray(cake.images);
  const generalCover = cake.coverImage ? [cake.coverImage] : [];

  let rawActiveGallery: string[] = [];
  let isTierSpecificGallery = false;

  if (tierGallery.length > 0) {
    rawActiveGallery = tierGallery;
    isTierSpecificGallery = true;
  } else if (tierLegacyImage.length > 0) {
    rawActiveGallery = tierLegacyImage;
    isTierSpecificGallery = true;
  } else if (generalGallery.length > 0) {
    rawActiveGallery = generalGallery;
  } else if (generalCover.length > 0) {
    rawActiveGallery = generalCover;
  } else {
    rawActiveGallery = [FALLBACK_IMAGE];
  }

  // Deduplicate only inside the currently active gallery
  const activeGallery = Array.from(new Set(rawActiveGallery)).filter(Boolean);

  // Manual hero image selection within active gallery
  const [selectedHeroImage, setSelectedHeroImage] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState<string>("");
  const [occasionParam, setOccasionParam] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search).get("occasion");
      if (p && p.trim()) {
        setOccasionParam(p.trim());
      }
    }
  }, []);

  // Favorites — persistent localStorage hook
  const { isFavorite, toggleFavorite } = useCakeFavorite(cake.id);

  // Active hero image (resets to activeGallery[0] unless selectedHeroImage is within activeGallery)
  const currentHeroRaw =
    selectedHeroImage && activeGallery.includes(selectedHeroImage)
      ? selectedHeroImage
      : activeGallery[0] || FALLBACK_IMAGE;

  const activeHeroImage = getCleanOriginalCakeImageUrl(currentHeroRaw) || FALLBACK_IMAGE;
  const currentHeroIndex = activeGallery.indexOf(currentHeroRaw);
  const displayIndex = currentHeroIndex !== -1 ? currentHeroIndex : 0;

  const restaurantName = brandData.title || settings?.restaurantName || DEFAULT_BRAND_NAME;
  const whatsappNumber = whatsappSetting?.whatsappNumber || settings?.whatsapp || "919876543210";
  const phoneNumber = whatsappSetting?.callNumber || settings?.phone || "+91 98765 43210";

  // Selected weight photo logic:
  // 1. activePriceObj weight-specific gallery (tierGallery[0])
  // 2. activePriceObj.image (weight-specific image)
  // 3. cake.coverImage
  // 4. generalGallery[0]
  const rawSelectedPhoto =
    tierGallery[0] ||
    (activePriceObj?.image && typeof activePriceObj.image === "string" && activePriceObj.image.trim()) ||
    (cake.coverImage && typeof cake.coverImage === "string" && cake.coverImage.trim()) ||
    generalGallery[0] ||
    null;

  const selectedPhotoUrl =
    rawSelectedPhoto
      ? (rawSelectedPhoto.startsWith("/")
          ? `https://ramansweetbakery.vercel.app${rawSelectedPhoto}`
          : rawSelectedPhoto)
      : null;

  const resolvedOccasion =
    occasionParam ||
    cake.occasionName ||
    cake.occasion?.name ||
    (typeof cake.occasion === "string" ? cake.occasion : null) ||
    cake.occasions?.[0]?.occasion?.name ||
    null;

  const isLargeCake =
    cake.category?.slug === "large-celebration-cakes" ||
    Boolean(cake.isCustomQuote) ||
    Boolean(activePriceObj.isCustomQuote);
  const isCustomQuoteTier = Boolean(
    activePriceObj.isCustomQuote ||
    activePriceObj.price == null ||
    cake.isCustomQuote
  );

  const waLink = generateWhatsAppLink({
    cakeName: cake.name,
    slug: cake.slug,
    weight: activePriceObj.weight,
    price: isCustomQuoteTier ? "Custom Quote" : activePriceObj.price,
    restaurantName,
    template: whatsappSetting?.defaultMessageTemplate,
    whatsappNumber,
    customMessage,
    customizationInfo: cake.customizationInfo || null,
    occasion: resolvedOccasion,
    imageUrl: selectedPhotoUrl,
    cakeUrl: cake.slug ? `https://ramansweetbakery.vercel.app/menu/cake/${encodeURIComponent(cake.slug.trim())}` : undefined,
    isCustomQuote: isCustomQuoteTier,
    isLargeCake,
  });

  const customCakeWaLink = `https://wa.me/${normalizeWhatsAppNumber(whatsappNumber)}?text=${encodeURIComponent(
    `Hello ${restaurantName},\n\n🎂 I would like to enquire about a *Custom Cake* design.\n\nPlease let me know how I can share my reference photo and requirements.`
  )}`;

  // Serving guide — reacts dynamically to weight selection
  const servingGuide = getServingGuide(activePriceObj.weight);

  // Discount calculation
  const hasDiscount =
    !isCustomQuoteTier &&
    activePriceObj.originalPrice !== null &&
    activePriceObj.originalPrice !== undefined &&
    activePriceObj.price !== null &&
    activePriceObj.price !== undefined &&
    activePriceObj.originalPrice > activePriceObj.price;

  const discountPercent = hasDiscount
    ? Math.round((1 - (activePriceObj.price ?? 0) / activePriceObj.originalPrice!) * 100)
    : null;

  // Dynamically generated authentic highlights from real cake data
  const highlights = [
    `Rich ${cake.name.toLowerCase().includes("chocolate") ? "Belgian chocolate ganache" : "artisan gourmet filling"}`,
    "Soft and moist chocolate sponge, 100% eggless",
    "Perfect for celebrations and luxury gifting",
    `Available in ${sortedPrices.map((p) => p.weight).join(", ")} sizes`,
    "Prepared fresh with premium confectionery ingredients",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0908] text-[#FBF7EE] selection:bg-[#D4AF37] selection:text-[#0A0907] overflow-x-clip font-sans">
      
      {/* ====================================================
          1. COMPACT LUXURY HEADER (60-65px)
          [ < Back to Menu ]        [ Raman's CAKES & MORE ]        [ ♥ ]
          ==================================================== */}
      {/* ====================================================
          1. COMPACT LUXURY HEADER (50-52px matching reference)
          [ < Back to Menu ]        [ Raman's CAKES & MORE ]        [ ♥ ]
          ==================================================== */}
      <header className="sticky top-0 z-40 bg-[#0A0908] border-b border-white/[0.06] px-3 sm:px-4 h-[52px] sm:h-[58px] flex items-center">
        <div className="relative w-full max-w-5xl mx-auto flex items-center justify-between">
          {/* Left: Back to Menu with Chevron */}
          <Link
            href="/menu"
            className="z-10 flex items-center gap-1 text-xs sm:text-sm font-medium text-zinc-200 hover:text-white transition-colors shrink-0"
            aria-label="Back to Menu"
          >
            <ChevronRight className="h-4 w-4 rotate-180 text-zinc-300" />
            <span>Back to Menu</span>
          </Link>

          {/* Center: Brand Identity (Chef Hat + "Raman" in script font) */}
          <Link
            href="/menu"
            className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center text-center group"
          >
            {/* Chef Hat with curved bottom arc matching reference logo */}
            <svg
              className="h-4 w-4 sm:h-[18px] sm:w-[18px] text-[#E5C378] group-hover:scale-105 transition-transform"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 13.5V15a0.8 0.8 0 0 0 0.8 0.8h10.4a0.8 0.8 0 0 0 0.8-0.8v-1.5" />
              <path d="M7.5 17.8a9 9 0 0 0 9 0" />
              <path d="M6 13.5A3.8 3.8 0 0 1 3.5 10a3.8 3.8 0 0 1 4.5-3.8 4.2 4.2 0 0 1 8 0 3.8 3.8 0 0 1 4.5 3.8 3.8 3.8 0 0 1-2.5 3.5" />
            </svg>
            <span className="font-script text-[22px] sm:text-[25px] text-[#F3E5CA] leading-none -mt-0.5 tracking-wide group-hover:text-white transition-colors">
              Raman
            </span>
          </Link>

          {/* Right: Circular Favorite Heart */}
          <button
            type="button"
            onClick={toggleFavorite}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            className="z-10 flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#1A1510] text-[#A89F91] transition-all active:scale-95 hover:border-rose-500/40 hover:text-rose-400"
          >
            <Heart className={`h-4 w-4 transition-transform duration-200 ${isFavorite ? "fill-[#E53935] text-[#E53935] scale-110" : "text-zinc-400"}`} />
          </button>
        </div>
      </header>

      {/* ====================================================
          MAIN CONTENT AREA
          A) Hero + Gallery: Nearly full-width (6-8px margin)
          B) Text Content: Comfortable 16px horizontal padding
          Desktop: 2-column editorial composition
          ==================================================== */}
      <main className="flex-1 pt-2 pb-12 md:pt-6 md:pb-16">
        <div className="mx-auto max-w-5xl md:px-6">
          
          <div className="grid grid-cols-1 md:grid-cols-12 md:gap-10 lg:gap-12 items-start">
            
            {/* ====================================================
                LEFT COLUMN / MOBILE HERO + THUMBNAILS
                Full-width edge-to-edge on mobile (0px outer margin, 0px gap between frames)
                ==================================================== */}
            <div className="md:col-span-6 px-0 md:px-0 space-y-0 md:space-y-3 md:sticky md:top-20">
              
              {/* 2. Dominant Hero Cake Image - Exact Reference Frame Ratio (1.37:1 = aspect-[63/46]) */}
              <div className="relative w-full aspect-[63/46] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0E0C0A]">
                <Image
                  key={activeHeroImage}
                  src={activeHeroImage}
                  alt={`${cake.name} - ${activePriceObj.weight}`}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  className="object-cover object-center transition-opacity duration-300"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (target.src !== FALLBACK_IMAGE) target.src = FALLBACK_IMAGE;
                  }}
                />

                {/* Top-Left Inside Badge: Bestseller / Signature / New */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-lg bg-[#E5A93C] px-2.5 py-1 text-xs font-semibold text-[#181005] shadow-sm pointer-events-none z-10">
                  <Crown className="h-3.5 w-3.5 stroke-[2.2] text-[#181005]" />
                  <span>{cake.bestseller ? "Bestseller" : cake.featured ? "Signature" : cake.isNew ? "New" : "Bestseller"}</span>
                </div>

                {/* Bottom-Right Image Pagination Counter: "1 / 5" */}
                {activeGallery.length > 1 && (
                  <div className="absolute bottom-2.5 right-2.5 rounded-full bg-black/60 border border-white/10 px-2 py-0.5 text-xs font-medium text-white/90 backdrop-blur-md pointer-events-none z-10">
                    {displayIndex + 1} / {activeGallery.length}
                  </div>
                )}
              </div>

              {/* 3. Ultra-Luxury Confectionery Thumbnail Gallery (Mobile: Curved Top Edge, Desktop: Fully Transparent / Borderless) */}
              {activeGallery.length > 1 && (
                <div className="px-0">
                  <div className="relative overflow-hidden rounded-t-[18px] border-t border-white/[0.08] bg-transparent px-1 pt-1.5 pb-0.5 md:border-t-0 md:rounded-none md:p-0 md:bg-transparent">
                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-none px-0.5 md:px-0">
                      {activeGallery.slice(0, 5).map((imgUrl, idx) => {
                        const thumbImg = getCleanOriginalCakeImageUrl(imgUrl) || FALLBACK_IMAGE;
                        const isCurrent = currentHeroRaw === imgUrl;
                        const isLastSlot = idx === 4 && activeGallery.length > 5;
                        const overflowCount = activeGallery.length - 4;

                        return (
                          <button
                            key={`${imgUrl}-${idx}`}
                            type="button"
                            onClick={() => setSelectedHeroImage(imgUrl)}
                            aria-label={`View photo ${idx + 1}`}
                            className={`relative aspect-square h-[52px] w-[52px] shrink-0 rounded-xl overflow-hidden transition-all duration-150 active:scale-95 ${
                              isCurrent
                                ? "border-2 border-[#D4AF37]"
                                : "border border-white/15 opacity-75 hover:opacity-100"
                            }`}
                          >
                            <Image
                              src={thumbImg}
                              alt={`${cake.name} - ${activePriceObj.weight} thumbnail ${idx + 1}`}
                              fill
                              sizes="52px"
                              className="object-cover object-center"
                              onError={(e) => {
                                const target = e.currentTarget as HTMLImageElement;
                                if (target.src !== FALLBACK_IMAGE) target.src = FALLBACK_IMAGE;
                              }}
                            />
                            {/* +N badge if more than 4 images */}
                            {isLastSlot && (
                              <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center font-price text-sm font-bold text-[#D4AF37]">
                                +{overflowCount}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ====================================================
                RIGHT COLUMN / MOBILE TEXT CONTENT
                Comfortable 14-16px horizontal padding, tight vertical rhythm matching reference
                ==================================================== */}
            <div className="md:col-span-6 px-3.5 sm:px-4 md:px-0 space-y-2 text-left mt-1.5 md:mt-0">
              
              {/* 4. Prominent Editorial Cake Title */}
              <div>
                <h1 className="font-sans text-[22px] sm:text-2xl font-extrabold text-[#F8F2E6] leading-tight tracking-tight">
                  {cake.name}
                </h1>
                
                {/* 5. Concise Readable Description */}
                {cake.description && (
                  <p className="text-xs sm:text-[13px] text-[#A89F91] leading-relaxed font-light mt-1 line-clamp-3">
                    {cake.description}
                  </p>
                )}
              </div>

              {/* 6. Trust Badges (Compact 3-column row matching Reference) */}
              <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                {/* 100% Eggless */}
                <div className="flex items-center justify-center gap-1.5 rounded-lg border border-[#2B231A] bg-[#16130F] py-1 px-1 text-center">
                  <Leaf className="h-3 w-3 text-emerald-400 shrink-0" />
                  <span className="text-[10px] sm:text-[10.5px] font-medium text-[#D8D0C5] truncate">100% Eggless</span>
                </div>

                {/* Pure Vegetarian */}
                <div className="flex items-center justify-center gap-1.5 rounded-lg border border-[#2B231A] bg-[#16130F] py-1 px-1 text-center">
                  <span className="flex h-2.5 w-2.5 shrink-0 items-center justify-center rounded-[2px] border-[1.5px] border-emerald-500 p-[1px]">
                    <span className="h-1 w-1 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-[10px] sm:text-[10.5px] font-medium text-[#D8D0C5] truncate">Pure Vegetarian</span>
                </div>

                {/* Freshly Baked */}
                <div className="flex items-center justify-center gap-1.5 rounded-lg border border-[#2B231A] bg-[#16130F] py-1 px-1 text-center">
                  <ChefHat className="h-3 w-3 text-[#D4AF37] stroke-[1.8] shrink-0" />
                  <span className="text-[10px] sm:text-[10.5px] font-medium text-[#D8D0C5] truncate">Freshly Baked</span>
                </div>
              </div>

              {/* 7. Price & Rating Row */}
              <div className="price-rating-row flex items-baseline justify-between pt-1">
                {/* Price Display */}
                <div>
                  {isCustomQuoteTier ? (
                    <div className="flex items-baseline gap-2.5 leading-none">
                      <span className="font-price text-2xl sm:text-3xl font-extrabold text-[#F5E29D] tracking-tight leading-none">
                        Custom Quote
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-2.5 leading-none">
                      <span className="font-price text-2xl sm:text-3xl font-extrabold text-[#F5E29D] tracking-tight leading-none">
                        ₹{(activePriceObj.price ?? 0).toLocaleString("en-IN")}
                      </span>
                      {hasDiscount && (
                        <span className="font-price text-xs sm:text-sm text-zinc-400/85 line-through font-normal">
                          ₹{activePriceObj.originalPrice!.toLocaleString("en-IN")}
                        </span>
                      )}
                      {discountPercent && (
                        <span className="font-sans inline-flex items-center justify-center h-[24px] px-1.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 tracking-wide uppercase whitespace-nowrap leading-none align-middle">
                          {discountPercent}% OFF
                        </span>
                      )}
                    </div>
                  )}
                  <span className="block font-sans text-xs text-[#A89F91] mt-1 font-normal">
                    for&nbsp;<span className="font-medium text-zinc-300">{activePriceObj.weight.replace(/(\d+)\s*(kg|g|gm)/i, "$1 $2")}</span>
                    {servingGuide && (
                      <>
                        <span className="mx-1.5 text-zinc-500">•</span>
                        <span className="text-[#E5C365] font-medium">{servingGuide}</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Display Rating & Editorial Label */}
                {cake.displayRating ? (
                  <div className="rating-display-block text-right shrink-0 pl-3">
                    <div className="flex items-center justify-end gap-1.5 text-xs text-[#F8F2E6] font-semibold whitespace-nowrap">
                      <span className="text-[#D4AF37]">★</span>
                      <span>{Number(cake.displayRating).toFixed(1)}</span>
                      {cake.ratingLabel ? (
                        <>
                          <span className="text-[#8C8275] text-[10px]">·</span>
                          <span className="text-[#E5C365] font-medium text-[11px] sm:text-xs">
                            {getCompactRatingLabel(cake.ratingLabel) !== cake.ratingLabel ? (
                              <>
                                <span className="rating-label-compact">
                                  {getCompactRatingLabel(cake.ratingLabel)}
                                </span>
                                <span className="rating-label-full">
                                  {cake.ratingLabel}
                                </span>
                              </>
                            ) : (
                              cake.ratingLabel
                            )}
                          </span>
                        </>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>

              {/* 8. Weight Selector */}
              <div className="space-y-1.5 pt-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-[#F8F2E6]">
                    Select Weight
                  </span>
                </div>

                {/* Weight Cards Grid matching reference */}
                <div className={`grid gap-1.5 sm:gap-2 ${sortedPrices.length <= 3 ? "grid-cols-3" : "grid-cols-4"}`}>
                  {sortedPrices.map((tier, idx) => {
                    const isSelected = selectedWeightIndex === idx;

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedWeightIndex(idx);
                          setSelectedHeroImage(null);
                        }}
                        className={`flex flex-col items-center justify-center rounded-xl py-1.5 px-1 text-center transition-all active:scale-95 ${
                          isSelected
                            ? "border-2 border-[#D4AF37] bg-[#1C1813] text-[#F8F2E6] shadow-[0_0_10px_rgba(212,175,55,0.2)]"
                            : "border border-white/10 bg-[#12100E] text-[#D4CBBF] hover:border-white/20 hover:bg-[#161411]"
                        }`}
                      >
                        <span className="text-[11px] sm:text-xs font-semibold">
                          {tier.weight.replace(/(\d+)\s*(kg|g)/i, "$1 $2")}
                        </span>
                        <span className={`mt-0.5 font-price text-[11px] sm:text-xs font-bold ${isSelected ? "text-[#F5E29D]" : "text-[#F8F2E6]"}`}>
                          {tier.isCustomQuote || tier.price == null ? "Quote" : `₹${tier.price.toLocaleString("en-IN")}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

                {/* Custom Message on Cake (Positioned immediately above What You Get) */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <label htmlFor="cake-custom-message" className="text-xs font-semibold text-[#D4CBBF]">
                      Name / Message on Cake <span className="text-[#8C8275] font-normal">(Optional)</span>
                    </label>
                    <span className="text-[10px] text-[#D4AF37]">✦ Free Custom Message</span>
                  </div>
                  <input
                    id="cake-custom-message"
                    name="customMessage"
                    type="text"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="e.g. Happy Birthday Riya"
                    maxLength={60}
                    className="w-full rounded-xl border border-white/10 bg-[#14120F] px-3.5 py-2 text-xs text-[#F8F2E6] placeholder-[#6C6356] focus:border-[#D4AF37] focus:outline-none transition-colors"
                  />
                </div>

                {/* 9. What You Get (Compact Customer Assurance Checklist) */}
                <div className="rounded-xl border border-[#D4AF37]/25 bg-[#14120E] p-2.5 sm:p-3 space-y-1.5">
                  <h4 className="text-[10.5px] sm:text-[11.5px] font-bold uppercase tracking-wider text-[#E5C365]">
                    What You Get
                  </h4>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[11px] sm:text-xs text-[#E8DFC8]">
                    <div className="flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">100% Eggless Cake</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{activePriceObj.weight.replace(/(\d+)\s*(kg|g|gm)/i, "$1 $2")} Weight</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">Cake Decoration</span>
                    </div>
                    {Boolean(cake.customizationInfo) && (
                      <div className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">Custom Message*</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 10. Primary WhatsApp CTA Button */}
                <div className="pt-1.5">
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between rounded-xl bg-[#25D366] hover:bg-[#20ba59] py-2.5 px-3.5 text-white shadow-[0_4px_16px_rgba(37,211,102,0.3)] transition-all active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white shrink-0">
                        {isPhotoCake ? (
                          <span className="text-base leading-none">📸</span>
                        ) : (
                          <WhatsAppIcon className="h-4.5 w-4.5 text-white" />
                        )}
                      </span>
                      <div className="text-left">
                        <span className="block text-xs sm:text-sm font-bold leading-tight">
                          {isPhotoCake
                            ? "📸 Send Your Photo"
                            : isCustomQuoteTier || isLargeCake
                            ? "Enquire on WhatsApp"
                            : "Order on WhatsApp"}
                        </span>
                        <span className="text-[10px] text-white/90 font-medium">
                          {isPhotoCake
                            ? "Share your photo on WhatsApp"
                            : isCustomQuoteTier
                            ? "Custom design & pricing enquiry"
                            : "Quick enquiry • No payment needed"}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-white shrink-0" />
                  </a>
                </div>

              {/* 10. Screen 2 Editorial Details: Feature Badges, Highlights, Ingredients */}
              <div id="details" className="pt-4 border-t border-white/[0.08] space-y-4">
                
                {/* Screen 2 Top 3 Features (Matching Reference Screen 2) */}
                <div className="grid grid-cols-3 gap-2 rounded-xl border border-white/10 bg-[#16130F] p-3 text-center">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <Leaf className="h-5 w-5 text-[#D4AF37]" />
                    <span className="text-[10px] font-semibold text-[#F8F2E6] leading-tight">100% Eggless<br/><span className="text-[#A89F91] font-normal">Pure Veg</span></span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1 border-x border-white/[0.08] px-1">
                    <ChefHat className="h-5 w-5 text-[#D4AF37]" />
                    <span className="text-[10px] font-semibold text-[#F8F2E6] leading-tight">Freshly Baked<br/><span className="text-[#A89F91] font-normal">to Order</span></span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1">
                    <Crown className="h-5 w-5 text-[#D4AF37]" />
                    <span className="text-[10px] font-semibold text-[#F8F2E6] leading-tight">Premium<br/><span className="text-[#A89F91] font-normal">Ingredients</span></span>
                  </div>
                </div>

                {/* Cake Highlights Card (Matching Reference Screen 2) */}
                <div className="rounded-xl border border-white/10 bg-[#14120F] p-3.5 space-y-2">
                  <h4 className="font-sans text-sm font-bold text-[#F8F2E6]">
                    Cake Highlights
                  </h4>
                  <ul className="space-y-1.5">
                    {highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-[#C8BFB2]">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-[9px] mt-0.5">
                          ✓
                        </span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Ingredients */}
                <div className="rounded-xl border border-white/10 bg-[#14120F] p-3.5 space-y-1.5">
                  <div className="flex items-center gap-2 text-[#D4AF37]">
                    <UtensilsCrossed className="h-4 w-4 text-[#D4AF37]" />
                    <h4 className="font-sans text-sm font-bold text-[#F8F2E6]">
                      Ingredients
                    </h4>
                  </div>
                  <p className="text-xs text-[#B8AEA0] leading-relaxed font-light">
                    {cake.ingredients || "Belgian chocolate, refined wheat flour, sugar, unsalted butter, fresh cream, cocoa, milk, baking ingredients and love."}
                  </p>
                </div>

                {/* Editorial Quote Banner */}
                {cake.editorialQuote && cake.editorialQuote.trim() ? (
                  <div className="py-3 text-center">
                    <div className="text-xl font-serif text-[#D4AF37]/60 leading-none mb-1">“</div>
                    <p className="font-serif italic text-sm sm:text-base text-[#F8F2E6]/90 tracking-wide">
                      “{cake.editorialQuote.trim().replace(/^["“]+|["”]+$/g, "")}”
                    </p>
                    <div className="w-10 h-[1px] bg-[#D4AF37]/30 mx-auto mt-2.5" />
                  </div>
                ) : null}

                {/* Preparation & Storage */}
                {cake.preparationNotes && (
                  <div className="pt-3 border-t border-white/[0.06] space-y-1">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
                      Preparation &amp; Storage
                    </h4>
                    <p className="text-xs text-[#B8AEA0] leading-relaxed font-light">
                      {cake.preparationNotes}
                    </p>
                  </div>
                )}

                {/* Customization */}
                {cake.customizationInfo && (
                  <div className="pt-3 border-t border-white/[0.06] space-y-1">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
                      Customization
                    </h4>
                    <p className="text-xs text-[#B8AEA0] leading-relaxed font-light">
                      {cake.customizationInfo}
                    </p>
                  </div>
                )}
              </div>

              {/* 13. Related Cakes (Matching Reference Screen 2) */}
              {relatedCakes && relatedCakes.length > 0 && (
                <div className="pt-5 border-t border-white/[0.08] space-y-3 text-left mt-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-sans text-base sm:text-lg font-bold text-[#F8F2E6]">
                      Like this? Try these
                    </h3>
                    <Link href="/menu" className="flex items-center gap-1 text-xs font-semibold text-[#D4AF37] hover:underline">
                      <span>See All</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
                    {relatedCakes.slice(0, 3).map((rel) => {
                      const price = rel.prices?.[0]?.price || 799;
                      const isTestImage =
                        !rel.coverImage ||
                        rel.coverImage.includes("qa_test") ||
                        rel.coverImage.includes("1x1");
                      const relImage = isTestImage
                        ? FALLBACK_IMAGE
                        : getNormalizedCakeImageUrl(rel.coverImage) || FALLBACK_IMAGE;

                      return (
                        <Link
                          key={rel.id}
                          href={`/menu/cake/${rel.slug}`}
                          className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#12100E] p-2 sm:p-2.5 transition-all hover:border-[#D4AF37]/50"
                        >
                          <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#0A0908]">
                            <Image
                              src={relImage}
                              alt={rel.name}
                              fill
                              sizes="(max-width: 640px) 110px, 180px"
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                const target = e.currentTarget as HTMLImageElement;
                                if (target.src !== FALLBACK_IMAGE) target.src = FALLBACK_IMAGE;
                              }}
                            />
                            <span className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white/80">
                              <Heart className="h-3 w-3" />
                            </span>
                          </div>
                          <span className="mt-2 font-sans text-xs font-semibold text-[#F8F2E6] truncate group-hover:text-[#D4AF37] transition-colors">
                            {rel.name}
                          </span>
                          <span className="font-price text-[11px] text-[#D4AF37] font-semibold mt-0.5">
                            ₹{price.toLocaleString("en-IN")} onwards
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 14. Custom Cake Enquiry Banner */}
              <div className="pt-2">
                <a
                  href={customCakeWaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-2xl border border-white/[0.08] bg-[#14120F] p-4 transition-all hover:border-[#D4AF37]/40 active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3.5 text-left">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/25 text-xl">
                      🎁
                    </span>
                    <div>
                      <h4 className="font-sans text-sm sm:text-base font-bold text-[#F8F2E6]">
                        Looking for a custom cake?
                      </h4>
                      <p className="text-xs text-[#8C8275] mt-0.5 font-light">
                        Share your design idea on WhatsApp
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-[#D4AF37] shrink-0" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 18. Approved Global Footer */}
      <Footer
        restaurantName={restaurantName}
        tagline={settings?.tagline}
        logo={settings?.logo}
        phone={phoneNumber}
        whatsapp={whatsappNumber}
        address={settings?.address}
        openingHours={settings?.openingHours}
        instagram={settings?.instagram}
        facebook={settings?.facebook}
        footerText={settings?.footerText}
      />
    </div>
  );
}
