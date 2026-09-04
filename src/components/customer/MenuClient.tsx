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

              {/* Quick Action CTA Buttons */}
              <div className="pt-2 flex items-center gap-2 sm:gap-3 flex-wrap">
                <Link
                  href="/menu/cakes"
                  className="inline-flex items-center space-x-1 rounded-xl bg-gold-gradient px-4 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-xs font-bold text-luxury-950 shadow-gold-sm hover:opacity-95 transition-opacity active:scale-95"
                >
                  <span>Explore All Cakes →</span>
                </Link>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 rounded-xl border border-gold-500/30 bg-gold-500/10 px-3.5 sm:px-4 py-2 sm:py-2.5 text-[11px] sm:text-xs font-semibold text-gold-300 hover:bg-gold-500/20 transition-all active:scale-95"
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

        {/* 4. POPULAR CATEGORIES (Instagram Story-Style Horizontal Scroll) */}
        <section className="space-y-2.5 sm:space-y-3.5 pt-1">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-serif text-[15px] sm:text-lg md:text-xl font-bold text-[#FBF7EE] tracking-tight flex items-center gap-2">
              <span>Popular Categories</span>
              <span className="rounded-full bg-gold-500/10 border border-gold-500/20 px-2 py-0.5 text-[9.5px] text-gold-400 font-mono">
                {categoriesList.length} Collections
              </span>
            </h2>
            <Link
              href="/menu/cakes"
              className="text-[11px] sm:text-xs md:text-sm font-semibold text-gold-400 hover:text-gold-300 transition-colors"
            >
              View all →
            </Link>
          </div>

          {/* Story-style Horizontal Scroll Row */}
          <div className="flex items-center gap-3 overflow-x-auto py-2 scrollbar-none snap-x">
            {categoriesList.map((cat) => (
              <Link
                key={cat.id}
                href={cat.isAll ? "/menu/cakes" : `/menu/cakes?category=${cat.slug}`}
                className="group flex flex-col items-center shrink-0 snap-start space-y-1.5 transition-transform active:scale-95"
              >
                <div
                  className={`relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full p-0.5 transition-all duration-300 ${
                    cat.isAll
                      ? "bg-gradient-to-tr from-[#C59B27] via-gold-300 to-[#C59B27] shadow-[0_0_12px_rgba(212,175,55,0.4)] scale-[1.03]"
                      : "bg-gradient-to-tr from-gold-500/40 via-white/10 to-gold-500/40 hover:from-gold-400 hover:to-gold-300"
                  }`}
                >
                  <div className="relative flex h-full w-full items-center justify-center rounded-full bg-[#0d0b09] border border-black/40 overflow-hidden">
                    {cat.isAll ? (
                      <div className="relative flex h-full w-full items-center justify-center p-2.5">
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        sizes="80px"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    )}
                  </div>
                </div>
                <span
                  className={`text-[10.5px] sm:text-xs font-semibold leading-tight text-center max-w-[72px] sm:max-w-[84px] truncate ${
                    cat.isAll ? "text-gold-300 font-bold" : "text-cream-200 group-hover:text-gold-400"
                  }`}
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5 md:gap-4 lg:gap-5">
            {signatureCakes.map((cake) => (
              <Link
                key={cake.id}
                href={`/menu/cake/${cake.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-gold-500/20 bg-[#12100e] p-2 sm:p-3 transition-all hover:border-gold-500/50 hover:shadow-[0_4px_20px_rgba(212,175,55,0.15)]"
              >
                {/* Cake Image Container */}
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-luxury-950">
                  <Image
                    src={cake.image}
                    alt={cake.name}
                    fill
                    sizes="(max-width: 640px) 180px, (max-width: 1024px) 240px, 300px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12100e]/80 via-transparent to-transparent" />

                  {/* Top-Left Badge */}
                  {cake.badge && (
                    <div className="absolute top-1.5 left-1.5 z-10">
                      <span className={`rounded-md px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wider ${cake.badgeClass}`}>
                        {cake.badge}
                      </span>
                    </div>
                  )}

                  {/* Top-Right Rating */}
                  <div className="absolute top-1.5 right-1.5 z-10 flex items-center gap-0.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[8.5px] font-bold text-gold-400 border border-gold-500/30">
                    <span>★</span>
                    <span>4.9</span>
                  </div>
                </div>

                {/* Cake Details */}
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-1.5">
                    {/* Standard Indian Veg Icon */}
                    <span className="flex h-3 w-3 shrink-0 items-center justify-center rounded-[2px] border border-emerald-500 p-[1px]">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </span>
                    <h3 className="font-serif text-xs sm:text-sm font-bold text-[#FBF7EE] group-hover:text-gold-400 transition-colors truncate">
                      {cake.name}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-luxury-800/60">
                    <div>
                      <span className="text-[9px] text-luxury-400 block leading-none">Starting</span>
                      <span className="text-xs sm:text-sm font-bold text-gold-400">
                        ₹{cake.price}
                      </span>
                    </div>
                    <span className="inline-flex items-center space-x-1 rounded-lg border border-gold-500/40 bg-gold-500/10 px-2 py-0.5 text-[10px] font-bold text-gold-300 group-hover:bg-gold-500/20 transition-colors">
                      <span>Order</span>
                      <ArrowRight className="h-2.5 w-2.5" />
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

      {/* 8. FLOATING STICKY WHATSAPP CUSTOM CAKE BAR ON MOBILE */}
      <div className="fixed bottom-14 left-3 right-3 z-30 md:hidden">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-full border border-emerald-500/50 bg-[#0d1812]/95 px-4 py-2.5 shadow-[0_4px_20px_rgba(16,185,129,0.3)] backdrop-blur-md active:scale-95 transition-transform"
        >
          <div className="flex items-center space-x-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#25D366] text-white shadow-md animate-pulse">
              <MessageCircle className="h-4 w-4 fill-white text-white" />
            </span>
            <span className="text-[11.5px] font-bold text-cream-100">
              Order Custom Cake on WhatsApp
            </span>
          </div>
          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9.5px] font-bold text-emerald-400 border border-emerald-500/40">
            Instant →
          </span>
        </a>
      </div>

      {/* 9. FIXED MOBILE BOTTOM NAVIGATION BAR */}
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
