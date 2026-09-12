"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { ActiveOccasionResult } from "@/lib/festivals/occasionEngine";
import FestivalOrnament from "@/components/customer/FestivalOrnament";

interface OccasionShowcaseProps {
  occasionData?: ActiveOccasionResult | null;
  defaultSettings?: any;
}

export interface FestivalMeta {
  banner: string;
  mobileBanner: string;
  subtitle: string;
  motifType: string;
  isLight?: boolean;
}

interface ShowcaseSlide {
  id: string;
  slug: string;
  title: string;
  rawName: string;
  subtitle: string;
  bannerAsset: string;
  mobileBannerAsset: string;
  motifType: string;
  isLight: boolean;
  href: string;
  buttonLabel: string;
  hasBakedInText: boolean;
}

/* Master list of pre-designed artwork assets that have calligraphy, ornaments, and buttons already baked into the image */
const BAKED_IN_TEXT_PRESETS = [
  "ganesh-chaturthi-banner",
  "diwali-banner",
  "christmas-banner",
  "new-year-banner",
  "valentines-day-banner",
  "valentine-day-banner",
  "holi-banner",
  "raksha-bandhan-banner",
  "eid-mubarak-banner",
  "navratri-banner",
  "makar-sankranti-banner",
  "media_1789038038168",
];

export function checkHasBakedInText(bannerUrl?: string | null, badgeText?: string | null): boolean {
  if (!bannerUrl) return false;
  const url = bannerUrl.toLowerCase();
  if (badgeText === "__NO_TEXT__") return true;
  if (url.includes("#text=true") || url.includes("#overlay=true")) return false;
  if (
    url.includes("#notext") ||
    url.includes("notext=true") ||
    url.includes("text=false") ||
    url.includes("overlay=false") ||
    url.includes("baked=true")
  ) {
    return true;
  }
  if (url.includes("generic") || url.includes("plain")) {
    return false;
  }
  return BAKED_IN_TEXT_PRESETS.some((preset) => url.includes(preset));
}

/**
 * ImageKit responsive URL transformer (Zero-Crop / Native-Ratio Locked)
 * Applies only responsive width, quality, and format auto-negotiation (WebP/AVIF).
 * NEVER applies crop, aspect-ratio, resize-and-crop, c-at_*, or ar-*.
 */
