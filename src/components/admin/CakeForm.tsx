"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Trash2,
  ArrowLeft,
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
    initialData?.customizationInfo || "Custom message on chocolate plaque, shape customization & tiered sizing available on request."
  );

  // Flags (All cakes are strictly 100% eggless & vegetarian)
  const [featured, setFeatured] = useState(initialData?.featured ?? false);
  const [bestseller, setBestseller] = useState(initialData?.bestseller ?? false);
  const [isNew, setIsNew] = useState(initialData?.isNew ?? false);
  const [available, setAvailable] = useState(initialData?.available ?? true);

  // Dynamic Weight Pricing Rows
  const [prices, setPrices] = useState<CakePriceRow[]>(
    initialData?.prices && initialData.prices.length > 0
      ? initialData.prices.map((p: any) => ({
          weight: p.weight,
          price: p.price,
          originalPrice: p.originalPrice || "",
          isDefault: p.isDefault,
          image: p.image || null,
        }))
      : [
          { weight: "0.5 kg", price: 799, originalPrice: 899, isDefault: false, image: null },
          { weight: "1 kg", price: 1399, originalPrice: 1599, isDefault: true, image: null },
          { weight: "1.5 kg", price: 1999, originalPrice: 2299, isDefault: false, image: null },
          { weight: "2 kg", price: 2599, originalPrice: 2999, isDefault: false, image: null },
        ]
  );

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: "cover" | "gallery") => {
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
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleAddWeightRow = () => {
    setPrices([...prices, { weight: "1 kg", price: 999, originalPrice: "", isDefault: false }]);
  };

  const handleRemoveWeightRow = (index: number) => {
    if (prices.length <= 1) {
      alert("At least one weight pricing option is required.");
      return;
    }
    setPrices(prices.filter((_, i) => i !== index));
  };

  const handleWeightChange = (index: number, field: keyof CakePriceRow, value: any) => {
    const updated = [...prices];
    updated[index] = { ...updated[index], [field]: value };
    setPrices(updated);
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

    setSubmitting(true);

    try {
      const payload = {
        name,
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
        occasionIds: selectedOccasionIds,
        prices: prices.map((p, idx) => ({
          weight: p.weight,
          price: Number(p.price) || 0,
          originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
          isDefault: p.isDefault ?? idx === 0,
          image: p.image || null,
        })),
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
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/cakes"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-gold-400 hover:text-gold-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Cakes List</span>
        </Link>
      </div>

      <div className="rounded-3xl border border-gold-500/20 bg-[#14120f] p-6 sm:p-8 shadow-2xl">
        <div className="border-b border-luxury-800 pb-5">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-400">
              {isEditing ? "Edit Confection" : "New Cake Creation"}
            </span>
            <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
              <Leaf className="h-3 w-3" />
              <span>100% Eggless</span>
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cream-50 mt-1">
            {isEditing ? `Edit "${initialData?.name}"` : "Create New Cake"}
          </h1>
          <p className="text-xs text-luxury-400 mt-1">
            Configure cake details, multiple weight-wise prices, high-resolution photography, and badges.
          </p>
        </div>

        {error && (
          <div className="mt-6 flex items-center space-x-2 rounded-xl border border-red-500/40 bg-red-950/40 p-3.5 text-xs text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-8">
          {/* Section 1: General Info */}
          <div className="space-y-4">
            <h2 className="font-serif text-base font-bold text-cream-100 flex items-center space-x-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold-500/20 text-[10px] text-gold-400 font-bold">1</span>
              <span>General Information</span>
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                  className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-4 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-cream-200">
                  Category <span className="text-gold-400">*</span>
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-4 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preparation Notice Time */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-cream-200">
                  Preparation / Notice Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fresh daily bake • 2-3 hours notice"
                  value={preparationNotes}
                  onChange={(e) => setPreparationNotes(e.target.value)}
                  className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-4 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
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
                  className="w-full rounded-xl border border-luxury-700 bg-luxury-950 p-3 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
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
                  className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-4 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Dynamic Weight-Wise Pricing */}
          <div className="space-y-4 pt-4 border-t border-luxury-800">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-base font-bold text-cream-100 flex items-center space-x-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold-500/20 text-[10px] text-gold-400 font-bold">2</span>
                <span>Weight-Wise Pricing Tiers</span>
              </h2>

              <button
                type="button"
                onClick={handleAddWeightRow}
                className="flex items-center space-x-1 rounded-lg border border-gold-500/30 bg-luxury-800 px-3 py-1.5 text-xs font-semibold text-gold-300 hover:bg-gold-500 hover:text-luxury-950"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Weight Tier</span>
              </button>
            </div>
            <p className="text-xs text-luxury-400">
              Configure available weights and prices (e.g. 0.5 kg → ₹799, 1 kg → ₹1399, 2 kg → ₹2599).
            </p>

            <div className="space-y-2.5">
              {prices.map((row, idx) => (
                <div
                  key={idx}
                  className="flex flex-wrap items-center gap-3 rounded-2xl border border-luxury-800 bg-[#161411] p-3.5"
                >
                  <div className="flex-1 min-w-[120px]">
                    <label className="block text-[10px] text-luxury-400 mb-1">Weight Tier</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 0.5 kg, 1 kg, 2 kg"
                      value={row.weight}
                      onChange={(e) => handleWeightChange(idx, "weight", e.target.value)}
                      className="w-full rounded-lg border border-luxury-700 bg-luxury-900 px-3 py-2 text-xs text-cream-100"
                    />
                  </div>

                  <div className="flex-1 min-w-[120px]">
                    <label className="block text-[10px] text-luxury-400 mb-1">Selling Price (₹)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="e.g. 799"
                      value={row.price}
                      onChange={(e) => handleWeightChange(idx, "price", e.target.value)}
                      className="w-full rounded-lg border border-luxury-700 bg-luxury-900 px-3 py-2 text-xs text-gold-400 font-bold"
                    />
                  </div>

                  <div className="flex-1 min-w-[120px]">
                    <label className="block text-[10px] text-luxury-400 mb-1">Original Price (₹ Strike-through)</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 899"
                      value={row.originalPrice || ""}
                      onChange={(e) => handleWeightChange(idx, "originalPrice", e.target.value)}
                      className="w-full rounded-lg border border-luxury-700 bg-luxury-900 px-3 py-2 text-xs text-luxury-400"
                    />
                  </div>

                  <div className="flex flex-col min-w-[140px]">
                    <label className="block text-[10px] text-luxury-400 mb-1">Tier Photo (Optional)</label>
                    <div className="flex items-center gap-2">
                      {row.image ? (
                        <div className="flex items-center gap-1.5 rounded-lg border border-gold-500/30 bg-luxury-900 p-1">
                          <img
                            src={row.image}
                            alt={row.weight}
                            className="h-8 w-8 rounded-md object-cover border border-gold-500/20"
                          />
                          <button
                            type="button"
                            onClick={() => handleWeightChange(idx, "image", null)}
                            className="p-1 text-cream-400 hover:text-red-400 transition-colors"
                            title="Remove tier photo"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setMediaModalTarget(`price-${idx}`);
                            setMediaModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-luxury-700 bg-luxury-900/60 px-2.5 py-2 text-[11px] text-cream-300 hover:border-gold-500/50 hover:text-gold-300 transition-colors"
                        >
                          <ImageIcon className="h-3.5 w-3.5 text-gold-400" />
                          <span>Select Photo</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-4">
                    <button
                      type="button"
                      onClick={() => handleRemoveWeightRow(idx)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-luxury-700 bg-luxury-900 text-luxury-400 hover:text-red-400"
                      title="Remove tier"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
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

              <div className="flex flex-col sm:flex-row items-start gap-4">
                {coverImage ? (
                  <div className="relative aspect-square h-28 w-28 shrink-0 overflow-hidden rounded-2xl border-2 border-gold-500/40 bg-luxury-950 shadow-md">
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
                  <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl border border-dashed border-luxury-700 bg-luxury-950 text-luxury-500">
                    <ImageIcon className="h-8 w-8" />
                  </div>
                )}

                <div className="flex-1 space-y-2 w-full">
                  <input
                    type="url"
                    placeholder="Paste image URL (https://...)"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-4 py-2 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                  />

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMediaModalTarget("cover");
                        setMediaModalOpen(true);
                      }}
                      className="flex items-center space-x-1.5 rounded-lg border border-gold-500/30 bg-luxury-800 px-3 py-1.5 text-xs text-gold-300 hover:bg-gold-500 hover:text-luxury-950"
                    >
                      <ImageIcon className="h-3.5 w-3.5" />
                      <span>Choose from Library</span>
                    </button>

                    <label className="flex cursor-pointer items-center space-x-1.5 rounded-lg border border-luxury-700 bg-luxury-900 px-3 py-1.5 text-xs text-cream-200 hover:border-gold-500/40">
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

              <div className="flex flex-wrap gap-3">
                {galleryImages.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square h-20 w-20 overflow-hidden rounded-xl border border-gold-500/20 bg-luxury-950"
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
                  className="flex h-20 w-20 flex-col items-center justify-center rounded-xl border border-dashed border-luxury-700 bg-luxury-950 text-luxury-400 hover:border-gold-500/40 hover:text-gold-300"
                >
                  <Plus className="h-5 w-5" />
                  <span className="text-[9px] mt-1">From Library</span>
                </button>

                <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-luxury-700 bg-luxury-950 text-luxury-400 hover:border-gold-500/40 hover:text-gold-300">
                  <Upload className="h-5 w-5" />
                  <span className="text-[9px] mt-1">Upload</span>
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

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-luxury-800 bg-[#161411] p-3.5 hover:border-gold-500/40">
                <div>
                  <span className="block text-xs font-semibold text-gold-400">Bestseller Badge</span>
                  <span className="text-[10px] text-luxury-400">Highlighted item</span>
                </div>
                <input
                  type="checkbox"
                  checked={bestseller}
                  onChange={(e) => setBestseller(e.target.checked)}
                  className="h-4 w-4 rounded accent-gold-500"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-luxury-800 bg-[#161411] p-3.5 hover:border-amber-500/40">
                <div>
                  <span className="block text-xs font-semibold text-amber-300">Signature Bake</span>
                  <span className="text-[10px] text-luxury-400">Featured spotlight</span>
                </div>
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4 rounded accent-amber-500"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-luxury-800 bg-[#161411] p-3.5">
                <div>
                  <span className="block text-xs font-semibold text-cream-200">New Arrival</span>
                  <span className="text-[10px] text-luxury-400">Fresh recipe tag</span>
                </div>
                <input
                  type="checkbox"
                  checked={isNew}
                  onChange={(e) => setIsNew(e.target.checked)}
                  className="h-4 w-4 rounded accent-gold-500"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-luxury-800 bg-[#161411] p-3.5">
                <div>
                  <span className="block text-xs font-semibold text-cream-200">Active Visibility</span>
                  <span className="text-[10px] text-luxury-400">Visible on menu</span>
                </div>
                <input
                  type="checkbox"
                  checked={available}
                  onChange={(e) => setAvailable(e.target.checked)}
                  className="h-4 w-4 rounded accent-emerald-500"
                />
              </label>
            </div>
          </div>

          {/* Section 5: Festivals & Occasion Collections */}
          <div className="space-y-4 pt-4 border-t border-luxury-800">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-base font-bold text-cream-100 flex items-center space-x-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold-500/20 text-[10px] text-gold-400 font-bold">5</span>
                <span>Festival & Occasion Collections</span>
              </h2>
              <span className="text-[11px] text-luxury-400">Multi-select tags</span>
            </div>
            <p className="text-xs text-luxury-400">
              Tag this cake under upcoming festivals or seasons. The system will automatically showcase this confection when that occasion's annual window activates.
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
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200 ${
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

          {/* Submit */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-luxury-800">
            <Link
              href="/admin/cakes"
              className="rounded-xl border border-luxury-700 bg-luxury-900 px-5 py-2.5 text-xs font-semibold text-cream-200 hover:border-luxury-600"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting || uploading}
              className="flex items-center space-x-2 rounded-xl bg-gold-gradient px-6 py-2.5 text-xs font-bold text-luxury-950 shadow-gold-sm hover:opacity-95 disabled:opacity-50"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-gold-500/30 bg-[#14120f] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-luxury-800 pb-4">
              <h3 className="font-serif text-lg font-bold text-cream-50">
                Select Photo from Media Library ({mediaLibrary.length})
              </h3>
              <button
                type="button"
                onClick={() => setMediaModalOpen(false)}
                className="text-luxury-400 hover:text-cream-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 max-h-80 overflow-y-auto pr-2">
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
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

            <div className="mt-6 flex justify-end border-t border-luxury-800 pt-4">
              <button
                type="button"
                onClick={() => setMediaModalOpen(false)}
                className="rounded-xl border border-luxury-700 bg-luxury-800 px-4 py-2 text-xs font-semibold text-cream-200"
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
