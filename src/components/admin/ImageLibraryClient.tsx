"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Upload,
  Trash2,
  Copy,
  Check,
  Sparkles,
  ImageIcon,
  Eye,
  X,
  AlertCircle,
  Search,
  ExternalLink,
  Layers,
  Filter,
} from "lucide-react";

interface ImageLibraryClientProps {
  initialImages: any[];
}

export default function ImageLibraryClient({ initialImages = [] }: ImageLibraryClientProps) {
  const [images, setImages] = useState(initialImages);
  const [uploading, setUploading] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "IN_USE" | "UNUSED" | "BANNERS" | "CAKES">("ALL");

  // File Upload Handler
  const handleUploadFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      const res = await fetch("/api/images", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setImages((prev) => [...data.images, ...prev]);
      setSuccessMessage(`Successfully uploaded ${data.images.length} new photo(s)!`);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setError(err.message || "Failed to upload files");
    } finally {
      setUploading(false);
    }
  };

  // Drag & drop listeners
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUploadFiles(e.dataTransfer.files);
    }
  };

  // Copy URL
  const handleCopyUrl = (img: any) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(img.url);
      setCopiedId(img.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Delete Single Image
  const handleDeleteImage = async (imgId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const res = await fetch(`/api/images?id=${imgId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setImages((prev) => prev.filter((img) => img.id !== imgId));
        if (previewImage?.id === imgId) setPreviewImage(null);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to delete image");
      }
    } catch (e) {
      console.error(e);
      setError("Failed to delete image");
    }
  };

  // Bulk Cleanup Unused / Orphaned Images
  const handleCleanupUnused = async () => {
    const unusedCount = images.filter((img) => !img.isUsed).length;
    if (unusedCount === 0) {
      alert("No unused or duplicate images found to clean up.");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to delete ${unusedCount} unused/orphaned image(s)? This will permanently purge old duplicate files from CDN and database while keeping all active product images intact.`
      )
    ) {
      return;
    }

    setCleaning(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/images?action=cleanup", {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Cleanup failed");

      const deletedSet = new Set(data.deletedIds || []);
      setImages((prev) => prev.filter((img) => !deletedSet.has(img.id)));
      setSuccessMessage(`Successfully purged ${data.deletedCount} unused duplicate/orphaned image(s)!`);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      setError(err.message || "Failed to clean up unused images");
    } finally {
      setCleaning(false);
    }
  };

  // Counts
  const usedCount = useMemo(() => images.filter((img) => img.isUsed).length, [images]);
  const unusedCount = useMemo(() => images.filter((img) => !img.isUsed).length, [images]);

  const bannerCount = useMemo(() => {
    return images.filter(
      (img) =>
        (img.filename || "").toLowerCase().includes("banner") ||
        (img.url || "").toLowerCase().includes("banner")
    ).length;
  }, [images]);

  const cakeCount = images.length - bannerCount;

  // Filtered images list
  const filteredImages = useMemo(() => {
    return images.filter((img) => {
      const filename = (img.filename || "").toLowerCase();
      const url = (img.url || "").toLowerCase();
      const query = searchQuery.toLowerCase().trim();

      const matchesSearch = !query || filename.includes(query) || url.includes(query);
      if (!matchesSearch) return false;

      if (filterType === "IN_USE") return Boolean(img.isUsed);
      if (filterType === "UNUSED") return !img.isUsed;
      if (filterType === "BANNERS") {
        return filename.includes("banner") || url.includes("banner");
      }
      if (filterType === "CAKES") {
        return !filename.includes("banner") && !url.includes("banner");
      }

      return true;
    });
  }, [images, searchQuery, filterType]);

  return (
    <div className="space-y-6 pb-32 sm:pb-12">
      {/* Header with Quick Clean Up Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-gold-400">
            Media Assets
          </span>
          <h1 className="font-serif text-2xl font-bold text-cream-50 sm:text-3xl">
            Image Library ({images.length})
          </h1>
          <p className="text-xs text-luxury-400 mt-1">
            Upload and manage cake photography. Detects active vs unused duplicate images automatically.
          </p>
        </div>

        {/* Clean Up Unused Action Button */}
        {unusedCount > 0 && (
          <button
            type="button"
            onClick={handleCleanupUnused}
            disabled={cleaning}
            className="self-start sm:self-center flex items-center gap-2 rounded-2xl border border-amber-500/40 bg-amber-950/40 px-4 py-2.5 text-xs font-bold text-amber-300 hover:bg-amber-900/60 hover:border-amber-400 disabled:opacity-50 transition-all shadow-lg"
          >
            {cleaning ? (
              <Sparkles className="h-4 w-4 animate-spin text-amber-400" />
            ) : (
              <Trash2 className="h-4 w-4 text-amber-400" />
            )}
            <span>Clean Up {unusedCount} Unused Duplicate Images</span>
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center space-x-2 rounded-xl border border-red-500/40 bg-red-950/40 p-3.5 text-xs text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center space-x-2 rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-3.5 text-xs text-emerald-400">
          <Check className="h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-6 sm:p-8 text-center transition-all ${
          dragActive
            ? "border-gold-400 bg-gold-500/10 scale-[1.01]"
            : "border-gold-500/30 bg-luxury-900/60 hover:border-gold-500/60"
        }`}
      >
        <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gold-500/10 text-gold-400 shadow-gold-sm mb-3">
          {uploading ? (
            <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 animate-spin" />
          ) : (
            <Upload className="h-6 w-6 sm:h-7 sm:w-7" />
          )}
        </div>

        <h3 className="font-serif text-sm sm:text-base font-bold text-cream-100">
          {uploading ? "Uploading & Processing Photos..." : "Upload New Cake & Banner Photos"}
        </h3>
        <p className="mt-1 text-[11px] sm:text-xs text-luxury-400 max-w-sm">
          Supports PNG, JPG, WEBP. Drag & drop on desktop or tap below on mobile.
        </p>

        <label className="mt-4 cursor-pointer rounded-xl bg-gold-gradient px-5 py-2.5 text-xs font-bold text-luxury-950 shadow-gold-sm hover:opacity-95 active:scale-95 transition-all inline-flex items-center gap-2">
          <Upload className="h-3.5 w-3.5" />
          <span>Choose Photos / Camera</span>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => handleUploadFiles(e.target.files)}
          />
        </label>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-gold-500/20 bg-luxury-900/80 p-3 sm:p-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setFilterType("ALL")}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
              filterType === "ALL"
                ? "bg-gold-500 text-luxury-950 font-bold shadow-gold-sm"
                : "bg-luxury-950 text-luxury-400 hover:text-cream-100 border border-luxury-800"
            }`}
          >
            All ({images.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterType("IN_USE")}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
              filterType === "IN_USE"
                ? "bg-emerald-500 text-luxury-950 font-bold shadow-gold-sm"
                : "bg-luxury-950 text-emerald-400 hover:text-emerald-300 border border-emerald-900/60"
            }`}
          >
            🟢 In Use ({usedCount})
          </button>

          <button
            type="button"
            onClick={() => setFilterType("UNUSED")}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
              filterType === "UNUSED"
                ? "bg-amber-500 text-luxury-950 font-bold shadow-gold-sm"
                : "bg-luxury-950 text-amber-400 hover:text-amber-300 border border-amber-900/60"
            }`}
          >
            🟠 Unused ({unusedCount})
          </button>

          <button
            type="button"
            onClick={() => setFilterType("BANNERS")}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
              filterType === "BANNERS"
                ? "bg-gold-500 text-luxury-950 font-bold shadow-gold-sm"
                : "bg-luxury-950 text-luxury-400 hover:text-cream-100 border border-luxury-800"
            }`}
          >
            Banners ({bannerCount})
          </button>

          <button
            type="button"
            onClick={() => setFilterType("CAKES")}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
              filterType === "CAKES"
                ? "bg-gold-500 text-luxury-950 font-bold shadow-gold-sm"
                : "bg-luxury-950 text-luxury-400 hover:text-cream-100 border border-luxury-800"
            }`}
          >
            Cakes & Sweets ({cakeCount})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-luxury-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by filename..."
            className="w-full rounded-xl border border-luxury-700 bg-luxury-950 pl-8 pr-8 py-1.5 text-xs text-cream-100 placeholder:text-luxury-500 focus:border-gold-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-luxury-400 hover:text-cream-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Images Grid */}
      <div className="rounded-3xl border border-gold-500/20 bg-luxury-900/80 p-4 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-base sm:text-lg font-bold text-cream-50">
            All Uploaded Media Assets ({filteredImages.length})
          </h2>
          {searchQuery && (
            <span className="text-[11px] text-gold-400">
              Matching &ldquo;{searchQuery}&rdquo;
            </span>
          )}
        </div>

        {filteredImages.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filteredImages.map((img) => (
              <div
                key={img.id}
                className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-luxury-950 transition-all ${
                  img.isUsed
                    ? "border-emerald-500/30 hover:border-emerald-400 hover:shadow-gold-sm"
                    : "border-amber-500/30 hover:border-amber-400"
                }`}
              >
                {/* Image Container - Tap to Preview */}
                <div
                  onClick={() => setPreviewImage(img)}
                  className="relative aspect-square w-full overflow-hidden bg-luxury-900 cursor-pointer"
                >
                  <Image
                    src={img.url}
                    alt={img.filename}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Usage Badge (Top Left) */}
                  <div className="absolute top-2 left-2 flex items-center gap-1 z-10">
                    {img.isUsed ? (
                      <span
                        className="inline-flex items-center gap-1 rounded-md bg-emerald-950/90 border border-emerald-500/60 px-1.5 py-0.5 text-[9px] font-bold text-emerald-300 backdrop-blur-md shadow"
                        title={img.usedIn && img.usedIn.length > 0 ? `Used in: ${img.usedIn.join(", ")}` : "In use on website"}
                      >
                        <Check className="h-2.5 w-2.5" /> In Use
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1 rounded-md bg-amber-950/90 border border-amber-500/60 px-1.5 py-0.5 text-[9px] font-bold text-amber-300 backdrop-blur-md shadow"
                        title="Not linked to any active cake, category, occasion, or setting"
                      >
                        <AlertCircle className="h-2.5 w-2.5" /> Unused
                      </span>
                    )}
                  </div>

                  {/* Top-right quick copy button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyUrl(img);
                    }}
                    className={`absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-lg border backdrop-blur-md transition-all ${
                      copiedId === img.id
                        ? "bg-emerald-500 text-white border-emerald-400"
                        : "bg-black/60 text-cream-200 border-luxury-700/80 hover:bg-gold-500 hover:text-luxury-950"
                    }`}
                    title="Copy Image URL"
                  >
                    {copiedId === img.id ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>

                  {/* Desktop Hover Actions Overlay */}
                  <div className="hidden md:flex absolute inset-0 items-center justify-center space-x-2 bg-luxury-950/70 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="inline-flex items-center gap-1 rounded-lg bg-luxury-900/90 border border-gold-500/40 px-2.5 py-1 text-[11px] font-semibold text-gold-300 shadow">
                      <Eye className="h-3.5 w-3.5" />
                      <span>Preview Details</span>
                    </span>
                  </div>
                </div>

                {/* Footer details with direct 1-tap mobile touch controls */}
                <div className="p-2 sm:p-2.5 space-y-1.5">
                  <div className="flex items-start justify-between gap-1">
                    <span
                      className="block text-[11px] font-semibold text-cream-200 truncate"
                      title={img.filename}
                    >
                      {img.filename}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-luxury-400 pt-0.5 border-t border-luxury-900">
                    <span className="font-mono text-[9px] text-luxury-500">
                      {img.size ? `${(img.size / 1024).toFixed(0)} KB` : "Web"}
                    </span>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setPreviewImage(img)}
                        className="p-1 rounded-md text-luxury-400 hover:text-gold-400 hover:bg-luxury-900 transition-colors"
                        title="Preview Details"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyUrl(img)}
                        className="p-1 rounded-md text-luxury-400 hover:text-gold-400 hover:bg-luxury-900 transition-colors"
                        title="Copy Image URL"
                      >
                        {copiedId === img.id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteImage(img.id)}
                        className="p-1 rounded-md text-luxury-500 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                        title="Delete Image"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-luxury-400 text-xs space-y-2">
            <ImageIcon className="h-8 w-8 mx-auto text-luxury-600 mb-2" />
            <p>
              {searchQuery
                ? `No images found matching "${searchQuery}".`
                : "No images found in this filter category."}
            </p>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-xs font-semibold text-gold-400 hover:underline"
              >
                Clear Search Filter
              </button>
            )}
          </div>
        )}
      </div>

      {/* Full Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-4 backdrop-blur-md overflow-y-auto">
          <div className="relative max-w-2xl w-full rounded-3xl border border-gold-500/30 bg-[#14120f] p-4 sm:p-6 shadow-2xl space-y-4 my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-luxury-800 pb-3">
              <div className="min-w-0 pr-2">
                <span className="font-serif text-sm sm:text-base font-bold text-cream-50 truncate block">
                  {previewImage.filename}
                </span>
                <span className="text-[10px] text-luxury-400 font-mono">
                  {previewImage.size ? `${(previewImage.size / 1024).toFixed(0)} KB` : "Web Hosted"}
                </span>
              </div>
              <button
                onClick={() => setPreviewImage(null)}
                className="rounded-xl p-1.5 text-luxury-400 hover:text-cream-100 hover:bg-luxury-800 transition-colors shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Image Box */}
            <div className="relative aspect-video sm:aspect-[16/10] w-full overflow-hidden rounded-2xl border border-gold-500/20 bg-luxury-950 flex items-center justify-center">
              <Image
                src={previewImage.url}
                alt={previewImage.filename}
                fill
                sizes="800px"
                className="object-contain"
              />
            </div>

            {/* Usage Status Details */}
            <div className="rounded-xl border border-luxury-800 bg-luxury-950 p-3 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-luxury-400 block">
                Website Usage Status
              </span>
              {previewImage.isUsed ? (
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {previewImage.usedIn && previewImage.usedIn.length > 0 ? (
                    previewImage.usedIn.map((item: string, idx: number) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-950/80 border border-emerald-700/60 px-2.5 py-1 text-xs font-semibold text-emerald-300"
                      >
                        <Check className="h-3 w-3 text-emerald-400" />
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs font-semibold text-emerald-400">
                      Linked to active menu item / banner
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 pt-0.5">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>Unused / Orphaned image (Not linked to any product or banner. Safe to delete).</span>
                </div>
              )}
            </div>

            {/* URL Display */}
            <div className="flex items-center gap-2 rounded-xl border border-luxury-800 bg-luxury-950 p-2.5">
              <span className="text-xs text-luxury-400 font-mono truncate flex-1">
                {previewImage.url}
              </span>
              <a
                href={previewImage.url}
                target="_blank"
                rel="noreferrer"
                className="text-luxury-400 hover:text-gold-400 p-1 shrink-0"
                title="Open original file in new tab"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            {/* Modal Action Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleCopyUrl(previewImage)}
                className="col-span-1 sm:col-span-2 flex items-center justify-center space-x-1.5 rounded-xl bg-gold-gradient py-2.5 px-4 font-bold text-xs text-luxury-950 shadow-gold-sm hover:opacity-95 transition-opacity"
              >
                {copiedId === previewImage.id ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                <span>{copiedId === previewImage.id ? "Copied to Clipboard!" : "Copy Image Link"}</span>
              </button>

              <button
                type="button"
                onClick={() => handleDeleteImage(previewImage.id)}
                className="flex items-center justify-center space-x-1.5 rounded-xl border border-red-500/40 bg-red-950/30 py-2.5 px-4 font-semibold text-xs text-red-400 hover:bg-red-900/40 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
