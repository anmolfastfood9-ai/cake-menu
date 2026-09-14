"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import {
  Cake,
  FolderTree,
  Image as ImageIcon,
  Sparkles,
  Plus,
  ArrowRight,
  ExternalLink,
  Settings,
  Eye,
  ShieldCheck,
  Zap,
  Smartphone,
  Check,
  Search,
  Tag,
  Star,
  Crown,
  ChefHat,
  Calendar,
  Layers,
  Copy,
  Download,
  Edit,
  SlidersHorizontal,
  RefreshCw,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

interface AdminDashboardClientProps {
  totalCakes: number;
  availableCakes: number;
  featuredCakes: number;
  bestsellerCakes: number;
  totalCategories: number;
  categoriesWithCount?: any[];
  activeOccasions?: any[];
  totalImages: number;
  recentCakes?: any[];
  sampleImages?: any[];
  pricingStats?: {
    minPrice: number;
    maxPrice: number;
    avgPrice: number;
  };
  settings?: any;
  whatsappSetting?: any;
}

export default function AdminDashboardClient({
  totalCakes = 0,
  availableCakes = 0,
  featuredCakes = 0,
  bestsellerCakes = 0,
  totalCategories = 0,
  categoriesWithCount = [],
  activeOccasions = [],
  totalImages = 0,
  recentCakes = [],
  sampleImages = [],
  pricingStats = { minPrice: 499, maxPrice: 2499, avgPrice: 899 },
  settings,
  whatsappSetting,
}: AdminDashboardClientProps) {
  // Local state for interactive inventory
  const [cakesList, setCakesList] = useState(recentCakes);
  const [activeTab, setActiveTab] = useState<"all" | "in_stock" | "out_of_stock" | "bestsellers" | "featured">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // WhatsApp quick settings
  const [waNumber, setWaNumber] = useState(
    whatsappSetting?.whatsappNumber || settings?.whatsapp || "919876543210"
  );
  const [savingWa, setSavingWa] = useState(false);
  const [savedWa, setSavedWa] = useState(false);

  // QR code & link copy state
  const [origin, setOrigin] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const menuUrl = origin ? `${origin}/menu` : "https://ramansweet.com/menu";
  const restaurantName = settings?.restaurantName || "Raman Sweet";

  // Formatted date
  const [currentDateStr, setCurrentDateStr] = useState("");
  useEffect(() => {
    const d = new Date();
    setCurrentDateStr(
      d.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    );
  }, []);

  // Quick inline stock availability toggle
  const handleToggleAvailability = async (cakeId: string, currentStatus: boolean) => {
    setTogglingId(cakeId);
    // Optimistic UI update
    setCakesList((prev) =>
      prev.map((c) => (c.id === cakeId ? { ...c, available: !currentStatus } : c))
    );

    try {
      const res = await fetch(`/api/cakes/${cakeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: !currentStatus }),
      });
      if (!res.ok) {
        // Rollback
        setCakesList((prev) =>
          prev.map((c) => (c.id === cakeId ? { ...c, available: currentStatus } : c))
        );
      }
    } catch (e) {
      console.error("Failed to update cake status", e);
      // Rollback
      setCakesList((prev) =>
        prev.map((c) => (c.id === cakeId ? { ...c, available: currentStatus } : c))
      );
    } finally {
      setTogglingId(null);
    }
  };

  // Save WhatsApp number
  const handleSaveWa = async () => {
    setSavingWa(true);
    try {
      await fetch("/api/whatsapp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whatsappNumber: waNumber }),
      });
      setSavedWa(true);
      setTimeout(() => setSavedWa(false), 2500);
    } catch (e) {
      console.error(e);
    } finally {
      setSavingWa(false);
    }
  };

  // Copy Menu URL
  const handleCopyLink = () => {
    navigator.clipboard.writeText(menuUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Download QR Code
  const handleDownloadQR = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new window.Image();
    img.onload = () => {
      canvas.width = 1000;
      canvas.height = 1000;
      if (ctx) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 50, 50, 900, 900);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `${restaurantName.toLowerCase().replace(/\s+/g, "-")}-table-qr.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  // Filter cakes for inventory studio
  const filteredCakes = useMemo(() => {
    return cakesList.filter((cake) => {
      // Tab filter
      if (activeTab === "in_stock" && !cake.available) return false;
      if (activeTab === "out_of_stock" && cake.available) return false;
      if (activeTab === "bestsellers" && !cake.bestseller) return false;
      if (activeTab === "featured" && !cake.featured) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = cake.name.toLowerCase().includes(q);
        const matchesCategory = cake.category?.name?.toLowerCase().includes(q);
        if (!matchesName && !matchesCategory) return false;
      }

      return true;
    });
  }, [cakesList, activeTab, searchQuery]);

  const outOfStockCount = Math.max(0, totalCakes - availableCakes);

  return (
    <div className="space-y-7 pb-12">
      {/* 1. TOP EXECUTIVE HEADER BAR */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-luxury-800 pb-5">
        <div className="flex items-center space-x-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold-500/15 text-gold-400 border border-gold-500/30 shadow-gold-sm">
            <ChefHat className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-cream-50">
                Dashboard
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Menu Live
              </span>
            </div>
            <p className="text-xs text-luxury-400 mt-0.5">
              Welcome back, <span className="text-gold-400 font-semibold">Chef Raman</span> • {currentDateStr || "Today"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/cakes/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-gold-gradient px-4 py-2 text-xs font-bold text-luxury-950 shadow-gold-sm hover:opacity-95 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add Cake</span>
          </Link>

          <a
            href="/menu"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-gold-500/30 bg-[#161411] px-4 py-2 text-xs font-semibold text-gold-300 hover:border-gold-500/60 hover:bg-gold-500/10 transition-all"
          >
            <span>Live Menu</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* 2. PROPERLY PAIRED 4-METRICS ROW: 2x2 ON MOBILE, 4-COL ON DESKTOP */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {/* Metric 1: Total Cakes */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:space-x-3.5 rounded-2xl border border-gold-500/20 bg-[#13110e] p-3.5 sm:p-5 shadow-lg hover:border-gold-500/40 transition-colors">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-gold-500/15 text-gold-400 border border-gold-500/30 shadow-inner">
            <Cake className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="min-w-0 flex-1 space-y-0.5">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-luxury-400 block truncate">
              Total Cakes
            </span>
            <div className="flex items-baseline space-x-1.5 sm:space-x-2">
              <span className="font-price text-2xl sm:text-3xl font-extrabold text-cream-50 leading-tight">
                {totalCakes}
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-emerald-400 truncate">
                ● {availableCakes} In Stock
              </span>
            </div>
            {outOfStockCount > 0 && (
              <span className="text-[9.5px] sm:text-[10.5px] font-medium text-amber-400 block truncate">
                {outOfStockCount} Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* Metric 2: Categories */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:space-x-3.5 rounded-2xl border border-gold-500/20 bg-[#13110e] p-3.5 sm:p-5 shadow-lg hover:border-gold-500/40 transition-colors">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-inner">
            <FolderTree className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="min-w-0 flex-1 space-y-0.5">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-luxury-400 block truncate">
              Categories
            </span>
            <div className="flex items-baseline space-x-1.5 sm:space-x-2">
              <span className="font-price text-2xl sm:text-3xl font-extrabold text-cream-50 leading-tight">
                {totalCategories}
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-amber-300 truncate">
                Collections
              </span>
            </div>
            <span className="text-[9.5px] sm:text-[10.5px] font-medium text-luxury-400 block truncate">
              Specialty Varieties
            </span>
          </div>
        </div>

        {/* Metric 3: Avg Price */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:space-x-3.5 rounded-2xl border border-gold-500/20 bg-[#13110e] p-3.5 sm:p-5 shadow-lg hover:border-gold-500/40 transition-colors">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-gold-500/15 text-gold-400 border border-gold-500/30 shadow-inner">
            <Tag className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="min-w-0 flex-1 space-y-0.5">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-luxury-400 block truncate">
              Avg Price
            </span>
            <div className="flex items-baseline space-x-1.5 sm:space-x-2">
              <span className="font-price text-xl sm:text-3xl font-extrabold text-gold-300 leading-tight">
                ₹{pricingStats.avgPrice.toLocaleString("en-IN")}
              </span>
            </div>
            <span className="text-[9.5px] sm:text-[10.5px] font-medium text-luxury-400 block truncate">
              Range: ₹{pricingStats.minPrice.toLocaleString("en-IN")} – ₹{pricingStats.maxPrice.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Metric 4: Spotlight Curations */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:space-x-3.5 rounded-2xl border border-gold-500/20 bg-[#13110e] p-3.5 sm:p-5 shadow-lg hover:border-gold-500/40 transition-colors">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-purple-500/15 text-purple-400 border border-purple-500/30 shadow-inner">
            <Crown className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="min-w-0 flex-1 space-y-0.5">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-luxury-400 block truncate">
              Spotlight
            </span>
            <div className="flex items-baseline space-x-1.5 sm:space-x-2">
              <span className="font-price text-2xl sm:text-3xl font-extrabold text-cream-50 leading-tight">
                {bestsellerCakes}
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-amber-400 truncate">
                Stars ★
              </span>
            </div>
            <span className="text-[9.5px] sm:text-[10.5px] font-medium text-gold-400 block truncate">
              {featuredCakes} Featured
            </span>
          </div>
        </div>
      </div>

      {/* 3. QUICK ACTIONS & CATEGORY BREAKDOWN ROW */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Quick Action Shortcuts (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-gold-500/20 bg-[#13110e] p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-luxury-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-gold-400" />
              <h2 className="font-sans text-xs font-bold uppercase tracking-wider text-cream-50">
                Quick Action Shortcuts
              </h2>
            </div>
            <span className="text-[11px] text-luxury-400">1-click navigation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <Link
              href="/admin/cakes/new"
              className="group flex items-center justify-between rounded-xl border border-gold-500/25 bg-[#161410] p-3.5 hover:border-gold-500/60 hover:bg-[#1c1813] transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold-500/15 text-gold-400 border border-gold-500/25 group-hover:bg-gold-500 group-hover:text-luxury-950 transition-colors">
                  <Plus className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-cream-100 group-hover:text-gold-300 transition-colors">
                    Add New Cake
                  </span>
                  <span className="block text-[11px] text-luxury-400">
                    Create item & weight tiers
                  </span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-luxury-500 group-hover:text-gold-400 group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/admin/categories"
              className="group flex items-center justify-between rounded-xl border border-luxury-800 bg-[#161410] p-3.5 hover:border-gold-500/40 hover:bg-[#1a1713] transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-luxury-900 text-luxury-300 border border-luxury-800 group-hover:text-gold-400 transition-colors">
                  <FolderTree className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-cream-100 group-hover:text-gold-300 transition-colors">
                    Manage Categories
                  </span>
                  <span className="block text-[11px] text-luxury-400">
                    Organize {totalCategories} collections
                  </span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-luxury-500 group-hover:text-gold-400 group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/admin/occasions"
              className="group flex items-center justify-between rounded-xl border border-luxury-800 bg-[#161410] p-3.5 hover:border-gold-500/40 hover:bg-[#1a1713] transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-luxury-900 text-luxury-300 border border-luxury-800 group-hover:text-gold-400 transition-colors">
                  <Calendar className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-cream-100 group-hover:text-gold-300 transition-colors">
                    Festive Occasions
                  </span>
                  <span className="block text-[11px] text-luxury-400">
                    Diwali, seasonal specials
                  </span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-luxury-500 group-hover:text-gold-400 group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/admin/qr"
              className="group flex items-center justify-between rounded-xl border border-luxury-800 bg-[#161410] p-3.5 hover:border-gold-500/40 hover:bg-[#1a1713] transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-luxury-900 text-luxury-300 border border-luxury-800 group-hover:text-gold-400 transition-colors">
                  <Smartphone className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-cream-100 group-hover:text-gold-300 transition-colors">
                    Tabletop QR Studio
                  </span>
                  <span className="block text-[11px] text-luxury-400">
                    Generate printable QR
                  </span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-luxury-500 group-hover:text-gold-400 group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/admin/whatsapp"
              className="group flex items-center justify-between rounded-xl border border-luxury-800 bg-[#161410] p-3.5 hover:border-emerald-500/40 hover:bg-[#1a1713] transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-luxury-900 text-luxury-300 border border-luxury-800 group-hover:text-emerald-400 transition-colors">
                  <WhatsAppIcon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-cream-100 group-hover:text-emerald-300 transition-colors">
                    WhatsApp Templates
                  </span>
                  <span className="block text-[11px] text-luxury-400">
                    Auto-enquiry format
                  </span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-luxury-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/admin/images"
              className="group flex items-center justify-between rounded-xl border border-luxury-800 bg-[#161410] p-3.5 hover:border-gold-500/40 hover:bg-[#1a1713] transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-luxury-900 text-luxury-300 border border-luxury-800 group-hover:text-gold-400 transition-colors">
                  <ImageIcon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-cream-100 group-hover:text-gold-300 transition-colors">
                    Media Library
                  </span>
                  <span className="block text-[11px] text-luxury-400">
                    Upload & manage photos
                  </span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-luxury-500 group-hover:text-gold-400 group-hover:translate-x-0.5 transition-all" />
            </Link>
          </div>
        </div>

        {/* Category Breakdown (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-gold-500/20 bg-[#13110e] p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-luxury-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-gold-400" />
              <h2 className="font-sans text-xs font-bold uppercase tracking-wider text-cream-50">
                Menu Category Breakdown
              </h2>
            </div>
            <Link
              href="/admin/categories"
              className="text-[11px] font-semibold text-gold-400 hover:text-gold-300 transition-colors"
            >
              View All ({totalCategories}) →
            </Link>
          </div>

          <div className="space-y-3 pt-1">
            {categoriesWithCount.slice(0, 5).map((cat) => {
              const cakeCount = cat._count?.cakes || 0;
              const percentage = totalCakes > 0 ? Math.round((cakeCount / totalCakes) * 100) : 0;
              return (
                <div key={cat.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-cream-200">{cat.name}</span>
                    <span className="font-price font-medium text-luxury-400">
                      {cakeCount} cakes ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-luxury-950 border border-luxury-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-gold-600 to-gold-400 transition-all duration-500"
                      style={{ width: `${Math.max(4, percentage)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. MAIN INVENTORY TABLE & TABLETOP QR SIDEBAR */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column (8 cols): Clean Cake Inventory Studio */}
        <div className="lg:col-span-8 rounded-3xl border border-gold-500/20 bg-[#13110e] p-6 shadow-xl space-y-5">
          {/* Header & Search in One Clean Flex Row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-luxury-800/80 pb-4">
            <div>
              <h2 className="font-sans text-base font-bold text-cream-50 flex items-center gap-2">
                <Cake className="h-4.5 w-4.5 text-gold-400" />
                <span>Cake Inventory Studio</span>
              </h2>
              <p className="text-xs text-luxury-400 mt-0.5">
                1-click live stock toggles & menu catalog controls
              </p>
            </div>

            {/* Dedicated Search Box */}
            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-luxury-400" />
              <input
                id="admin-cake-search"
                name="admin-cake-search"
                aria-label="Search cakes by name"
                type="text"
                placeholder="Search cakes by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-luxury-800 bg-[#100e0c] pl-9 pr-3 py-1.5 text-xs text-cream-100 placeholder-luxury-500 focus:border-gold-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Filter Tabs on their OWN dedicated row */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: "all", label: `All (${cakesList.length})` },
                { id: "in_stock", label: `In Stock (${availableCakes})` },
                { id: "out_of_stock", label: `Out of Stock (${outOfStockCount})` },
                { id: "bestsellers", label: `Bestsellers (${bestsellerCakes})` },
                { id: "featured", label: `Featured (${featuredCakes})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                    activeTab === tab.id
                      ? "bg-gold-500 text-luxury-950 shadow-gold-sm font-bold"
                      : "bg-[#181512] text-luxury-400 hover:text-cream-100 hover:bg-luxury-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <Link
              href="/admin/cakes"
              className="inline-flex items-center gap-1 text-xs font-semibold text-gold-400 hover:text-gold-300"
            >
              <span>View Full Catalog →</span>
            </Link>
          </div>

          {/* Desktop Table (Visible on md and up) */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-luxury-800/80 bg-[#0e0d0b]">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-luxury-800 bg-[#151310] text-luxury-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4 font-semibold w-10 text-center">#</th>
                  <th className="py-3 px-3 font-semibold">Cake Details</th>
                  <th className="py-3 px-3 font-semibold">Category</th>
                  <th className="py-3 px-3 font-semibold">Starting Price</th>
                  <th className="py-3 px-3 font-semibold text-center">Availability</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-luxury-800/60">
                {filteredCakes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-luxury-400">
                      No cakes matching your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredCakes.map((cake, index) => {
                    const startingPrice = cake.prices?.[0]?.price || 799;
                    const isToggling = togglingId === cake.id;

                    return (
                      <tr key={cake.id} className="hover:bg-luxury-800/25 transition-colors">
                        {/* Serial Number */}
                        <td className="py-3 px-4 text-center font-price font-medium text-luxury-500 text-xs">
                          {index + 1}
                        </td>

                        {/* Cake Details */}
                        <td className="py-3 px-3">
                          <div className="flex items-center space-x-3">
                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-gold-500/20 bg-luxury-950">
                              <Image
                                src={cake.coverImage}
                                alt={cake.name}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            </div>
                            <div className="space-y-0.5">
                              <span className="font-semibold text-cream-100 block text-xs leading-snug">
                                {cake.name}
                              </span>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {cake.bestseller && (
                                  <span className="rounded px-1.5 py-0.2 bg-amber-500/15 border border-amber-500/30 text-[9px] font-bold text-amber-300">
                                    ★ Bestseller
                                  </span>
                                )}
                                {cake.featured && (
                                  <span className="rounded px-1.5 py-0.2 bg-gold-500/15 border border-gold-500/30 text-[9px] font-bold text-gold-300">
                                    👑 Featured
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-3">
                          <span className="rounded-lg border border-luxury-800 bg-[#151310] px-2 py-0.5 text-[11px] font-medium text-luxury-300">
                            {cake.category?.name || "Specialty"}
                          </span>
                        </td>

                        {/* Starting Price */}
                        <td className="py-3 px-3 font-price font-bold text-gold-400 text-sm">
                          ₹{startingPrice.toLocaleString("en-IN")}
                        </td>

                        {/* 1-Click Availability Toggle */}
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => handleToggleAvailability(cake.id, cake.available)}
                            disabled={isToggling}
                            title={cake.available ? "Click to mark Out of Stock" : "Click to mark In Stock"}
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-bold transition-all ${
                              cake.available
                                ? "bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-900/60"
                                : "bg-red-950/80 border border-red-500/40 text-red-400 hover:bg-red-900/60"
                            } ${isToggling ? "opacity-50 cursor-wait" : ""}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                cake.available ? "bg-emerald-400" : "bg-red-400"
                              }`}
                            />
                            <span>{cake.available ? "In Stock" : "Out of Stock"}</span>
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center space-x-1.5">
                            <Link
                              href={`/admin/cakes/${cake.id}`}
                              className="rounded-lg border border-luxury-800 bg-[#151310] p-1.5 text-luxury-300 hover:border-gold-500/40 hover:text-gold-300 transition-colors"
                              title="Edit Cake"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Link>

                            <Link
                              href={`/menu/cake/${cake.slug}`}
                              target="_blank"
                              className="rounded-lg border border-luxury-800 bg-[#151310] p-1.5 text-luxury-300 hover:border-gold-500/40 hover:text-gold-300 transition-colors"
                              title="View Live on Customer Menu"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Inventory Cards (Touch-Friendly for Phones) */}
          <div className="md:hidden space-y-3">
            {filteredCakes.length === 0 ? (
              <div className="rounded-2xl border border-luxury-800 bg-[#0e0d0b] p-6 text-center text-xs text-luxury-400">
                No cakes matching your filter criteria.
              </div>
            ) : (
              filteredCakes.map((cake, index) => {
                const startingPrice = cake.prices?.[0]?.price || 799;
                const isToggling = togglingId === cake.id;

                return (
                  <div
                    key={cake.id}
                    className="rounded-2xl border border-luxury-800 bg-[#0e0d0b] p-3.5 space-y-3 shadow-md"
                  >
                    {/* Top Row: Thumbnail + Info + Price */}
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-gold-500/20 bg-luxury-950">
                          <Image
                            src={cake.coverImage}
                            alt={cake.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-price text-luxury-500 font-bold">#{index + 1}</span>
                            <span className="font-semibold text-cream-100 text-xs truncate block">
                              {cake.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="rounded bg-[#151310] border border-luxury-800 px-1.5 py-0.2 text-[9.5px] font-medium text-luxury-300">
                              {cake.category?.name || "Specialty"}
                            </span>
                            {cake.bestseller && (
                              <span className="rounded bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.2 text-[9px] font-bold text-amber-300">
                                ★ Bestseller
                              </span>
                            )}
                            {cake.featured && (
                              <span className="rounded bg-gold-500/15 border border-gold-500/30 px-1.5 py-0.2 text-[9px] font-bold text-gold-300">
                                👑 Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <span className="font-price font-bold text-gold-400 text-sm shrink-0">
                        ₹{startingPrice.toLocaleString("en-IN")}
                      </span>
                    </div>

                    {/* Bottom Row: 1-Tap Toggle & Touch Actions */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-luxury-800/70">
                      <button
                        onClick={() => handleToggleAvailability(cake.id, cake.available)}
                        disabled={isToggling}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold transition-all active:scale-95 ${
                          cake.available
                            ? "bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 active:bg-emerald-900"
                            : "bg-red-950/90 border border-red-500/40 text-red-300 active:bg-red-900"
                        } ${isToggling ? "opacity-50" : ""}`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            cake.available ? "bg-emerald-400" : "bg-red-400"
                          }`}
                        />
                        <span>{cake.available ? "In Stock" : "Out of Stock"}</span>
                      </button>

                      <div className="flex items-center space-x-1.5">
                        <Link
                          href={`/admin/cakes/${cake.id}`}
                          className="flex items-center gap-1 rounded-xl border border-luxury-800 bg-[#151310] px-2.5 py-1.5 text-xs font-semibold text-luxury-300 hover:text-gold-300 active:bg-luxury-800"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </Link>
                        <Link
                          href={`/menu/cake/${cake.slug}`}
                          target="_blank"
                          className="rounded-xl border border-luxury-800 bg-[#151310] p-1.5 text-luxury-300 hover:text-gold-300 active:bg-luxury-800"
                          title="View on Live Menu"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Tabletop QR & Quick WhatsApp Gateway */}
        <div className="lg:col-span-4 space-y-6">
          {/* Instant Tabletop QR Code Studio */}
          <div className="rounded-3xl border border-gold-500/30 bg-[#13110e] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-luxury-800/80 pb-3">
              <div className="flex items-center space-x-2">
                <Smartphone className="h-4 w-4 text-gold-400" />
                <span className="font-sans text-xs font-bold uppercase tracking-wider text-cream-50">
                  Tabletop QR Studio
                </span>
              </div>
              <Link
                href="/admin/qr"
                className="text-[11px] font-semibold text-gold-400 hover:underline"
              >
                Custom Studio →
              </Link>
            </div>

            <div className="flex flex-col items-center justify-center space-y-3 p-2 text-center">
              <div
                ref={qrRef}
                className="rounded-2xl border border-gold-500/40 bg-white p-3 shadow-xl"
              >
                <QRCodeSVG
                  value={menuUrl}
                  size={150}
                  level="H"
                  fgColor="#090807"
                  bgColor="#FFFFFF"
                  includeMargin={false}
                />
              </div>

              <div className="space-y-0.5">
                <span className="text-xs font-bold text-cream-100 block">
                  Scan to View Digital Menu
                </span>
                <span className="text-[10px] text-luxury-400 block truncate max-w-[220px]">
                  {menuUrl}
                </span>
              </div>

              <div className="flex items-center gap-2 w-full pt-1">
                <button
                  onClick={handleDownloadQR}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-gold-gradient py-2 text-xs font-bold text-luxury-950 shadow-gold-sm hover:opacity-95 transition-all"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Print</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-luxury-800 bg-[#181512] px-3 py-2 text-xs font-semibold text-luxury-300 hover:text-cream-100 hover:border-gold-500/40 transition-all"
                >
                  {copiedLink ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Quick WhatsApp Business Gateway Editor */}
          <div className="rounded-3xl border border-emerald-500/25 bg-[#13110e] p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-luxury-800/80 pb-3">
              <div className="flex items-center space-x-2">
                <WhatsAppIcon className="h-4.5 w-4.5 text-emerald-400" />
                <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-cream-50">
                  WhatsApp Orders Number
                </h3>
              </div>
              <Link
                href="/admin/whatsapp"
                className="text-[11px] font-semibold text-emerald-400 hover:underline"
              >
                Template →
              </Link>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-luxury-400">
                Customer cake orders will connect to this WhatsApp phone number.
              </p>

              <div className="space-y-1.5">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={waNumber}
                    onChange={(e) => setWaNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3.5 py-2 text-xs font-price text-cream-100 focus:border-emerald-500 focus:outline-none"
                  />
                  <button
                    onClick={handleSaveWa}
                    disabled={savingWa}
                    className="shrink-0 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2 text-xs font-bold text-luxury-950 shadow-sm transition-all"
                  >
                    {savedWa ? "Saved ✓" : savingWa ? "Saving..." : "Update"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. MEDIA ASSET GALLERY */}
      <div className="rounded-3xl border border-gold-500/20 bg-[#13110e] p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-luxury-800/80 pb-3">
          <div className="flex items-center space-x-2">
            <ImageIcon className="h-4 w-4 text-gold-400" />
            <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-cream-50">
              Media Asset Library ({totalImages} files)
            </h3>
          </div>
          <Link
            href="/admin/images"
            className="text-[11px] font-semibold text-gold-400 hover:underline"
          >
            Upload / View All →
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-8 pt-1">
          {sampleImages.slice(0, 8).map((img) => (
            <div
              key={img.id}
              className="group relative aspect-square overflow-hidden rounded-xl border border-luxury-800 bg-luxury-950 hover:border-gold-500 transition-colors"
            >
              <Image
                src={img.url}
                alt={img.filename || "Bakery media"}
                fill
                sizes="80px"
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 6. SYSTEM TRUST FOOTER */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 border-t border-luxury-800 pt-6 text-center text-xs text-luxury-400">
        <div className="space-y-1">
          <ChefHat className="mx-auto h-4 w-4 text-gold-400" />
          <span className="block font-bold text-cream-200">100% Pure Veg</span>
          <span className="text-[10px]">Strictly Eggless Menu</span>
        </div>

        <div className="space-y-1">
          <Zap className="mx-auto h-4 w-4 text-gold-400" />
          <span className="block font-bold text-cream-200">Instant Sync</span>
          <span className="text-[10px]">Realtime Cloud DB</span>
        </div>

        <div className="space-y-1">
          <Smartphone className="mx-auto h-4 w-4 text-gold-400" />
          <span className="block font-bold text-cream-200">Mobile Optimized</span>
          <span className="text-[10px]">Lightning QR Loading</span>
        </div>

        <div className="space-y-1">
          <SlidersHorizontal className="mx-auto h-4 w-4 text-gold-400" />
          <span className="block font-bold text-cream-200">One-Click Toggles</span>
          <span className="text-[10px]">Live Stock Controls</span>
        </div>

        <div className="space-y-1 col-span-2 sm:col-span-1">
          <ShieldCheck className="mx-auto h-4 w-4 text-gold-400" />
          <span className="block font-bold text-cream-200">Protected CMS</span>
          <span className="text-[10px]">Role-based Security</span>
        </div>
      </div>
    </div>
  );
}
