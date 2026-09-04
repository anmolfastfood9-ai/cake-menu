"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/customer/Navbar";
import CakeCard from "@/components/customer/CakeCard";
import { MessageCircle } from "lucide-react";
import { generateGeneralWhatsAppLink } from "@/lib/whatsapp";
import OccasionShowcase from "@/components/customer/OccasionShowcase";
import Footer from "@/components/customer/Footer";
import MobileBottomNav from "@/components/customer/MobileBottomNav";

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
  /*
   * ============================================================
   * DYNAMIC WEBSITE SETTINGS
   * ============================================================
   */
  const restaurantName =
    settings?.restaurantName || "RAMAN SWEET BAKERY";

  const tagline =
    settings?.tagline || "& Family Restaurant";

  // Match reference title "Crafted for Sweet Perfection" unless customized
  const configuredTitle = settings?.heroTitle;
  const heroTitle =
    configuredTitle &&
    configuredTitle !== "Digital Cake Menu" &&
    configuredTitle !== "Every Moment Celebrates Sweet Perfection"
      ? configuredTitle
      : "Crafted for Sweet Perfection";

  // Reference does not have subtitle text under title
  const heroSubtitle = "";

  // Use admin setting heroImage if configured; fallback to gold hero cake PNG
  const heroImage =
    settings?.heroImage ||
    settings?.heroShowcaseImage ||
    "/images/ref_hero_gold_cake.png";

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
   * SIGNATURE CAKES DATA
   * High-resolution reference mapping for optimal quality
   * ============================================================
   */
  const displayCakes =
    initialCakes.length > 0
      ? initialCakes.slice(0, 4).map((c, index) => {
          let cover = c.coverImage || c.image;
          if (
            !cover ||
            cover.includes("photo-1578985545062-69928b1d9587") ||
            cover.includes("photo-1588195538326")
          ) {
            const fallbackImages = [
              "/images/ref_belgian_chocolate.png",
              "/images/ref_mango_cheesecake.png",
              "/images/ref_ramari_cheesecake.png",
              "/images/ref_cheesecake_truffle.png",
            ];
            cover = fallbackImages[index % 4];
          }
          return {
            ...c,
            coverImage: cover,
          };
        })
      : [
          {
            id: "1",
            name: "Belgian Chocolate Truffle",
            slug: "chocolate-truffle",
            coverImage: "/images/ref_belgian_chocolate.png",
            available: true,
            prices: [{ weight: "1 kg", price: 1499 }],
          },
          {
            id: "2",
            name: "Mango Passion Fruit Cheesecake",
            slug: "mango-delight",
            coverImage: "/images/ref_mango_cheesecake.png",
            available: true,
            prices: [{ weight: "1 kg", price: 1499 }],
          },
          {
            id: "3",
            name: "Ramari Cheesecake",
            slug: "blueberry-cheesecake",
            coverImage: "/images/ref_ramari_cheesecake.png",
            available: true,
            prices: [{ weight: "1 kg", price: 1499 }],
          },
          {
            id: "4",
            name: "Cheesecake Truffle",
            slug: "24k-royal-gold-truffle",
            coverImage: "/images/ref_cheesecake_truffle.png",
            available: true,
            prices: [{ weight: "1 kg", price: 1499 }],
          },
        ];

  const categoryImageFor = (cat: any) => {
    const label = `${cat.name} ${cat.slug}`.toLowerCase();
    if (label.includes("fruit") || label.includes("berry") || label.includes("mango")) return "/images/cat_fruit.png";
    if (label.includes("photo") || label.includes("designer")) return "/images/cat_photo_cakes.png";
    if (label.includes("premium") || label.includes("cheese")) return "/images/cat_cheesecakes.png";
    if (label.includes("birthday") || label.includes("anniversary")) return "/images/cat_all.png";
    return "/images/cat_truffle.png";
  };

  const categoriesList = [
    {
      id: "all",
      name: "Cakes",
      isAll: true,
      slug: "all",
      image: "/images/cat_all.png",
    },
    ...(initialCategories.length > 0
      ? initialCategories.slice(0, 7).map((cat) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          isAll: false,
          image: cat.image && cat.image.startsWith("/") ? cat.image : categoryImageFor(cat),
        }))
      : [
          { id: "chocolate", name: "Chocolate", slug: "chocolate", isAll: false, image: "/images/cat_truffle.png" },
          { id: "fruit", name: "Fruit", slug: "fruit-berry", isAll: false, image: "/images/cat_fruit.png" },
          { id: "premium", name: "Premium", slug: "premium", isAll: false, image: "/images/cat_cheesecakes.png" },
          { id: "photo-cakes", name: "Photo Cakes", slug: "photo-cakes", isAll: false, image: "/images/cat_photo_cakes.png" },
        ]),
  ];

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
        <section className="relative w-full text-center overflow-hidden">
          {/* Ambient background glow */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-x-4
              top-10
              h-[300px]
              rounded-full
              bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.24)_0%,rgba(16,185,129,0.10)_38%,transparent_74%)]
              blur-2xl
            "
          />

          <div className="relative z-10 flex flex-col items-center">
            {/* ------------------------------------------------
                Hero Cake
                ------------------------------------------------ */}
            <div
              className="
                relative
                w-[270px]
                h-[270px]
                sm:w-[300px]
                sm:h-[300px]
                md:w-[350px]
                md:h-[350px]
                lg:w-[390px]
                lg:h-[390px]
                -mt-1
                md:mt-1
                -mb-1
              "
            >
              <Image
                src={heroImage}
                alt={heroTitle}
                fill
                priority
                sizes="
                  (max-width: 430px) 270px,
                  (max-width: 640px) 300px,
                  (max-width: 1024px) 350px,
                  390px
                "
                className="
                  object-contain
                  drop-shadow-[0_18px_30px_rgba(212,175,55,0.28)]
                  transition-transform
                  duration-700
                "
              />
            </div>

            {/* ------------------------------------------------
                Hero Title
                ------------------------------------------------ */}
            <h1
              className="
                max-w-[370px]
                px-3
                mt-1
                md:mt-2
                font-serif
                text-[26px]
                sm:text-[31px]
                md:text-[42px]
                lg:text-[48px]
                font-bold
                leading-[1.12]
                tracking-normal
                bg-gradient-to-r
                from-[#FFF2CC]
                via-[#E6C675]
                to-[#C59A3A]
                bg-clip-text
                text-transparent
              "
            >
              {heroTitle}
            </h1>

            {/* Keep subtitle available when configured,
                but don't introduce extra height when empty. */}
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
                Hero CTA
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
              <Link
                href="/menu/cakes"
                className="
                  inline-flex
                  h-10
                  min-w-[128px]
                  sm:min-w-[138px]
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-emerald-500/70
                  bg-[#081a12]
                  px-4
                  text-[12px]
                  sm:text-sm
                  font-semibold
                  text-emerald-100
                  shadow-[0_0_16px_rgba(16,185,129,0.20)]
                  transition-all
                  active:scale-[0.97]
                  hover:bg-[#0b2619]
                "
              >
                Explore Menu
              </Link>

              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex
                  h-10
                  min-w-[128px]
                  sm:min-w-[138px]
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-emerald-500/70
                  bg-[#081a12]
                  px-4
                  text-[12px]
                  sm:text-sm
                  font-semibold
                  text-emerald-100
                  shadow-[0_0_16px_rgba(16,185,129,0.20)]
                  transition-all
                  active:scale-[0.97]
                  hover:bg-[#0b2619]
                "
              >
                Book a Cake
              </a>
            </div>
          </div>
        </section>

        {/* ====================================================
            FESTIVAL / OCCASION
        ==================================================== */}
        <div className="mt-3 sm:mt-4">
          <OccasionShowcase occasionData={activeOccasion} />
        </div>

        {/* ====================================================
            CATEGORY NAVIGATION
        ==================================================== */}
        <section className="mt-4 sm:mt-5 w-full min-w-0">
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
              py-1
              px-1
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
                gap-[9px]
                sm:gap-3
              "
            >
              {categoriesList.map((cat) => (
                <Link
                  key={cat.id}
                  href={
                    cat.isAll
                      ? "/menu/cakes"
                      : `/menu/cakes?category=${cat.slug}`
                  }
                  className="
                    group
                    flex
                    w-[70px]
                    min-w-[70px]
                    shrink-0
                    snap-start
                    flex-col
                    items-center
                    text-center
                    active:scale-[0.96]
                    transition-transform
                  "
                >
                  <div
                    className={`
                      relative
                      flex
                      h-[58px]
                      w-[58px]
                      items-center
                      justify-center
                      overflow-hidden
                      rounded-full
                      p-[2px]
                      transition-all
                      ${cat.isAll
                        ? "border-2 border-[#D4AF37] bg-[#11100D] shadow-[0_0_16px_rgba(212,175,55,0.36)]"
                        : "border-2 border-[#D4AF37]/45 bg-[#11100D] group-hover:border-[#D4AF37]"
                      }
                    `}
                  >
                    <div className="relative h-full w-full overflow-hidden rounded-full">
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        sizes="58px"
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <span
                    className={`
                      mt-1.5
                      w-full
                      whitespace-nowrap
                      overflow-hidden
                      text-ellipsis
                      text-[10px]
                      sm:text-[11px]
                      leading-tight
                      ${cat.isAll
                        ? "font-bold text-[#E7C96B]"
                        : "font-medium text-[#F2EEE6]"
                      }
                    `}
                  >
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ====================================================
            SIGNATURE CAKES
        ==================================================== */}
        <section className="mt-4 sm:mt-5">
          <div className="mb-2 px-0.5">
            <h2
              className="
                font-serif
                text-[19px]
                sm:text-xl
                md:text-2xl
                font-bold
                leading-tight
                text-[#E7C96B]
              "
            >
              Signature Cakes
            </h2>
          </div>

          <div
            className="
              grid
              grid-cols-2
              gap-2.5
              sm:gap-3
              md:grid-cols-4
              md:gap-4
              lg:gap-5
            "
          >
            {displayCakes.map((cake: any) => (
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
                    cake.prices ||
                    [
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
        </section>
      </main>

      {/* ======================================================
          DESKTOP FOOTER
      ====================================================== */}
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

      {/* ======================================================
          MOBILE FLOATING WHATSAPP
          The main content has enough bottom padding so this
          never has to hide the final cake-card controls.
      ====================================================== */}
      <div
        className="
          fixed
          inset-x-3
          bottom-[calc(76px+env(safe-area-inset-bottom))]
          z-50
          md:hidden
          pointer-events-none
        "
      >
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="
            pointer-events-auto
            flex
            min-h-[46px]
            w-full
            items-center
            justify-center
            gap-2.5
            rounded-full
            border
            border-emerald-500/65
            bg-[#062116]/95
            px-4
            py-2.5
            text-center
            shadow-[0_0_22px_rgba(16,185,129,0.34)]
            backdrop-blur-md
            transition-transform
            active:scale-[0.98]
          "
        >
          <span className="flex h-5 w-5 shrink-0 items-center justify-center text-[#25D366]">
            <MessageCircle className="h-5 w-5 fill-[#25D366] text-[#25D366]" />
          </span>

          <span
            className="
              text-xs
              sm:text-sm
              font-semibold
              tracking-wide
              text-emerald-100
            "
          >
            Order Custom Cake on WhatsApp
          </span>
        </a>
      </div>
      <MobileBottomNav active="menu" />
    </div>
  );
}
