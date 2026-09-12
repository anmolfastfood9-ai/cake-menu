"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/customer/Navbar";
import CakeCard from "@/components/customer/CakeCard";
import { generateGeneralWhatsAppLink } from "@/lib/whatsapp";
import OccasionShowcase from "@/components/customer/OccasionShowcase";
import Footer from "@/components/customer/Footer";
import CategoryIcon from "@/components/customer/CategoryIcon";
import { Sparkles, BookOpen } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

import { DEFAULT_BRAND_NAME, DEFAULT_BRAND_TAGLINE } from "@/components/customer/BrandIdentity";
import { cleanupStaleFavorites } from "@/lib/customerFavorites";

interface MenuClientProps {
  initialCategories?: any[];
  initialCakes?: any[];
  settings?: any;
  whatsappSetting?: any;
  activeOccasion?: any;
  initialSelectedCategory?: string;
}

export default function MenuClient({
  initialCategories = [],
  initialCakes = [],
  settings,
  whatsappSetting,
  activeOccasion,
  initialSelectedCategory = "all",
}: MenuClientProps) {
  useEffect(() => {
    if (initialCakes && initialCakes.length > 0) {
      cleanupStaleFavorites(initialCakes.map((c: any) => c.id).filter(Boolean));
    }
  }, [initialCakes]);

  /*
   * ============================================================
   * DYNAMIC WEBSITE SETTINGS
   * ============================================================
   */
  const restaurantName =
    settings?.restaurantName || DEFAULT_BRAND_NAME;

  const tagline =
    settings?.tagline || DEFAULT_BRAND_TAGLINE;

  const heroTitle =
    settings?.heroTitle || "Crafted for Sweet Perfection";

  // Reference does not have subtitle text under title
  const heroSubtitle = "";

  // Use admin setting heroImage only if configured as a true cake cutout; never as a rectangular banner
  const isBannerAsset =
    settings?.heroImage &&
    (settings.heroImage.includes("banner") ||
      settings.heroImage.includes("festival") ||
      settings.heroImage.includes("generic"));

  const heroImage =
    (!isBannerAsset && settings?.heroImage) ||
    "/images/user_master_hero_cake_uncut_transparent.png";

  const whatsappNumber =
    whatsappSetting?.whatsappNumber ||
    settings?.whatsapp ||
    "919876543210";

  const phoneNumber =
    whatsappSetting?.callNumber ||
    settings?.phone ||
    "+91 98765 43210";

  /*
   * ============================================================
   * SIGNATURE CAKES & CATEGORY FILTER
   * Dynamic on-page filtering for fast counter browsing
   * ============================================================
   */
  const [heroImgSrc, setHeroImgSrc] = useState<string>(heroImage);

  useEffect(() => {
    setHeroImgSrc(heroImage);
  }, [heroImage]);

  const [selectedCategory, setSelectedCategory] = useState<string>(initialSelectedCategory);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("category");
      if (cat) {
        setSelectedCategory(cat);
      }
    }
  }, []);

  const handleSelectCategory = (slug: string) => {
    setSelectedCategory(slug);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (slug === "all") {
        url.searchParams.delete("category");
      } else {
        url.searchParams.set("category", slug);
      }
      window.history.replaceState({}, "", url.toString());
    }
  };

  const displayCakes = useMemo(() => {
    const fallbackImages = [
      "/images/ref_belgian_chocolate.png",
      "/images/ref_mango_cheesecake.png",
      "/images/ref_ramari_cheesecake.png",
      "/images/ref_cheesecake_truffle.png",
    ];

    if (initialCakes.length > 0) {
      return initialCakes.map((c) => ({
        ...c,
        coverImage: c.coverImage || c.image || fallbackImages[0],
      }));
    }

    return [
      {
        id: "1",
        name: "Belgian Chocolate Truffle",
        slug: "chocolate-truffle",
        coverImage: "/images/ref_belgian_chocolate.png",
        available: true,
        category: { slug: "chocolate", name: "Chocolate" },
        prices: [{ weight: "1 kg", price: 1499, isDefault: true }],
      },
      {
        id: "2",
        name: "Mango Passion Fruit Cheesecake",
        slug: "mango-delight",
        coverImage: "/images/ref_mango_cheesecake.png",
        available: true,
        category: { slug: "premium", name: "Cheesecakes" },
        prices: [{ weight: "1 kg", price: 1499, isDefault: true }],
      },
      {
        id: "3",
        name: "Ramari Cheesecake",
        slug: "blueberry-cheesecake",
        coverImage: "/images/ref_ramari_cheesecake.png",
        available: true,
        category: { slug: "premium", name: "Cheesecakes" },
        prices: [{ weight: "1 kg", price: 1499, isDefault: true }],
      },
      {
        id: "4",
        name: "Cheesecake Truffle",
        slug: "24k-royal-gold-truffle",
        coverImage: "/images/ref_cheesecake_truffle.png",
        available: true,
        category: { slug: "chocolate", name: "Chocolate" },
        prices: [{ weight: "1 kg", price: 1499, isDefault: true }],
      },
    ];
  }, [initialCakes]);

  const filteredCakes = useMemo(() => {
    let list = displayCakes;

    if (selectedCategory !== "all") {
      const normSelected = selectedCategory.toLowerCase().trim();

      list = list.filter((c: any) => {
        const catId = (c.categoryId || c.category?.id || "").toLowerCase();
        const catSlug = (c.category?.slug || "").toLowerCase();
        const catName = (c.category?.name || "").toLowerCase();
        const cakeName = (c.name || "").toLowerCase();
        const cakeDesc = (c.description || "").toLowerCase();

        // 1. Direct slug or ID match
        if (catSlug === normSelected || catId === normSelected) {
          return true;
        }

        // 2. Specialized keyword mappings
        if (normSelected === "chocolate" || normSelected.includes("truffle")) {
          return (
            catSlug.includes("chocolate") ||
            catSlug.includes("truffle") ||
            catName.includes("chocolate") ||
            catName.includes("truffle") ||
            cakeName.includes("chocolate") ||
            cakeName.includes("truffle") ||
            cakeDesc.includes("chocolate") ||
            cakeDesc.includes("truffle")
          );
        }
        if (normSelected === "fruit" || normSelected.includes("berry")) {
          return (
            catSlug.includes("fruit") ||
            catSlug.includes("berry") ||
            catName.includes("fruit") ||
            catName.includes("berry") ||
            cakeName.includes("fruit") ||
            cakeName.includes("mango") ||
            cakeName.includes("berry") ||
            cakeDesc.includes("fruit")
          );
        }
        if (normSelected.includes("cheese")) {
          return (
            catSlug.includes("cheese") ||
            catName.includes("cheese") ||
            cakeName.includes("cheese") ||
            cakeDesc.includes("cheese")
          );
        }
        if (normSelected.includes("photo") || normSelected.includes("designer")) {
          return (
            catSlug.includes("photo") ||
            catSlug.includes("designer") ||
            catName.includes("photo") ||
            catName.includes("designer") ||
            cakeName.includes("photo") ||
            cakeDesc.includes("photo")
          );
        }
        if (normSelected.includes("birthday") || normSelected.includes("celebration")) {
          return (
            catSlug.includes("birthday") ||
            catSlug.includes("celebration") ||
            catName.includes("birthday") ||
            catName.includes("celebration") ||
            cakeName.includes("birthday")
          );
        }
        if (normSelected.includes("anniversary") || normSelected.includes("love")) {
          return (
            catSlug.includes("anniversary") ||
            catName.includes("anniversary") ||
            cakeName.includes("anniversary")
          );
        }
        if (normSelected.includes("signature") || normSelected.includes("luxury") || normSelected.includes("premium")) {
          return (
            catSlug.includes("signature") ||
            catSlug.includes("luxury") ||
            catSlug.includes("premium") ||
            catName.includes("signature") ||
            catName.includes("luxury") ||
            catName.includes("premium")
          );
        }

        return (
          catSlug.includes(normSelected) ||
          normSelected.includes(catSlug) ||
          catName.toLowerCase().includes(normSelected)
        );
      });
    }

    return list;
  }, [displayCakes, selectedCategory]);

  const categoriesList = useMemo(() => {
    const allItem = { id: "all", name: "All", slug: "all" };

    if (!initialCategories || initialCategories.length === 0) {
      return [
        allItem,
        { id: "chocolate", name: "Truffle", slug: "chocolate" },
        { id: "fruit", name: "Fruit & Berry", slug: "fruit" },
        { id: "cheesecakes", name: "Cheesecakes", slug: "cheesecakes" },
        { id: "photo-cakes", name: "Photo Cakes", slug: "photo-cakes" },
      ];
    }

    const activeCats = initialCategories
      .filter((cat: any) => cat.active !== false)
      .sort((a: any, b: any) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

    const seenSlugs = new Set<string>();
    const dynamicList: { id: string; name: string; slug: string; image?: string }[] = [];

    for (const cat of activeCats) {
      const s = (cat.slug || cat.name || "").toLowerCase().trim();
      if (!s || s === "all" || seenSlugs.has(s)) continue;
      seenSlugs.add(s);
      dynamicList.push({
        id: cat.id || s,
        name: cat.name,
        slug: cat.slug || s,
        image: cat.image,
      });
    }

    return [allItem, ...dynamicList];
  }, [initialCategories]);

  const waLink = generateGeneralWhatsAppLink(
    whatsappNumber,
    restaurantName
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-[#FBF7EE] font-sans overflow-x-hidden selection:bg-[#D4AF37]/30">
      {/* ======================================================
          HEADER
      ====================================================== */}
      <Navbar
        restaurantName={restaurantName}
        tagline={tagline}
        logo={settings?.logo}
        whatsappNumber={whatsappNumber}
        phoneNumber={phoneNumber}
      />

      {/* ======================================================
          MAIN CONTENT
          Mobile is intentionally compact and reference-driven.
      ====================================================== */}
      <main
        className="
          w-full
          max-w-[430px]
          md:max-w-5xl
          lg:max-w-6xl
          xl:max-w-7xl
          mx-auto
          px-3
          sm:px-5
          md:px-8
          flex-1
          overflow-x-hidden
          pb-32
          md:pb-12
        "
      >
        {/* ====================================================
            HERO
        ==================================================== */}
        {/* ====================================================
            HERO SECTION WITH 2 SEPARATE LAYERS
            BACKGROUND -> Separate CSS Ambient Glow -> Transparent Cake PNG -> Hero Text
        ==================================================== */}
        <section className="relative w-full text-center overflow-hidden py-1">
          {/* LAYER 1: Separate Stationary CSS Ambient Glow (Soft radial, warm champagne/gold + emerald tint, blurred, seamless) */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              left-1/2
              top-[25px]
              z-0
              h-[310px]
              w-[350px]
              -translate-x-1/2
              rounded-full
              bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.34)_0%,rgba(240,222,160,0.18)_30%,rgba(16,185,129,0.10)_55%,transparent_75%)]
              blur-3xl
            "
          />

          <div className="relative z-10 flex flex-col items-center">
            {/* LAYER 2: Transparent Master Hero Cake PNG */}
            <div
              className="
                relative
                z-10
                w-[285px]
                h-[285px]
                sm:w-[330px]
                sm:h-[330px]
                md:w-[380px]
                md:h-[380px]
                mt-1
                mb-0.5
                animate-subtle-bounce
              "
            >
              <Image
                src={heroImgSrc}
                alt={heroTitle}
                fill
                priority
                sizes="
                  (max-width: 430px) 285px,
                  (max-width: 640px) 330px,
                  (max-width: 1024px) 380px,
                  380px
                "
                className="
                  object-contain
                  object-center
                  drop-shadow-[0_20px_35px_rgba(212,175,55,0.30)]
                "
                onError={() => setHeroImgSrc("/images/user_master_hero_cake_uncut_transparent.png")}
              />
            </div>

            {/* Micro Gold Badge */}
            <div className="relative z-20 mt-1 mb-1 inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/35 bg-[#16130E]/80 px-3 py-1 text-[10px] sm:text-[11px] font-semibold tracking-widest text-[#E7C979] uppercase shadow-[0_0_12px_rgba(212,175,55,0.20)]">
              <Sparkles className="h-3 w-3 text-[#D4AF37] animate-pulse" />
              100% Eggless • Artisanal Bakery
            </div>

            {/* LAYER 3: Hero Title Text */}
            <h1
              className="
                relative
                z-20
                max-w-[370px]
                px-3
                mt-0.5
                font-serif
                text-[24px]
                sm:text-[28px]
                md:text-[34px]
                font-semibold
                leading-tight
                tracking-normal
                gold-shimmer-text
                drop-shadow-[0_4px_12px_rgba(212,175,55,0.25)]
              "
            >
              {heroTitle}
            </h1>

            {/* Keep subtitle available when configured */}
            {heroSubtitle ? (
              <p
                className="
                  mt-2
                  max-w-[330px]
                  px-3
                  text-[11px]
                  sm:text-xs
                  leading-relaxed
                  text-[#CFC6B6]
                "
              >
                {heroSubtitle}
              </p>
            ) : null}

            {/* ------------------------------------------------
                Hero CTA (Primary Gold Highlight vs Secondary Emerald Outline)
                ------------------------------------------------ */}
            <div
              className="
                mt-4
                flex
                items-center
                justify-center
                gap-3
                w-full
              "
            >
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("cake-catalog");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="
                  inline-flex
                  h-10
                  min-w-[130px]
                  sm:min-w-[140px]
                  items-center
                  justify-center
                  gap-1.5
                  rounded-xl
                  border
                  border-emerald-500/70
                  bg-[#0A1812]/80
                  px-4
                  text-[12px]
                  sm:text-sm
                  font-serif
                  font-semibold
                  text-[#E8DEC8]
                  shadow-[0_0_14px_rgba(16,185,129,0.25)]
                  transition-all
                  active:scale-[0.97]
                  hover:bg-[#0E2219]
                  hover:border-emerald-400
                "
              >
                <BookOpen className="h-3.5 w-3.5 text-[#E7C979]" />
                Explore Menu
              </button>

              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex
                  h-10
                  min-w-[130px]
                  sm:min-w-[140px]
                  items-center
                  justify-center
                  gap-1.5
                  rounded-xl
                  border
                  border-[#F3D068]/80
                  bg-gradient-to-r
                  from-[#D4AF37]
                  via-[#F3D068]
                  to-[#D4AF37]
                  px-4
                  text-[12px]
                  sm:text-sm
                  font-sans
                  font-bold
                  text-[#0B0907]
                  shadow-[0_0_20px_rgba(212,175,55,0.40)]
                  transition-all
                  active:scale-[0.97]
                  hover:shadow-[0_0_25px_rgba(212,175,55,0.60)]
                  hover:brightness-105
                "
              >
                <WhatsAppIcon className="h-4 w-4 text-[#0B0907]" />
                Book a Cake
              </a>
            </div>
          </div>
        </section>

        {/* ====================================================
            FESTIVAL / OCCASION / YEAR-ROUND SHOWCASE
        ==================================================== */}
        <div className="mt-3 sm:mt-4">
          <OccasionShowcase occasionData={activeOccasion} defaultSettings={settings} />
        </div>

        {/* ====================================================
            CATEGORY NAVIGATION
        ==================================================== */}
        <section id="category-navigation" className="mt-3.5 sm:mt-4 w-full min-w-0">
          <div
            className="
              w-full
              max-w-full
              min-w-0
              overflow-x-auto
              overflow-y-hidden
              overscroll-x-contain
              touch-pan-x
              scroll-smooth
              snap-x
              snap-mandatory
              py-2
              px-3
              sm:px-4
              [scrollbar-width:none]
              [-ms-overflow-style:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            <div
              className="
                flex
                w-max
                items-start
                gap-2.5
                sm:gap-3.5
                pr-6
                sm:pr-8
              "
            >
              {categoriesList.map((cat) => {
                const isSelected = selectedCategory === cat.slug;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelectCategory(cat.slug)}
                    className="
                      group
                      flex
                      w-[72px]
                      min-w-[72px]
                      sm:w-[76px]
                      sm:min-w-[76px]
                      shrink-0
                      snap-start
                      flex-col
                      items-center
                      text-center
                      active:scale-[0.95]
                      transition-transform
                      duration-150
                      focus:outline-none
                    "
                  >
                    {/* Concentric Golden Ring Saucer */}
                    <div
                      className={`
                        relative
                        flex
                        h-[56px]
                        w-[56px]
                        sm:h-[60px]
                        sm:w-[60px]
                        items-center
                        justify-center
                        rounded-full
                        transition-all
                        duration-300
                        ${isSelected
                          ? "border-2 border-[#F5E29D] bg-gradient-to-b from-[#2A2012] via-[#16120C] to-[#0A0806] shadow-[0_0_18px_rgba(231,201,107,0.5)] ring-2 ring-[#E7C96B]/45"
                          : "border border-[#D4AF37]/40 bg-gradient-to-b from-[#1C160F] via-[#100D09] to-[#070604] group-hover:border-[#E7C96B]/75 group-hover:shadow-[0_0_10px_rgba(212,175,55,0.25)]"
                        }
                      `}
                    >
                      {/* Inner concentric ring / saucer depth */}
                      <div
                        className={`
                          absolute
                          inset-[3px]
                          rounded-full
                          border
                          transition-colors
                          pointer-events-none
                          ${isSelected
                            ? "border-[#E7C96B]/50 bg-[radial-gradient(circle_at_50%_25%,rgba(245,226,157,0.22)_0%,transparent_70%)]"
                            : "border-[#D4AF37]/25 bg-[radial-gradient(circle_at_50%_25%,rgba(212,175,55,0.1)_0%,transparent_70%)]"
                          }
                        `}
                      />

                      {/* Upper crescent light reflection arc */}
                      <div
                        className={`
                          absolute
                          top-[3px]
                          left-[16%]
                          right-[16%]
                          h-[40%]
                          rounded-t-full
                          border-t
                          pointer-events-none
                          ${isSelected ? "border-[#F5E29D]/60" : "border-[#D4AF37]/35"}
                        `}
                      />

                      {/* Bespoke Crisp Vector Cake Icon */}
                      <div className="relative z-10 flex items-center justify-center">
                        <CategoryIcon
                          slug={cat.slug}
                          name={cat.name}
                          className={`
                            h-[26px]
                            w-[26px]
                            sm:h-[28px]
                            sm:w-[28px]
                            transition-all
                            duration-200
                            group-hover:scale-105
                            ${isSelected
                              ? "text-[#F5E29D] drop-shadow-[0_0_8px_rgba(231,201,107,0.85)]"
                              : "text-[#E7C96B]/85 group-hover:text-[#F5E29D]"
                            }
                          `}
                        />
                      </div>
                    </div>

                    {/* High-contrast wrapped label, zero truncation */}
                    <span
                      className={`
                        mt-1.5
                        w-full
                        text-center
                        text-[10.5px]
                        sm:text-[11.5px]
                        leading-[1.18]
                        tracking-tight
                        font-medium
                        line-clamp-2
                        transition-colors
                        ${isSelected
                          ? "font-bold text-[#E7C96B] drop-shadow-[0_1px_4px_rgba(231,201,107,0.35)]"
                          : "text-[#D8D0C5] group-hover:text-[#FBF7EE]"
                        }
                      `}
                    >
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ====================================================
            CAKE SHOWCASE CATALOG
        ==================================================== */}
        <section id="cake-catalog" className="mt-5 sm:mt-6 scroll-mt-20">
          <div className="mb-2 sm:mb-2.5 flex items-center justify-between px-0.5">
            <h2
              className="
                font-serif
                text-[20px]
                sm:text-2xl
                md:text-[26px]
                font-bold
                tracking-[-0.01em]
                text-[#F5E29D]
                drop-shadow-[0_1px_6px_rgba(212,175,55,0.25)]
              "
            >
              {searchQuery.trim()
                ? `Results for "${searchQuery}"`
                : selectedCategory === "all"
                ? "Signature Cakes"
                : `${categoriesList.find((c) => c.slug === selectedCategory)?.name || "Artisan"} Cakes`}
            </h2>
            <span className="inline-flex items-center rounded-full border border-[#D4AF37]/30 bg-[#16130E]/85 px-2 py-0.5 text-[9.5px] sm:text-[10.5px] font-medium text-[#E0CE9E] shadow-[0_2px_6px_rgba(0,0,0,0.35)]">
              {filteredCakes.length} {filteredCakes.length === 1 ? "Cake" : "Cakes"}
            </span>
          </div>

          {filteredCakes.length === 0 ? (
            <div className="rounded-2xl border border-[#D4AF37]/25 bg-[#0F0D0A] p-8 text-center">
              <p className="text-xs text-[#A69B8D]">
                No cakes currently listed under this category.
              </p>
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className="mt-3 inline-flex items-center rounded-xl border border-[#D4AF37]/50 bg-[#16130E] px-4 py-2 text-xs font-semibold text-[#EBD699] hover:bg-[#D4AF37]/20 transition-colors"
              >
                View All Available Cakes
              </button>
            </div>
          ) : (
            <div
              className="
                grid
                grid-cols-2
                gap-2.5
                sm:gap-3.5
                md:grid-cols-4
                md:gap-4
                lg:gap-5
              "
            >
              {filteredCakes.map((cake: any) => (
                <CakeCard
                  key={cake.id}
                  cake={{
                    id: cake.id,
                    name: cake.name,
                    slug: cake.slug || cake.id,
                    description:
                      cake.description ||
                      "Artisanal handcrafted luxury confection.",
                    coverImage:
                      cake.coverImage ||
                      cake.image ||
                      "/images/ref_belgian_chocolate.png",
                    featured: cake.featured || false,
                    bestseller: cake.bestseller || false,
                    isNew: cake.isNew || false,
                    available: cake.available !== false,
                    prices:
                      cake.prices && cake.prices.length > 0
                        ? cake.prices
                        : [
                            {
                              weight: "1 kg",
                              price: cake.price || 1499,
                            },
                          ],
                  }}
                  whatsappNumber={whatsappNumber}
                  restaurantName={restaurantName}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* ======================================================
          FOOTER
      ====================================================== */}
      <Footer
        restaurantName={restaurantName}
        tagline={tagline}
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
