"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/customer/Navbar";
import {
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Cake as CakeIcon,
  Clock,
  Sparkles,
  Leaf,
  Heart,
} from "lucide-react";
import { generateGeneralWhatsAppLink } from "@/lib/whatsapp";
import OccasionShowcase from "@/components/customer/OccasionShowcase";

import Footer from "@/components/customer/Footer";

interface MenuClientProps {
  initialCategories?: any[];
  initialCakes?: any[];
  settings?: any;
  whatsappSetting?: any;
  activeOccasion?: any;
}

export default function MenuClient({
  initialCategories = [],
  initialCakes = [],
  settings,
  whatsappSetting,
  activeOccasion,
}: MenuClientProps) {
  const restaurantName = settings?.restaurantName || "Raman Sweet & Luxury Pâtisserie";
  const tagline = settings?.tagline || "Artisanal Luxury Pâtisserie";
  const heroTitle = settings?.heroTitle || "Every Celebration Deserves a Perfect Cake";
  const heroSubtitle =
    settings?.heroSubtitle ||
    "Freshly baked daily. Beautifully handcrafted with 100% pure vegetarian & eggless gourmet ingredients.";
  const heroImage = settings?.heroImage || "/images/celebration_hero_cake_clean.png";
  const whatsappNumber = whatsappSetting?.whatsappNumber || settings?.whatsapp || "919876543210";
  const phoneNumber = whatsappSetting?.callNumber || settings?.phone || "+91 98765 43210";

  // Dynamic Signature Cakes from DB with fallback
  const signatureCakes =
    initialCakes.length > 0
      ? initialCakes.slice(0, 4).map((cake) => {
          const price = cake.prices?.[0]?.price || 799;
          let badge: string | null = null;
          let badgeClass = "";
          if (cake.bestseller) {
            badge = "Bestseller";
            badgeClass = "bg-[#C59B27] text-luxury-950 font-bold";
          } else if (cake.featured) {
            badge = "Signature";
            badgeClass = "bg-[#D97706] text-white font-bold";
          } else if (cake.isNew) {
            badge = "New";
            badgeClass = "bg-[#B45309] text-white font-bold";
          }

          return {
            id: cake.id,
            name: cake.name,
            slug: cake.slug,
            price,
            badge,
            badgeClass,
            image: cake.coverImage || "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600&auto=format&fit=crop",
          };
        })
      : [
          {
            id: "1",
            name: "Chocolate Truffle",
            slug: "chocolate-truffle",
            price: 799,
            badge: "Bestseller",
            badgeClass: "bg-[#C59B27] text-luxury-950 font-bold",
            image: "/images/hero_cake.jpg",
          },
          {
            id: "2",
            name: "Pistachio Rose",
            slug: "pistachio-rose",
            price: 899,
            badge: "Signature",
            badgeClass: "bg-[#D97706] text-white font-bold",
            image: "/images/pistachio_rose.jpg",
          },
          {
            id: "3",
            name: "Red Velvet",
            slug: "red-velvet",
            price: 849,
            badge: "New",
            badgeClass: "bg-[#B45309] text-white font-bold",
            image: "/images/red_velvet.jpg",
          },
          {
            id: "4",
            name: "Mango Delight",
            slug: "mango-delight",
            price: 799,
            badge: null,
            badgeClass: "",
            image: "/images/mango_delight.jpg",
          },
        ];

  // Dynamic Popular Categories from DB with fallback
  const categoriesList = [
    {
      id: "all",
      name: "All Cakes",
      isAll: true,
      slug: "all",
      image: "/images/categories/all_cakes.svg",
    },
    ...(initialCategories.length > 0
      ? initialCategories.map((cat) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          isAll: false,
          image: cat.image || "/images/categories/chocolate.png",
        }))
      : [
          { id: "chocolate", name: "Chocolate", slug: "chocolate", isAll: false, image: "/images/categories/chocolate.png" },
          { id: "fruit-berry", name: "Fruit & Berry", slug: "fruit-berry", isAll: false, image: "/images/categories/fruit_berry.png" },
          { id: "exotic-premium", name: "Exotic & Premium", slug: "exotic-premium", isAll: false, image: "/images/categories/exotic.png" },
          { id: "bento", name: "Bento Cakes", slug: "bento-cakes", isAll: false, image: "/images/categories/bento.png" },
          { id: "anniversary", name: "Anniversary", slug: "anniversary", isAll: false, image: "/images/categories/anniversary.png" },
          { id: "birthday", name: "Birthday", slug: "birthday", isAll: false, image: "/images/categories/birthday.png" },
          { id: "photo-designer", name: "Photo & Designer", slug: "designer-cakes", isAll: false, image: "/images/categories/designer.png" },
        ]),
  ];

  const waLink = generateGeneralWhatsAppLink(whatsappNumber, restaurantName);

  return (
    <div className="min-h-screen flex flex-col bg-[#090807] text-[#FBF7EE] selection:bg-gold-500 selection:text-luxury-950 font-sans pb-20 md:pb-0">
      {/* 1. TOP HEADER BRAND NAVBAR */}
      <Navbar
        restaurantName={restaurantName}
        whatsappNumber={whatsappNumber}
        phoneNumber={phoneNumber}
      />

      {/* RESPONSIVE MAIN CONTENT CONTAINER */}
      <main className="w-full max-w-md md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-2 sm:pt-4 pb-8 space-y-4 md:space-y-8 flex-1">
        
        {/* 2. CELEBRATION HERO SECTION (RESPONSIVE SPLIT ON TABLET/DESKTOP) */}
        <section className="relative w-full rounded-2xl md:rounded-3xl border border-gold-500/15 bg-gradient-to-b md:bg-gradient-to-r from-[#14120f] via-[#100e0c] to-[#0a0908] p-3.5 sm:p-6 md:p-8 lg:p-10 shadow-2xl overflow-hidden text-left">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8 items-center">
            {/* Left Content */}
            <div className="md:col-span-7 space-y-1.5 md:space-y-4">
              <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[9.5px] md:text-xs font-bold tracking-wider uppercase border border-gold-500/30 bg-gold-500/10 text-gold-400">
                <Sparkles className="h-3 w-3 shrink-0" />
                <span>{tagline}</span>
              </div>

              <h1 className="font-serif text-[26px] xs:text-[28px] sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#FBF7EE] leading-[1.12]">
                {heroTitle}
              </h1>

              <p className="text-[11px] sm:text-xs md:text-sm text-[#A69B8D] font-normal leading-relaxed max-w-lg">
                {heroSubtitle}
              </p>

              {/* Desktop Quick Action CTA Buttons */}
              <div className="pt-1 md:pt-2 hidden sm:flex items-center gap-3">
                <Link
                  href="/menu/cakes"
                  className="rounded-xl bg-gold-gradient px-5 py-2.5 text-xs font-bold text-luxury-950 shadow-gold-sm hover:opacity-95 transition-opacity"
                >
                  Explore All Cakes →
                </Link>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-gold-500/30 bg-gold-500/10 px-4 py-2.5 text-xs font-semibold text-gold-300 hover:bg-gold-500/20 transition-all flex items-center gap-1.5"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-emerald-400" />
                  <span>WhatsApp Enquiry</span>
                </a>
              </div>
            </div>

            {/* Right Hero Chocolate Cake on Pedestal Stand */}
            <div className="md:col-span-5 relative w-full aspect-[282/215] max-w-[320px] sm:max-w-[360px] md:max-w-none mx-auto mt-0.5 md:mt-0">
              <Image
                src={heroImage}
                alt={heroTitle}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 450px"
                className="object-contain hover:scale-103 transition-transform duration-500"
              />
              {/* Seamless Vignettes */}
              <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-[#14120f]/80 to-transparent pointer-events-none hidden md:block" />
              <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-[#0a0908]/80 to-transparent pointer-events-none hidden md:block" />
            </div>
          </div>
        </section>

        {/* 3. DYNAMIC OCCASION SHOWCASE (AUTOMATIC FESTIVAL & OCCASION ENGINE) */}
        <OccasionShowcase occasionData={activeOccasion} />

        {/* 4. POPULAR CATEGORIES (4 columns on mobile, 8 columns on desktop) */}
        <section className="space-y-2.5 sm:space-y-3.5 pt-1">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-serif text-[15px] sm:text-lg md:text-xl font-bold text-[#FBF7EE] tracking-tight">
              Popular Categories
            </h2>
            <Link
              href="/menu/cakes"
              className="text-[11px] sm:text-xs md:text-sm font-semibold text-gold-400 hover:text-gold-300 transition-colors"
            >
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-8 gap-1.5 sm:gap-2.5 md:gap-3">
            {categoriesList.map((cat) => (
              <Link
                key={cat.id}
                href={cat.isAll ? "/menu/cakes" : `/menu/cakes?category=${cat.slug}`}
                className={`group flex flex-col items-center justify-center rounded-2xl py-2 px-1 sm:p-3 text-center transition-all duration-300 ${
                  cat.isAll
                    ? "border border-[#C59B27] bg-[#161310] shadow-[0_0_12px_rgba(197,155,39,0.18)]"
                    : "border border-white/5 bg-[#14120f] hover:border-gold-500/40 hover:bg-[#181512]"
                }`}
              >
                <div className="relative flex h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 items-center justify-center overflow-hidden rounded-full bg-[#0d0b09] border border-white/5 shadow-inner">
                  {cat.isAll ? (
                    <div className="relative flex h-full w-full items-center justify-center p-1.5 sm:p-2">
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        width={36}
                        height={36}
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 48px, 64px"
                      className="object-cover group-hover:scale-108 transition-transform duration-300"
                    />
                  )}
                </div>
                <span
                  className={`mt-1.5 text-[9.5px] sm:text-[11px] md:text-xs font-medium leading-tight tracking-tight truncate w-full text-center ${
                    cat.isAll
                      ? "text-[#FBF7EE] font-semibold"
                      : "text-cream-100 group-hover:text-gold-400"
                  } transition-colors`}
                >
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 5. SIGNATURE CAKES (2-Column on Mobile, 4-Column on Desktop) */}
        <section className="space-y-2 sm:space-y-3.5 pt-1">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="font-serif text-sm sm:text-lg md:text-xl font-bold text-[#FBF7EE]">
                Signature Cakes
              </h2>
              <p className="text-[9.5px] sm:text-xs text-luxury-400">
                Handpicked favorites for every special moment.
              </p>
            </div>
            <Link
              href="/menu/cakes"
              className="text-[10.5px] sm:text-xs md:text-sm font-semibold text-gold-400 hover:text-gold-300"
            >
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3.5 md:gap-4 lg:gap-5">
            {signatureCakes.map((cake) => (
              <Link
                key={cake.id}
                href={`/menu/cake/${cake.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-xl md:rounded-2xl border border-luxury-800/80 bg-[#14120f] p-2 sm:p-3 md:p-3.5 transition-all hover:border-gold-500/40 hover:shadow-gold-md"
              >
                {/* Cake Image & Badges */}
                <div className="relative aspect-square w-full overflow-hidden rounded-lg md:rounded-xl bg-luxury-950">
                  <Image
                    src={cake.image}
                    alt={cake.name}
                    fill
                    sizes="(max-width: 640px) 180px, (max-width: 1024px) 240px, 300px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Top-Left Badge */}
                  {cake.badge && (
                    <div className="absolute top-1.5 left-1.5 z-10">
                      <span className={`rounded px-1.5 py-0.5 text-[8px] sm:text-[9px] uppercase tracking-wider ${cake.badgeClass}`}>
                        {cake.badge}
                      </span>
                    </div>
                  )}
                </div>

                {/* Cake Details */}
                <div className="mt-2 sm:mt-2.5 space-y-1">
                  <h3 className="font-serif text-xs sm:text-sm md:text-base font-bold text-[#FBF7EE] group-hover:text-gold-400 transition-colors truncate">
                    {cake.name}
                  </h3>
                  <div className="flex items-center justify-between pt-0.5">
                    <div className="flex items-baseline space-x-1">
                      <span className="text-[9.5px] sm:text-xs text-luxury-400">From</span>
                      <span className="text-xs sm:text-sm md:text-base font-bold text-gold-400">
                        ₹{cake.price}
                      </span>
                    </div>
                    <span className="text-[9px] sm:text-xs font-semibold text-gold-400 group-hover:translate-x-0.5 transition-transform">
                      View Cake →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 6. CUSTOM CAKE CTA (RESPONSIVE BANNER) */}
        <section className="rounded-2xl md:rounded-3xl border border-gold-500/20 bg-[#14120f] p-3.5 sm:p-6 md:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-8">
            {/* Left Content */}
            <div className="space-y-2 text-left sm:max-w-xl">
              <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[9px] sm:text-xs font-bold uppercase tracking-wider bg-gold-500/10 text-gold-400 border border-gold-500/20">
                <Sparkles className="h-3 w-3" />
                <span>Bespoke Confectionery</span>
              </div>
              <h3 className="font-serif text-base sm:text-xl md:text-2xl font-bold text-[#FBF7EE]">
                Looking for a Custom Cake?
              </h3>
              <p className="text-[10.5px] sm:text-xs md:text-sm text-luxury-300 font-light leading-relaxed">
                Personalised eggless cakes for birthdays, weddings, anniversaries, corporate milestones and special celebrations. Handcrafted to your exact vision.
              </p>
              <div className="pt-1 sm:pt-2">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 rounded-xl bg-[#25D366] px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg hover:bg-emerald-500 transition-colors"
                >
                  <MessageCircle className="h-4 w-4 fill-white text-white" />
                  <span>Chat with Pastry Chef on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Right Bespoke Cake Image */}
            <div className="relative aspect-square w-28 sm:w-36 md:w-44 lg:w-48 shrink-0 overflow-hidden rounded-2xl border border-gold-500/25 bg-luxury-950 shadow-md">
              <Image
                src="/images/custom_cake.jpg"
                alt="Custom Celebration Cake"
                fill
                sizes="(max-width: 640px) 120px, 200px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Bottom 3 Trust Badges */}
          <div className="mt-3 sm:mt-5 pt-3 border-t border-luxury-800/80 grid grid-cols-3 gap-2 text-center text-[9px] sm:text-xs text-cream-200">
            <div className="flex items-center justify-center space-x-1.5">
              <Leaf className="h-3.5 w-3.5 text-gold-400 shrink-0" />
              <span className="truncate font-medium">100% Pure Veg & Eggless</span>
            </div>
            <div className="flex items-center justify-center space-x-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-gold-400 shrink-0" />
              <span className="truncate font-medium">Hygienic Artisan Kitchen</span>
            </div>
            <div className="flex items-center justify-center space-x-1.5">
              <Clock className="h-3.5 w-3.5 text-gold-400 shrink-0" />
              <span className="truncate font-medium">Fresh Daily On-Time Delivery</span>
            </div>
          </div>
        </section>
      </main>

      {/* 7. DESKTOP FOOTER */}
      <div className="hidden md:block">
        <Footer
          restaurantName={restaurantName}
          phone={phoneNumber}
          whatsapp={whatsappNumber}
          address={settings?.address}
          openingHours={settings?.openingHours}
          instagram={settings?.instagram}
          facebook={settings?.facebook}
          footerText={settings?.footerText}
        />
      </div>

      {/* 8. FIXED MOBILE BOTTOM NAVIGATION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-gold-500/20 bg-[#0d0c0a]/95 py-2 backdrop-blur-xl md:hidden">
        {/* Menu (Active Tab with Gold Glow) */}
        <Link
          href="/menu"
          className="relative flex flex-col items-center space-y-0.5 px-4 py-1 rounded-xl bg-gold-500/10 text-gold-400"
        >
          <CakeIcon className="h-4 w-4" />
          <span className="text-[9.5px] font-bold">Menu</span>
        </Link>

        {/* All Cakes */}
        <Link
          href="/menu/cakes"
          className="flex flex-col items-center space-y-0.5 px-4 py-1 text-luxury-400 hover:text-cream-100 transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          <span className="text-[9.5px] font-medium">All Cakes</span>
        </Link>

        {/* Order */}
        <Link
          href="/menu/order"
          className="flex flex-col items-center space-y-0.5 px-4 py-1 text-luxury-400 hover:text-cream-100 transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="text-[9.5px] font-medium">Order</span>
        </Link>
      </div>
    </div>
  );
}
