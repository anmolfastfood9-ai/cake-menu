"use client";

import { useState, useRef, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";
import {
  QrCode,
  Download,
  Printer,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Cake,
  Sliders,
  Store,
  RefreshCw,
} from "lucide-react";

interface QrGeneratorClientProps {
  settings?: any;
  whatsappSetting?: any;
}

export default function QrGeneratorClient({
  settings,
  whatsappSetting,
}: QrGeneratorClientProps) {
  const [origin, setOrigin] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const restaurantName = settings?.restaurantName || "Raman Sweet & Family Restaurant";
  const tagline = settings?.tagline || "100% Eggless • Pure Vegetarian";
  const defaultUrl = origin ? `${origin}/menu` : "https://ramansweet.com/menu";

  // QR Code Options
  const [targetUrl, setTargetUrl] = useState<string>(defaultUrl);
  const [customPath, setCustomPath] = useState<string>("/menu");
  const [tableNumber, setTableNumber] = useState<string>("");
  const [qrSize, setQrSize] = useState<number>(256);
  const [fgColor, setFgColor] = useState<string>("#12100e");
  const [bgColor, setBgColor] = useState<string>("#FFFFFF");
  const [includeLogo, setIncludeLogo] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const qrContainerRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

  // Sync target URL when customPath or tableNumber changes
  useEffect(() => {
    const baseUrl = origin || "https://ramansweet.com";
    let finalUrl = `${baseUrl}${customPath}`;
    if (tableNumber.trim()) {
      finalUrl += `?table=${encodeURIComponent(tableNumber.trim())}`;
    }
    setTargetUrl(finalUrl);
  }, [origin, customPath, tableNumber]);

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadPNG = () => {
    const svgElement = qrContainerRef.current?.querySelector("svg");
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
    <div className="mx-auto max-w-5xl space-y-6">
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
            Generate high-resolution QR codes for table stands, cake boxes, counters, and posters. Customers scan to view your live digital menu.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintCard}
            className="flex items-center space-x-1.5 rounded-xl border border-gold-500/30 bg-gold-500/10 px-4 py-2.5 text-xs font-semibold text-gold-300 hover:bg-gold-500 hover:text-luxury-950 transition-colors"
          >
            <Printer className="h-4 w-4" />
            <span>Print Standee Card</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Customization Controls */}
        <div className="lg:col-span-6 space-y-6">
          {/* Target URL Card */}
          <div className="rounded-3xl border border-gold-500/20 bg-[#14120f] p-6 shadow-xl space-y-4">
            <h2 className="font-serif text-base font-bold text-cream-100 flex items-center space-x-2 border-b border-luxury-800 pb-3">
              <Store className="h-4 w-4 text-gold-400" />
              <span>Target Menu Destination</span>
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-cream-200 mb-1">
                  Preset Pages
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCustomPath("/menu");
                      setTableNumber("");
                    }}
                    className={`rounded-xl border p-2 text-xs font-semibold text-center transition-colors ${
                      customPath === "/menu" && !tableNumber
                        ? "border-gold-400 bg-gold-500/15 text-gold-300"
                        : "border-luxury-800 bg-luxury-950 text-luxury-300 hover:border-gold-500/40"
                    }`}
                  >
                    Main Menu
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCustomPath("/menu/cakes");
                      setTableNumber("");
                    }}
                    className={`rounded-xl border p-2 text-xs font-semibold text-center transition-colors ${
                      customPath === "/menu/cakes"
                        ? "border-gold-400 bg-gold-500/15 text-gold-300"
                        : "border-luxury-800 bg-luxury-950 text-luxury-300 hover:border-gold-500/40"
                    }`}
                  >
                    All Cakes Catalog
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCustomPath("/menu/order");
                      setTableNumber("");
                    }}
                    className={`rounded-xl border p-2 text-xs font-semibold text-center transition-colors ${
                      customPath === "/menu/order"
                        ? "border-gold-400 bg-gold-500/15 text-gold-300"
                        : "border-luxury-800 bg-luxury-950 text-luxury-300 hover:border-gold-500/40"
                    }`}
                  >
                    Order Concierge
                  </button>
                </div>
              </div>

              {/* Table / Counter Number */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-cream-200 mb-1">
                    Custom Path
                  </label>
                  <input
                    type="text"
                    value={customPath}
                    onChange={(e) => setCustomPath(e.target.value)}
                    placeholder="/menu"
                    className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3 py-2 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
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

              {/* Full URL Box */}
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
                    className="shrink-0 rounded-xl border border-gold-500/30 bg-luxury-900 px-3 py-2 text-xs font-semibold text-gold-300 hover:bg-gold-500 hover:text-luxury-950"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Styling Options Card */}
          <div className="rounded-3xl border border-gold-500/20 bg-[#14120f] p-6 shadow-xl space-y-4">
            <h2 className="font-serif text-base font-bold text-cream-100 flex items-center space-x-2 border-b border-luxury-800 pb-3">
              <Sliders className="h-4 w-4 text-gold-400" />
              <span>QR Design & Colors</span>
            </h2>

            <div className="space-y-4">
              {/* Color Presets */}
              <div>
                <label className="block text-xs font-semibold text-cream-200 mb-1.5">
                  Color Scheme Presets
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFgColor("#12100e");
                      setBgColor("#FFFFFF");
                    }}
                    className={`rounded-xl border p-2 text-xs font-medium flex items-center justify-center space-x-2 ${
                      fgColor === "#12100e" && bgColor === "#FFFFFF"
                        ? "border-gold-400 bg-gold-500/10 text-gold-300"
                        : "border-luxury-800 bg-luxury-950 text-luxury-300"
                    }`}
                  >
                    <span className="h-3 w-3 rounded-full bg-black border border-white" />
                    <span>Classic Black</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFgColor("#C59B27");
                      setBgColor("#12100e");
                    }}
                    className={`rounded-xl border p-2 text-xs font-medium flex items-center justify-center space-x-2 ${
                      fgColor === "#C59B27" && bgColor === "#12100e"
                        ? "border-gold-400 bg-gold-500/10 text-gold-300"
                        : "border-luxury-800 bg-luxury-950 text-luxury-300"
                    }`}
                  >
                    <span className="h-3 w-3 rounded-full bg-gold-500" />
                    <span>Luxury Gold</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFgColor("#78350F");
                      setBgColor("#FFFBEB");
                    }}
                    className={`rounded-xl border p-2 text-xs font-medium flex items-center justify-center space-x-2 ${
                      fgColor === "#78350F" && bgColor === "#FFFBEB"
                        ? "border-gold-400 bg-gold-500/10 text-gold-300"
                        : "border-luxury-800 bg-luxury-950 text-luxury-300"
                    }`}
                  >
                    <span className="h-3 w-3 rounded-full bg-amber-800" />
                    <span>Warm Cocoa</span>
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
                    Background Color
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

              {/* Logo in Center Toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-luxury-800">
                <div>
                  <span className="block text-xs font-semibold text-cream-200">
                    Include Bakery Logo Badge
                  </span>
                  <span className="text-[10px] text-luxury-400">
                    Adds a luxury cake icon in the center of the QR code
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={includeLogo}
                  onChange={(e) => setIncludeLogo(e.target.checked)}
                  className="h-4 w-4 rounded accent-gold-500"
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
                Print Ready Card
              </span>
            </div>

            {/* Printable Table Standee Box */}
            <div
              ref={printRef}
              className="mx-auto max-w-sm rounded-3xl border-2 border-[#D4AF37]/50 p-6 shadow-2xl text-center space-y-4 transition-all"
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
                          src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23C59B27' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m20 21-8-8-8 8'/><path d='M4 21v-7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7'/><path d='M12 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4z'/></svg>",
                          x: undefined,
                          y: undefined,
                          height: 36,
                          width: 36,
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

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleDownloadPNG}
                className="flex items-center space-x-1.5 rounded-xl bg-gold-gradient px-5 py-2.5 text-xs font-bold text-luxury-950 shadow-gold-sm hover:opacity-95 transition-opacity"
              >
                <Download className="h-4 w-4" />
                <span>Download PNG Image</span>
              </button>

              <button
                type="button"
                onClick={handlePrintCard}
                className="flex items-center space-x-1.5 rounded-xl border border-gold-500/30 bg-luxury-900 px-4 py-2.5 text-xs font-semibold text-gold-300 hover:border-gold-500"
              >
                <Printer className="h-4 w-4" />
                <span>Print Table Card</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
