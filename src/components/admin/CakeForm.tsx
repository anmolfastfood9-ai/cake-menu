"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Upload,
  Sparkles,
  Check,
  ImageIcon,
  X,
  AlertCircle,
  Scale,
  Leaf,
} from "lucide-react";

interface CakePriceRow {
  weight: string;
  price: number | string;
  originalPrice?: number | string;
  isDefault?: boolean;
  image?: string | null;
  images?: string[];
}

interface CakeFormProps {
  categories: any[];
  initialData?: any;
  isEditing?: boolean;
}

export default function CakeForm({ categories = [], initialData, isEditing = false }: CakeFormProps) {
  const router = useRouter();

  // Form State
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || categories[0]?.id || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "");
  const [ingredients, setIngredients] = useState(initialData?.ingredients || "");
  const [preparationNotes, setPreparationNotes] = useState(
    initialData?.preparationNotes || "Freshly baked daily • 2-3 hours preparation time"
  );
  const [customizationInfo, setCustomizationInfo] = useState(
    initialData?.customizationInfo || "Custom message on cake, shape customization & tiered sizing available on request."
  );

  // Flags (All cakes are strictly 100% eggless & vegetarian)
  const [featured, setFeatured] = useState(initialData?.featured ?? false);
  const [bestseller, setBestseller] = useState(initialData?.bestseller ?? false);
  const [isNew, setIsNew] = useState(initialData?.isNew ?? false);
  const [available, setAvailable] = useState(initialData?.available ?? true);

  // Display Rating & Editorial Label (Optional, per-cake presentation)
  const [displayRating, setDisplayRating] = useState<string | number>(
    initialData?.displayRating !== undefined && initialData?.displayRating !== null
      ? initialData.displayRating
      : ""
  );
  const [ratingLabel, setRatingLabel] = useState<string>(initialData?.ratingLabel || "");
  const [editorialQuote, setEditorialQuote] = useState<string>(initialData?.editorialQuote || "");

  // Dynamic Weight Pricing Rows
  const [prices, setPrices] = useState<CakePriceRow[]>(
    initialData?.prices && initialData.prices.length > 0
      ? initialData.prices.map((p: any) => {
          let tierImages: string[] = [];
          try {
            tierImages = typeof p.images === "string" ? JSON.parse(p.images) : Array.isArray(p.images) ? p.images : [];
          } catch {
            tierImages = [];
          }
          return {
            weight: p.weight,
            price: p.price,
            originalPrice: p.originalPrice || "",
            isDefault: p.isDefault,
            image: p.image || null,
            images: tierImages,
          };
        })
      : [
          { weight: "0.5 kg", price: 799, originalPrice: 899, isDefault: false, image: null, images: [] },
          { weight: "1 kg", price: 1399, originalPrice: 1599, isDefault: true, image: null, images: [] },
          { weight: "1.5 kg", price: 1999, originalPrice: 2299, isDefault: false, image: null, images: [] },
          { weight: "2 kg", price: 2599, originalPrice: 2999, isDefault: false, image: null, images: [] },
        ]
  );

  // Active accordion tier index for managing weight-specific gallery
  const [openGalleryTierIndex, setOpenGalleryTierIndex] = useState<number | null>(null);

  // Gallery Images
  let initialGallery: string[] = [];
  try {
    initialGallery = typeof initialData?.images === "string" ? JSON.parse(initialData.images) : initialData?.images || [];
  } catch (e) {
    initialGallery = [];
  }
  const [galleryImages, setGalleryImages] = useState<string[]>(initialGallery);

  // Media Library Modal
  const [mediaLibrary, setMediaLibrary] = useState<any[]>([]);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaModalTarget, setMediaModalTarget] = useState<string>("cover");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Occasion / Festival Tags
  const [availableOccasions, setAvailableOccasions] = useState<any[]>([]);
  const [selectedOccasionIds, setSelectedOccasionIds] = useState<string[]>(
    initialData?.occasions
      ? initialData.occasions.map((o: any) => o.occasionId || o.occasion?.id).filter(Boolean)
      : []
  );

  useEffect(() => {
    fetch("/api/images")
      .then((res) => res.json())
      .then((data) => {
        if (data?.images) setMediaLibrary(data.images);
      })
      .catch(console.error);

    fetch("/api/occasions")
      .then((res) => res.json())
      .then((data) => {
        if (data?.occasions) setAvailableOccasions(data.occasions);
      })
      .catch(console.error);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);
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

      setMediaLibrary((prev) => [...data.images, ...prev]);

      if (target === "cover" && data.images[0]) {
        setCoverImage(data.images[0].url);
      } else if (target === "gallery") {
        const newUrls = data.images.map((img: any) => img.url);
        setGalleryImages((prev) => [...prev, ...newUrls]);
      } else if (target.startsWith("tier-gallery-")) {
        const pIdx = parseInt(target.replace("tier-gallery-", ""), 10);
        if (!isNaN(pIdx) && prices[pIdx]) {
          const newUrls = data.images.map((img: any) => img.url);
          const current = prices[pIdx].images || [];
          const updated = [...current, ...newUrls].slice(0, 5);
          handleWeightChange(pIdx, "images", updated);
          if (!prices[pIdx].image && updated.length > 0) {
            handleWeightChange(pIdx, "image", updated[0]);
          }
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleAddWeightRow = () => {
    setPrices([...prices, { weight: "1 kg", price: 999, originalPrice: "", isDefault: false, image: null, images: [] }]);
  };

  const handleRemoveWeightRow = (index: number) => {
    if (prices.length <= 1) {
      alert("At least one weight pricing option is required.");
      return;
    }
    setPrices(prices.filter((_, i) => i !== index));
    if (openGalleryTierIndex === index) {
      setOpenGalleryTierIndex(null);
    } else if (openGalleryTierIndex !== null && openGalleryTierIndex > index) {
      setOpenGalleryTierIndex(openGalleryTierIndex - 1);
    }
  };

  const handleWeightChange = (index: number, field: keyof CakePriceRow, value: any) => {
    const updated = [...prices];
    updated[index] = { ...updated[index], [field]: value };
    setPrices(updated);
  };

  const handleReorderTierGallery = (tierIdx: number, fromIdx: number, toIdx: number) => {
    const currentTier = prices[tierIdx];
    if (!currentTier || !currentTier.images) return;
    const gallery = [...currentTier.images];
    if (fromIdx < 0 || fromIdx >= gallery.length || toIdx < 0 || toIdx >= gallery.length) return;
    const [moved] = gallery.splice(fromIdx, 1);
    gallery.splice(toIdx, 0, moved);
    handleWeightChange(tierIdx, "images", gallery);
    if (gallery.length > 0) {
      handleWeightChange(tierIdx, "image", gallery[0]);
    }
  };

  const handleRemoveTierGalleryImage = (tierIdx: number, imageIdx: number) => {
    const currentTier = prices[tierIdx];
    if (!currentTier || !currentTier.images) return;
    const gallery = currentTier.images.filter((_, i) => i !== imageIdx);
    handleWeightChange(tierIdx, "images", gallery);
    handleWeightChange(tierIdx, "image", gallery.length > 0 ? gallery[0] : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Cake name is required");
      return;
    }
    if (!categoryId) {
      setError("Please select a category");
      return;
    }
    if (!coverImage.trim()) {
      setError("Please select or upload a cover image");
      return;
    }
    if (prices.length === 0) {
      setError("Please add at least one weight pricing tier");
      return;
    }

    // Display Rating validation (Optional: 4.5 to 5.0, 1 decimal place)
    let parsedDisplayRating: number | null = null;
    if (displayRating !== "" && displayRating !== null && displayRating !== undefined) {
      const num = Number(displayRating);
      if (isNaN(num) || num < 4.5 || num > 5.0) {
        setError("Display Rating must be between 4.5 and 5.0");
        return;
      }
      const rounded = Math.round(num * 10) / 10;
      if (Math.abs(num - rounded) > 0.001) {
        setError("Display Rating can have at most 1 decimal place (e.g. 4.8)");
        return;
      }
      parsedDisplayRating = rounded;
    }

    const trimmedRatingLabel = ratingLabel.trim() || null;
    if (trimmedRatingLabel && trimmedRatingLabel.length > 30) {
      setError("Display Label must not exceed 30 characters");
      return;
    }

    const trimmedEditorialQuote = editorialQuote.trim() || null;
    if (trimmedEditorialQuote && trimmedEditorialQuote.length > 180) {
      setError("Editorial Quote must not exceed 180 characters");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        name,
        productType: "CAKE",
        slug: slug.trim() || undefined,
        categoryId,
        description,
        coverImage,
        images: galleryImages,
        ingredients,
        preparationNotes,
        customizationInfo,
        featured,
        bestseller,
        isNew,
        available,
        displayRating: parsedDisplayRating,
        ratingLabel: trimmedRatingLabel,
        editorialQuote: trimmedEditorialQuote,
        occasionIds: selectedOccasionIds,
        prices: prices.map((p, idx) => {
          const tierGallery = (p.images || [])
            .filter((img) => typeof img === "string" && img.trim().length > 0)
            .slice(0, 5);
          return {
            weight: p.weight,
            price: Number(p.price) || 0,
            originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
            isDefault: p.isDefault ?? idx === 0,
            image: tierGallery.length > 0 ? tierGallery[0] : (p.image || null),
            images: tierGallery,
          };
        }),
      };

      const url = isEditing ? `/api/cakes/${initialData.id}` : "/api/cakes";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save cake");
      }

      router.push("/admin/cakes");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-32 sm:pb-8">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/cakes"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-gold-400 hover:text-gold-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Cakes List</span>
        </Link>
      </div>

      <div className="rounded-2xl sm:rounded-3xl border border-gold-500/20 bg-[#14120f] p-4 sm:p-8 shadow-2xl">
        <div className="border-b border-luxury-800 pb-4 sm:pb-5">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-400">
              {isEditing ? "Edit Confection" : "New Cake Creation"}
            </span>
            <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
              <Leaf className="h-3 w-3" />
              <span>100% Eggless</span>
            </span>
          </div>
          <h1 className="font-serif text-xl sm:text-3xl font-bold text-cream-50 mt-1">
            {isEditing ? `Edit "${initialData?.name}"` : "Create New Cake"}
          </h1>
          <p className="text-xs text-luxury-400 mt-1">
            Configure cake details, multiple weight-wise prices, high-resolution photography, and badges.
          </p>
        </div>

        {error && (
          <div className="mt-4 sm:mt-6 flex items-center space-x-2 rounded-xl border border-red-500/40 bg-red-950/40 p-3.5 text-xs text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-7 sm:space-y-8">
          {/* Section 1: General Info */}
          <div className="space-y-4">
            <h2 className="font-serif text-base font-bold text-cream-100 flex items-center space-x-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold-500/20 text-[10px] text-gold-400 font-bold">1</span>
              <span>General Information</span>
            </h2>

            <div className="grid grid-cols-1 gap-3.5 sm:gap-4 sm:grid-cols-2">
              {/* Cake Name */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-semibold text-cream-200">
                  Cake Name <span className="text-gold-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Belgian Dark Chocolate Truffle"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3.5 sm:px-4 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-semibold text-cream-200">
                  Category <span className="text-gold-400">*</span>
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3.5 sm:px-4 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preparation Notice Time */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-semibold text-cream-200">
                  Preparation / Notice Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fresh daily bake • 2-3 hours notice"
                  value={preparationNotes}
                  onChange={(e) => setPreparationNotes(e.target.value)}
                  className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3.5 sm:px-4 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-semibold text-cream-200">
                  Description <span className="text-gold-400">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the layers, cocoa origin, and flavor notes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-luxury-700 bg-luxury-950 p-3 sm:p-3.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                />
              </div>

              {/* Ingredients */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-semibold text-cream-200">
                  Artisanal Ingredients
                </label>
                <input
                  type="text"
                  placeholder="e.g. 54% Callebaut Belgian Cocoa, French Butter, Bourbon Vanilla Pods"
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3.5 sm:px-4 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                />
              </div>

              {/* Editorial Quote */}
              <div className="space-y-1.5 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-cream-200">
                    Editorial Quote <span className="text-luxury-400 font-normal">(Optional · Max 180 chars)</span>
                  </label>
                  <span className="text-[10.5px] text-luxury-500">
                    {editorialQuote.length}/180
                  </span>
                </div>
                <textarea
                  rows={2}
                  maxLength={180}
                  placeholder='e.g. Handcrafted layers of sour cherries and dark Belgian ganache.'
                  value={editorialQuote}
                  onChange={(e) => setEditorialQuote(e.target.value)}
                  className="w-full rounded-xl border border-luxury-700 bg-luxury-950 p-3 text-xs text-cream-100 placeholder:text-luxury-600 focus:border-gold-500 focus:outline-none"
                />
                <p className="text-[10.5px] text-luxury-400">
                  Highlighted quotation banner shown on the cake page. Leave blank to hide the quote banner completely.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Weight / Pack Size / Unit Pricing */}
          <div className="space-y-4 pt-4 border-t border-luxury-800">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-base font-bold text-cream-100 flex items-center space-x-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold-500/20 text-[10px] text-gold-400 font-bold">2</span>
                <span>Weight / Pack Size / Unit Tiers</span>
              </h2>

              <button
                type="button"
                onClick={handleAddWeightRow}
                className="flex items-center space-x-1 rounded-lg border border-gold-500/30 bg-luxury-800 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-gold-300 hover:bg-gold-500 hover:text-luxury-950 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Tier</span>
              </button>
            </div>
            <p className="text-xs text-luxury-400">
              Configure cake weights and pricing tiers (e.g., 0.5 kg, 1 kg, 2 kg).
            </p>

            <div className="space-y-3">
              {prices.map((row, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all p-3 sm:p-4 space-y-3 ${
                    openGalleryTierIndex === idx
                      ? "border-gold-500/50 bg-[#171410] shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
                      : "border-luxury-800 bg-[#161411]"
                  }`}
                >
                  {/* Top bar for Mobile: Tier Number + Delete Button */}
                  <div className="flex md:hidden items-center justify-between border-b border-luxury-800/80 pb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-gold-400">Tier #{idx + 1}</span>
                      {row.weight && (
                        <span className="text-[11px] text-cream-300 font-medium">({row.weight})</span>
                      )}
                      {row.isDefault && (
                        <span className="text-[9px] font-semibold bg-gold-500/20 text-gold-300 px-1.5 py-0.5 rounded">Default</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveWeightRow(idx)}
                      className="inline-flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 p-1 rounded bg-red-950/30 border border-red-500/20 px-2 py-1"
                      title="Remove tier"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>

                  {/* Desktop & Mobile Responsive Grid */}
                  <div className="grid grid-cols-2 gap-2.5 md:flex md:flex-wrap md:items-end md:gap-3">
                    {/* Weight / Unit */}
                    <div className="col-span-1 md:flex-1 md:min-w-[120px]">
                      <label className="block text-[10px] font-medium text-luxury-400 mb-1">Weight / Unit</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 0.5 kg, 1 kg"
                        value={row.weight}
                        onChange={(e) => handleWeightChange(idx, "weight", e.target.value)}
                        className="w-full rounded-xl border border-luxury-700 bg-luxury-900 px-3 py-2 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                      />
                    </div>

                    {/* Selling Price */}
                    <div className="col-span-1 md:flex-1 md:min-w-[120px]">
                      <label className="block text-[10px] font-medium text-luxury-400 mb-1">Selling Price (₹)</label>
                      <input
                        type="number"
                        required
                        min="0"
                        placeholder="e.g. 799"
                        value={row.price}
                        onChange={(e) => handleWeightChange(idx, "price", e.target.value)}
                        className="w-full rounded-xl border border-luxury-700 bg-luxury-900 px-3 py-2 text-xs text-gold-400 font-bold focus:border-gold-500 focus:outline-none"
                      />
                    </div>

                    {/* Original Price */}
                    <div className="col-span-1 md:flex-1 md:min-w-[110px]">
                      <label className="block text-[10px] font-medium text-luxury-400 mb-1">Original Price (₹)</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="e.g. 899"
                        value={row.originalPrice || ""}
                        onChange={(e) => handleWeightChange(idx, "originalPrice", e.target.value)}
                        className="w-full rounded-xl border border-luxury-700 bg-luxury-900 px-3 py-2 text-xs text-luxury-400 focus:border-gold-500 focus:outline-none"
                      />
                    </div>

                    {/* Manage Gallery Control */}
                    <div className="col-span-1 md:min-w-[160px]">
                      <label className="block text-[10px] font-medium text-luxury-400 mb-1">Weight Gallery (Max 5)</label>
                      <button
                        type="button"
                        onClick={() => setOpenGalleryTierIndex(openGalleryTierIndex === idx ? null : idx)}
                        className={`w-full inline-flex items-center justify-between gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
                          (row.images && row.images.length > 0)
                            ? "border-gold-500/50 bg-gold-500/15 text-gold-300 hover:bg-gold-500/25"
                            : "border-luxury-700 bg-luxury-900 text-cream-300 hover:border-gold-500/40 hover:text-gold-300"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <ImageIcon className="h-3.5 w-3.5 text-gold-400 shrink-0" />
                          <span className="truncate">Gallery</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-black/60 text-[9px] font-bold text-gold-400">
                            {row.images?.length || 0}
                          </span>
                          {openGalleryTierIndex === idx ? (
                            <ChevronUp className="h-3.5 w-3.5 text-gold-400" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5 text-luxury-400" />
                          )}
                        </div>
                      </button>
                    </div>

                    {/* Desktop Trash Button */}
                    <div className="hidden md:flex items-center pb-0.5">
                      <button
                        type="button"
                        onClick={() => handleRemoveWeightRow(idx)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-luxury-700 bg-luxury-900 text-luxury-400 hover:text-red-400 hover:border-red-500/40 transition-colors"
                        title="Remove tier"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Accordion / Drawer: Manage Gallery for this Weight Tier */}
                  {openGalleryTierIndex === idx && (
                    <div className="rounded-xl border border-gold-500/20 bg-luxury-950/70 p-3 sm:p-4 space-y-3 mt-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-luxury-800 pb-2.5">
                        <div>
                          <h4 className="text-xs font-bold text-gold-300 flex items-center gap-1.5">
                            <span>{row.weight || "Weight Tier"} — Multi-Image Gallery</span>
                            <span className="text-[11px] font-normal text-luxury-400">
                              ({(row.images?.length || 0)} / 5 photos)
                            </span>
                          </h4>
                          <p className="text-[11px] text-luxury-400 mt-0.5">
                            Reorder photos intentionally. Slot [1] is the main hero photo for {row.weight || "this tier"}.
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {(row.images?.length || 0) < 5 && (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  setMediaModalTarget(`tier-gallery-${idx}`);
                                  setMediaModalOpen(true);
                                }}
                                className="inline-flex items-center gap-1 rounded-lg border border-gold-500/40 bg-gold-500/15 px-2.5 py-1.5 text-xs font-semibold text-gold-300 hover:bg-gold-500/25 transition-colors"
                              >
                                <Plus className="h-3.5 w-3.5" />
                                <span>Media Library</span>
                              </button>

                              <label className="inline-flex items-center gap-1 cursor-pointer rounded-lg border border-luxury-700 bg-luxury-900 px-2.5 py-1.5 text-xs font-medium text-cream-200 hover:border-luxury-600 transition-colors">
                                <Upload className="h-3.5 w-3.5 text-gold-400" />
                                <span>Upload</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  disabled={uploading}
                                  onChange={(e) => handleFileUpload(e, `tier-gallery-${idx}`)}
                                />
                              </label>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Display Ordered Gallery Slots: [1] [2] [3] [4] [5] */}
                      {row.images && row.images.length > 0 ? (
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 pt-1">
                          {row.images.map((imgUrl, imgIdx) => (
                            <div
                              key={imgIdx}
                              className="group relative aspect-square rounded-xl border border-luxury-700 bg-luxury-900/90 overflow-hidden shadow-md flex flex-col justify-between p-1"
                            >
                              <img
                                src={imgUrl}
                                alt={`${row.weight} photo ${imgIdx + 1}`}
                                className="h-full w-full object-contain rounded-lg"
                              />

                              {/* Number Badge [1] [2] ... */}
                              <div className="absolute top-1 left-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-black/85 border border-gold-500/50 text-[9px] sm:text-[10px] font-bold text-gold-400 backdrop-blur-sm">
                                {imgIdx + 1}
                              </div>

                              {/* Primary / Hero Badge on Slot 1 */}
                              {imgIdx === 0 && (
                                <div className="absolute bottom-1 left-1 rounded bg-gold-500 px-1 py-0.5 text-[8px] sm:text-[9px] font-bold uppercase text-luxury-950 tracking-wide shadow-sm">
                                  Hero
                                </div>
                              )}

                              {/* Order & Remove Controls */}
                              <div className="absolute top-1 right-1 flex items-center gap-0.5 bg-black/85 rounded-lg p-0.5 border border-white/10 backdrop-blur-sm">
                                {imgIdx > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => handleReorderTierGallery(idx, imgIdx, imgIdx - 1)}
                                    className="p-1 text-cream-300 hover:text-gold-400 transition-colors"
                                    title="Move left"
                                  >
                                    <ArrowLeft className="h-3 w-3" />
                                  </button>
                                )}
                                {imgIdx < row.images!.length - 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleReorderTierGallery(idx, imgIdx, imgIdx + 1)}
                                    className="p-1 text-cream-300 hover:text-gold-400 transition-colors"
                                    title="Move right"
                                  >
                                    <ArrowRight className="h-3 w-3" />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTierGalleryImage(idx, imgIdx)}
                                  className="p-1 text-cream-300 hover:text-red-400 transition-colors"
                                  title="Remove photo"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-xl border border-dashed border-luxury-800 bg-luxury-900/40 p-4 text-center">
                          <p className="text-xs text-cream-200">
                            No gallery images configured for {row.weight || "this weight tier"}.
                          </p>
                          <p className="text-[11px] text-luxury-400 mt-1">
                            {row.image
                              ? `Legacy single photo is active: ${row.image}`
                              : "This tier will fall back to the general cake gallery."}
                          </p>
                          <div className="mt-3 flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setMediaModalTarget(`tier-gallery-${idx}`);
                                setMediaModalOpen(true);
                              }}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-gold-500/40 bg-gold-500/10 px-3 py-1.5 text-xs font-semibold text-gold-300 hover:bg-gold-500/20"
                            >
                              <Plus className="h-3.5 w-3.5" />
                              <span>Add First Image to {row.weight} Gallery</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Photography */}
          <div className="space-y-4 pt-4 border-t border-luxury-800">
            <h2 className="font-serif text-base font-bold text-cream-100 flex items-center space-x-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold-500/20 text-[10px] text-gold-400 font-bold">3</span>
              <span>Confection Photography</span>
            </h2>

            {/* Cover Image */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-cream-200">
                Cover Photo (Primary) <span className="text-gold-400">*</span>
              </label>

              <div className="flex flex-col sm:flex-row items-start gap-3.5 sm:gap-4">
                {coverImage ? (
                  <div className="relative aspect-square h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-2xl border-2 border-gold-500/40 bg-luxury-950 shadow-md self-center sm:self-auto">
                    <Image src={coverImage} alt="Cover Preview" fill sizes="112px" className="object-cover" />
                    <button
                      type="button"
                      onClick={() => setCoverImage("")}
                      className="absolute top-1 right-1 rounded-full bg-black/80 p-1 text-luxury-300 hover:text-red-400"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex h-24 w-24 sm:h-28 sm:w-28 shrink-0 items-center justify-center rounded-2xl border border-dashed border-luxury-700 bg-luxury-950 text-luxury-500 self-center sm:self-auto">
                    <ImageIcon className="h-8 w-8" />
                  </div>
                )}

                <div className="flex-1 space-y-2.5 w-full">
                  <input
                    type="url"
                    placeholder="Paste image URL (https://...)"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3.5 sm:px-4 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                  />

                  <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        setMediaModalTarget("cover");
                        setMediaModalOpen(true);
                      }}
                      className="flex items-center justify-center space-x-1.5 rounded-xl border border-gold-500/30 bg-luxury-800 px-3 py-2 text-xs font-semibold text-gold-300 hover:bg-gold-500 hover:text-luxury-950 transition-colors"
                    >
                      <ImageIcon className="h-3.5 w-3.5" />
                      <span>From Library</span>
                    </button>

                    <label className="flex cursor-pointer items-center justify-center space-x-1.5 rounded-xl border border-luxury-700 bg-luxury-900 px-3 py-2 text-xs font-semibold text-cream-200 hover:border-gold-500/40 transition-colors">
                      <Upload className="h-3.5 w-3.5" />
                      <span>Upload File</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, "cover")}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery Images */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold text-cream-200">
                Additional Gallery Photos (Optional)
              </label>

              <div className="grid grid-cols-4 sm:flex sm:flex-wrap gap-2.5 sm:gap-3">
                {galleryImages.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square overflow-hidden rounded-xl border border-gold-500/20 bg-luxury-950 sm:h-20 sm:w-20"
                  >
                    <Image src={imgUrl} alt="Gallery preview" fill sizes="80px" className="object-cover" />
                    <button
                      type="button"
                      onClick={() => setGalleryImages(galleryImages.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 rounded-full bg-black/80 p-0.5 text-luxury-300 hover:text-red-400"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    setMediaModalTarget("gallery");
                    setMediaModalOpen(true);
                  }}
                  className="aspect-square flex flex-col items-center justify-center rounded-xl border border-dashed border-luxury-700 bg-luxury-950 text-luxury-400 hover:border-gold-500/40 hover:text-gold-300 sm:h-20 sm:w-20"
                >
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-[9px] mt-0.5">Library</span>
                </button>

                <label className="aspect-square flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-luxury-700 bg-luxury-950 text-luxury-400 hover:border-gold-500/40 hover:text-gold-300 sm:h-20 sm:w-20">
                  <Upload className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-[9px] mt-0.5">Upload</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, "gallery")}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Section 4: Badges & Visibility */}
          <div className="space-y-4 pt-4 border-t border-luxury-800">
            <h2 className="font-serif text-base font-bold text-cream-100 flex items-center space-x-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold-500/20 text-[10px] text-gold-400 font-bold">4</span>
              <span>Badges & Menu Visibility</span>
            </h2>

            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-luxury-800 bg-[#161411] p-3 hover:border-gold-500/40">
                <div className="pr-1">
                  <span className="block text-xs font-semibold text-gold-400">Bestseller</span>
                  <span className="text-[10px] text-luxury-400">Highlight badge</span>
                </div>
                <input
                  type="checkbox"
                  checked={bestseller}
                  onChange={(e) => setBestseller(e.target.checked)}
                  className="h-4 w-4 rounded accent-gold-500 shrink-0"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-luxury-800 bg-[#161411] p-3 hover:border-amber-500/40">
                <div className="pr-1">
                  <span className="block text-xs font-semibold text-amber-300">Signature</span>
                  <span className="text-[10px] text-luxury-400">Chef spotlight</span>
                </div>
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4 rounded accent-amber-500 shrink-0"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-luxury-800 bg-[#161411] p-3 hover:border-gold-500/40">
                <div className="pr-1">
                  <span className="block text-xs font-semibold text-cream-200">New Arrival</span>
                  <span className="text-[10px] text-luxury-400">Fresh recipe tag</span>
                </div>
                <input
                  type="checkbox"
                  checked={isNew}
                  onChange={(e) => setIsNew(e.target.checked)}
                  className="h-4 w-4 rounded accent-gold-500 shrink-0"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-luxury-800 bg-[#161411] p-3 hover:border-emerald-500/40">
                <div className="pr-1">
                  <span className="block text-xs font-semibold text-emerald-400">Active</span>
                  <span className="text-[10px] text-luxury-400">Visible on menu</span>
                </div>
                <input
                  type="checkbox"
                  checked={available}
                  onChange={(e) => setAvailable(e.target.checked)}
                  className="h-4 w-4 rounded accent-emerald-500 shrink-0"
                />
              </label>
            </div>

            {/* Display Rating & Editorial Label */}
            <div className="rounded-xl border border-luxury-800 bg-[#161411] p-3.5 sm:p-4 space-y-3">
              <div>
                <h3 className="text-xs font-semibold text-gold-400">Display Rating & Label</h3>
                <p className="text-[11px] text-luxury-400">
                  Optional per-cake presentation rating and editorial highlight. Leave empty to hide rating.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-cream-200 mb-1">
                    Display Rating <span className="text-luxury-400 font-normal">(4.5 to 5.0, 1 decimal)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="4.5"
                      max="5.0"
                      placeholder="e.g. 4.8 (leave blank to hide)"
                      value={displayRating}
                      onChange={(e) => setDisplayRating(e.target.value)}
                      className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3.5 py-2 text-xs text-cream-100 placeholder:text-luxury-600 focus:border-gold-500 focus:outline-none"
                    />
                    <span className="absolute right-3 top-2 text-xs text-[#D4AF37] pointer-events-none">
                      ★
                    </span>
                  </div>
                  <span className="block text-[10px] text-luxury-500 mt-1">
                    Allowed: 4.5, 4.6, 4.7, 4.8, 4.9, 5.0
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-cream-200 mb-1">
                    Display Label <span className="text-luxury-400 font-normal">(Optional · Max 30 chars)</span>
                  </label>
                  <input
                    type="text"
                    maxLength={30}
                    placeholder="e.g. Bakery Favourite, Popular Choice, Top Pick"
                    value={ratingLabel}
                    onChange={(e) => setRatingLabel(e.target.value)}
                    className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3.5 py-2 text-xs text-cream-100 placeholder:text-luxury-600 focus:border-gold-500 focus:outline-none"
                  />
                  <span className="block text-[10px] text-luxury-500 mt-1">
                    Customer sees: ★ {displayRating || "4.8"}{ratingLabel ? ` · ${ratingLabel}` : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Festivals & Occasion Collections */}
          <div className="space-y-4 pt-4 border-t border-luxury-800">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-base font-bold text-cream-100 flex items-center space-x-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold-500/20 text-[10px] text-gold-400 font-bold">5</span>
                <span>Festival & Occasion Collections</span>
              </h2>
              <span className="text-[11px] text-luxury-400">Multi-select</span>
            </div>
            <p className="text-xs text-luxury-400">
              Tag this cake under upcoming festivals or seasons. The system will automatically showcase this confection when that occasion&apos;s annual window activates.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {availableOccasions.map((occ) => {
                const isSelected = selectedOccasionIds.includes(occ.id);
                const accent = occ.accentColor || "#D4AF37";
                return (
                  <button
                    key={occ.id}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setSelectedOccasionIds(selectedOccasionIds.filter((id) => id !== occ.id));
                      } else {
                        setSelectedOccasionIds([...selectedOccasionIds, occ.id]);
                      }
                    }}
                    className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs font-semibold transition-all duration-200 ${
                      isSelected
                        ? "border border-gold-500 bg-gold-500/20 text-gold-300 shadow-gold-sm"
                        : "border border-luxury-800 bg-[#161411] text-luxury-400 hover:border-luxury-700 hover:text-cream-200"
                    }`}
                  >
                    <div
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: accent }}
                    />
                    <span>{occ.name}</span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-gold-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-6 border-t border-luxury-800">
            <Link
              href="/admin/cakes"
              className="flex items-center justify-center rounded-xl border border-luxury-700 bg-luxury-900 px-5 py-3 sm:py-2.5 text-xs font-semibold text-cream-200 hover:border-luxury-600 transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting || uploading}
              className="flex items-center justify-center space-x-2 rounded-xl bg-gold-gradient px-6 py-3 sm:py-2.5 text-xs font-bold text-luxury-950 shadow-gold-sm hover:opacity-95 disabled:opacity-50 transition-opacity"
            >
              {submitting ? (
                <Sparkles className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  <span>{isEditing ? "Save Changes" : "Publish Cake to Menu"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Media Library Selection Modal */}
      {mediaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl sm:rounded-3xl border border-gold-500/30 bg-[#14120f] p-4 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-luxury-800 pb-3 sm:pb-4">
              <h3 className="font-serif text-base sm:text-lg font-bold text-cream-50 truncate pr-2">
                Select Photo from Media Library ({mediaLibrary.length})
              </h3>
              <button
                type="button"
                onClick={() => setMediaModalOpen(false)}
                className="text-luxury-400 hover:text-cream-100 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 flex-1 overflow-y-auto pr-1">
              <div className="grid grid-cols-3 gap-2 sm:gap-3 sm:grid-cols-4">
                {mediaLibrary.map((img) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => {
                      if (mediaModalTarget === "cover") {
                        setCoverImage(img.url);
                      } else if (mediaModalTarget === "gallery") {
                        if (!galleryImages.includes(img.url)) {
                          setGalleryImages([...galleryImages, img.url]);
                        }
                      } else if (mediaModalTarget.startsWith("tier-gallery-")) {
                        const pIdx = parseInt(mediaModalTarget.replace("tier-gallery-", ""), 10);
                        if (!isNaN(pIdx) && prices[pIdx]) {
                          const current = prices[pIdx].images || [];
                          if (current.length < 5 && !current.includes(img.url)) {
                            const updated = [...current, img.url];
                            handleWeightChange(pIdx, "images", updated);
                            if (!prices[pIdx].image) {
                              handleWeightChange(pIdx, "image", updated[0]);
                            }
                          }
                        }
                      } else if (mediaModalTarget.startsWith("price-")) {
                        const pIdx = parseInt(mediaModalTarget.replace("price-", ""), 10);
                        if (!isNaN(pIdx)) {
                          handleWeightChange(pIdx, "image", img.url);
                        }
                      }
                      setMediaModalOpen(false);
                    }}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-luxury-800 bg-luxury-950 hover:border-gold-500"
                  >
                    <Image src={img.url} alt={img.filename} fill sizes="150px" className="object-cover group-hover:scale-105 transition-transform" />
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex justify-end border-t border-luxury-800 pt-3">
              <button
                type="button"
                onClick={() => setMediaModalOpen(false)}
                className="w-full sm:w-auto rounded-xl border border-luxury-700 bg-luxury-800 px-4 py-2.5 text-xs font-semibold text-cream-200 text-center"
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


