"use client";

import { useState, useRef, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import * as htmlToImage from "html-to-image";
import {
  QrCode,
  Download,
  Printer,
  Copy,
  Check,
  Sparkles,
  Cake,
  Sliders,
  Store,
  Layers,
  Tag,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { getAppUrl, PRODUCTION_APP_URL } from "@/lib/appUrl";

import { CakeMenuPremiumStandee } from "./templates/CakeMenuPremiumStandee";
import { QR_CENTER_LOGO } from "./constants/qrLogo";

interface QrGeneratorClientProps {
  settings?: any;
  whatsappSetting?: any;
  categories?: Array<{ id: string; name: string; slug: string }>;
  cakes?: Array<{ id: string; name: string; slug: string; coverImage?: string | null }>;
  mediaImages?: Array<{ id: string; filename?: string; name?: string; url: string }>;
}

const OCCASION_PRESETS = [
  { name: "Birthday Cakes", path: "/menu?occasion=birthday" },
  { name: "Anniversary Cakes", path: "/menu?occasion=anniversary" },
  { name: "Celebration & Party", path: "/menu?occasion=celebration" },
  { name: "Custom & Wedding Cakes", path: "/menu?occasion=custom" },
];

export default function QrGeneratorClient({
  settings,
  categories = [],
  cakes = [],
  mediaImages = [],
}: QrGeneratorClientProps) {
  const [origin, setOrigin] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const restaurantName = settings?.restaurantName || "Raman Sweet Bakery";
  const tagline = settings?.tagline || "& Family Restaurant";
  const logoUrl = settings?.logo || "/images/logo_emblem.png";
  const defaultUrl = origin ? `${origin}/menu` : `${getAppUrl()}/menu`;

  // Template Selection
  const [selectedTemplate, setSelectedTemplate] = useState<"cake-menu-premium" | "standard">(
    "cake-menu-premium"
  );

  // Destination Mode: 'main' | 'category' | 'cake' | 'occasion' | 'custom'
  const [destinationType, setDestinationType] = useState<
    "main" | "category" | "cake" | "occasion" | "custom"
  >("main");
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>(
    categories[0]?.slug || "large-celebration-cakes"
  );
  const [selectedCakeSlug, setSelectedCakeSlug] = useState<string>(
    cakes[0]?.slug || "royal-chocolate-celebration-cake"
  );
  const [selectedOccasionPath, setSelectedOccasionPath] = useState<string>(
    OCCASION_PRESETS[0].path
  );

  // QR Code Options
  const [targetUrl, setTargetUrl] = useState<string>(defaultUrl);
  const [customPath, setCustomPath] = useState<string>("/menu");
  const [tableNumber, setTableNumber] = useState<string>("");
  const [qrSize] = useState<number>(256);
  const [fgColor, setFgColor] = useState<string>("#1A0F0A");
  const [bgColor, setBgColor] = useState<string>("#FFFFFF");
  const [includeLogo, setIncludeLogo] = useState<boolean>(true);
  const [useProductionDomain, setUseProductionDomain] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const qrContainerRef = useRef<HTMLDivElement>(null);
  const standeeRef = useRef<HTMLDivElement>(null);
  const standardCardRef = useRef<HTMLDivElement>(null);

  // Update customPath when destinationType or sub-selection changes
  const handleDestinationTypeChange = (type: "main" | "category" | "cake" | "occasion" | "custom") => {
    setDestinationType(type);
    if (type === "main") {
      setCustomPath("/menu");
    } else if (type === "category") {
      setCustomPath(`/menu/category/${selectedCategorySlug}`);
    } else if (type === "cake") {
      setCustomPath(`/menu/cake/${selectedCakeSlug}`);
    } else if (type === "occasion") {
      setCustomPath(selectedOccasionPath);
    }
  };

  const handleCategorySelect = (slug: string) => {
    setSelectedCategorySlug(slug);
    setCustomPath(`/menu/category/${slug}`);
  };

  const handleCakeSelect = (slug: string) => {
    setSelectedCakeSlug(slug);
    setCustomPath(`/menu/cake/${slug}`);
  };

  const handleOccasionSelect = (path: string) => {
    setSelectedOccasionPath(path);
    setCustomPath(path);
  };

  // Sync target URL when customPath, tableNumber, or domain mode changes
  useEffect(() => {
    const baseUrl = useProductionDomain ? PRODUCTION_APP_URL : (origin || getAppUrl());
    let finalUrl =
      customPath.startsWith("http://") || customPath.startsWith("https://")
        ? customPath
        : `${baseUrl}${customPath.startsWith("/") ? customPath : `/${customPath}`}`;

    if (tableNumber.trim()) {
      const sep = finalUrl.includes("?") ? "&" : "?";
      finalUrl += `${sep}table=${encodeURIComponent(tableNumber.trim())}`;
    }
    setTargetUrl(finalUrl);
  }, [origin, customPath, tableNumber, useProductionDomain]);


  const handleCopyLink = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Download high-resolution PNG of the active standee card or QR
  const handleDownloadFullStandee = async () => {
    const targetNode =
      selectedTemplate === "cake-menu-premium"
        ? standeeRef.current
        : standardCardRef.current;

    if (!targetNode) return;

    setIsExporting(true);
    try {
      // 2.5x pixel ratio guarantees crystal sharp output for A4 printing and tabletop acrylic displays
      const dataUrl = await htmlToImage.toPng(targetNode, {
        pixelRatio: 2.5,
        cacheBust: true,
        backgroundColor: selectedTemplate === "cake-menu-premium" ? "#FAF7EE" : bgColor,
      });

      const downloadLink = document.createElement("a");
      const cleanName = restaurantName.replace(/[^a-zA-Z0-9]/g, "_");
      const templateSuffix =
        selectedTemplate === "cake-menu-premium" ? "Premium_Standee" : "Standard_Card";
      downloadLink.href = dataUrl;
      downloadLink.download = `${cleanName}_${templateSuffix}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (err) {
      console.error("Failed to export standee image:", err);
      // Fallback to raw QR code download if DOM image export fails
      handleDownloadRawQR();
    } finally {
      setIsExporting(false);
    }
  };

  // Download raw QR code image only
  const handleDownloadRawQR = () => {
    const activeRef =
      selectedTemplate === "cake-menu-premium" ? standeeRef : qrContainerRef;
    const svgElement = activeRef.current?.querySelector("svg");
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    canvas.width = qrSize * 2;
    canvas.height = qrSize * 2;

    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = bgColor === "transparent" ? "#FFFFFF" : bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const pngUrl = canvas.toDataURL("image/png");

        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `${restaurantName.replace(/\s+/g, "_")}_Menu_QR.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handlePrintCard = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-32 sm:pb-12">
      {/* Global Print Media Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-standee-container,
          #printable-standee-container * {
            visibility: visible;
          }
          #printable-standee-container {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 140mm;
            max-width: 100%;
            margin: 0;
            padding: 0;
            box-shadow: none !important;
          }
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-luxury-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-400">
              MARKETING & INSTORE ACCESSIBILITY
            </span>
            <span className="inline-flex items-center space-x-1 rounded-full bg-gold-500/10 border border-gold-500/30 px-2 py-0.5 text-[10px] font-semibold text-gold-400">
              <QrCode className="h-3 w-3" />
              <span>Instant Digital Menu</span>
            </span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-cream-50 sm:text-3xl mt-1">
            QR Code Generator & Table Standee
          </h1>
          <p className="text-xs text-luxury-400 mt-1">
            Generate high-resolution, print-ready QR standees for table stands, counters, and posters. Customers scan to view your live digital menu.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintCard}
            className="flex items-center space-x-1.5 rounded-xl border border-gold-500/30 bg-gold-500/10 px-4 py-2.5 text-xs font-semibold text-gold-300 hover:bg-gold-500 hover:text-luxury-950 transition-colors cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Print Standee</span>
          </button>
        </div>
      </div>

      {/* ================================================== */}
      {/* 11. TEMPLATE SELECTOR */}
      {/* ================================================== */}
      <div className="rounded-3xl border border-gold-500/30 bg-[#14120f] p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3 border-b border-luxury-800 pb-2.5">
          <span className="text-xs font-bold text-cream-100 uppercase tracking-wider flex items-center space-x-2">
            <Layers className="h-4 w-4 text-gold-400" />
            <span>Standee Template Selector</span>
          </span>
          <span className="text-[11px] text-gold-400 font-medium">
            Choose your physical display design
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Option 1: Cake Menu — Premium (New) */}
          <button
            type="button"
            onClick={() => {
              setSelectedTemplate("cake-menu-premium");
              setFgColor("#1A0F0A");
              setBgColor("#FFFFFF");
            }}
            className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
              selectedTemplate === "cake-menu-premium"
                ? "border-gold-400 bg-gold-500/10 shadow-lg ring-1 ring-gold-400/40"
                : "border-luxury-800 bg-luxury-950/60 text-luxury-300 hover:border-gold-500/30"
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="font-serif text-sm font-bold text-cream-50 flex items-center space-x-1.5">
                <span>Cake Menu — Premium</span>
                <span className="rounded-full bg-gold-500/20 text-[#D4AF37] border border-gold-500/40 px-2 py-0.2 text-[9px] font-semibold">
                  RECOMMENDED
                </span>
              </span>
              {selectedTemplate === "cake-menu-premium" && (
                <span className="h-2.5 w-2.5 rounded-full bg-gold-400 shadow-sm" />
              )}
            </div>
            <p className="text-[11px] text-luxury-300">
              Luxury tabletop acrylic standee • Warm ivory & deep chocolate • Gold accents • Dynamic branding & cake showcase.
            </p>
          </button>

          {/* Option 2: Standard Table Card (Existing) */}
          <button
            type="button"
            onClick={() => {
              setSelectedTemplate("standard");
              setFgColor("#12100e");
              setBgColor("#FFFFFF");
            }}
            className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all ${
              selectedTemplate === "standard"
                ? "border-gold-400 bg-gold-500/10 shadow-lg ring-1 ring-gold-400/40"
                : "border-luxury-800 bg-luxury-950/60 text-luxury-300 hover:border-gold-500/30"
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="font-serif text-sm font-bold text-cream-50">
                Standard Table Card
              </span>
              {selectedTemplate === "standard" && (
                <span className="h-2.5 w-2.5 rounded-full bg-gold-400 shadow-sm" />
              )}
            </div>
            <p className="text-[11px] text-luxury-300">
              Original minimalist tabletop card • Focused on high-visibility QR and quick customer access.
            </p>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Customization Controls */}
        <div className="lg:col-span-6 space-y-6">
          {/* ================================================== */}
          {/* TARGET MENU DESTINATION CONTROLS */}
          {/* ================================================== */}
          <div className="rounded-3xl border border-gold-500/20 bg-[#14120f] p-6 shadow-xl space-y-4">
            <h2 className="font-serif text-base font-bold text-cream-100 flex items-center space-x-2 border-b border-luxury-800 pb-3">
              <Store className="h-4 w-4 text-gold-400" />
              <span>Target Menu Destination</span>
            </h2>

            {/* Live Production Domain Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl border border-gold-500/30 bg-gold-500/10">
              <div className="pr-2">
                <span className="block text-xs font-bold text-cream-100 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-gold-400" />
                  <span>Live Production Domain Mode</span>
                </span>
                <span className="block text-[10px] text-luxury-300 mt-0.5">
                  {useProductionDomain
                    ? "Encodes live production URL (https://ramansweetbakery.vercel.app) for real customer scans"
                    : `Encodes current test host (${origin || "localhost"})`}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setUseProductionDomain(!useProductionDomain)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  useProductionDomain ? "bg-gold-500" : "bg-luxury-800"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-luxury-950 shadow ring-0 transition duration-200 ease-in-out ${
                    useProductionDomain ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>


            <div className="space-y-3.5">
              {/* Destination Mode Tabs */}
              <div>
                <label className="block text-xs font-semibold text-cream-200 mb-1.5">
                  Select Destination Type
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleDestinationTypeChange("main")}
                    className={`rounded-xl border p-2 text-[11px] font-semibold text-center transition-colors truncate ${
                      destinationType === "main"
                        ? "border-gold-400 bg-gold-500/15 text-gold-300 shadow-sm"
                        : "border-luxury-800 bg-luxury-950 text-luxury-300 hover:border-gold-500/40"
                    }`}
                  >
                    Main Menu
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDestinationTypeChange("category")}
                    className={`rounded-xl border p-2 text-[11px] font-semibold text-center transition-colors truncate ${
                      destinationType === "category"
                        ? "border-gold-400 bg-gold-500/15 text-gold-300 shadow-sm"
                        : "border-luxury-800 bg-luxury-950 text-luxury-300 hover:border-gold-500/40"
                    }`}
                  >
                    Category
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDestinationTypeChange("cake")}
                    className={`rounded-xl border p-2 text-[11px] font-semibold text-center transition-colors truncate ${
                      destinationType === "cake"
                        ? "border-gold-400 bg-gold-500/15 text-gold-300 shadow-sm"
                        : "border-luxury-800 bg-luxury-950 text-luxury-300 hover:border-gold-500/40"
                    }`}
                  >
                    Cake
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDestinationTypeChange("occasion")}
                    className={`rounded-xl border p-2 text-[11px] font-semibold text-center transition-colors truncate ${
                      destinationType === "occasion"
                        ? "border-gold-400 bg-gold-500/15 text-gold-300 shadow-sm"
                        : "border-luxury-800 bg-luxury-950 text-luxury-300 hover:border-gold-500/40"
                    }`}
                  >
                    Occasion
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDestinationTypeChange("custom")}
                    className={`rounded-xl border p-2 text-[11px] font-semibold text-center transition-colors truncate ${
                      destinationType === "custom"
                        ? "border-gold-400 bg-gold-500/15 text-gold-300 shadow-sm"
                        : "border-luxury-800 bg-luxury-950 text-luxury-300 hover:border-gold-500/40"
                    }`}
                  >
                    Custom URL
                  </button>
                </div>
              </div>

              {/* Sub-Selection depending on Destination Type */}
              {destinationType === "category" && categories.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-cream-200 mb-1">
                    Select Target Category
                  </label>
                  <select
                    value={selectedCategorySlug}
                    onChange={(e) => handleCategorySelect(e.target.value)}
                    className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3 py-2 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name} (/menu/category/{cat.slug})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {destinationType === "cake" && cakes.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-cream-200 mb-1">
                    Select Target Cake
                  </label>
                  <select
                    value={selectedCakeSlug}
                    onChange={(e) => handleCakeSelect(e.target.value)}
                    className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3 py-2 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                  >
                    {cakes.map((cake) => (
                      <option key={cake.id} value={cake.slug}>
                        {cake.name} (/menu/cake/{cake.slug})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {destinationType === "occasion" && (
                <div>
                  <label className="block text-xs font-semibold text-cream-200 mb-1">
                    Select Target Occasion
                  </label>
                  <select
                    value={selectedOccasionPath}
                    onChange={(e) => handleOccasionSelect(e.target.value)}
                    className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3 py-2 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                  >
                    {OCCASION_PRESETS.map((occ) => (
                      <option key={occ.path} value={occ.path}>
                        {occ.name} ({occ.path})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Custom Path & Table Number Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-cream-200 mb-1">
                    Encoded Path or Full URL
                  </label>
                  <input
                    type="text"
                    value={customPath}
                    onChange={(e) => {
                      setCustomPath(e.target.value);
                      setDestinationType("custom");
                    }}
                    placeholder="/menu"
                    className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3 py-2 text-xs text-cream-100 focus:border-gold-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-cream-200 mb-1">
                    Table / Counter # (Optional)
                  </label>
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="e.g. Table 05"
                    className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3 py-2 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Full URL Display Box */}
              <div>
                <label className="block text-[11px] text-luxury-400 mb-1">
                  Active Encoded URL
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={targetUrl}
                    className="w-full rounded-xl border border-luxury-800 bg-luxury-950 px-3 py-2 text-xs font-mono text-gold-400 select-all"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    title="Copy URL"
                    className="shrink-0 rounded-xl border border-gold-500/30 bg-luxury-900 px-3 py-2 text-xs font-semibold text-gold-300 hover:bg-gold-500 hover:text-luxury-950 cursor-pointer"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================== */}
          {/* STYLING & QR OPTIONS CARD */}
          {/* ================================================== */}
          <div className="rounded-3xl border border-gold-500/20 bg-[#14120f] p-6 shadow-xl space-y-4">
            <h2 className="font-serif text-base font-bold text-cream-100 flex items-center space-x-2 border-b border-luxury-800 pb-3">
              <Sliders className="h-4 w-4 text-gold-400" />
              <span>QR Colors & Branding</span>
            </h2>

            <div className="space-y-4">
              {/* Color Presets */}
              <div>
                <label className="block text-xs font-semibold text-cream-200 mb-1.5">
                  Color Scheme Presets
                </label>
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFgColor("#1A0F0A");
                      setBgColor("#FFFFFF");
                    }}
                    className={`rounded-xl border p-2 text-[11px] sm:text-xs font-medium flex items-center justify-center space-x-1.5 transition-colors ${
                      fgColor === "#1A0F0A" && bgColor === "#FFFFFF"
                        ? "border-gold-400 bg-gold-500/10 text-gold-300"
                        : "border-luxury-800 bg-luxury-950 text-luxury-300"
                    }`}
                  >
                    <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0 rounded-full bg-[#1A0F0A] border border-white" />
                    <span className="truncate">Deep Cocoa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFgColor("#12100e");
                      setBgColor("#FFFFFF");
                    }}
                    className={`rounded-xl border p-2 text-[11px] sm:text-xs font-medium flex items-center justify-center space-x-1.5 transition-colors ${
                      fgColor === "#12100e" && bgColor === "#FFFFFF"
                        ? "border-gold-400 bg-gold-500/10 text-gold-300"
                        : "border-luxury-800 bg-luxury-950 text-luxury-300"
                    }`}
                  >
                    <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0 rounded-full bg-black border border-white" />
                    <span className="truncate">Pure Black</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFgColor("#78350F");
                      setBgColor("#FFFBEB");
                    }}
                    className={`rounded-xl border p-2 text-[11px] sm:text-xs font-medium flex items-center justify-center space-x-1.5 transition-colors ${
                      fgColor === "#78350F" && bgColor === "#FFFBEB"
                        ? "border-gold-400 bg-gold-500/10 text-gold-300"
                        : "border-luxury-800 bg-luxury-950 text-luxury-300"
                    }`}
                  >
                    <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0 rounded-full bg-amber-800" />
                    <span className="truncate">Amber Ivory</span>
                  </button>
                </div>
              </div>

              {/* Custom Color Pickers */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-cream-200 mb-1">
                    QR Foreground Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="h-9 w-10 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                    />
                    <input
                      type="text"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3 py-2 text-xs text-cream-100 uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-cream-200 mb-1">
                    QR Background Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={bgColor === "transparent" ? "#FFFFFF" : bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="h-9 w-10 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                    />
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3 py-2 text-xs text-cream-100 uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Contrast warning if fgColor and bgColor are too close */}
              {fgColor.toLowerCase() === bgColor.toLowerCase() && (
                <div className="flex items-center space-x-2 rounded-xl border border-amber-500/40 bg-amber-500/10 p-2.5 text-xs text-amber-300">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>
                    Warning: Foreground and background colors are identical. QR code will not be scannable.
                  </span>
                </div>
              )}

              {/* Logo in Center Toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-luxury-800">
                <div>
                  <span className="block text-xs font-semibold text-cream-200">
                    Include Center Bakery Emblem
                  </span>
                  <span className="text-[10px] text-luxury-400">
                    Adds luxury cake emblem in center of QR code
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={includeLogo}
                  onChange={(e) => setIncludeLogo(e.target.checked)}
                  className="h-4 w-4 rounded accent-gold-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Printable Standee Preview */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-3xl border border-gold-500/30 bg-[#14120f] p-6 shadow-2xl space-y-4 text-center">
            <div className="flex items-center justify-between border-b border-luxury-800 pb-3">
              <span className="font-serif text-sm font-bold text-cream-50 uppercase tracking-wider">
                Live Standee Preview
              </span>
              <span className="text-[10px] text-gold-400 font-semibold bg-gold-500/10 border border-gold-500/30 px-2 py-0.5 rounded-full">
                {selectedTemplate === "cake-menu-premium"
                  ? "A4 Tabletop Acrylic Insert"
                  : "Print Ready Card"}
              </span>
            </div>

            {/* PREVIEW CONTAINER */}
            <div id="printable-standee-container" className="flex justify-center w-full">
              {selectedTemplate === "cake-menu-premium" ? (
                /* NEW PREMIUM STANDEE TEMPLATE */
                <CakeMenuPremiumStandee
                  ref={standeeRef}
                  restaurantName={restaurantName}
                  tagline={tagline}
                  logoUrl={logoUrl}
                  targetUrl={targetUrl}
                  tableNumber={tableNumber}
                  includeLogo={includeLogo}
                  fgColor={fgColor}
                  bgColor={bgColor}
                  size="preview"
                />
              ) : (
                /* EXISTING STANDARD CARD TEMPLATE (100% PRESERVED) */
                <div
                  ref={standardCardRef}
                  className="mx-auto max-w-sm rounded-3xl border-2 border-[#D4AF37]/50 p-6 shadow-2xl text-center space-y-4 transition-all w-full"
                  style={{ backgroundColor: bgColor === "transparent" ? "#FFFFFF" : bgColor }}
                >
                  {/* Bakery Branding Header */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#12100e] text-[#D4AF37]">
                        <Cake className="h-4 w-4" />
                      </div>
                    </div>
                    <h2 className="font-serif text-lg font-bold text-[#12100e] tracking-tight">
                      {restaurantName}
                    </h2>
                    <p className="text-[9.5px] uppercase tracking-widest text-[#B45309] font-bold">
                      {tagline}
                    </p>
                  </div>

                  {/* QR Code Container */}
                  <div
                    ref={qrContainerRef}
                    className="flex items-center justify-center p-4 rounded-2xl bg-white shadow-inner border border-stone-200 mx-auto w-fit"
                  >
                    <QRCodeSVG
                      value={targetUrl}
                      size={200}
                      fgColor={fgColor}
                      bgColor="#FFFFFF"
                      level="H"
                      imageSettings={
                        includeLogo
                          ? {
                              src: QR_CENTER_LOGO,
                              x: undefined,
                              y: undefined,
                              height: 42,
                              width: 42,
                              excavate: true,
                            }
                          : undefined
                      }
                    />
                  </div>

                  {/* Instructional Footer */}
                  <div className="space-y-1 pt-1">
                    <div className="inline-flex items-center space-x-1.5 rounded-full bg-[#12100e] px-4 py-1 text-xs font-bold text-[#FBF7EE]">
                      <Sparkles className="h-3 w-3 text-[#D4AF37]" />
                      <span>SCAN TO VIEW DIGITAL MENU</span>
                    </div>

                    {tableNumber && (
                      <p className="text-xs font-bold text-[#12100e] pt-1">
                        {tableNumber}
                      </p>
                    )}

                    <p className="text-[10px] text-stone-600 font-medium pt-1">
                      Point your camera to browse 100% eggless cakes & order on WhatsApp
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 w-full">
              <button
                type="button"
                onClick={handleDownloadFullStandee}
                disabled={isExporting}
                className="w-full flex items-center justify-center space-x-1.5 rounded-xl bg-gold-gradient py-3 px-4 text-xs font-bold text-luxury-950 shadow-gold-sm hover:opacity-95 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                <span>
                  {isExporting ? "Rendering PNG..." : "Download Standee PNG (2.5x HD)"}
                </span>
              </button>

              <button
                type="button"
                onClick={handlePrintCard}
                className="w-full flex items-center justify-center space-x-1.5 rounded-xl border border-gold-500/30 bg-luxury-900 py-3 px-4 text-xs font-semibold text-gold-300 hover:border-gold-500 hover:bg-gold-500/10 active:scale-95 transition-all cursor-pointer"
              >
                <Printer className="h-4 w-4" />
                <span>Print Standee Card</span>
              </button>
            </div>

            {/* Download QR Only fallback link */}
            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={handleDownloadRawQR}
                className="text-[11px] text-luxury-400 hover:text-gold-300 underline transition-colors cursor-pointer"
              >
                Download Raw QR Code Only (PNG)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
