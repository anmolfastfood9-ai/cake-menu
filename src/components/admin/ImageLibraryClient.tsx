"use client";

import { useState } from "react";
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
} from "lucide-react";

interface ImageLibraryClientProps {
  initialImages: any[];
}

export default function ImageLibraryClient({ initialImages = [] }: ImageLibraryClientProps) {
  const [images, setImages] = useState(initialImages);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  // File Upload Handler
  const handleUploadFiles = async (files: FileList | null) => {
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

      setImages((prev) => [...data.images, ...prev]);
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

  // Delete Image
  const handleDeleteImage = async (imgId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const res = await fetch(`/api/images?id=${imgId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setImages((prev) => prev.filter((img) => img.id !== imgId));
        if (previewImage?.id === imgId) setPreviewImage(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-gold-400">
          Media Assets
        </span>
        <h1 className="font-serif text-2xl font-bold text-cream-50 sm:text-3xl">
          Image Library ({images.length})
        </h1>
        <p className="text-xs text-luxury-400">
          Upload and manage cake photography. All images are hosted and ready for menu cards and galleries.
        </p>
      </div>

      {error && (
        <div className="flex items-center space-x-2 rounded-xl border border-red-500/40 bg-red-950/40 p-3.5 text-xs text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 text-center transition-all ${
          dragActive
            ? "border-gold-400 bg-gold-500/10 scale-101"
            : "border-gold-500/30 bg-luxury-900/60 hover:border-gold-500/60"
        }`}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-500/10 text-gold-400 shadow-gold-sm mb-3">
          {uploading ? (
            <Sparkles className="h-7 w-7 animate-spin" />
          ) : (
            <Upload className="h-7 w-7" />
          )}
        </div>

        <h3 className="font-serif text-base font-bold text-cream-100">
          {uploading ? "Uploading & Processing Confection Photos..." : "Drag & Drop Cake Images Here"}
        </h3>
        <p className="mt-1 text-xs text-luxury-400 max-w-sm">
          Supports PNG, JPG, WEBP formats. Multi-file upload supported.
        </p>

        <label className="mt-4 cursor-pointer rounded-xl bg-gold-gradient px-5 py-2.5 text-xs font-bold text-luxury-950 shadow-gold-sm hover:opacity-95 transition-opacity">
          <span>Browse Files from Computer</span>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleUploadFiles(e.target.files)}
          />
        </label>
      </div>

      {/* Images Grid */}
      <div className="rounded-3xl border border-gold-500/20 bg-luxury-900/80 p-6 shadow-xl">
        <h2 className="font-serif text-lg font-bold text-cream-50 mb-4">
          All Uploaded Media Assets
        </h2>

        {images.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {images.map((img) => (
              <div
                key={img.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-luxury-800 bg-luxury-950 transition-all hover:border-gold-500/50 hover:shadow-gold-sm"
              >
                {/* Image Container */}
                <div className="relative aspect-square w-full overflow-hidden bg-luxury-900">
                  <Image
                    src={img.url}
                    alt={img.filename}
                    fill
                    sizes="200px"
                    className="object-cover group-hover:scale-105 transition-transform"
                  />

                  {/* Hover Actions Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center space-x-2 bg-luxury-950/70 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => setPreviewImage(img)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-luxury-900 text-cream-100 hover:text-gold-400 border border-luxury-700"
                      title="Preview Full Size"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyUrl(img)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-luxury-900 text-cream-100 hover:text-gold-400 border border-luxury-700"
                      title="Copy URL"
                    >
                      {copiedId === img.id ? (
                        <Check className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteImage(img.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-luxury-900 text-luxury-400 hover:text-red-400 border border-luxury-700"
                      title="Delete Image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Footer details */}
                <div className="p-2.5">
                  <span className="block text-[11px] font-semibold text-cream-200 truncate">
                    {img.filename}
                  </span>
                  <span className="block text-[9px] text-luxury-400">
                    {img.size ? `${(img.size / 1024).toFixed(0)} KB` : "Web Hosted"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-luxury-400 text-xs">
            No images uploaded yet. Drag and drop your cake photos above!
          </div>
        )}
      </div>

      {/* Full Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-luxury-950/85 p-4 backdrop-blur-md">
          <div className="relative max-w-2xl w-full rounded-3xl border border-gold-500/30 bg-luxury-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-luxury-800 pb-3 mb-4">
              <span className="font-serif text-sm font-bold text-cream-50 truncate max-w-sm">
                {previewImage.filename}
              </span>
              <button
                onClick={() => setPreviewImage(null)}
                className="rounded-lg p-1 text-luxury-400 hover:text-cream-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-gold-500/20 bg-luxury-950">
              <Image
                src={previewImage.url}
                alt={previewImage.filename}
                fill
                sizes="800px"
                className="object-contain"
              />
            </div>

            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-luxury-400 truncate max-w-xs">{previewImage.url}</span>
              <button
                onClick={() => handleCopyUrl(previewImage)}
                className="flex items-center space-x-1.5 rounded-lg bg-gold-gradient px-3.5 py-1.5 font-bold text-luxury-950 shadow-gold-sm"
              >
                {copiedId === previewImage.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedId === previewImage.id ? "Copied!" : "Copy Image Link"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
