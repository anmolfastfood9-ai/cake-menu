"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Leaf,
  Calendar,
  Clock,
  ChefHat,
  Heart,
} from "lucide-react";
import Navbar from "@/components/customer/Navbar";
import Footer from "@/components/customer/Footer";
import CakeCard, { CakeItem } from "@/components/customer/CakeCard";
import { DEFAULT_BRAND_NAME } from "@/components/customer/BrandIdentity";
import { FESTIVAL_CONFIG, checkHasBakedInText } from "@/components/customer/OccasionShowcase";
import FestivalOrnament from "@/components/customer/FestivalOrnament";

interface OccasionClientProps {
  occasion: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    badgeText?: string | null;
    bannerImage?: string | null;
    accentColor?: string | null;
    type?: string;
  };
  cakes: CakeItem[];
  occasionCategories?: any[];
  settings?: any;
  whatsappSetting?: any;
  occurrence?: {
    id: string;
    eventDate: string | Date;
    displayStart: string | Date;
    displayEnd: string | Date;
    year: number;
  } | null;
}

export default function OccasionClient({
  occasion,
  cakes,
  settings,
  whatsappSetting,
  occurrence,
}: OccasionClientProps) {
  const slug = (occasion.slug || "").toLowerCase();
  const festivalMeta = FESTIVAL_CONFIG[slug];

  const restaurantName = settings?.restaurantName || DEFAULT_BRAND_NAME;
  const whatsappNumber =
    whatsappSetting?.whatsappNumber || settings?.whatsapp || "919876543210";
  const phoneNumber =
    whatsappSetting?.callNumber || settings?.phone || "+91 98765 43210";

  // Clean banner URL without any hash params
  const rawBanner = occasion.bannerImage?.trim();
  const cleanBanner = rawBanner ? rawBanner.split("#")[0] : null;

  const bannerAsset =
    cleanBanner ||
    festivalMeta?.banner ||
    "/images/festivals/generic-luxury-banner.jpg";

  const mobileBannerAsset =
    cleanBanner ||
    festivalMeta?.mobileBanner ||
    festivalMeta?.banner ||
    "/images/festivals/generic-luxury-banner.jpg";

  // Strictly available cakes belonging to this occasion
  const occasionCakes = useMemo(() => {
    return (cakes || []).filter(
      (cake) =>
        cake &&
        cake.available &&
        (!cake.productType || cake.productType.toUpperCase() === "CAKE")
    );
  }, [cakes]);

  // Festival Subtitle & Description (Cakes Only)
  const festivalSubtitle =
    festivalMeta?.subtitle || "Sweeten Your Celebrations";

  const festivalDescription =
    occasion.description ||
    `A curated collection of handcrafted 100% eggless luxury cakes for ${occasion.name}.`;

  // Celebration Date
  const eventDateStr = occurrence?.eventDate
    ? new Date(occurrence.eventDate).toLocaleDateString("en-IN", {
        weekday: "short",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  // Primary Occasion Title (clean uppercase festival name / badge)
  const primaryOccasionHeading = useMemo(() => {
    if (occasion.badgeText) {
      const cleaned = occasion.badgeText.replace(/^[^\w\s]+/, "").trim();
      if (cleaned) return cleaned.toUpperCase();
    }
    const baseName = occasion.name.trim();
    if (baseName.toLowerCase().includes("special")) {
      return baseName.toUpperCase();
    }
    return `${baseName.toUpperCase()} SPECIAL`;
  }, [occasion.badgeText, occasion.name]);

  // Pass full rawBanner (with #overlay=true / #notext flags intact) or fallback to checkHasBakedInText
  const fullBannerForCheck =
    rawBanner ||
    festivalMeta?.banner ||
    "/images/festivals/generic-luxury-banner.jpg";

  const hasBakedInText = checkHasBakedInText(fullBannerForCheck, occasion.badgeText);

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-[#FBF7EE] selection:bg-[#D4AF37] selection:text-[#0A0805] font-sans pb-16 md:pb-0 overflow-x-clip">
      {/* ======================================================
          1. HEADER
          Reuses canonical BrandIdentity / Navbar system with
          back button to /menu: "← Back to Menu"
      ====================================================== */}
      <Navbar
        restaurantName={restaurantName}
        tagline={settings?.tagline}
        logo={settings?.logo}
        whatsappNumber={whatsappNumber}
        phoneNumber={phoneNumber}
        showBack={true}
        backHref="/menu"
        backLabel="Back to Menu"
        pageTitle={
          occasion.name.toLowerCase().includes("special")
            ? occasion.name
            : `${occasion.name} Special`
        }
      />

      <main className="flex-1 py-4 sm:py-7">
        <div className="mx-auto max-w-6xl px-3 sm:px-6 lg:px-8">
          {/* ======================================================
              2. FESTIVAL HERO
              Full natural image ratio, NO forced fixed-height container,
              NO blind object-cover cropping.
          ====================================================== */}
          <section
            aria-label={`${occasion.name} Festive Hero`}
            className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-[#D4AF37]/30 bg-[#0C0A08] shadow-[0_12px_44px_rgba(0,0,0,0.65),0_0_24px_rgba(212,175,55,0.06)]"
          >
            <picture className="block w-full">
              {mobileBannerAsset && (
                <source
                  media="(max-width: 640px)"
                  srcSet={mobileBannerAsset}
                />
              )}
              <img
                src={bannerAsset}
                alt={`${occasion.name} Celebration Banner`}
                className="w-full h-auto block"
                loading="eager"
                decoding="async"
              />
            </picture>

            {/* SMART HYBRID MODE: Render luxury HTML text & ornaments inside hero banner only if the banner does NOT have baked-in text */}
            {!hasBakedInText && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 py-2 text-center pointer-events-none bg-gradient-to-t from-black/70 via-black/30 to-black/40">
                {/* Glowing Halo */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-40"
                >
                  <div className="w-40 h-40 sm:w-72 sm:h-72 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.35)_0%,transparent_70%)] blur-xl" />
                </div>

                {/* Top Ornament */}
                <div className="w-full flex justify-center mb-1 sm:mb-2">
                  <FestivalOrnament
                    festival={slug}
                    position="top"
                    className="max-w-[120px] xs:max-w-[160px] sm:max-w-[260px] md:max-w-[320px]"
                  />
                </div>

                {/* 3D Gold Title */}
                <h2 className="font-serif text-lg xs:text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-wider leading-tight text-transparent bg-clip-text bg-gradient-to-b from-[#FFFDF5] via-[#F7DE96] to-[#C99726] drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] uppercase">
                  {primaryOccasionHeading}
                </h2>

                {/* Subtitle */}
                <p className="mt-1 text-[9px] xs:text-[11px] sm:text-xs font-semibold tracking-[0.22em] text-[#E6C675] uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                  {festivalSubtitle}
                </p>

                {/* Bottom Ornament */}
                <div className="w-full flex justify-center mt-1 sm:mt-2">
                  <FestivalOrnament
                    festival={slug}
                    position="bottom"
                    className="max-w-[100px] xs:max-w-[130px] sm:max-w-[220px] md:max-w-[280px]"
                  />
                </div>
              </div>
            )}
          </section>

          {/* ======================================================
              3. FESTIVAL INFORMATION
              Compact Description • Active Celebration Date
          ====================================================== */}
          <section className="mt-4 sm:mt-6 text-center max-w-2xl mx-auto px-3 space-y-2">
            {/* Compact Description */}
            <p className="text-xs sm:text-sm text-[#C8BFB0] leading-relaxed max-w-xl mx-auto font-normal">
              {festivalDescription}
            </p>

            {/* Optional Active Celebration Date */}
            {eventDateStr && (
              <div className="pt-0.5 flex items-center justify-center gap-1.5 text-[11px] sm:text-xs text-[#D4AF37]">
                <Calendar className="h-3.5 w-3.5 text-[#D4AF37]" />
                <span className="font-medium tracking-wide">
                  Celebration: {eventDateStr}
                </span>
              </div>
            )}
          </section>

          {/* ======================================================
              4. FESTIVAL BADGE / BENEFITS
              Compact luxury benefit row
          ====================================================== */}
          <section className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[10.5px] sm:text-xs">
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-[#0A1811]/90 px-3 py-1 text-emerald-400 font-semibold shadow-sm">
              <Leaf className="h-3.5 w-3.5 text-emerald-400" />
              <span>100% Pure Veg & Eggless</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-[#D4AF37]/30 bg-[#14120E] px-3 py-1 text-[#EBD699] font-medium shadow-sm">
              <Clock className="h-3.5 w-3.5 text-[#D4AF37]" />
              <span>Freshly Baked to Order</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-[#D4AF37]/30 bg-[#14120E] px-3 py-1 text-[#EBD699] font-medium shadow-sm">
              <ChefHat className="h-3.5 w-3.5 text-[#D4AF37]" />
              <span>Premium Artisanal Quality</span>
            </div>
          </section>

          {/* ======================================================
              5. FESTIVAL CAKES COUNT
              Clean, cake-only count header
          ====================================================== */}
          {occasionCakes.length > 0 && (
            <div className="mt-6 sm:mt-8 flex items-center justify-between border-b border-[#D4AF37]/20 pb-3">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.7)]" />
                <h2 className="font-serif text-sm sm:text-base md:text-lg font-bold tracking-wide text-[#FAF5EB]">
                  {occasionCakes.length}{" "}
                  {occasionCakes.length === 1 ? "Festival Cake" : "Festival Cakes"}
                </h2>
              </div>
              <span className="text-[10px] sm:text-xs font-mono font-medium text-[#D4AF37]/80">
                100% Eggless
              </span>
            </div>
          )}

          {/* ======================================================
              6. FESTIVAL CAKES GRID
              CakeCard only:
              Mobile: 2 columns • Desktop: 3–4 columns
          ====================================================== */}
          <section className="mt-4 sm:mt-6">
            {occasionCakes.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                {occasionCakes.map((cake) => (
                  <CakeCard
                    key={cake.id}
                    cake={cake}
                    whatsappNumber={whatsappNumber}
                    restaurantName={restaurantName}
                  />
                ))}
              </div>
            ) : (
              /* ======================================================
                  9. EMPTY STATE
                  When no products are available or match filter
              ====================================================== */
              <div className="mt-8 rounded-3xl border border-[#D4AF37]/25 bg-[#0F0D0A]/90 p-8 sm:p-12 text-center shadow-[0_8px_32px_rgba(0,0,0,0.5)] max-w-md mx-auto">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#181410] shadow-[0_0_16px_rgba(212,175,55,0.15)] mb-4">
                  <Sparkles className="h-6 w-6 text-[#D4AF37]" />
                </div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#FAF5EB]">
                  No festive treats are available yet.
                </h3>
                <p className="mt-2 text-xs text-[#C8BFB0] leading-relaxed">
                  We are curating handcrafted specials for {occasion.name}. Check
                  back soon or explore our full digital cake menu.
                </p>
                <div className="mt-6">
                  <Link
                    href="/menu"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D4AF37] bg-gradient-to-r from-[#D4AF37] to-[#BFA15F] px-5 py-2.5 text-xs font-bold text-[#0A0805] shadow-[0_4px_16px_rgba(212,175,55,0.3)] transition-all hover:scale-[1.02] active:scale-95"
                  >
                    <ArrowLeft className="h-3.5 w-3.5 text-[#0A0805]" />
                    <span>Back to Menu</span>
                  </Link>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* ======================================================
          11. FOOTER
          Reuses canonical Footer component with BrandIdentity
          and subtle botanical gold corner ornament.
      ====================================================== */}
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