export function getOptimizedBannerUrl(url?: string | null, width: number = 1400): string {
  if (!url || typeof url !== "string") return "";
  if (url.includes("ik.imagekit.io")) {
    const [baseUrl, hash] = url.split("#");
    const hashPart = hash ? `#${hash}` : "";
    if (baseUrl.includes("tr=")) {
      return url;
    }
    const separator = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${separator}tr=w-${width},q-80,f-auto${hashPart}`;
  }
  return url;
}

function CornerFlourish({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const rotation = {
    tl: "",
    tr: "rotate-90",
    br: "rotate-180",
    bl: "-rotate-90",
  }[position];

  return (
    <svg
      viewBox="0 0 40 40"
      className={`absolute w-4 h-4 xs:w-5 xs:h-5 sm:w-8 sm:h-8 text-[#D4AF37]/80 ${rotation} ${
        position.includes("t") ? "top-1 sm:top-2" : "bottom-1 sm:bottom-2"
      } ${
        position.includes("l") ? "left-1 sm:left-2" : "right-1 sm:right-2"
      } pointer-events-none`}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 2 C 14 2, 22 10, 22 22 M2 2 C 2 14, 10 22, 22 22 M5 5 L 14 14"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="2" cy="2" r="1.5" fill="currentColor" />
      <circle cx="22" cy="22" r="1.5" fill="currentColor" />
    </svg>
  );
}

function MandalaGlow() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-30"
    >
      <div className="w-40 h-40 sm:w-72 sm:h-72 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.35)_0%,transparent_70%)] blur-xl" />
    </div>
  );
}

export const FESTIVAL_CONFIG: Record<string, FestivalMeta> = {
  "ganesh-chaturthi": {
    banner: "/images/festivals/ganesh-chaturthi-banner.jpg",
    mobileBanner: "/images/festivals/mobile/ganesh-chaturthi-mobile.jpg",
    subtitle: "FESTIVE SPECIAL",
    motifType: "lotus",
  },
  "diwali": {
    banner: "/images/festivals/diwali-banner.jpg",
    mobileBanner: "/images/festivals/mobile/diwali-mobile.jpg",
    subtitle: "SWEETEN THE CELEBRATION",
    motifType: "diya",
  },
  "christmas": {
    banner: "/images/festivals/christmas-banner.jpg",
    mobileBanner: "/images/festivals/mobile/christmas-mobile.jpg",
    subtitle: "CAKES FOR A BRIGHTER TOMORROW",
    motifType: "tree",
  },
  "new-year": {
    banner: "/images/festivals/new-year-banner.jpg",
    mobileBanner: "/images/festivals/mobile/new-year-mobile.jpg",
    subtitle: "NEW MOMENTS • SWEETER DAYS",
    motifType: "starburst",
  },
  "valentines-day": {
    banner: "/images/festivals/valentines-day-banner.jpg",
    mobileBanner: "/images/festivals/mobile/valentines-day-mobile.jpg",
    subtitle: "CELEBRATE LOVE",
    motifType: "heart",
  },
  "valentine-day": {
    banner: "/images/festivals/valentines-day-banner.jpg",
    mobileBanner: "/images/festivals/mobile/valentines-day-mobile.jpg",
    subtitle: "CELEBRATE LOVE",
    motifType: "heart",
  },
  "holi": {
    banner: "/images/festivals/holi-banner.jpg",
    mobileBanner: "/images/festivals/mobile/holi-mobile.jpg",
    subtitle: "SWEETEN THE COLORS",
    motifType: "mandala",
  },
  "raksha-bandhan": {
    banner: "/images/festivals/raksha-bandhan-banner.jpg",
    mobileBanner: "/images/festivals/mobile/raksha-bandhan-mobile.jpg",
    subtitle: "A SWEETER BOND",
    motifType: "rakhi",
  },
  "eid-mubarak": {
    banner: "/images/festivals/eid-mubarak-banner.jpg",
    mobileBanner: "/images/festivals/mobile/eid-mubarak-mobile.jpg",
    subtitle: "SHARE SWEET BLESSINGS",
    motifType: "crescent",
  },
  "eid": {
    banner: "/images/festivals/eid-mubarak-banner.jpg",
    mobileBanner: "/images/festivals/mobile/eid-mubarak-mobile.jpg",
    subtitle: "SHARE SWEET BLESSINGS",
    motifType: "crescent",
  },
  "eid-al-adha": {
    banner: "/images/festivals/eid-mubarak-banner.jpg",
    mobileBanner: "/images/festivals/mobile/eid-mubarak-mobile.jpg",
    subtitle: "SHARE SWEET BLESSINGS",
    motifType: "crescent",
  },
  "navratri": {
    banner: "/images/festivals/navratri-banner.jpg",
    mobileBanner: "/images/festivals/mobile/navratri-mobile.jpg",
    subtitle: "NINE NIGHTS OF JOY",
    motifType: "dandiya",
  },
  "dussehra": {
    banner: "/images/festivals/navratri-banner.jpg",
    mobileBanner: "/images/festivals/mobile/navratri-mobile.jpg",
    subtitle: "NINE NIGHTS OF JOY",
    motifType: "dandiya",
  },
  "makar-sankranti": {
    banner: "/images/festivals/makar-sankranti-banner.jpg",
    mobileBanner: "/images/festivals/mobile/makar-sankranti-mobile.jpg",
    subtitle: "SWEETEN NEW BEGINNINGS",
    motifType: "sunburst",
    isLight: true,
  },
};

const GENERIC_FALLBACK_BANNER = "/images/festivals/generic-luxury-banner.jpg";
const GENERIC_FALLBACK_MOBILE_BANNER = "/images/festivals/mobile/generic-luxury-mobile.jpg";


export default function OccasionShowcase({
  occasionData,
  defaultSettings,
}: OccasionShowcaseProps) {
  // Construct list of active slides
  let slides: ShowcaseSlide[] = [];

  if (
    occasionData?.isMerged &&
    occasionData?.mergedOccasions &&
    occasionData.mergedOccasions.length > 1
  ) {
    // MULTI-FESTIVAL CAROUSEL MODE
    slides = occasionData.mergedOccasions.map((occ) => {
      const occSlug = (occ.slug || "").toLowerCase();
      let conf = FESTIVAL_CONFIG[occSlug];
      if (!conf) {
        for (const [key, value] of Object.entries(FESTIVAL_CONFIG)) {
          if (occSlug.includes(key) || key.includes(occSlug)) {
            conf = value;
            break;
          }
        }
      }

      let slideTitle = occ.name;
      if (/\s+Special$/i.test(slideTitle)) {
        slideTitle = slideTitle.replace(/\s+Special$/i, "").trim();
      }

      const banner = occ.bannerImage?.trim() || (conf ? conf.banner : GENERIC_FALLBACK_BANNER);
      const mobileBanner = occ.bannerImage?.trim()
        ? occ.bannerImage.trim()
        : (conf ? conf.mobileBanner : GENERIC_FALLBACK_MOBILE_BANNER);
      const sub = conf ? conf.subtitle : (occ.badgeText || "FESTIVE SPECIAL");
      const motif = conf ? conf.motifType : "default";
      const hasBakedIn = checkHasBakedInText(banner, occ.badgeText);

      return {
        id: occ.id,
        slug: occSlug,
        title: slideTitle,
        rawName: occ.name,
        subtitle: sub,
        bannerAsset: banner,
        mobileBannerAsset: mobileBanner,
        motifType: motif,
        isLight: Boolean(conf?.isLight),
        href: `/menu/occasion/${occSlug}`,
        buttonLabel: "View Cakes",
        hasBakedInText: hasBakedIn,
      };
    });
  } else if (occasionData?.occasion) {
    // SINGLE FESTIVAL MODE
    const occSlug = (occasionData.occasion.slug || "").toLowerCase();
    let conf = FESTIVAL_CONFIG[occSlug];
    if (!conf) {
      for (const [key, value] of Object.entries(FESTIVAL_CONFIG)) {
        if (occSlug.includes(key) || key.includes(occSlug)) {
          conf = value;
          break;
        }
      }
    }

    let slideTitle = occasionData.occasion.name.trim();
    if (/\s+Special$/i.test(slideTitle)) {
      slideTitle = slideTitle.replace(/\s+Special$/i, "").trim();
    }

    const banner =
      occasionData.occasion.bannerImage?.trim() ||
      (conf ? conf.banner : GENERIC_FALLBACK_BANNER);
    const mobileBanner = occasionData.occasion.bannerImage?.trim()
      ? occasionData.occasion.bannerImage.trim()
      : (conf ? conf.mobileBanner : GENERIC_FALLBACK_MOBILE_BANNER);
    const sub = conf ? conf.subtitle : "FESTIVE SPECIAL";
    const motif = conf ? conf.motifType : "default";
    const hasBakedIn = checkHasBakedInText(banner, occasionData.occasion.badgeText);

    slides = [
      {
        id: occasionData.occasion.id,
        slug: occSlug,
        title: slideTitle,
        rawName: occasionData.occasion.name.trim(),
        subtitle: sub,
        bannerAsset: banner,
        mobileBannerAsset: mobileBanner,
        motifType: motif,
        isLight: Boolean(conf?.isLight),
        href: `/menu/occasion/${occSlug}`,
        buttonLabel: "View Cakes",
        hasBakedInText: hasBakedIn,
      },
    ];
  } else {
    // YEAR-ROUND DEFAULT BANNER MODE
    const defaultBanner = defaultSettings?.heroImage?.trim() || GENERIC_FALLBACK_BANNER;
    const isNoText =
      defaultSettings?.heroTitle === "__NO_TEXT__" ||
      defaultSettings?.heroTitle === "" ||
      defaultBanner.includes("#notext") ||
      defaultBanner.includes("text=false") ||
      defaultBanner.includes("overlay=false") ||
      checkHasBakedInText(defaultBanner);

    slides = [
      {
        id: "default-showcase",
        slug: "default",
        title: isNoText ? "" : (defaultSettings?.heroTitle || "Raman Sweet Signature Collection"),
        rawName: isNoText ? "" : (defaultSettings?.heroTitle || "Raman Sweet Signature Collection"),
        subtitle: isNoText ? "" : (defaultSettings?.heroSubtitle || "100% EGGLESS • HANDCRAFTED ARTISANAL BAKES"),
        bannerAsset: defaultBanner,
        mobileBannerAsset: defaultSettings?.heroImage?.trim() || GENERIC_FALLBACK_MOBILE_BANNER,
        motifType: "starburst",
        isLight: false,
        href: "#category-navigation",
        buttonLabel: "Explore Cakes",
        hasBakedInText: isNoText,
      },
    ];
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance carousel every 5 seconds when multiple slides exist
  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  const activeIndex = currentIndex % slides.length;
  const currentSlide = slides[activeIndex] || slides[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <section
      className="w-full px-0 py-0"
      aria-label={`${currentSlide.rawName} festive showcase`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative w-full group/carousel">
        <Link
          href={currentSlide.href}
          prefetch={true}
          className="
            group
            relative
            block
            w-full
            overflow-hidden
            rounded-[14px]
            sm:rounded-[20px]
            border
            border-[#D4AF37]/80
            bg-[#0B0806]
            shadow-[0_4px_24px_rgba(212,175,55,0.22)]
            ring-1
            ring-inset
            ring-[#D4AF37]/25
            transition-all
            duration-300
            hover:border-[#E8C85A]
            hover:shadow-[0_8px_32px_rgba(212,175,55,0.35)]
            active:scale-[0.995]
          "
        >
          {/* SLIDES CONTAINER WITH NATURAL PROPORTION RENDERING (ZERO CROP) */}
          <div className="relative w-full">
            {slides.map((slide, idx) => {
              const isActive = idx === activeIndex;

              return (
                <div
                  key={slide.id}
                  className={`
                    ${idx === 0 ? "relative" : "absolute inset-0"}
                    transition-opacity
                    duration-700
                    ease-in-out
                    ${isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}
                  `}
                >
                  <picture className="w-full h-auto block">
                    <source
                      media="(max-width: 767px)"
                      srcSet={getOptimizedBannerUrl(slide.mobileBannerAsset || slide.bannerAsset, 750)}
                    />
                    <img
                      src={getOptimizedBannerUrl(slide.bannerAsset, 1400)}
                      alt={slide.rawName}
                      className="w-full h-auto block object-contain transition-transform duration-700 group-hover:scale-[1.01]"
                      loading={idx === 0 ? "eager" : "lazy"}
                    />
                  </picture>

                  {/* SMART HYBRID MODE: Render luxury HTML text & ornaments only if the banner does NOT have baked-in text */}
                  {!slide.hasBakedInText && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-3 py-1.5 sm:px-6 sm:py-3 text-center pointer-events-none">
                      {/* Sacred Aura Halo Glow */}
                      <MandalaGlow />

                      {/* 4 Corner Palace Flourishes */}
                      <CornerFlourish position="tl" />
                      <CornerFlourish position="tr" />
                      <CornerFlourish position="bl" />
                      <CornerFlourish position="br" />

                      {/* Top Festival Ornament */}
                      <div className="w-full flex justify-center mb-0.5 sm:mb-1">
                        <FestivalOrnament
                          festival={slide.slug}
                          position="top"
                          className="max-w-[120px] xs:max-w-[150px] sm:max-w-[240px] md:max-w-[300px]"
                        />
                      </div>

                      {/* 3D Metallic Gold Title */}
                      <h3 className="font-serif text-xs xs:text-sm sm:text-2xl md:text-3xl font-extrabold tracking-wider leading-tight text-transparent bg-clip-text bg-gradient-to-b from-[#FFFDF5] via-[#F7DE96] to-[#C99726] drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                        {slide.title}
                      </h3>

                      {/* Subtitle */}
                      <p className="mt-0.5 text-[7px] xs:text-[8px] sm:text-xs font-semibold tracking-[0.22em] text-[#E6C675] uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                        {slide.subtitle}
                      </p>

                      {/* Bottom Kundan Floral Divider */}
                      <div className="w-full flex justify-center mt-0.5 sm:mt-1">
                        <FestivalOrnament
                          festival={slide.slug}
                          position="bottom"
                          className="max-w-[120px] xs:max-w-[150px] sm:max-w-[240px] md:max-w-[300px]"
                        />
                      </div>

                      {/* Obsidian Glass "View Cakes" Pill CTA */}
                      <div className="mt-1 sm:mt-2.5 inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-0.5 sm:px-4 sm:py-1 rounded-full border border-[#D4AF37]/80 bg-black/65 backdrop-blur-sm text-[7px] xs:text-[8px] sm:text-xs font-bold text-[#F3D78A] shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                        <span>{slide.buttonLabel || "View Cakes"}</span>
                        <ArrowRight className="h-2 w-2 sm:h-3 sm:w-3 text-[#D4AF37]" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Link>

        {/* MULTI-FESTIVAL NAVIGATION CONTROLS (Displayed only when 2+ festivals are active) */}
        {slides.length > 1 && (
          <>
            {/* Left Chevron Button */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous Festival Banner"
              className="
                absolute
                left-2
                sm:left-3
                top-1/2
                -translate-y-1/2
                z-30
                flex
                h-7
                w-7
                sm:h-8
                sm:w-8
                items-center
                justify-center
                rounded-full
                border
                border-[#D4AF37]/50
                bg-black/60
                text-[#E6C675]
                backdrop-blur-sm
                shadow-[0_2px_10px_rgba(0,0,0,0.8)]
                transition-all
                duration-200
                hover:scale-110
                hover:border-[#D4AF37]
                hover:bg-black/90
                hover:text-white
                active:scale-95
              "
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Right Chevron Button */}
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next Festival Banner"
              className="
                absolute
                right-2
                sm:right-3
                top-1/2
                -translate-y-1/2
                z-30
                flex
                h-7
                w-7
                sm:h-8
                sm:w-8
                items-center
                justify-center
                rounded-full
                border
                border-[#D4AF37]/50
                bg-black/60
                text-[#E6C675]
                backdrop-blur-sm
                shadow-[0_2px_10px_rgba(0,0,0,0.8)]
                transition-all
                duration-200
                hover:scale-110
                hover:border-[#D4AF37]
                hover:bg-black/90
                hover:text-white
                active:scale-95
              "
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Bottom Gold Indicator Dots */}
            <div className="absolute bottom-1.5 sm:bottom-2.5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 pointer-events-auto">
              {slides.map((s, idx) => {
                const active = idx === activeIndex;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentIndex(idx);
                    }}
                    className={`
                      transition-all
                      duration-300
                      rounded-full
                      ${
                        active
                          ? "w-5 h-1 sm:h-1.5 bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.9)]"
                          : "w-1.5 h-1 sm:h-1.5 bg-white/40 hover:bg-white/70"
                      }
                    `}
                    aria-label={`Go to ${s.title} banner`}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}