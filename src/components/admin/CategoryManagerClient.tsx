"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Edit2,
  Trash2,
  FolderTree,
  Check,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Upload,
  ImageIcon,
  AlertCircle,
} from "lucide-react";

interface CategoryManagerClientProps {
  initialCategories: any[];
}

export default function CategoryManagerClient({
  initialCategories = [],
}: CategoryManagerClientProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [active, setActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Media Library Modal
  const [mediaLibrary, setMediaLibrary] = useState<any[]>([]);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Delete & Reassign Modal
  const [deleteModalCat, setDeleteModalCat] = useState<any | null>(null);
  const [reassignTargetId, setReassignTargetId] = useState<string>("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch("/api/images")
      .then((res) => res.json())
      .then((data) => {
        if (data?.images) setMediaLibrary(data.images);
      })
      .catch(console.error);
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setImage("");
    setDisplayOrder(categories.length + 1);
    setActive(true);
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (cat: any) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug || "");
    setDescription(cat.description || "");
    setImage(cat.image || "");
    setDisplayOrder(cat.displayOrder || 0);
    setActive(cat.active ?? true);
    setError(null);
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      if (data.images[0]) {
        setImage(data.images[0].url);
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleToggleActive = async (catId: string, currentVal: boolean) => {
    try {
      const res = await fetch(`/api/categories/${catId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !currentVal }),
      });

      if (res.ok) {
        setCategories((prev) =>
          prev.map((c) => (c.id === catId ? { ...c, active: !currentVal } : c))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMove = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const updated = [...categories];
    const itemA = updated[index];
    const itemB = updated[targetIndex];

    updated[index] = itemB;
    updated[targetIndex] = itemA;

    const reordered = updated.map((cat, idx) => ({
      ...cat,
      displayOrder: idx + 1,
    }));

    setCategories(reordered);

    try {
      await Promise.all(
        reordered.map((cat) =>
          fetch(`/api/categories/${cat.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ displayOrder: cat.displayOrder }),
          })
        )
      );
    } catch (e) {
      console.error("Failed to reorder categories", e);
    }
  };

  const handleRenumberSequence = async () => {
    const reordered = categories.map((cat, idx) => ({
      ...cat,
      displayOrder: idx + 1,
    }));
    setCategories(reordered);

    try {
      await Promise.all(
        reordered.map((cat) =>
          fetch(`/api/categories/${cat.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ displayOrder: cat.displayOrder }),
          })
        )
      );
    } catch (e) {
      console.error("Failed to fix sequence", e);
    }
  };

  const initiateDelete = (cat: any) => {
    const cakeCount = cat._count?.cakes || 0;
    if (cakeCount > 0) {
      // Find default target category (first active category that is not this one)
      const otherActive = categories.find((c) => c.id !== cat.id && c.active);
      setReassignTargetId(otherActive?.id || "");
      setDeleteModalCat(cat);
    } else {
      if (confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
        executeDelete(cat.id);
      }
    }
  };

  const executeDelete = async (catId: string, reassignToId?: string) => {
    setDeleting(true);
    try {
      const url = reassignToId
        ? `/api/categories/${catId}?reassignToId=${reassignToId}`
        : `/api/categories/${catId}`;

      const res = await fetch(url, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setCategories((prev) => {
          const filtered = prev.filter((c) => c.id !== catId);
          if (reassignToId && deleteModalCat) {
            const movedCount = deleteModalCat._count?.cakes || 0;
            return filtered.map((c) =>
              c.id === reassignToId
                ? { ...c, _count: { cakes: (c._count?.cakes || 0) + movedCount } }
                : c
            );
          }
          return filtered;
        });
        setDeleteModalCat(null);
      } else {
        alert(data.error || "Failed to delete category");
      }
    } catch (e) {
      console.error(e);
      alert("Error deleting category");
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Category name is required");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        slug: slug.trim() || undefined,
        description: description.trim() || null,
        image: image.trim() || null,
        displayOrder: Number(displayOrder) || 0,
        active,
      };

      const url = editingCategory ? `/api/categories/${editingCategory.id}` : "/api/categories";
      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save category");

      if (editingCategory) {
        setCategories((prev) =>
          prev
            .map((c) => (c.id === editingCategory.id ? { ...c, ...data.category } : c))
            .sort((a, b) => a.displayOrder - b.displayOrder)
        );
      } else {
        setCategories((prev) =>
          [...prev, { ...data.category, _count: { cakes: 0 } }].sort(
            (a, b) => a.displayOrder - b.displayOrder
          )
        );
      }

      setModalOpen(false);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-28 sm:pb-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-gold-400">
            Organization
          </span>
          <h1 className="font-serif text-2xl font-bold text-cream-50 sm:text-3xl">
            Cake Categories ({categories.length})
          </h1>
          <p className="text-xs text-luxury-400">
            Create, reorder, and configure categories displayed on the customer menu filter bar.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleRenumberSequence}
            className="flex items-center space-x-1.5 rounded-xl border border-gold-500/30 bg-luxury-800 px-3.5 py-2 text-xs font-semibold text-gold-300 hover:bg-gold-500 hover:text-luxury-950 transition-colors"
            title="Clean and assign unique sequential orders 1, 2, 3..."
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            <span>Fix Order Numbers (1–N)</span>
          </button>

          <button
            onClick={openCreateModal}
            className="flex items-center space-x-1.5 rounded-xl bg-gold-gradient px-4 py-2 text-xs font-bold text-luxury-950 shadow-gold-sm hover:scale-102 transition-transform"
          >
            <Plus className="h-4 w-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Categories Grid / List */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat, idx) => (
          <div
            key={cat.id}
            className="flex flex-col justify-between rounded-2xl border border-gold-500/20 bg-luxury-900/80 p-4 sm:p-5 shadow-lg transition-all hover:border-gold-500/40"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="rounded-md bg-luxury-950 px-2 py-0.5 text-[10px] font-bold text-gold-400 border border-luxury-800">
                    Order: #{cat.displayOrder}
                  </span>
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, -1)}
                      className="p-1 rounded-md bg-luxury-950 border border-luxury-800 text-luxury-400 hover:text-gold-300 disabled:opacity-20 transition-colors"
                      title="Move Up"
                    >
                      <ArrowUp className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === categories.length - 1}
                      onClick={() => handleMove(idx, 1)}
                      className="p-1 rounded-md bg-luxury-950 border border-luxury-800 text-luxury-400 hover:text-gold-300 disabled:opacity-20 transition-colors"
                      title="Move Down"
                    >
                      <ArrowDown className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleActive(cat.id, cat.active)}
                  className={`flex items-center space-x-1 rounded-full px-2 py-0.5 text-[10px] font-semibold transition-colors ${
                    cat.active
                      ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                      : "bg-red-950 text-red-400 border border-red-500/30"
                  }`}
                >
                  <span>{cat.active ? "Active" : "Disabled"}</span>
                </button>
              </div>

              <div className="mt-3 flex items-start space-x-3">
                {cat.image ? (
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-gold-500/20 bg-luxury-950">
                    <Image src={cat.image} alt={cat.name} fill sizes="48px" className="object-cover" />
                  </div>
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gold-500/20 bg-luxury-950 text-gold-400">
                    <FolderTree className="h-6 w-6" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif text-base font-bold text-cream-100 truncate">{cat.name}</h3>
                  <span className="text-[10px] text-luxury-500 font-mono block truncate">/menu?category={cat.slug}</span>
                </div>
              </div>

              {cat.description && (
                <p className="mt-2.5 text-xs text-luxury-400 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              )}
            </div>

            <div className="mt-4 sm:mt-5 flex items-center justify-between border-t border-luxury-800 pt-3 text-xs">
              <span className={`font-medium ${cat._count?.cakes === 0 ? "text-luxury-500" : "text-luxury-300"}`}>
                {cat._count?.cakes ?? 0} {cat._count?.cakes === 1 ? "cake" : "cakes"}
                {cat._count?.cakes === 0 && (
                  <span className="ml-1.5 rounded bg-luxury-950 border border-luxury-800 px-1.5 py-0.5 text-[9px] text-amber-400/80">
                    Empty
                  </span>
                )}
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openEditModal(cat)}
                  className="rounded-lg border border-gold-500/30 bg-luxury-800 px-2.5 py-1 text-gold-300 hover:bg-gold-500 hover:text-luxury-950 text-[11px] font-semibold transition-colors flex items-center gap-1"
                >
                  <Edit2 className="h-3 w-3" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => initiateDelete(cat)}
                  className="rounded-lg border border-luxury-700 bg-luxury-950 p-1 text-luxury-400 hover:text-red-400 transition-colors"
                  title="Delete category"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Add / Edit Category */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-luxury-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-gold-500/30 bg-luxury-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-luxury-800 pb-4">
              <h3 className="font-serif text-lg font-bold text-cream-50">
                {editingCategory ? `Edit Category: ${editingCategory.name}` : "Create New Category"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-luxury-400 hover:text-cream-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-950/40 p-3 text-xs text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-cream-200">
                    Category Name <span className="text-gold-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Belgian Chocolate"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-luxury-700 bg-luxury-950 p-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-cream-200">
                    Custom Slug <span className="text-luxury-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. belgian-chocolate"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full rounded-xl border border-luxury-700 bg-luxury-950 p-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-cream-200">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Short summary of this collection..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-luxury-700 bg-luxury-950 p-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-cream-200">
                    Display Order #
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full rounded-xl border border-luxury-700 bg-luxury-950 p-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-cream-200">
                    Status
                  </label>
                  <select
                    value={active ? "true" : "false"}
                    onChange={(e) => setActive(e.target.value === "true")}
                    className="w-full rounded-xl border border-luxury-700 bg-luxury-950 p-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                  >
                    <option value="true">Active (Visible)</option>
                    <option value="false">Disabled (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Banner Image URL + Media Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-cream-200">
                  Banner Image
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/... or choose media"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="flex-1 rounded-xl border border-luxury-700 bg-luxury-950 p-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setMediaModalOpen(true)}
                    className="inline-flex items-center gap-1 rounded-xl border border-gold-500/40 bg-gold-500/15 px-3 py-2.5 text-xs font-semibold text-gold-300 hover:bg-gold-500/25 transition-colors shrink-0"
                  >
                    <ImageIcon className="h-3.5 w-3.5" />
                    <span>Media</span>
                  </button>
                  <label className="inline-flex items-center gap-1 cursor-pointer rounded-xl border border-luxury-700 bg-luxury-800 px-3 py-2.5 text-xs font-semibold text-cream-200 hover:border-luxury-600 transition-colors shrink-0">
                    <Upload className="h-3.5 w-3.5 text-gold-400" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploading}
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>

                {image && (
                  <div className="relative h-16 w-full overflow-hidden rounded-xl border border-luxury-700 bg-luxury-950 mt-2">
                    <Image src={image} alt="Preview" fill className="object-cover" />
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-3 border-t border-luxury-800 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-luxury-700 bg-luxury-800 px-4 py-2 text-xs font-semibold text-cream-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center space-x-1.5 rounded-xl bg-gold-gradient px-5 py-2 text-xs font-bold text-luxury-950 shadow-gold-sm"
                >
                  <Check className="h-4 w-4" />
                  <span>{editingCategory ? "Update Category" : "Save Category"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Library Selector Modal */}
      {mediaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-luxury-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-gold-500/30 bg-luxury-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-luxury-800 pb-3">
              <h3 className="font-serif text-lg font-bold text-cream-50">Select Banner Image</h3>
              <button onClick={() => setMediaModalOpen(false)} className="text-luxury-400 hover:text-cream-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            {mediaLibrary.length === 0 ? (
              <p className="text-xs text-luxury-400 text-center py-8">
                No images uploaded yet. Use the Upload button above.
              </p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-72 overflow-y-auto pr-1">
                {mediaLibrary.map((img) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => {
                      setImage(img.url);
                      setMediaModalOpen(false);
                    }}
                    className={`relative aspect-video overflow-hidden rounded-xl border transition-all ${
                      image === img.url
                        ? "border-gold-500 ring-2 ring-gold-500/50"
                        : "border-luxury-700 hover:border-gold-500/40"
                    }`}
                  >
                    <Image src={img.url} alt={img.filename || "Media"} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-luxury-800">
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

      {/* Delete & Reassign Modal */}
      {deleteModalCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-luxury-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-gold-500/40 bg-luxury-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-luxury-800 pb-3">
              <h3 className="font-serif text-lg font-bold text-cream-50 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-400" />
                <span>Reassign Cakes &amp; Delete</span>
              </h3>
              <button onClick={() => setDeleteModalCat(null)} className="text-luxury-400 hover:text-cream-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-cream-200 leading-relaxed">
              Category <span className="font-bold text-gold-300">&quot;{deleteModalCat.name}&quot;</span> has{" "}
              <span className="font-bold text-amber-400">{deleteModalCat._count?.cakes || 0} cake(s)</span> assigned to it.
            </p>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-cream-200">
                Reassign all {deleteModalCat._count?.cakes || 0} cakes to:
              </label>
              <select
                value={reassignTargetId}
                onChange={(e) => setReassignTargetId(e.target.value)}
                className="w-full rounded-xl border border-luxury-700 bg-luxury-950 p-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
              >
                {categories
                  .filter((c) => c.id !== deleteModalCat.id && c.active)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c._count?.cakes || 0} cakes)
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-luxury-800">
              <button
                type="button"
                onClick={() => setDeleteModalCat(null)}
                className="rounded-xl border border-luxury-700 bg-luxury-800 px-4 py-2 text-xs font-semibold text-cream-200"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting || !reassignTargetId}
                onClick={() => executeDelete(deleteModalCat.id, reassignTargetId)}
                className="rounded-xl bg-red-900/80 hover:bg-red-800 border border-red-500/50 px-4 py-2 text-xs font-bold text-red-100 transition-colors"
              >
                {deleting ? "Reassigning & Deleting..." : "Reassign & Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
