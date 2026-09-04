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
  const restaurantName = settings?.restaurantName || "RAMAN SWEET BAKERY";
  const tagline = settings?.tagline || "& Family Restaurant";
  const heroTitle = settings?.heroTitle || "Crafted for Sweet Perfection";
  const heroImage = settings?.heroImage || "/images/ref_hero_gold_cake.png";
  const whatsappNumber = whatsappSetting?.whatsappNumber || settings?.whatsapp || "919876543210";
  const phoneNumber = whatsappSetting?.callNumber || settings?.phone || "+91 98765 43210";

  // Dynamic Signature Cakes from DB with fallback matching reference image 1-to-1
  const displayCakes =
    initialCakes.length > 0
      ? initialCakes.slice(0, 4)
      : [
          {
            id: "1",
            name: "Belgian Chocolate Truffle",
            slug: "belgian-chocolate-truffle",
            coverImage: "/images/ref_belgian_chocolate.png",
            available: true,
            prices: [{ weight: "1 kg", price: 1499 }],
          },
          {
            id: "2",
            name: "Mango Passion Fruit Cheesecake",
            slug: "mango-passion-fruit-cheesecake",
            coverImage: "/images/ref_mango_cheesecake.png",
            available: true,
            prices: [{ weight: "1 kg", price: 1499 }],
          },
          {
            id: "3",
            name: "Ramari Cheesecake",
            slug: "ramari-cheesecake",
            coverImage: "/images/ref_ramari_cheesecake.png",
            available: true,
            prices: [{ weight: "1 kg", price: 1499 }],
          },
          {
            id: "4",
            name: "Cheesecake Truffle",
            slug: "cheesecake-truffle",
            coverImage: "/images/ref_cheesecake_truffle.png",
            available: true,
            prices: [{ weight: "1 kg", price: 1499 }],
          },
        ];

  // Dynamic Popular Categories from DB with fallback
  const categoriesList = [
    {
      id: "all",
      name: "All",
      isAll: true,
      slug: "all",
      image: "/images/cat_all.png",
    },
    ...(initialCategories.length > 0
      ? initialCategories.map((cat) => {
          let catImage = cat.image || "/images/cat_truffle.png";
          const lowerName = cat.name.toLowerCase();
          if (lowerName.includes("truffle") || lowerName.includes("chocolate")) {
            catImage = "/images/cat_truffle.png";
          } else if (lowerName.includes("fruit") || lowerName.includes("berry")) {
            catImage = "/images/cat_fruit.png";
          } else if (lowerName.includes("cheese")) {
            catImage = "/images/cat_cheesecakes.png";
          } else if (lowerName.includes("photo") || lowerName.includes("designer")) {
            catImage = "/images/cat_photo_cakes.png";
          }
          return {
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            isAll: false,
            image: catImage,
          };
        })
      : [
          { id: "truffle", name: "Truffle", slug: "chocolate-truffle", isAll: false, image: "/images/cat_truffle.png" },
          { id: "fruit", name: "Fruit", slug: "fruit-berry", isAll: false, image: "/images/cat_fruit.png" },
          { id: "cheesecakes", name: "Cheesecakes", slug: "cheesecakes", isAll: false, image: "/images/cat_cheesecakes.png" },
          { id: "photo-cakes", name: "Photo Cakes", slug: "photo-designer", isAll: false, image: "/images/cat_photo_cakes.png" },
        ]),
  ];

  const waLink = generateGeneralWhatsAppLink(whatsappNumber, restaurantName);

  return (
    <div className="min-h-screen flex flex-col bg-[#070605] text-[#FBF7EE] selection:bg-gold-500 selection:text-luxury-950 font-sans pb-36 md:pb-12">
      {/* 1. TOP HEADER BRAND NAVBAR */}
      <Navbar
        restaurantName={restaurantName}
        tagline={tagline}
        whatsappNumber={whatsappNumber}
        phoneNumber={phoneNumber}
      />

      {/* RESPONSIVE MAIN CONTENT CONTAINER (CONTROLLED MOBILE WIDTH & COMPACT TIGHT SPACING) */}
      <main className="w-full max-w-md md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-1 space-y-2.5 sm:space-y-4 flex-1">
        
        {/* 2. CELEBRATION HERO SHOWCASE (LARGE 3D FLOATING CAKE WITH SOFT BLENDING & SPOTLIGHT) */}
        <section className="relative w-full pt-1 pb-1 text-center overflow-hidden">
          {/* Ambient Golden Radial Spotlight directly behind the floating cake */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.4)_0%,rgba(16,185,129,0.12)_45%,transparent_75%)]" />

          <div className="relative z-10 flex flex-col items-center max-w-xl mx-auto space-y-2 sm:space-y-3">
            {/* Large Floating 3D Gold Cake Image with Soft Radial Edge Mask */}
            <div className="relative w-72 h-72 xs:w-80 xs:h-80 sm:w-88 sm:h-88 md:w-[420px] md:h-[420px] aspect-square -my-4 sm:-my-6 [mask-image:radial-gradient(circle_at_center,black_80%,transparent_100%)] [-webkit-mask-image:radial-gradient(circle_at_center,black_80%,transparent_100%)]">
              <Image
                src={heroImage}
                alt={heroTitle}
                fill
                priority
                sizes="(max-width: 768px) 360px, 460px"
                className="object-contain filter drop-shadow-[0_20px_35px_rgba(212,175,55,0.4)] hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Large Serif Display Headline with Gold Gradient */}
            <h1 className="font-serif text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#FFF3D1] via-[#E6C675] to-[#B89235] bg-clip-text text-transparent leading-snug px-2">
              {heroTitle}
            </h1>

            {/* Glowing Emerald CTA Buttons */}
            <div className="pt-0.5 flex items-center justify-center gap-3">
              <Link
                href="/menu/cakes"
                className="inline-flex items-center justify-center rounded-xl border border-emerald-500/70 bg-[#0c2419]/90 px-6 sm:px-8 py-2.5 text-xs sm:text-sm font-semibold text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:bg-emerald-900/50 active:scale-95 transition-all min-w-[120px]"
              >
                <span>Explore Menu</span>
              </Link>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-emerald-500/70 bg-[#0c2419]/90 px-6 sm:px-8 py-2.5 text-xs sm:text-sm font-semibold text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:bg-emerald-900/50 active:scale-95 transition-all min-w-[120px]"
              >
                <span>Book a Cake</span>
              </a>
            </div>
          </div>
        </section>

        {/* 3. DYNAMIC FESTIVAL BANNER */}
        <OccasionShowcase occasionData={activeOccasion} />

        {/* 4. CATEGORY NAVIGATION (SMOOTH TOUCH HORIZONTAL SCROLL) */}
        <section className="py-0.5 w-full overflow-hidden">
          <div className="flex items-center gap-3.5 overflow-x-auto py-1.5 px-1 scrollbar-none snap-x snap-mandatory touch-pan-x [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden justify-start sm:justify-center">
            {categoriesList.map((cat) => (
              <Link
                key={cat.id}
                href={cat.isAll ? "/menu/cakes" : `/menu/cakes?category=${cat.slug}`}
                className="group flex flex-col items-center shrink-0 snap-start space-y-1.5 active:scale-95 transition-transform min-w-[64px]"
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
                  className={`text-[11.5px] font-medium leading-tight text-center ${
                    cat.isAll ? "text-gold-300 font-bold" : "text-cream-200 group-hover:text-gold-400"
                  }`}
                >
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 5. SIGNATURE CAKES (EXACT 2-COLUMN MOBILE GRID MATCHING MOCKUP) */}
        <section className="space-y-2.5 pt-0.5">
          <div className="px-1 text-left">
            <h2 className="font-serif text-base sm:text-xl font-bold text-gold-200 tracking-wide">
              Signature Cakes
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
            {displayCakes.map((cake: any) => (
              <CakeCard
                key={cake.id}
                cake={{
                  id: cake.id,
                  name: cake.name,
                  slug: cake.slug || cake.id,
                  description: cake.description || "Artisanal handcrafted luxury confection.",
                  coverImage: cake.coverImage || cake.image || "/images/ref_belgian_chocolate.png",
                  featured: cake.featured || false,
                  bestseller: cake.bestseller || false,
                  isNew: cake.isNew || false,
                  available: cake.available !== false,
                  prices: cake.prices || [{ weight: "1 kg", price: cake.price || 1499 }],
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

      {/* 7. FLOATING STICKY WHATSAPP CTA BAR ON MOBILE */}
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
