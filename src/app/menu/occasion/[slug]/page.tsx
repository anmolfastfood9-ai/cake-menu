import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/customer/Navbar";
import Footer from "@/components/customer/Footer";
import CakeCard from "@/components/customer/CakeCard";
import FloatingContact from "@/components/customer/FloatingContact";
import {
  getCachedOccasion,
  getCachedWebsiteSettings,
  getCachedWhatsAppSetting,
} from "@/lib/cache";
import {
  ArrowLeft,
  Sparkles,
  Leaf,
  Calendar,
  MessageCircle,
  Clock,
  ShieldCheck,
  ChefHat,
  ChevronRight,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;
  const occasion = await getCachedOccasion(slug);

  if (!occasion) {
    return {
      title: "Festive Occasion | Raman Sweet & Luxury Pâtisserie",
      description: "Explore our handcrafted eggless festive cake collections.",
    };
  }

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://sweetdelights.com").replace(/\/$/, "");
  const canonicalUrl = `${appUrl}/menu/occasion/${occasion.slug}`;
  const title = `${occasion.name} Festive Cake Collection | 100% Eggless Luxury Bakes`;
  const description =
    occasion.description ||
    `Celebrate ${occasion.name} with artisanal 100% eggless luxury cakes. Browse collection & enquire directly on WhatsApp.`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function OccasionPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const [occasion, settings, whatsappSetting] = await Promise.all([
    getCachedOccasion(slug),
    getCachedWebsiteSettings(),
    getCachedWhatsAppSetting(),
  ]);

  if (!occasion || !occasion.active) {
    notFound();
  }

  const cakes = occasion.cakes.map((co: any) => co.cake);
  const occurrence = (occasion as any).occurrences?.[0];

  const restaurantName = settings?.restaurantName || "Raman Sweet Cake";
  const whatsappNumber =
    whatsappSetting?.whatsappNumber || settings?.whatsapp || "919876543210";
  const phoneNumber =
    whatsappSetting?.callNumber || settings?.phone || "+91 98765 43210";
  const accentColor = occasion.accentColor || "#D4AF37";

  const eventDateStr = occurrence?.eventDate
    ? new Date(occurrence.eventDate).toLocaleDateString("en-IN", {
        weekday: "short",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const cleanWaNumber = whatsappNumber.replace(/[^0-9]/g, "");
  const customEnquiryMsg = encodeURIComponent(
    `Hello ${restaurantName},\n\nI am browsing the *${occasion.name} Collection* on your Digital Cake Menu and would like to enquire about special orders / custom cakes.\n\nPlease share details!`
  );
  const festiveWhatsAppUrl = `https://wa.me/${cleanWaNumber}?text=${customEnquiryMsg}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#080706] text-[#FBF7EE] selection:bg-gold-500 selection:text-luxury-950 font-sans">
      <Navbar
        restaurantName={restaurantName}
        whatsappNumber={whatsappNumber}
        phoneNumber={phoneNumber}
      />

      <main className="flex-1 py-5 sm:py-8">
        <div className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav className="mb-4 sm:mb-6 flex items-center space-x-2 text-xs font-medium text-cream-400">
            <Link
              href="/menu"
              className="hover:text-gold-400 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-gold-400" />
              <span>Digital Menu</span>
            </Link>
            <ChevronRight className="h-3 w-3 text-cream-600" />
            <span className="text-gold-400 font-semibold truncate">
              {occasion.name} Collection
            </span>
          </nav>

          {/* Occasion Hero Card */}
          <div
            className="relative overflow-hidden rounded-3xl border border-gold-500/25 bg-gradient-to-b from-[#181410] via-[#120f0d] to-[#0a0807] p-6 sm:p-10 shadow-2xl backdrop-blur-2xl"
            style={{
              boxShadow: `0 12px 40px -10px ${accentColor}25, 0 1px 3px rgba(0,0,0,0.5)`,
            }}
          >
            {/* Ambient Radial Glows */}
            <div
              className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl opacity-25"
              style={{ backgroundColor: accentColor }}
            />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full blur-3xl opacity-15 bg-gold-500" />

            {/* Content Container */}
            <div className="relative z-10 max-w-3xl space-y-4">
              {/* Badges Row */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Occasion Badge */}
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold tracking-wider uppercase border shadow-sm"
                  style={{
                    borderColor: `${accentColor}60`,
                    backgroundColor: `${accentColor}18`,
                    color: accentColor,
                  }}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{occasion.badgeText || `${occasion.name.toUpperCase()} SPECIAL`}</span>
                </span>

                {/* 100% Eggless Pure Veg Badge */}
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-950/50 px-3 py-1 text-xs font-semibold text-emerald-400 shadow-sm backdrop-blur-sm">
                  <Leaf className="h-3.5 w-3.5 text-emerald-400" />
                  <span>100% Pure Veg • Eggless</span>
                </span>

                {/* Live Celebration Date */}
                {eventDateStr && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/30 bg-gold-950/40 px-3 py-1 text-xs font-medium text-gold-300 backdrop-blur-sm">
                    <Calendar className="h-3.5 w-3.5 text-gold-400" />
                    <span>Celebration: {eventDateStr}</span>
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-cream-50 leading-tight">
                  {occasion.name}
                  <span className="block text-gold-400 font-sans text-lg sm:text-2xl font-light tracking-wide mt-1">
                    Festive Confection Collection
                  </span>
                </h1>

                {occasion.description && (
                  <p className="text-sm sm:text-base leading-relaxed text-cream-300 max-w-2xl font-normal">
                    {occasion.description}
                  </p>
                )}
              </div>

              {/* Quick Summary Pill & Pre-order note */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-cream-400 border-t border-gold-500/15">
                <div className="flex items-center gap-1.5 font-medium text-gold-300">
                  <ChefHat className="h-4 w-4 text-gold-400" />
                  <span>
                    {cakes.length} Artisanal {cakes.length === 1 ? "Creation" : "Creations"} Curated
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-cream-400">
                  <Clock className="h-3.5 w-3.5 text-gold-400/80" />
                  <span>Freshly Baked On Same-Day Order</span>
                </div>
                <div className="flex items-center gap-1.5 text-cream-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Sanitised Luxury Pâtisserie Box</span>
                </div>
              </div>
            </div>
          </div>

          {/* Festive Custom Inquiry Strip */}
          <div className="mt-6 rounded-2xl border border-gold-500/20 bg-gradient-to-r from-gold-950/40 via-luxury-900/60 to-gold-950/40 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-md shadow-lg">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2 text-gold-300 font-serif text-base font-semibold">
                <Sparkles className="h-4 w-4 text-gold-400" />
                <span>Custom Celebration & Bulk Orders for {occasion.name}</span>
              </div>
              <p className="text-xs text-cream-400 leading-relaxed">
                Need customized weights, festive eggless designs, or bulk party orders? Pre-order with our chefs directly on WhatsApp.
              </p>
            </div>

            <a
              href={festiveWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-950/50 transition-all active:scale-95 shrink-0"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Enquire for {occasion.name}</span>
            </a>
          </div>

          {/* Cakes Grid Section */}
          <div className="mt-8 sm:mt-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-cream-100 flex items-center gap-2">
                <span>Curated Festive Cakes</span>
                <span className="rounded-full bg-gold-500/15 border border-gold-500/30 px-2 py-0.5 text-xs text-gold-400 font-mono font-medium">
                  {cakes.length}
                </span>
              </h2>

              <Link
                href="/menu/cakes"
                className="text-xs font-medium text-gold-400 hover:text-gold-300 transition-colors"
              >
                View Full Catalog →
              </Link>
            </div>

            {cakes.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                {cakes.map((cake: any) => (
                  <CakeCard
                    key={cake.id}
                    cake={cake}
                    whatsappNumber={whatsappNumber}
                    restaurantName={restaurantName}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-cream-900 bg-luxury-900/40 p-12 text-center text-cream-400">
                <ChefHat className="mx-auto h-10 w-10 text-gold-400/50 mb-3" />
                <p className="text-sm">No cakes currently assigned to this festive collection.</p>
                <Link
                  href="/menu/cakes"
                  className="mt-4 inline-block text-xs font-semibold text-gold-400 hover:underline"
                >
                  Explore our complete menu →
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer
        restaurantName={restaurantName}
        phone={phoneNumber}
        whatsapp={whatsappNumber}
        address={settings?.address}
        openingHours={settings?.openingHours}
      />

      {/* Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-gold-500/20 bg-[#0d0c0a]/95 py-2 backdrop-blur-xl md:hidden">
        <Link
          href="/menu"
          className="flex flex-col items-center space-y-0.5 px-4 py-1 text-luxury-400 hover:text-cream-100 transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          <span className="text-[9.5px] font-medium">Menu</span>
        </Link>

        <Link
          href="/menu/cakes"
          className="relative flex flex-col items-center space-y-0.5 px-4 py-1 rounded-xl bg-gold-500/10 text-gold-400"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-[9.5px] font-bold">All Cakes</span>
        </Link>

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

