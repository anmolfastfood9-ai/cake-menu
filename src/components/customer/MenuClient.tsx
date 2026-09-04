"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/customer/Navbar";
import CakeCard from "@/components/customer/CakeCard";
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
        
        {/* 2. CELEBRATION HERO SHOWCASE (FLOATING CAKE WITH RADIAL SPOTLIGHT) */}
        <section className="relative w-full py-2 sm:py-4 text-center overflow-hidden">
          {/* Ambient Golden Radial Spotlight directly behind the cake */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(212,175,55,0.25),rgba(9,8,7,0)_70%)]" />

          <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto space-y-3 sm:space-y-4">
            {/* Giant Floating 3D Gold Cake Image */}
            <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 aspect-square -my-2">
              <Image
                src={heroImage}
                alt={heroTitle || "Crafted for Sweet Perfection"}
                fill
                priority
                sizes="(max-width: 768px) 300px, 360px"
                className="object-contain filter drop-shadow-[0_20px_35px_rgba(212,175,55,0.35)] hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Large Serif Display Headline */}
            <h1 className="font-serif text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#FBF7EE] leading-tight px-2">
              Crafted for Sweet Perfection
            </h1>

            {/* Glowing Emerald CTA Buttons */}
            <div className="pt-1 flex items-center justify-center gap-3.5 flex-wrap">
              <Link
                href="/menu/cakes"
                className="inline-flex items-center justify-center rounded-xl border border-emerald-500/60 bg-[#0c2419] px-6 sm:px-7 py-2.5 text-xs font-semibold text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:bg-emerald-900/50 active:scale-95 transition-all"
              >
                <span>Explore Menu</span>
              </Link>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-emerald-500/60 bg-[#0c2419] px-6 sm:px-7 py-2.5 text-xs font-semibold text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:bg-emerald-900/50 active:scale-95 transition-all"
              >
                <span>Book a Cake</span>
              </a>
            </div>
          </div>
        </section>

        {/* 3. DYNAMIC FESTIVAL BANNER */}
        <OccasionShowcase occasionData={activeOccasion} />

        {/* 4. CATEGORY NAVIGATION (STORY CIRCLES WITH GOLD RINGS) */}
        <section className="py-2">
          {/* Horizontal Story Circles Row */}
          <div className="flex items-center gap-4 overflow-x-auto py-1 scrollbar-none snap-x justify-start sm:justify-center px-1">
            {[
              {
                id: "all",
                name: "All",
                slug: "all",
                isAll: true,
                svg: (
                  <svg className="w-6 h-6 text-gold-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 4v4m0 0l-2-2m2 2l2-2" />
                    <path d="M4 14h16v6H4z" />
                    <path d="M6 10h12v4H6z" />
                  </svg>
                ),
              },
              {
                id: "truffle",
                name: "Truffle",
                slug: "chocolate-truffle",
                isAll: false,
                svg: (
                  <svg className="w-6 h-6 text-gold-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 3v3" />
                    <path d="M5 12c0-3.3 3.1-6 7-6s7 2.7 7 6v6H5v-6z" />
                    <path d="M8 12c0 1.5 1.8 2 4 2s4-.5 4-2" />
                  </svg>
                ),
              },
              {
                id: "fruit",
                name: "Fruit",
                slug: "fruit-berry",
                isAll: false,
                svg: (
                  <svg className="w-6 h-6 text-gold-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="7" />
                    <path d="M12 9v6m-3-3h6" />
                  </svg>
                ),
              },
              {
                id: "cheesecakes",
                name: "Cheesecakes",
                slug: "cheesecakes",
                isAll: false,
                svg: (
                  <svg className="w-6 h-6 text-gold-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 18l16-3V8L4 18z" />
                    <path d="M4 18v3h16v-6" />
                  </svg>
                ),
              },
              {
                id: "photo-cakes",
                name: "Photo Cakes",
                slug: "photo-designer",
                isAll: false,
                svg: (
                  <svg className="w-6 h-6 text-gold-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="4" y="6" width="16" height="12" rx="2" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ),
              },
            ].map((cat) => (
              <Link
                key={cat.id}
                href={cat.isAll ? "/menu/cakes" : `/menu/cakes?category=${cat.slug}`}
                className="group flex flex-col items-center shrink-0 snap-start space-y-1.5 active:scale-95 transition-transform"
              >
                <div
                  className={`relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full p-0.5 transition-all ${
                    cat.isAll
                      ? "border-2 border-gold-400 bg-[#14110e] shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                      : "border-2 border-gold-500/40 bg-[#12100e] hover:border-gold-400"
                  }`}
                >
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0d0b09]">
                    {cat.svg}
                  </div>
                </div>
                <span
                  className={`text-xs font-medium leading-tight text-center ${
                    cat.isAll ? "text-gold-300 font-bold" : "text-cream-200 group-hover:text-gold-400"
                  }`}
                >
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 5. SIGNATURE CAKES */}
        <section className="space-y-3 pt-1">
          <div className="px-1 text-left">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-gold-200">
              Signature Cakes
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {initialCakes.length > 0
              ? initialCakes.slice(0, 4).map((cake) => (
                  <CakeCard key={cake.id} cake={cake} whatsappNumber={whatsappNumber} restaurantName={restaurantName} />
                ))
              : signatureCakes.map((cake) => (
                  <CakeCard
                    key={cake.id}
                    cake={{
                      id: cake.id,
                      name: cake.name,
                      slug: cake.slug,
                      description: "Artisanal handcrafted luxury confection.",
                      coverImage: cake.image,
                      featured: cake.badge === "Signature",
                      bestseller: cake.badge === "Bestseller",
                      isNew: cake.badge === "New",
                      available: true,
                      prices: [{ weight: "1 kg", price: cake.price }],
                    }}
                    whatsappNumber={whatsappNumber}
                    restaurantName={restaurantName}
                  />
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

      {/* 8. SINGLE FLOATING STICKY WHATSAPP CUSTOM CAKE BAR ON MOBILE (MATCHES MOCKUP 1-TO-1) */}
      <div className="fixed bottom-3 left-3 right-3 z-50 md:hidden">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 rounded-full border border-emerald-500/50 bg-[#092217]/95 px-4 py-3 shadow-[0_0_20px_rgba(16,185,129,0.35)] backdrop-blur-md active:scale-95 transition-transform"
        >
          <span className="flex h-5 w-5 items-center justify-center text-[#25D366]">
            <MessageCircle className="h-5 w-5 fill-[#25D366] text-[#25D366]" />
          </span>
          <span className="text-xs sm:text-sm font-semibold text-emerald-100 tracking-wide">
            Order Custom Cake on WhatsApp
          </span>
        </a>
      </div>
    </div>
  );
}
