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
  const heroImage = "/images/ref_hero_gold_cake.png";
  const whatsappNumber = whatsappSetting?.whatsappNumber || settings?.whatsapp || "919876543210";
  const phoneNumber = whatsappSetting?.callNumber || settings?.phone || "+91 98765 43210";

  // Dynamic Signature Cakes from DB with fallback matching reference image 1-to-1
  const signatureCakes = [
    {
      id: "1",
      name: "Belgian Chocolate Truffle",
      slug: "belgian-chocolate-truffle",
      price: 1499,
      badge: null,
      badgeClass: "",
      image: "/images/ref_belgian_chocolate.png",
    },
    {
      id: "2",
      name: "Mango Passion Fruit Cheesecake",
      slug: "mango-passion-fruit-cheesecake",
      price: 1499,
      badge: null,
      badgeClass: "",
      image: "/images/ref_mango_cheesecake.png",
    },
    {
      id: "3",
      name: "Ramari Cheesecake",
      slug: "ramari-cheesecake",
      price: 1499,
      badge: null,
      badgeClass: "",
      image: "/images/ref_ramari_cheesecake.png",
    },
    {
      id: "4",
      name: "Cheesecake Truffle",
      slug: "cheesecake-truffle",
      price: 1499,
      badge: null,
      badgeClass: "",
      image: "/images/ref_cheesecake_truffle.png",
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
                alt="Crafted for Sweet Perfection"
                fill
                priority
                sizes="(max-width: 768px) 300px, 360px"
                className="object-contain filter drop-shadow-[0_20px_35px_rgba(212,175,55,0.35)] hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Large Serif Display Headline with Gold Gradient */}
            <h1 className="font-serif text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#FFF3D1] via-[#E6C675] to-[#B89235] bg-clip-text text-transparent leading-tight px-2">
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

        {/* 4. CATEGORY NAVIGATION (EXACT 5 STORY RINGS FROM MOCKUP) */}
        <section className="py-2">
          {/* Horizontal Story Circles Row */}
          <div className="flex items-center gap-3.5 overflow-x-auto py-1 scrollbar-none snap-x justify-start sm:justify-center px-1">
            {[
              {
                id: "all",
                name: "All",
                slug: "all",
                isAll: true,
                image: "/images/cat_all.png",
              },
              {
                id: "truffle",
                name: "Truffle",
                slug: "chocolate-truffle",
                isAll: false,
                image: "/images/cat_truffle.png",
              },
              {
                id: "fruit",
                name: "Fruit",
                slug: "fruit-berry",
                isAll: false,
                image: "/images/cat_fruit.png",
              },
              {
                id: "cheesecakes",
                name: "Cheesecakes",
                slug: "cheesecakes",
                isAll: false,
                image: "/images/cat_cheesecakes.png",
              },
              {
                id: "photo-cakes",
                name: "Photo Cakes",
                slug: "photo-designer",
                isAll: false,
                image: "/images/cat_photo_cakes.png",
              },
            ].map((cat) => (
              <Link
                key={cat.id}
                href={cat.isAll ? "/menu/cakes" : `/menu/cakes?category=${cat.slug}`}
                className="group flex flex-col items-center shrink-0 snap-start space-y-1.5 active:scale-95 transition-transform"
              >
                <div
                  className={`relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full overflow-hidden p-0.5 transition-all ${
                    cat.isAll
                      ? "border-2 border-gold-400 bg-[#14110e] shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                      : "border-2 border-gold-500/40 bg-[#12100e] hover:border-gold-400"
                  }`}
                >
                  <div className="relative flex h-full w-full items-center justify-center rounded-full overflow-hidden">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
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

        {/* 5. SIGNATURE CAKES (EXACT 4 CARDS MATCHING MOCKUP 1-TO-1) */}
        <section className="space-y-3 pt-1 pb-6">
          <div className="px-1 text-left">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-gold-200">
              Signature Cakes
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {signatureCakes.map((cake) => (
              <CakeCard
                key={cake.id}
                cake={{
                  id: cake.id,
                  name: cake.name,
                  slug: cake.slug,
                  description: "Artisanal handcrafted luxury confection.",
                  coverImage: cake.image,
                  featured: false,
                  bestseller: false,
                  isNew: false,
                  available: true,
                  prices: [{ weight: "1 kg", price: cake.price }],
                }}
                whatsappNumber={whatsappNumber}
                restaurantName={restaurantName}
              />
            ))}
          </div>
        </section>
      </main>

      {/* 6. DESKTOP FOOTER */}
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

      {/* 7. SINGLE FLOATING STICKY WHATSAPP CUSTOM CAKE BAR ON MOBILE (MATCHES MOCKUP 1-TO-1) */}
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
