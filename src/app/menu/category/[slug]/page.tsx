import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/customer/Navbar";
import Footer from "@/components/customer/Footer";
import CakeCard from "@/components/customer/CakeCard";
import MobileBottomNav from "@/components/customer/MobileBottomNav";
import { ArrowLeft, MessageCircle, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      cakes: {
        where: { available: true },
        include: {
          category: true,
          prices: {
            orderBy: { price: "asc" },
          },
        },
        orderBy: [{ featured: "desc" }, { bestseller: "desc" }, { createdAt: "desc" }],
      },
    },
  });

  if (!category) {
    notFound();
  }

  const settings = await prisma.websiteSetting.findUnique({
    where: { id: "default" },
  });

  const whatsappSetting = await prisma.whatsAppSetting.findUnique({
    where: { id: "default" },
  });

  const restaurantName = settings?.restaurantName || "Raman Sweet & Luxury Pâtisserie";
  const whatsappNumber = whatsappSetting?.whatsappNumber || settings?.whatsapp || "919876543210";
  const phoneNumber = whatsappSetting?.callNumber || settings?.phone || "+91 98765 43210";

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-cream-100 pb-24 md:pb-0">
      <Navbar
        restaurantName={restaurantName}
        whatsappNumber={whatsappNumber}
        phoneNumber={phoneNumber}
      />

      <main className="flex-1 py-6 lg:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb / Back */}
          <div className="mb-4">
            <Link
              href="/menu"
              className="inline-flex items-center space-x-2 text-xs font-semibold text-gold-400 hover:text-gold-300 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Full Menu</span>
            </Link>
          </div>

          {/* Category Banner */}
          <div className="relative overflow-hidden rounded-[24px] border border-gold-500/25 bg-gradient-to-br from-[#15110C] via-[#0F0E0B] to-[#090806] p-6 sm:p-10 shadow-[0_14px_45px_rgba(0,0,0,0.45)]">
            {category.image && (
              <div className="absolute inset-y-0 right-0 hidden w-1/2 opacity-30 md:block">
                <img src={category.image} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#11100D] to-transparent" />
              </div>
            )}
            <div className="relative z-10 max-w-2xl">
              <span className="inline-flex items-center space-x-1.5 rounded-full border border-gold-500/30 bg-luxury-950/80 px-3 py-1 text-xs font-semibold text-gold-300">
                <Sparkles className="h-3.5 w-3.5 text-gold-400" />
                <span>Specialty Collection</span>
              </span>
              <h1 className="mt-4 font-serif text-3xl font-bold tracking-normal text-[#F8F0DE] sm:text-4xl">
                {category.name}
              </h1>
              {category.description && (
                <p className="mt-2 text-sm leading-relaxed text-luxury-300">
                  {category.description}
                </p>
              )}
              <span className="mt-4 inline-block text-xs font-medium text-gold-400">
                {category.cakes.length} eggless {category.cakes.length === 1 ? "cake" : "cakes"} available
              </span>
              <a
                href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hello ${restaurantName}, I want to enquire about ${category.name} cakes.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-emerald-300/35 bg-[#25D366] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-950/40"
              >
                <MessageCircle className="h-4 w-4 fill-white" />
                Order from this collection
              </a>
            </div>
          </div>

          {/* Cake Grid */}
          <div className="mt-8 sm:mt-10">
            {category.cakes.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                {category.cakes.map((cake) => (
                  <CakeCard
                    key={cake.id}
                    cake={cake}
                    whatsappNumber={whatsappNumber}
                    restaurantName={restaurantName}
                  />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-luxury-400">
                No cakes currently available in this category.
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
        instagram={settings?.instagram}
        facebook={settings?.facebook}
        footerText={settings?.footerText}
      />

      <MobileBottomNav active="cakes" />
    </div>
  );
}
