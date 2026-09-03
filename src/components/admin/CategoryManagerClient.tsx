"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  FolderTree,
  Check,
  X,
  ArrowUpDown,
  Cake,
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
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [active, setActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName("");
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
    setDescription(cat.description || "");
    setImage(cat.image || "");
    setDisplayOrder(cat.displayOrder || 0);
    setActive(cat.active ?? true);
    setError(null);
    setModalOpen(true);
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

  const handleDelete = async (catId: string, name: string) => {
    if (!confirm(`Delete category "${name}"? Cakes belonging to this category will also be deleted.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/categories/${catId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== catId));
      }
    } catch (e) {
      console.error(e);
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
        name,
        description,
        image: image || null,
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
    <div className="space-y-6">
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

        <button
          onClick={openCreateModal}
          className="flex items-center space-x-1.5 rounded-xl bg-gold-gradient px-4 py-2.5 text-xs font-bold text-luxury-950 shadow-gold-sm hover:scale-102 transition-transform"
        >
          <Plus className="h-4 w-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Grid / List */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex flex-col justify-between rounded-2xl border border-gold-500/20 bg-luxury-900/80 p-5 shadow-lg transition-all hover:border-gold-500/40"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-luxury-950 px-2 py-0.5 text-[10px] font-bold text-gold-400 border border-luxury-800">
                  Order: #{cat.displayOrder}
                </span>

                <button
                  onClick={() => handleToggleActive(cat.id, cat.active)}
                  className={`flex items-center space-x-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
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
                <div>
                  <h3 className="font-serif text-base font-bold text-cream-100">{cat.name}</h3>
                  <span className="text-[10px] text-luxury-500 font-mono">/menu/category/{cat.slug}</span>
                </div>
              </div>

              {cat.description && (
                <p className="mt-2.5 text-xs text-luxury-400 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              )}
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-luxury-800 pt-3 text-xs">
              <span className="text-luxury-400 font-medium">
                {cat._count?.cakes ?? 0} {cat._count?.cakes === 1 ? "cake" : "cakes"}
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openEditModal(cat)}
                  className="rounded-lg border border-gold-500/30 bg-luxury-800 px-2.5 py-1 text-gold-300 hover:bg-gold-500 hover:text-luxury-950 text-[11px] font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="rounded-lg border border-luxury-700 bg-luxury-950 p-1 text-luxury-400 hover:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Add / Edit */}
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
              <div className="mt-4 rounded-xl border border-red-500/40 bg-red-950/40 p-3 text-xs text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
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

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-cream-200">
                  Banner Image URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full rounded-xl border border-luxury-700 bg-luxury-950 p-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                />
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
    </div>
  );
}
