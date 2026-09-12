"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Sparkles,
  Check,
  Settings,
  Store,
  Clock,
  MapPin,
  Phone,
  Globe,
  AlertCircle,
  Upload,
  ImageIcon,
  ExternalLink,
  X,
  Eye,
  MessageCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

interface SettingsClientProps {
  initialSettings?: any;
}

export default function SettingsClient({ initialSettings }: SettingsClientProps) {
  const router = useRouter();

  const [restaurantName, setRestaurantName] = useState(
    initialSettings?.restaurantName || "Raman Sweet & Luxury Pâtisserie"
  );
  const [tagline, setTagline] = useState(
    initialSettings?.tagline || "Handcrafted Artisanal Cakes & Luxury Confections"
  );
  const [logo, setLogo] = useState(
    initialSettings?.logo || "/images/logo_emblem.png"
  );
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [heroTitle, setHeroTitle] = useState(
    initialSettings?.heroTitle || "Artisanal Elegance In Every Slice"
  );
  const [heroSubtitle, setHeroSubtitle] = useState(
    initialSettings?.heroSubtitle ||
      "Indulge in our curated collection of master-crafted cakes, baked fresh with premium Belgian cocoa, organic vanilla & French butter."
  );
  const [heroImage, setHeroImage] = useState(
    initialSettings?.heroImage ||
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200&auto=format&fit=crop"
  );
  const [about, setAbout] = useState(
    initialSettings?.about ||
      "Welcome to Raman Sweet Cake. Every creation is an edible masterpiece made to elevate your moments of joy and celebration."
  );
  const [phone, setPhone] = useState(initialSettings?.phone || "+91 98765 43210");
  const [whatsapp, setWhatsapp] = useState(initialSettings?.whatsapp || "919876543210");
  const [address, setAddress] = useState(
    initialSettings?.address || "Plot 42, Haute Pâtisserie Boulevard, Luxury District, Delhi NCR, India"
  );
  const [openingHours, setOpeningHours] = useState(
    initialSettings?.openingHours || "Monday - Sunday: 9:00 AM - 11:00 PM"
  );
  const [instagram, setInstagram] = useState(
    initialSettings?.instagram || "https://instagram.com/ramansweetcake"
  );
  const [facebook, setFacebook] = useState(
    initialSettings?.facebook || "https://facebook.com/ramansweetcake"
  );
  const [footerText, setFooterText] = useState(
    initialSettings?.footerText || "© 2026 Raman Sweet & Luxury Pâtisserie. Handcrafted with passion."
  );

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Upload & Media Picker state
  const [uploadingHero, setUploadingHero] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<"hero" | "logo">("hero");
  const [libraryImages, setLibraryImages] = useState<any[]>([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);

  // Fetch images for Media Library picker
  const openMediaPicker = async (target: "hero" | "logo" = "hero") => {
    setMediaPickerTarget(target);
    setMediaPickerOpen(true);
    if (libraryImages.length === 0) {
      setLoadingLibrary(true);
      try {
        const res = await fetch("/api/images");
        const data = await res.json();
        if (data.images) setLibraryImages(data.images);
      } catch (err) {
        console.error("Failed to load library images:", err);
      } finally {
        setLoadingLibrary(false);
      }
    }
  };

  // Direct Hero Image Upload
  const handleHeroUpload = async (file: File) => {
    setUploadingHero(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("folder", "/hero");

      const res = await fetch("/api/images", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Hero image upload failed");

      if (data.images && data.images[0]?.url) {
        setHeroImage(data.images[0].url);
        setLibraryImages((prev) => [data.images[0], ...prev]);
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload hero image");
    } finally {
      setUploadingHero(false);
    }
  };

  // Direct Logo Upload
  const handleLogoUpload = async (file: File) => {
    setUploadingLogo(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("folder", "/logo");

      const res = await fetch("/api/images", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Logo upload failed");

      if (data.images && data.images[0]?.url) {
        setLogo(data.images[0].url);
        setLibraryImages((prev) => [data.images[0], ...prev]);
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload logo");
    } finally {
      setUploadingLogo(false);
    }
  };

  // Sync state whenever initialSettings prop changes or after page refresh
  useEffect(() => {
    if (initialSettings) {
      if (initialSettings.restaurantName) setRestaurantName(initialSettings.restaurantName);
      if (initialSettings.tagline !== undefined) setTagline(initialSettings.tagline || "");
      if (initialSettings.logo !== undefined) setLogo(initialSettings.logo || "/images/logo_emblem.png");
      if (initialSettings.heroTitle !== undefined) setHeroTitle(initialSettings.heroTitle || "");
      if (initialSettings.heroSubtitle !== undefined) setHeroSubtitle(initialSettings.heroSubtitle || "");
      if (initialSettings.heroImage !== undefined) setHeroImage(initialSettings.heroImage || "");
      if (initialSettings.about !== undefined) setAbout(initialSettings.about || "");
      if (initialSettings.phone !== undefined) setPhone(initialSettings.phone || "");
      if (initialSettings.whatsapp !== undefined) setWhatsapp(initialSettings.whatsapp || "");
      if (initialSettings.address !== undefined) setAddress(initialSettings.address || "");
      if (initialSettings.openingHours !== undefined) setOpeningHours(initialSettings.openingHours || "");
      if (initialSettings.instagram !== undefined) setInstagram(initialSettings.instagram || "");
      if (initialSettings.facebook !== undefined) setFacebook(initialSettings.facebook || "");
      if (initialSettings.footerText !== undefined) setFooterText(initialSettings.footerText || "");
    }
  }, [initialSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        restaurantName: restaurantName.trim(),
        tagline: tagline.trim(),
        logo: logo ? logo.trim() : "",
        heroTitle: heroTitle.trim(),
        heroSubtitle: heroSubtitle.trim(),
        heroImage: heroImage.trim(),
        about: about.trim(),
        phone: phone.trim(),
        whatsapp: whatsapp.trim(),
        address: address.trim(),
        openingHours: openingHours.trim(),
        instagram: instagram.trim(),
        facebook: facebook.trim(),
        footerText: footerText.trim(),
      };

      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update settings in database");
      }

      // Update state directly from authoritative database record
      if (data.settings) {
        setRestaurantName(data.settings.restaurantName || "");
        setTagline(data.settings.tagline || "");
        if (data.settings.logo !== undefined) setLogo(data.settings.logo || "/images/logo_emblem.png");
        setHeroTitle(data.settings.heroTitle || "");
        setHeroSubtitle(data.settings.heroSubtitle || "");
        setHeroImage(data.settings.heroImage || "");
        setAbout(data.settings.about || "");
        setPhone(data.settings.phone || "");
        setWhatsapp(data.settings.whatsapp || "");
        setAddress(data.settings.address || "");
        setOpeningHours(data.settings.openingHours || "");
        setInstagram(data.settings.instagram || "");
        setFacebook(data.settings.facebook || "");
        setFooterText(data.settings.footerText || "");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-32 sm:pb-12">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-gold-400">
          Branding & Identity
        </span>
        <h1 className="font-serif text-2xl font-bold text-cream-50 sm:text-3xl">
          Website & Bakery Settings
        </h1>
        <p className="text-xs text-luxury-400">
          Changes configured here instantly appear on the customer digital menu without touching code.
        </p>
      </div>

      {success && (
        <div className="flex items-center space-x-2 rounded-2xl border border-emerald-500/40 bg-emerald-950/60 p-4 text-xs font-semibold text-emerald-400">
          <Check className="h-4 w-4 shrink-0" />
          <span>Website settings updated successfully! Live menu is in sync.</span>
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-2 rounded-2xl border border-red-500/40 bg-red-950/60 p-4 text-xs text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand Logo & Official Emblem Card */}
        <div className="rounded-3xl border border-gold-500/25 bg-luxury-900/80 p-6 sm:p-8 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-luxury-800 pb-3">
            <h2 className="font-serif text-base font-bold text-cream-100 flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-gold-400" />
              <span>Official Brand Logo & Crest</span>
            </h2>
            <span className="text-[10.5px] text-gold-400 bg-gold-500/10 border border-gold-500/25 px-2.5 py-0.5 rounded-full font-medium">
              Shown in Navbar & Menu
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pt-1">
            {/* Live Logo Preview Box */}
            <div className="flex flex-col items-center shrink-0">
              <div className="relative h-28 w-28 rounded-full overflow-hidden border-2 border-[#D4AF37]/60 bg-[#12100C] shadow-[0_0_30px_rgba(212,175,55,0.25)] flex items-center justify-center">
                {logo ? (
                  <img
                    src={logo}
                    alt="Brand Logo"
                    className="h-full w-full object-cover rounded-full"
                  />
                ) : (
                  <Store className="h-10 w-10 text-gold-400/50" />
                )}
                {uploadingLogo && (
                  <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center text-[10px] text-gold-400 font-bold backdrop-blur-xs">
                    <Loader2 className="h-5 w-5 animate-spin mb-1 text-gold-400" />
                    <span>Uploading...</span>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-gold-400/80 mt-2 font-semibold tracking-wide">
                Live Navbar Preview
              </span>
            </div>

            {/* Upload Controls */}
            <div className="flex-1 space-y-3.5 w-full text-center sm:text-left">
              <div>
                <h3 className="text-sm font-bold text-cream-100">
                  Upload Bakery Logo Emblem
                </h3>
                <p className="text-xs text-luxury-400 mt-1 leading-relaxed">
                  Upload your bakery circular logo or seal (PNG, JPG, WebP). This logo is dynamically shown in the customer navigation bar, digital menu headers, and brand badges.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
                <label className="flex items-center space-x-2 rounded-xl bg-gold-gradient px-4 py-2.5 text-xs font-bold text-luxury-950 shadow-gold-sm hover:brightness-110 active:scale-95 transition-all cursor-pointer">
                  {uploadingLogo ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Upload className="h-3.5 w-3.5" />
                  )}
                  <span>{uploadingLogo ? "Uploading..." : "Upload Logo Image"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingLogo}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleLogoUpload(file);
                    }}
                  />
                </label>

                <button
                  type="button"
                  onClick={() => openMediaPicker("logo")}
                  className="flex items-center space-x-2 rounded-xl border border-luxury-700 bg-luxury-800 px-3.5 py-2.5 text-xs font-semibold text-cream-200 hover:border-gold-500/50 hover:text-gold-400 transition-all active:scale-95"
                >
                  <ImageIcon className="h-3.5 w-3.5 text-gold-400" />
                  <span>Choose from Media</span>
                </button>

                {logo !== "/images/logo_emblem.png" && (
                  <button
                    type="button"
                    onClick={() => setLogo("/images/logo_emblem.png")}
                    className="flex items-center space-x-1.5 rounded-xl border border-luxury-800 bg-luxury-900/60 px-3 py-2.5 text-xs font-medium text-luxury-400 hover:text-cream-200 hover:border-luxury-700 transition-colors"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>Reset to Default</span>
                  </button>
                )}
              </div>

              {/* Direct Path / URL Field */}
              <div className="pt-1.5">
                <label className="block text-[10px] uppercase tracking-wider text-luxury-400 font-semibold mb-1">
                  Logo URL / File Path
                </label>
                <input
                  type="text"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  placeholder="/images/logo_emblem.png or https://..."
                  className="w-full rounded-xl border border-luxury-800 bg-[#161411] px-3.5 py-2 text-xs text-cream-100 placeholder-luxury-500 focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/30"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Brand & Hero Banner Card */}
        <div className="rounded-3xl border border-gold-500/20 bg-luxury-900/80 p-6 sm:p-8 shadow-xl space-y-5">
          <h2 className="font-serif text-base font-bold text-cream-100 flex items-center space-x-2 border-b border-luxury-800 pb-3">
            <Store className="h-4 w-4 text-gold-400" />
            <span>Bakery Brand & Hero Section</span>
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs font-semibold text-cream-200">
                Restaurant / Bakery Name
              </label>
              <input
                type="text"
                required
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-4 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs font-semibold text-cream-200">
                Brand Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-4 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs font-semibold text-cream-200">
                Hero Section Title
              </label>
              <input
                type="text"
                value={heroTitle}
                placeholder="e.g. Artisanal Elegance In Every Slice"
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-4 py-2.5 text-xs text-cream-100 placeholder:text-luxury-600 focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs font-semibold text-cream-200">
                Hero Section Subtitle
              </label>
              <textarea
                rows={2}
                value={heroSubtitle}
                placeholder="e.g. Indulge in our curated collection of master-crafted cakes, baked fresh with premium ingredients."
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full rounded-xl border border-luxury-700 bg-luxury-950 p-3 text-xs text-cream-100 placeholder:text-luxury-600 focus:border-gold-500 focus:outline-none"
              />
            </div>

            {/* Hero Showcase Image with Live Preview & Direct Controls */}
            <div className="space-y-3 sm:col-span-2 pt-2 border-t border-luxury-800">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-semibold text-cream-200">
                    Hero Showcase Banner Artwork
                  </label>
                  <p className="text-[10px] text-luxury-400">
                    Displayed at the top of your digital menu when no active festival banner is scheduled.
                  </p>
                </div>
                <span className="rounded bg-gold-500/15 border border-gold-500/30 px-2 py-0.5 text-[9px] font-semibold text-gold-300">
                  Live Banner
                </span>
              </div>

              {/* Interactive Live Banner Preview */}
              <div className="relative aspect-[16/5.5] w-full overflow-hidden rounded-2xl border border-gold-500/40 bg-[#0B0806] shadow-lg group">
                <img
                  src={heroImage || "/images/festivals/generic-luxury-banner.jpg"}
                  alt="Hero Showcase Preview"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/festivals/generic-luxury-banner.jpg";
                  }}
                />
                {/* Visual Overlay Preview */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col items-center justify-end p-3 sm:p-4 text-center">
                  <span className="text-[9px] uppercase tracking-widest text-[#E6C675] font-medium">
                    {tagline || "100% EGGLESS • LUXURY BAKERY"}
                  </span>
                  <h4 className="font-serif text-sm sm:text-base font-bold text-[#FFFDF7] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] line-clamp-1">
                    {heroTitle || restaurantName}
                  </h4>
                  {heroSubtitle && (
                    <p className="hidden sm:block text-[10px] text-cream-200/80 max-w-md line-clamp-1 mt-0.5">
                      {heroSubtitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons: Upload & Choose from Library */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl border border-gold-500/40 bg-gold-500/10 px-3.5 py-2 text-xs font-semibold text-gold-300 hover:bg-gold-500/20 active:scale-95 transition-all">
                  <Upload className="h-3.5 w-3.5" />
                  <span>{uploadingHero ? "Uploading..." : "Upload New Hero Photo"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingHero}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleHeroUpload(file);
                    }}
                  />
                </label>

                <button
                  type="button"
                  onClick={() => openMediaPicker("hero")}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-luxury-700 bg-luxury-950 px-3.5 py-2 text-xs text-luxury-300 hover:text-gold-400 hover:border-gold-500/40 active:scale-95 transition-all"
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  <span>Choose from Media Library</span>
                </button>
              </div>

              {/* Raw URL Input */}
              <div className="relative">
                <input
                  type="url"
                  value={heroImage}
                  placeholder="https://..."
                  onChange={(e) => setHeroImage(e.target.value)}
                  className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-4 py-2 text-xs text-cream-100 placeholder:text-luxury-600 focus:border-gold-500 focus:outline-none pr-10 font-mono text-[11px]"
                />
                {heroImage && (
                  <a
                    href={heroImage}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-luxury-400 hover:text-gold-400"
                    title="Open image in new tab"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Location Details */}
        <div className="rounded-3xl border border-gold-500/20 bg-luxury-900/80 p-6 sm:p-8 shadow-xl space-y-5">
          <h2 className="font-serif text-base font-bold text-cream-100 flex items-center space-x-2 border-b border-luxury-800 pb-3">
            <Phone className="h-4 w-4 text-gold-400" />
            <span>Contact & Physical Boutique Details</span>
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-cream-200">
                  Direct Call Phone Number
                </label>
                {phone && (
                  <a
                    href={`tel:${phone}`}
                    className="text-[10px] text-gold-400 hover:underline inline-flex items-center gap-1"
                  >
                    <Phone className="h-2.5 w-2.5" />
                    <span>Test Call</span>
                  </a>
                )}
              </div>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-4 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-cream-200">
                  WhatsApp Number (with Country Code e.g. 919876543210)
                </label>
                {whatsapp && (
                  <a
                    href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-emerald-400 hover:underline inline-flex items-center gap-1"
                  >
                    <WhatsAppIcon className="h-2.5 w-2.5" />
                    <span>Test Chat</span>
                  </a>
                )}
              </div>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-4 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-cream-200">
                  Bakery Address
                </label>
                {address && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-gold-400 hover:underline inline-flex items-center gap-1"
                  >
                    <MapPin className="h-2.5 w-2.5" />
                    <span>Google Maps</span>
                  </a>
                )}
              </div>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-4 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs font-semibold text-cream-200">
                Opening Hours
              </label>
              <input
                type="text"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-4 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Story, Social & Footer */}
        <div className="rounded-3xl border border-gold-500/20 bg-luxury-900/80 p-6 sm:p-8 shadow-xl space-y-5">
          <h2 className="font-serif text-base font-bold text-cream-100 flex items-center space-x-2 border-b border-luxury-800 pb-3">
            <Globe className="h-4 w-4 text-gold-400" />
            <span>Bakery Story & Social Channels</span>
          </h2>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-cream-200">
                Bakery Story / About Text
              </label>
              <textarea
                rows={3}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="w-full rounded-xl border border-luxury-700 bg-luxury-950 p-3 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-cream-200">
                  Instagram Profile URL
                </label>
                <input
                  type="url"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-4 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-cream-200">
                  Facebook Page URL
                </label>
                <input
                  type="url"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-4 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-cream-200">
                Footer Copyright Text
              </label>
              <input
                type="text"
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-4 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-xl bg-gold-gradient px-7 py-3.5 text-xs font-bold text-luxury-950 shadow-gold-sm hover:opacity-95 transition-opacity"
          >
            {saving ? (
              <Sparkles className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Check className="h-4 w-4" />
                <span>Save All Website Settings</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Media Picker Modal */}
      {mediaPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-4 backdrop-blur-md overflow-y-auto">
          <div className="relative max-w-2xl w-full rounded-3xl border border-gold-500/30 bg-[#14120f] p-4 sm:p-6 shadow-2xl space-y-4 my-auto max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-luxury-800 pb-3">
              <div className="flex items-center space-x-2">
                <ImageIcon className="h-4 w-4 text-gold-400" />
                <h3 className="font-serif text-base font-bold text-cream-50">
                  {mediaPickerTarget === "logo" ? "Select Brand Logo Emblem" : "Select Hero Banner Artwork"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setMediaPickerOpen(false)}
                className="rounded-xl p-1.5 text-luxury-400 hover:text-cream-100 hover:bg-luxury-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-luxury-400">
              {mediaPickerTarget === "logo"
                ? "Tap any image to set it as your bakery brand logo emblem."
                : "Tap any image to instantly select it as your hero showcase banner."}
            </p>

            {loadingLibrary ? (
              <div className="py-16 text-center text-xs text-luxury-400">
                <Sparkles className="h-6 w-6 animate-spin mx-auto text-gold-400 mb-2" />
                <span>Loading media assets...</span>
              </div>
            ) : libraryImages.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto max-h-96 pr-1">
                {libraryImages.map((img) => {
                  const isSelected = mediaPickerTarget === "logo" ? logo === img.url : heroImage === img.url;
                  return (
                    <div
                      key={img.id}
                      onClick={() => {
                        if (mediaPickerTarget === "logo") {
                          setLogo(img.url);
                        } else {
                          setHeroImage(img.url);
                        }
                        setMediaPickerOpen(false);
                      }}
                      className={`group relative aspect-[16/10] overflow-hidden rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? "border-gold-500 ring-2 ring-gold-500/50 shadow-gold-sm"
                          : "border-luxury-800 hover:border-gold-500/50"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.filename}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                        <span className="text-[10px] text-cream-100 font-medium truncate">
                          {img.filename}
                        </span>
                      </div>
                      {isSelected && (
                        <span className="absolute top-1.5 right-1.5 rounded-full bg-gold-500 text-luxury-950 p-1 shadow-lg">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-luxury-400">
                No images found in library. Use &quot;Upload&quot; to add artwork.
              </div>
            )}

            <div className="flex justify-end border-t border-luxury-800 pt-3">
              <button
                type="button"
                onClick={() => setMediaPickerOpen(false)}
                className="rounded-xl border border-luxury-700 px-4 py-2 text-xs font-semibold text-luxury-300 hover:text-cream-100 hover:bg-luxury-900 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
