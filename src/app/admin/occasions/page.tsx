"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Calendar,
  Check,
  X,
  Cake,
  Sliders,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  RotateCcw,
} from "lucide-react";
import { checkHasBakedInText, FESTIVAL_CONFIG } from "@/components/customer/OccasionShowcase";

function getOccasionBannerUrl(slug: string, customBanner?: string | null): string {
  if (customBanner) return customBanner;
  if (FESTIVAL_CONFIG[slug]?.banner) return FESTIVAL_CONFIG[slug].banner;
  return `/images/festivals/${slug}-banner.jpg`;
}

interface OccasionRecord {
  id: string;
  name: string;
  slug: string;
  type: string;
  description?: string;
  badgeText?: string;
  bannerImage?: string | null;
  accentColor?: string;
  priority: number;
  active: boolean;
  calendarKey: string;
  cakeCount: number;
  cakeIds?: string[];
  daysBefore?: number;
  daysAfter?: number;
  status: "ACTIVE" | "UPCOMING" | "PAST" | "INACTIVE";
  currentOccurrence?: {
    eventDate: string;
    displayStart: string;
    displayEnd: string;
  } | null;
}

export default function AdminOccasionsPage() {
  const [occasions, setOccasions] = useState<OccasionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [cakesList, setCakesList] = useState<any[]>([]);

  // Edit Modal State
  const [editingOccasion, setEditingOccasion] = useState<OccasionRecord | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    badgeText: "",
    description: "",
    bannerImage: "",
    accentColor: "#D4AF37",
    priority: 50,
    eventDate: "",
    daysBefore: 5,
    daysAfter: 1,
    selectedCakeIds: [] as string[],
  });
  const [saving, setSaving] = useState(false);

  // Create Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    type: "CUSTOM",
    badgeText: "",
    description: "",
    bannerImage: "",
    accentColor: "#D4AF37",
    priority: 75,
    eventDate: new Date().toISOString().slice(0, 10),
    daysBefore: 5,
    daysAfter: 1,
    selectedCakeIds: [] as string[],
    active: true,
  });

  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [bannerUploadError, setBannerUploadError] = useState<string | null>(null);
  const [editBannerHasText, setEditBannerHasText] = useState<boolean>(true);
  const [createBannerHasText, setCreateBannerHasText] = useState<boolean>(true);
  const [editCakeSearch, setEditCakeSearch] = useState("");
  const [createCakeSearch, setCreateCakeSearch] = useState("");

  // Year-Round Default Banner State (active when no festival is scheduled)
  const [defaultBannerImage, setDefaultBannerImage] = useState<string>("/images/festivals/generic-luxury-banner.jpg");
  const [defaultBannerTitle, setDefaultBannerTitle] = useState<string>("Raman Sweet Signature Collection");
  const [defaultBannerSubtitle, setDefaultBannerSubtitle] = useState<string>("100% EGGLESS • HANDCRAFTED ARTISANAL BAKES");
  const [bannerHasText, setBannerHasText] = useState<boolean>(false);
  const [savingDefaultBanner, setSavingDefaultBanner] = useState(false);
  const [uploadingDefaultBanner, setUploadingDefaultBanner] = useState(false);
  const [defaultBannerSuccess, setDefaultBannerSuccess] = useState(false);
  const [defaultBannerError, setDefaultBannerError] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);



  const fetchOccasions = async () => {
    try {
      const res = await fetch("/api/occasions");
      const data = await res.json();
      if (data.occasions) {
        setOccasions(data.occasions);
      }
    } catch (err: any) {
      setError("Failed to load occasions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOccasions();
    fetch("/api/cakes?cakesOnly=true")
      .then((res) => res.json())
      .then((data) => {
        if (data.cakes) setCakesList(data.cakes);
      })
      .catch(console.error);

    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          if (data.settings.heroImage) setDefaultBannerImage(data.settings.heroImage);
          if (data.settings.heroTitle !== undefined) {
            if (data.settings.heroTitle === "__NO_TEXT__") {
              setBannerHasText(false); // Clean poster mode (no text overlay)
              setDefaultBannerTitle("");
            } else {
              setBannerHasText(true); // Show 3D Gold Text Overlay
              setDefaultBannerTitle(data.settings.heroTitle || "Raman Sweet Signature Collection");
            }
          }
          if (data.settings.heroSubtitle) setDefaultBannerSubtitle(data.settings.heroSubtitle);
        }
      })
      .catch(console.error);
  }, []);

  const handleToggleBannerHasText = async (showOverlay: boolean) => {
    setBannerHasText(showOverlay);
    const saveTitle = showOverlay
      ? (defaultBannerTitle || "Raman Sweet Signature Collection")
      : "__NO_TEXT__";
    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heroImage: defaultBannerImage.trim(),
          heroTitle: saveTitle,
          heroSubtitle: defaultBannerSubtitle.trim(),
        }),
      });
      setDefaultBannerSuccess(true);
      setTimeout(() => setDefaultBannerSuccess(false), 3000);
    } catch (err: any) {
      console.error("Failed to toggle banner text mode:", err);
    }
  };

  const handleToggleActive = async (occ: OccasionRecord) => {
    try {
      const res = await fetch(`/api/occasions/${occ.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !occ.active }),
      });
      if (res.ok) {
        setOccasions(
          occasions.map((o) => (o.id === occ.id ? { ...o, active: !occ.active } : o))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBannerUpload = async (file: File, isEdit: boolean) => {
    if (!file) return;
    setUploadingBanner(true);
    setBannerUploadError(null);
    try {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("folder", "/festivals");

      const res = await fetch("/api/images", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload banner");

      const uploadedUrl = data.images?.[0]?.url;
      if (uploadedUrl) {
        if (isEdit) {
          setEditForm((prev) => ({ ...prev, bannerImage: `${uploadedUrl}#overlay=true` }));
          setEditBannerHasText(true);
        } else {
          setCreateForm((prev) => ({ ...prev, bannerImage: `${uploadedUrl}#overlay=true` }));
          setCreateBannerHasText(true);
        }
      }
    } catch (err: any) {
      setBannerUploadError(err.message || "Failed to upload banner");
    } finally {
      setUploadingBanner(false);
    }
  };

  const handleDefaultBannerUpload = async (file: File) => {
    if (!file) return;
    setUploadingDefaultBanner(true);
    setDefaultBannerError(null);
    setDefaultBannerSuccess(false);
    try {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("folder", "/festivals");

      const res = await fetch("/api/images", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload banner");

      const uploadedUrl = data.images?.[0]?.url;
      if (uploadedUrl) {
        setDefaultBannerImage(uploadedUrl);

        // Auto-save immediately to settings so customer view updates without extra clicks
        const saveTitle = bannerHasText ? (defaultBannerTitle.trim() || "Raman Sweet Signature Collection") : "__NO_TEXT__";
        const saveRes = await fetch("/api/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            heroImage: uploadedUrl.trim(),
            heroTitle: saveTitle,
            heroSubtitle: defaultBannerSubtitle.trim(),
          }),
        });

        if (!saveRes.ok) {
          const errData = await saveRes.json().catch(() => ({}));
          throw new Error(errData.error || "Uploaded banner, but failed to persist to settings");
        }

        setDefaultBannerSuccess(true);
        setTimeout(() => setDefaultBannerSuccess(false), 4000);
      }
    } catch (err: any) {
      setDefaultBannerError(err.message || "Failed to upload banner");
    } finally {
      setUploadingDefaultBanner(false);
    }
  };

  const handleResetDefaultBanner = async () => {
    const master8k = "/images/festivals/8k/generic-luxury-banner-8k.jpg";
    const defaultTitle = "Raman Sweet Signature Collection";
    const defaultSubtitle = "100% EGGLESS • HANDCRAFTED ARTISANAL BAKES";
    setDefaultBannerImage(master8k);
    setDefaultBannerTitle(defaultTitle);
    setDefaultBannerSubtitle(defaultSubtitle);
    setBannerHasText(true);
    setSavingDefaultBanner(true);
    setDefaultBannerError(null);
    setDefaultBannerSuccess(false);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heroImage: master8k,
          heroTitle: defaultTitle,
          heroSubtitle: defaultSubtitle,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to reset default banner");
      }

      setDefaultBannerSuccess(true);
      setTimeout(() => setDefaultBannerSuccess(false), 4000);
    } catch (err: any) {
      setDefaultBannerError(err.message || "Failed to reset banner");
    } finally {
      setSavingDefaultBanner(false);
    }
  };

  const handleSaveDefaultBanner = async () => {
    setSavingDefaultBanner(true);
    setDefaultBannerError(null);
    setDefaultBannerSuccess(false);
    try {
      const saveTitle = bannerHasText ? (defaultBannerTitle.trim() || "Raman Sweet Signature Collection") : "__NO_TEXT__";
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heroImage: defaultBannerImage.trim(),
          heroTitle: saveTitle,
          heroSubtitle: defaultBannerSubtitle.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update default banner");

      setDefaultBannerSuccess(true);
      setTimeout(() => setDefaultBannerSuccess(false), 3000);
    } catch (err: any) {
      setDefaultBannerError(err.message || "Failed to save default banner");
    } finally {
      setSavingDefaultBanner(false);
    }
  };

  const handleOpenEdit = (occ: OccasionRecord) => {
    setEditingOccasion(occ);
    let evDate = "";
    if (occ.currentOccurrence?.eventDate) {
      try {
        const d = new Date(occ.currentOccurrence.eventDate);
        if (!isNaN(d.getTime())) {
          evDate = d.toISOString().slice(0, 10);
        }
      } catch {
        evDate = "";
      }
    }
    setEditForm({
      name: occ.name,
      badgeText: occ.badgeText || "",
      description: occ.description || "",
      bannerImage: occ.bannerImage || "",
      accentColor: occ.accentColor || "#D4AF37",
      priority: occ.priority || 50,
      eventDate: evDate,
      daysBefore: occ.daysBefore ?? 5,
      daysAfter: occ.daysAfter ?? 1,
      selectedCakeIds: occ.cakeIds || [],
    });
    const bannerUrl = getOccasionBannerUrl(occ.slug, occ.bannerImage);
    // showOverlay is true if text overlay should be displayed on the banner
    let showOverlay = true;
    if (bannerUrl.includes("#overlay=true") || bannerUrl.includes("#text=true")) {
      showOverlay = true;
    } else if (bannerUrl.includes("#notext")) {
      showOverlay = false;
    } else {
      showOverlay = !checkHasBakedInText(bannerUrl, occ.badgeText);
    }
    setEditBannerHasText(showOverlay);
    setBannerUploadError(null);
    setEditCakeSearch("");
  };

  const handleToggleEditBannerText = async (newShowOverlay: boolean) => {
    setEditBannerHasText(newShowOverlay);
    if (!editingOccasion) return;

    let finalBanner = editForm.bannerImage ? editForm.bannerImage.trim() : "";
    if (finalBanner) {
      const cleanUrl = finalBanner.split("#")[0];
      finalBanner = newShowOverlay ? `${cleanUrl}#overlay=true` : `${cleanUrl}#notext`;
    } else {
      const defaultUrl = getOccasionBannerUrl(editingOccasion.slug);
      finalBanner = newShowOverlay ? `${defaultUrl}#overlay=true` : `${defaultUrl}#notext`;
    }

    setEditForm((prev) => ({ ...prev, bannerImage: finalBanner }));

    try {
      await fetch(`/api/occasions/${editingOccasion.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bannerImage: finalBanner,
        }),
      });
      fetchOccasions();
    } catch (err) {
      console.error("Failed to auto-save banner text toggle:", err);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOccasion) return;
    setSaving(true);
    try {
      let finalBanner = editForm.bannerImage ? editForm.bannerImage.trim() : "";
      if (finalBanner) {
        const cleanUrl = finalBanner.split("#")[0];
        finalBanner = editBannerHasText ? `${cleanUrl}#overlay=true` : `${cleanUrl}#notext`;
      } else {
        const defaultUrl = getOccasionBannerUrl(editingOccasion.slug);
        finalBanner = editBannerHasText ? `${defaultUrl}#overlay=true` : `${defaultUrl}#notext`;
      }

      const res = await fetch(`/api/occasions/${editingOccasion.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.name,
          badgeText: editForm.badgeText,
          description: editForm.description,
          bannerImage: finalBanner || null,
          accentColor: editForm.accentColor,
          priority: editForm.priority,
          eventDate: editForm.eventDate || undefined,
          daysBefore: editForm.daysBefore,
          daysAfter: editForm.daysAfter,
          cakeIds: editForm.selectedCakeIds,
        }),
      });
      if (res.ok) {
        await fetchOccasions();
        setEditingOccasion(null);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update occasion");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating occasion");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name || !createForm.eventDate) {
      alert("Occasion Name and Celebration Date are required");
      return;
    }
    setCreating(true);
    try {
      let finalBanner = createForm.bannerImage ? createForm.bannerImage.trim() : "";
      if (finalBanner) {
        finalBanner = finalBanner.split("#")[0];
        finalBanner = createBannerHasText ? `${finalBanner}#overlay=true` : `${finalBanner}#notext`;
      }

      const res = await fetch("/api/occasions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: createForm.name,
          type: createForm.type,
          badgeText: createForm.badgeText,
          description: createForm.description,
          bannerImage: finalBanner || null,
          accentColor: createForm.accentColor,
          priority: createForm.priority,
          eventDate: createForm.eventDate,
          daysBefore: createForm.daysBefore,
          daysAfter: createForm.daysAfter,
          active: createForm.active,
          cakeIds: createForm.selectedCakeIds,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create occasion");

      await fetchOccasions();
      setCreateModalOpen(false);
      setCreateForm({
        name: "",
        type: "CUSTOM",
        badgeText: "",
        description: "",
        bannerImage: "",
        accentColor: "#D4AF37",
        priority: 75,
        eventDate: new Date().toISOString().slice(0, 10),
        daysBefore: 5,
        daysAfter: 1,
        selectedCakeIds: [],
        active: true,
      });
    } catch (err: any) {
      alert(err.message || "Failed to create occasion");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteOccasion = async (occ: OccasionRecord) => {
    if (!confirm(`Are you sure you want to delete "${occ.name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/occasions/${occ.id}`, { method: "DELETE" });
      if (res.ok) {
        setOccasions(occasions.filter((o) => o.id !== occ.id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete occasion");
      }
    } catch (err) {
      alert("Error deleting occasion");
    }
  };

  const activeOccasion = occasions.find((o) => o.status === "ACTIVE" && o.active && o.cakeCount > 0);
  const upcomingOccasions = occasions.filter((o) => o.status === "UPCOMING" && o.active);

  const formatDate = (isoStr?: string) => {
    if (!isoStr) return "N/A";
    const d = new Date(isoStr);
    return d.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6 pb-32 sm:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-400">
              AUTOMATIC OCCASION ENGINE
            </span>
            <span className="inline-flex items-center space-x-1 rounded-full bg-gold-500/10 border border-gold-500/30 px-2 py-0.5 text-[10px] font-semibold text-gold-400">
              <Calendar className="h-3 w-3" />
              <span>Year-Aware Almanac</span>
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cream-50 mt-1">
            Festivals & Occasions
          </h1>
          <p className="text-xs text-luxury-400 mt-1 max-w-2xl">
            The system automatically calculates annual Indian festival & seasonal dates. You can also manually add custom occasions for special celebrations, anniversaries, or local events.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center space-x-1.5 rounded-xl bg-gold-gradient px-4 py-2 text-xs font-bold text-luxury-950 shadow-gold-sm hover:opacity-95 transition-opacity"
          >
            <Plus className="h-4 w-4" />
            <span>+ Add Custom Occasion</span>
          </button>

          <Link
            href="/menu"
            target="_blank"
            className="inline-flex items-center space-x-1.5 rounded-xl border border-gold-500/30 bg-gold-500/10 px-4 py-2 text-xs font-semibold text-gold-300 hover:bg-gold-500 hover:text-luxury-950 transition-colors"
          >
            <span>Preview Menu</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Currently Active Showcase */}
        <div className="rounded-2xl border border-gold-500/30 bg-gradient-to-b from-luxury-900 to-[#14120f] p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-luxury-400">
            <span className="font-semibold uppercase tracking-wider text-gold-400">Live on Customer Menu</span>
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="mt-2.5">
            {activeOccasion ? (
              <>
                <h3 className="font-serif text-lg font-bold text-cream-50">
                  {activeOccasion.name}
                </h3>
                <p className="text-xs text-luxury-300 mt-0.5">
                  {activeOccasion.cakeCount} cake(s) showcased • Priority {activeOccasion.priority}
                </p>
                <div className="mt-3">
                  <Link
                    href={`/menu/occasion/${activeOccasion.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-gold-400 hover:text-gold-300"
                  >
                    <span>View Customer Collection</span>
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-serif text-base font-medium text-luxury-400">
                  No Festival Active Today
                </h3>
                <p className="text-xs text-luxury-500 mt-1">
                  The customer menu is currently displaying standard signature collections.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Upcoming Festival */}
        <div className="rounded-2xl border border-luxury-800 bg-[#14120f] p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-luxury-400">
            <span className="font-semibold uppercase tracking-wider text-cream-200">Next Upcoming Occasion</span>
            <Calendar className="h-4 w-4 text-luxury-500" />
          </div>
          <div className="mt-2.5">
            {upcomingOccasions.length > 0 ? (
              <>
                <h3 className="font-serif text-lg font-bold text-cream-50">
                  {upcomingOccasions[0].name}
                </h3>
                <p className="text-xs text-luxury-300 mt-0.5">
                  Window starts: {formatDate(upcomingOccasions[0].currentOccurrence?.displayStart)}
                </p>
                <p className="text-[11px] text-gold-400/80 mt-1">
                  {upcomingOccasions[0].cakeCount} cake(s) currently tagged
                </p>
              </>
            ) : (
              <p className="text-xs text-luxury-500 mt-1">None within immediate calendar</p>
            )}
          </div>
        </div>

        {/* System Almanac Notice */}
        <div className="rounded-2xl border border-luxury-800 bg-[#14120f] p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-1.5 text-xs text-luxury-400">
              <HelpCircle className="h-3.5 w-3.5 text-gold-400" />
              <span className="font-semibold uppercase tracking-wider text-gold-400">Automatic & Manual</span>
            </div>
            <p className="text-xs text-luxury-300 mt-2 leading-relaxed">
              Standard Indian festivals resolve automatically each year. Custom store events and flash sales can be added manually anytime.
            </p>
          </div>
          <div className="text-[11px] text-luxury-500 pt-2 border-t border-luxury-800/60">
            {occasions.length} total collections configured
          </div>
        </div>
      </div>

      {/* Year-Round Default Banner (Active when no festival is scheduled) */}
      <div className="rounded-3xl border border-gold-500/30 bg-[#14120f] p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-luxury-800 pb-3.5">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-gold-400" />
              <h2 className="font-serif text-lg font-bold text-cream-100">
                Year-Round Default Banner
              </h2>
            </div>
            <p className="text-xs text-luxury-400 mt-0.5">
              Displays on customer /menu on normal days when no festival or occasion is active on the calendar.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {defaultBannerSuccess && (
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 animate-fade-in">
                <Check className="h-3.5 w-3.5" /> Saved Live!
              </span>
            )}
            <button
              type="button"
              onClick={handleSaveDefaultBanner}
              disabled={savingDefaultBanner}
              className="rounded-xl bg-gold-gradient px-4 py-2 text-xs font-bold text-luxury-950 shadow-gold-sm hover:opacity-95 disabled:opacity-50 transition-opacity"
            >
              {savingDefaultBanner ? "Saving Banner..." : "Save Default Banner"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* Left: Interactive 16:4 Live Preview */}
          <div className="lg:col-span-6 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-cream-200">Customer View Live Preview</span>
              <span className="rounded bg-gold-500/15 border border-gold-500/30 px-2 py-0.5 text-[9.5px] font-semibold text-gold-300">
                16:4 Aspect Ratio
              </span>
            </div>
            <div className="relative aspect-[16/4.5] w-full overflow-hidden rounded-2xl border border-gold-500/60 bg-[#0B0806] shadow-xl group">
              <img
                src={defaultBannerImage || "/images/festivals/generic-luxury-banner.jpg"}
                alt="Default Banner Live Preview"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/festivals/generic-luxury-banner.jpg";
                }}
              />
              {/* Center Radial Overlay: Only rendered when banner does NOT have text */}
              {/* Center Radial Overlay: Rendered when bannerHasText is true (Show Overlay mode) */}
              {bannerHasText ? (
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,5,4,0.60)_0%,rgba(6,5,4,0.25)_55%,transparent_100%)] flex flex-col items-center justify-center text-center p-3 select-none">
                  <div className="mb-0.5 text-[#E6C675] drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                    <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0l2.5 8.5L23 11l-8.5 2.5L12 22l-2.5-8.5L1 11l8.5-2.5L12 0z" />
                    </svg>
                  </div>
                  <h4 className="font-serif text-sm sm:text-lg font-bold text-[#FFFDF7] drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
                    {defaultBannerTitle || "Raman Sweet Signature Collection"}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="h-[1px] w-6 bg-gradient-to-r from-transparent to-[#D4AF37]" />
                    <span className="text-[8px] sm:text-[9.5px] uppercase tracking-[0.2em] text-[#E6C675] font-semibold">
                      {defaultBannerSubtitle || "100% EGGLESS • HANDCRAFTED ARTISANAL BAKES"}
                    </span>
                    <span className="h-[1px] w-6 bg-gradient-to-l from-transparent to-[#D4AF37]" />
                  </div>
                  <div className="mt-1.5 rounded-full border border-[#D4AF37]/85 bg-black/45 px-3 py-0.5 text-[8px] sm:text-[9px] font-bold tracking-wider text-[#F7EDD2] shadow">
                    EXPLORE CAKES →
                  </div>
                </div>
              ) : (
                <div className="absolute top-2 right-2 rounded bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[9px] font-semibold text-amber-300">
                  Clean Artwork Mode (No HTML Text Overlay)
                </div>
              )}
            </div>
          </div>

          {/* Right: Controls & Text Fields */}
          <div className="lg:col-span-6 space-y-3.5">
            {/* Toggle: Banner has text */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-gold-500/30 bg-gold-500/10">
              <div className="pr-3">
                <span className="text-xs font-bold text-gold-300 block">
                  Banner Par 3D Gold Text Overlay Dikhayein?
                </span>
                <span className="text-[10px] text-luxury-300 leading-tight block mt-0.5">
                  <strong>ON (Recommended)</strong>: Headline, Sub-headline aur Button luxury 3D Gold style me dikhega. <br />
                  <strong>OFF</strong>: Extra text hide hoga (agar poster me pehle se text printed hai).
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleToggleBannerHasText(!bannerHasText)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  bannerHasText ? "bg-amber-500" : "bg-luxury-800"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    bannerHasText ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {bannerHasText ? (
              <>
                <div>
                  <label className="block text-xs font-semibold text-cream-200 mb-1">
                    Banner Headline Title
                  </label>
                  <input
                    type="text"
                    value={defaultBannerTitle}
                    onChange={(e) => setDefaultBannerTitle(e.target.value)}
                    placeholder="e.g. Raman Sweet Signature Collection"
                    className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3.5 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-cream-200 mb-1">
                    Sub-Headline Description
                  </label>
                  <input
                    type="text"
                    value={defaultBannerSubtitle}
                    onChange={(e) => setDefaultBannerSubtitle(e.target.value)}
                    placeholder="e.g. 100% EGGLESS • HANDCRAFTED ARTISANAL BAKES"
                    className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3.5 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">
                ✦ <strong>Clean Artwork Mode Active</strong>: Banner par koi extra HTML text ya button nahi aayega. Aapka original design 100% clean aur border-to-border dikhega.
              </div>
            )}

            {/* Upload & Reset Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl border border-gold-500/40 bg-gold-500/10 px-3.5 py-2 text-xs font-semibold text-gold-300 hover:bg-gold-500/20 transition-colors">
                <Upload className="h-4 w-4" />
                <span>{uploadingDefaultBanner ? "Uploading..." : "Upload New Default Banner"}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingDefaultBanner}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleDefaultBannerUpload(file);
                  }}
                />
              </label>

              <button
                type="button"
                onClick={handleResetDefaultBanner}
                className="inline-flex items-center gap-1.5 rounded-xl border border-luxury-700 bg-luxury-950 px-3 py-2 text-xs text-luxury-300 hover:text-gold-400 hover:border-gold-500/40 transition-colors"
                title="Reset to 8K Luxury Master"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset to 8K Master</span>
              </button>
            </div>
            {defaultBannerError && (
              <p className="text-xs text-red-400">{defaultBannerError}</p>
            )}
          </div>
        </div>
      </div>

      {/* Occasions List */}
      <div className="rounded-3xl border border-gold-500/20 bg-[#14120f] p-5 sm:p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg font-bold text-cream-100">
            All Occasions & Calendar Status ({occasions.length})
          </h2>
          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="text-xs font-semibold text-gold-400 hover:text-gold-300 transition-colors"
          >
            + Add New
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-gold-400">Loading occasions...</div>
        ) : (
          <div className="space-y-3">
            {occasions.map((occ) => {
              const accent = occ.accentColor || "#D4AF37";
              const occurrence = occ.currentOccurrence;
              const isCustom = occ.type === "CUSTOM" || occ.calendarKey.startsWith("custom_");

              return (
                <div
                  key={occ.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5 rounded-2xl border border-luxury-800/80 bg-[#181512] p-4 transition-colors hover:border-gold-500/30"
                >
                  {/* Left: Info */}
                  <div className="space-y-1 sm:max-w-md">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: accent }}
                      />
                      <h3 className="font-serif text-base font-bold text-cream-50">
                        {occ.name}
                      </h3>
                      <span className="rounded-md border border-luxury-700 bg-luxury-900 px-1.5 py-0.5 text-[9.5px] font-semibold text-luxury-300">
                        {occ.type}
                      </span>

                      {/* Status Badge */}
                      {occ.status === "ACTIVE" && occ.active && (
                        <span className="rounded-full border border-emerald-500/40 bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                          Active Now
                        </span>
                      )}
                      {occ.status === "UPCOMING" && occ.active && (
                        <span className="rounded-full border border-gold-500/30 bg-gold-950/40 px-2 py-0.5 text-[10px] font-semibold text-gold-400">
                          Upcoming
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-luxury-400 line-clamp-1">
                      {occ.description || "No promotional description set"}
                    </p>

                    {/* Calculated Dates */}
                    <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[11px] text-luxury-500">
                      <span>Event: <strong className="text-luxury-300 font-medium">{formatDate(occurrence?.eventDate)}</strong></span>
                      <span>•</span>
                      <span>Display Window: <span className="text-luxury-300">{formatDate(occurrence?.displayStart)} – {formatDate(occurrence?.displayEnd)}</span></span>
                    </div>
                  </div>

                  {/* Middle: Banner Thumbnail Preview */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="relative w-24 sm:w-32 aspect-[16/5] rounded-lg overflow-hidden border border-gold-500/30 bg-black/80 shadow-sm group">
                      <img
                        src={getOccasionBannerUrl(occ.slug, occ.bannerImage)}
                        alt={occ.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/images/festivals/generic-luxury-banner.jpg";
                        }}
                      />
                      <span className={`absolute bottom-0.5 right-1 rounded px-1 py-0.2 text-[8px] font-medium backdrop-blur-[2px] ${
                        occ.bannerImage ? "bg-amber-950/80 text-amber-300 border border-amber-500/40" : "bg-black/70 text-gold-300"
                      }`}>
                        {occ.bannerImage ? "Custom" : "System 8K"}
                        {(occ.bannerImage?.includes("#notext") || checkHasBakedInText(getOccasionBannerUrl(occ.slug, occ.bannerImage), occ.badgeText)) ? " • Clean" : ""}
                      </span>
                    </div>
                  </div>

                  {/* Right: Tagged Cakes, Switch & Actions */}
                  <div className="flex items-center gap-3 sm:gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-luxury-800">
                    {/* Tagged Cakes */}
                    <div className="text-right">
                      <span className="text-xs font-bold text-cream-100 block">
                        {occ.cakeCount} Cakes
                      </span>
                      <span className="text-[10px] text-luxury-500">Tagged</span>
                    </div>

                    {/* Content Active Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => handleToggleActive(occ)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        occ.active ? "bg-emerald-600" : "bg-luxury-800"
                      }`}
                      title={occ.active ? "Occasion is enabled" : "Occasion is disabled"}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          occ.active ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>

                    {/* Edit Content Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(occ)}
                      className="rounded-xl border border-luxury-700 bg-luxury-900 p-2 text-luxury-300 hover:border-gold-500 hover:text-gold-400 transition-colors"
                      title="Edit Promotional Content"
                    >
                      <Sliders className="h-4 w-4" />
                    </button>

                    {/* Delete Button (Custom Occasions) */}
                    {isCustom && (
                      <button
                        type="button"
                        onClick={() => handleDeleteOccasion(occ)}
                        className="rounded-xl border border-luxury-700 bg-luxury-900 p-2 text-luxury-400 hover:border-red-500/60 hover:text-red-400 transition-colors"
                        title="Delete Custom Occasion"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Content Drawer / Modal */}
      {editingOccasion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl border border-gold-500/30 bg-[#14120f] p-4 sm:p-6 shadow-2xl space-y-4 my-4 sm:my-8 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-luxury-800 pb-3">
              <div className="flex items-center space-x-2">
                <Sliders className="h-4 w-4 text-gold-400" />
                <h3 className="font-serif text-lg font-bold text-cream-50">
                  Edit {editingOccasion.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingOccasion(null)}
                className="text-luxury-400 hover:text-cream-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Occasion Name */}
                <div>
                  <label className="block text-xs font-semibold text-cream-200 mb-1">
                    Occasion Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3.5 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                  />
                </div>

                {/* Priority Score */}
                <div>
                  <label className="block text-xs font-semibold text-cream-200 mb-1">
                    Display Priority (1-100)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={editForm.priority}
                    onChange={(e) => setEditForm({ ...editForm, priority: Number(e.target.value) })}
                    className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3.5 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Event Date & Pre-Order Window */}
              <div className="rounded-2xl border border-luxury-800 bg-luxury-900/60 p-3.5 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-cream-200 mb-1">
                    Celebration / Event Date
                  </label>
                  <input
                    type="date"
                    value={editForm.eventDate}
                    onChange={(e) => setEditForm({ ...editForm, eventDate: e.target.value })}
                    className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3.5 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-luxury-400 mb-1">
                      Pre-Order Days Before
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={editForm.daysBefore}
                      onChange={(e) => setEditForm({ ...editForm, daysBefore: Number(e.target.value) })}
                      className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3 py-2 text-xs text-cream-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-luxury-400 mb-1">
                      Active Days After
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={editForm.daysAfter}
                      onChange={(e) => setEditForm({ ...editForm, daysAfter: Number(e.target.value) })}
                      className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3 py-2 text-xs text-cream-100"
                    />
                  </div>
                </div>

                <p className="text-[10px] text-gold-400/90 font-medium">
                  ℹ️ Window: {editForm.daysBefore} days before event date until {editForm.daysAfter} day(s) after.
                </p>
              </div>

              {/* Homepage Badge Text */}
              <div>
                <label className="block text-xs font-semibold text-cream-200 mb-1">
                  Homepage Badge Text
                </label>
                <input
                  type="text"
                  value={editForm.badgeText}
                  onChange={(e) => setEditForm({ ...editForm, badgeText: e.target.value })}
                  placeholder="e.g. 🪔 DIWALI SPECIAL"
                  className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3.5 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                />
              </div>

              {/* Promotional Subtitle */}
              <div>
                <label className="block text-xs font-semibold text-cream-200 mb-1">
                  Promotional Subtitle
                </label>
                <textarea
                  rows={2}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="Celebrate the season with our handcrafted eggless collection..."
                  className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3.5 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                />
              </div>

              {/* Accent Color */}
              <div>
                <label className="block text-xs font-semibold text-cream-200 mb-1">
                  Theme Accent Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={editForm.accentColor}
                    onChange={(e) => setEditForm({ ...editForm, accentColor: e.target.value })}
                    className="h-9 w-9 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                  />
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {["#D4AF37", "#EC4899", "#10B981", "#3B82F6", "#8B5CF6", "#F97316"].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setEditForm({ ...editForm, accentColor: c })}
                        className={`h-6 w-6 rounded-full border-2 transition-transform ${
                          editForm.accentColor === c ? "scale-110 border-white" : "border-transparent"
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Festival Banner Artwork (Wide 16:4 / 16:5 Ratio) */}
              <div className="rounded-2xl border border-gold-500/25 bg-luxury-900/60 p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-gold-400">
                      Festival Banner Artwork
                    </label>
                    <p className="text-[10px] text-luxury-400">
                      Upload custom 16:4 banner or use built-in 8K Master.
                    </p>
                  </div>
                  {editForm.bannerImage ? (
                    <span className="rounded bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[9px] font-semibold text-amber-300">
                      Custom Banner Active
                    </span>
                  ) : (
                    <span className="rounded bg-gold-500/15 border border-gold-500/30 px-2 py-0.5 text-[9px] font-semibold text-gold-300">
                      Using System 8K Master
                    </span>
                  )}
                </div>

                {/* Interactive Live Preview */}
                <div className="relative aspect-[16/4.5] w-full overflow-hidden rounded-xl border border-gold-500/60 bg-[#0B0806] shadow-lg group">
                  <img
                    src={getOccasionBannerUrl(editingOccasion.slug, editForm.bannerImage)}
                    alt="Banner Live Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/festivals/generic-luxury-banner.jpg";
                    }}
                  />
                  {editBannerHasText ? (
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-2">
                      <span className="text-[9px] uppercase tracking-widest text-[#E6C675] font-medium">
                        {editForm.badgeText || "FESTIVE SPECIAL"}
                      </span>
                      <h4 className="font-serif text-sm sm:text-base font-bold text-[#FFFDF7] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                        {editForm.name || editingOccasion.name}
                      </h4>
                      <div className="mt-1 rounded-full border border-gold-400/80 bg-black/50 px-2.5 py-0.5 text-[8px] font-bold text-gold-300">
                        VIEW CAKES →
                      </div>
                    </div>
                  ) : (
                    <div className="absolute top-2 right-2 rounded bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[9px] font-semibold text-amber-300">
                      Clean Artwork Mode (No HTML Text Overlay)
                    </div>
                  )}
                </div>

                {/* Toggle: Show 3D Gold Text Overlay on Banner */}
                <div
                  onClick={() => handleToggleEditBannerText(!editBannerHasText)}
                  className="flex items-center justify-between p-3 rounded-xl border border-gold-500/30 bg-gold-500/10 cursor-pointer hover:bg-gold-500/15 transition-colors select-none"
                >
                  <div className="pr-3">
                    <span className="text-xs font-bold text-gold-300 block">
                      Banner Par 3D Gold Text Overlay Dikhayein?
                    </span>
                    <span className="text-[10px] text-luxury-300 leading-tight block mt-0.5">
                      <strong>ON (Recommended)</strong>: Festive Title, Subtitle aur Button luxury 3D Gold style me dikhega. <br />
                      <strong>OFF</strong>: Extra text hide hoga (sirf clean graphic poster dikhega agar poster me pehle se text printed hai).
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleEditBannerText(!editBannerHasText);
                    }}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      editBannerHasText ? "bg-amber-500" : "bg-luxury-800"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        editBannerHasText ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Instant Status Pill */}
                {editBannerHasText ? (
                  <div className="rounded-xl border border-gold-500/30 bg-gold-500/10 p-2.5 text-xs text-gold-300 flex items-center gap-2">
                    <span className="text-gold-400">✦</span>
                    <span><strong>Text Overlay Mode Active</strong>: 3D Gold Title, ornaments aur button banner ke upar luxury style me render honge.</span>
                  </div>
                ) : (
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-300 flex items-center gap-2">
                    <span className="text-amber-400">✦</span>
                    <span><strong>Clean Artwork Mode Active</strong>: Banner par koi extra HTML text overlay ya button nahi aayega.</span>
                  </div>
                )}

                {/* Upload & Reset Controls */}
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl border border-gold-500/40 bg-gold-500/10 px-3 py-1.5 text-xs font-semibold text-gold-300 hover:bg-gold-500/20 transition-colors">
                    <Upload className="h-3.5 w-3.5" />
                    <span>{uploadingBanner ? "Uploading..." : "Upload New Banner"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingBanner}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleBannerUpload(file, true);
                      }}
                    />
                  </label>

                  {editForm.bannerImage && (
                    <button
                      type="button"
                      onClick={() => setEditForm((prev) => ({ ...prev, bannerImage: "" }))}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-luxury-700 bg-luxury-950 px-2.5 py-1.5 text-xs text-luxury-300 hover:text-gold-400 hover:border-gold-500/40 transition-colors"
                      title="Revert to system pre-generated 8K/4K master banner"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Reset to System 8K Master</span>
                    </button>
                  )}
                </div>
                {bannerUploadError && (
                  <p className="text-[11px] text-red-400">{bannerUploadError}</p>
                )}
              </div>

              {/* Tag Pure Veg Cakes */}
              {cakesList.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-xs font-semibold text-cream-200">
                        Tag Pure Veg Cakes ({editForm.selectedCakeIds.length} Selected)
                      </label>
                      <p className="text-[10px] text-luxury-400">
                        Select cakes to showcase in this collection.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setEditForm({
                            ...editForm,
                            selectedCakeIds: cakesList.map((c) => c.id),
                          })
                        }
                        className="rounded-lg border border-gold-500/30 bg-gold-500/10 px-2.5 py-1 text-[10px] font-semibold text-gold-300 hover:bg-gold-500/20 transition-colors"
                      >
                        Select All ({cakesList.length})
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setEditForm({
                            ...editForm,
                            selectedCakeIds: [],
                          })
                        }
                        className="rounded-lg border border-luxury-700 bg-luxury-900 px-2.5 py-1 text-[10px] font-medium text-luxury-400 hover:text-cream-200 transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  {/* Quick Search Filter */}
                  <input
                    type="text"
                    placeholder="Search cakes by name or category..."
                    value={editCakeSearch}
                    onChange={(e) => setEditCakeSearch(e.target.value)}
                    className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3.5 py-2 text-xs text-cream-100 placeholder:text-luxury-500 focus:border-gold-500 focus:outline-none"
                  />

                  <div className="max-h-56 overflow-y-auto space-y-1 rounded-xl border border-luxury-800 bg-luxury-950/80 p-2">
                    {cakesList
                      .filter(
                        (cake) =>
                          cake.name.toLowerCase().includes(editCakeSearch.toLowerCase()) ||
                          (cake.category?.name &&
                            cake.category.name.toLowerCase().includes(editCakeSearch.toLowerCase()))
                      )
                      .map((cake) => {
                        const isChecked = editForm.selectedCakeIds.includes(cake.id);
                        return (
                          <label
                            key={cake.id}
                            className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition-colors ${
                              isChecked
                                ? "bg-gold-500/15 text-gold-300 border border-gold-500/30"
                                : "hover:bg-luxury-900 text-cream-200 border border-transparent"
                            }`}
                          >
                            <div className="flex items-center space-x-2.5 min-w-0">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setEditForm({
                                      ...editForm,
                                      selectedCakeIds: [...editForm.selectedCakeIds, cake.id],
                                    });
                                  } else {
                                    setEditForm({
                                      ...editForm,
                                      selectedCakeIds: editForm.selectedCakeIds.filter(
                                        (id) => id !== cake.id
                                      ),
                                    });
                                  }
                                }}
                                className="h-4 w-4 rounded accent-gold-500 shrink-0"
                              />
                              {cake.coverImage && (
                                <img
                                  src={cake.coverImage}
                                  alt={cake.name}
                                  className="h-7 w-7 rounded-lg object-cover shrink-0"
                                />
                              )}
                              <span className="truncate font-medium">{cake.name}</span>
                            </div>
                            {cake.category?.name && (
                              <span className="text-[10px] text-luxury-400 bg-luxury-900 px-2 py-0.5 rounded-md shrink-0 ml-2 border border-luxury-800">
                                {cake.category.name}
                              </span>
                            )}
                          </label>
                        );
                      })}
                  </div>
                </div>
              )}



              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-luxury-800">
                <button
                  type="button"
                  onClick={() => setEditingOccasion(null)}
                  className="w-full py-2.5 rounded-xl border border-luxury-700 text-xs font-semibold text-luxury-300 hover:text-cream-100 hover:bg-luxury-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-2.5 rounded-xl bg-gold-gradient text-xs font-bold text-luxury-950 shadow-gold-sm hover:opacity-95 disabled:opacity-50 transition-opacity"
                >
                  {saving ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Custom Occasion Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl border border-gold-500/30 bg-[#14120f] p-4 sm:p-6 shadow-2xl space-y-4 my-4 sm:my-8 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-luxury-800 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-gold-400" />
                <h2 className="font-serif text-lg font-bold text-cream-50">
                  Add Custom Occasion / Festival
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="text-luxury-400 hover:text-cream-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Occasion Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-cream-200 mb-1">
                    Occasion Name <span className="text-gold-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Store Anniversary Special, Chhath Puja"
                    value={createForm.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCreateForm({
                        ...createForm,
                        name: val,
                        badgeText: createForm.badgeText || (val ? `🎉 ${val.toUpperCase()} SPECIAL` : ""),
                      });
                    }}
                    className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3.5 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                  />
                </div>

                {/* Occasion Type */}
                <div>
                  <label className="block text-xs font-semibold text-cream-200 mb-1">
                    Occasion Type
                  </label>
                  <select
                    value={createForm.type}
                    onChange={(e) => setCreateForm({ ...createForm, type: e.target.value })}
                    className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3.5 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                  >
                    <option value="CUSTOM">Custom Celebration</option>
                    <option value="FESTIVAL">Cultural Festival</option>
                    <option value="CELEBRATION">Milestone / Special Day</option>
                    <option value="SEASONAL">Seasonal Special</option>
                  </select>
                </div>

                {/* Priority Score */}
                <div>
                  <label className="block text-xs font-semibold text-cream-200 mb-1">
                    Display Priority (1-100)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={createForm.priority}
                    onChange={(e) => setCreateForm({ ...createForm, priority: Number(e.target.value) })}
                    className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3.5 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Event Date & Pre-Order Window */}
              <div className="rounded-2xl border border-luxury-800 bg-luxury-900/60 p-3.5 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-cream-200 mb-1">
                    Celebration / Event Date <span className="text-gold-400">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={createForm.eventDate}
                    onChange={(e) => setCreateForm({ ...createForm, eventDate: e.target.value })}
                    className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3.5 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-luxury-400 mb-1">
                      Pre-Order Days Before
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={createForm.daysBefore}
                      onChange={(e) => setCreateForm({ ...createForm, daysBefore: Number(e.target.value) })}
                      className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3 py-2 text-xs text-cream-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-luxury-400 mb-1">
                      Active Days After
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={createForm.daysAfter}
                      onChange={(e) => setCreateForm({ ...createForm, daysAfter: Number(e.target.value) })}
                      className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3 py-2 text-xs text-cream-100"
                    />
                  </div>
                </div>

                <p className="text-[10px] text-gold-400/90 font-medium">
                  ℹ️ Card will appear on customer menu {createForm.daysBefore} days before celebration date and auto-close {createForm.daysAfter} day(s) after.
                </p>
              </div>

              {/* Badge Text */}
              <div>
                <label className="block text-xs font-semibold text-cream-200 mb-1">
                  Card Badge Text
                </label>
                <input
                  type="text"
                  placeholder="e.g. 🎉 5TH ANNIVERSARY SPECIAL"
                  value={createForm.badgeText}
                  onChange={(e) => setCreateForm({ ...createForm, badgeText: e.target.value })}
                  className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3.5 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-cream-200 mb-1">
                  Promotional Subtitle
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe this special occasion or celebration..."
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3.5 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                />
              </div>

              {/* Accent Color */}
              <div>
                <label className="block text-xs font-semibold text-cream-200 mb-1">
                  Theme Accent Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={createForm.accentColor}
                    onChange={(e) => setCreateForm({ ...createForm, accentColor: e.target.value })}
                    className="h-9 w-9 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                  />
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {["#D4AF37", "#EC4899", "#10B981", "#3B82F6", "#8B5CF6", "#F97316"].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCreateForm({ ...createForm, accentColor: c })}
                        className={`h-6 w-6 rounded-full border-2 transition-transform ${
                          createForm.accentColor === c ? "scale-110 border-white" : "border-transparent"
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Festival Banner Artwork (Wide 16:4 / 16:5 Ratio) */}
              <div className="rounded-2xl border border-gold-500/25 bg-luxury-900/60 p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-gold-400">
                      Festival Banner Artwork (Optional)
                    </label>
                    <p className="text-[10px] text-luxury-400">
                      Upload custom 16:4 banner or system luxury fallback will be used.
                    </p>
                  </div>
                  {createForm.bannerImage && (
                    <span className="rounded bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[9px] font-semibold text-amber-300">
                      Custom Banner Added
                    </span>
                  )}
                </div>

                {/* Interactive Live Preview */}
                <div className="relative aspect-[16/4.5] w-full overflow-hidden rounded-xl border border-gold-500/60 bg-[#0B0806] shadow-lg group">
                  <img
                    src={createForm.bannerImage || "/images/festivals/generic-luxury-banner.jpg"}
                    alt="Banner Live Preview"
                    className="h-full w-full object-cover"
                  />
                  {createBannerHasText ? (
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-2">
                      <span className="text-[9px] uppercase tracking-widest text-[#E6C675] font-medium">
                        {createForm.badgeText || "FESTIVE SPECIAL"}
                      </span>
                      <h4 className="font-serif text-sm sm:text-base font-bold text-[#FFFDF7] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                        {createForm.name || "Special Celebration"}
                      </h4>
                      <div className="mt-1 rounded-full border border-gold-400/80 bg-black/50 px-2.5 py-0.5 text-[8px] font-bold text-gold-300">
                        VIEW CAKES →
                      </div>
                    </div>
                  ) : (
                    <div className="absolute top-2 right-2 rounded bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[9px] font-semibold text-amber-300">
                      Clean Artwork Mode (No HTML Text Overlay)
                    </div>
                  )}
                </div>

                {/* Toggle: Show 3D Gold Text Overlay on Banner */}
                <div
                  onClick={() => setCreateBannerHasText(!createBannerHasText)}
                  className="flex items-center justify-between p-3 rounded-xl border border-gold-500/30 bg-gold-500/10 cursor-pointer hover:bg-gold-500/15 transition-colors select-none"
                >
                  <div className="pr-3">
                    <span className="text-xs font-bold text-gold-300 block">
                      Banner Par 3D Gold Text Overlay Dikhayein?
                    </span>
                    <span className="text-[10px] text-luxury-300 leading-tight block mt-0.5">
                      <strong>ON (Recommended)</strong>: Festive Title, Subtitle aur Button luxury 3D Gold style me dikhega. <br />
                      <strong>OFF</strong>: Extra text hide hoga (sirf clean graphic poster dikhega agar poster me pehle se text printed hai).
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCreateBannerHasText(!createBannerHasText);
                    }}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      createBannerHasText ? "bg-amber-500" : "bg-luxury-800"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        createBannerHasText ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Instant Status Pill */}
                {createBannerHasText ? (
                  <div className="rounded-xl border border-gold-500/30 bg-gold-500/10 p-2.5 text-xs text-gold-300 flex items-center gap-2">
                    <span className="text-gold-400">✦</span>
                    <span><strong>Text Overlay Mode Active</strong>: 3D Gold Title, ornaments aur button banner ke upar luxury style me render honge.</span>
                  </div>
                ) : (
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-300 flex items-center gap-2">
                    <span className="text-amber-400">✦</span>
                    <span><strong>Clean Artwork Mode Active</strong>: Banner par koi extra HTML text overlay ya button nahi aayega.</span>
                  </div>
                )}

                {/* Upload Controls */}
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl border border-gold-500/40 bg-gold-500/10 px-3 py-1.5 text-xs font-semibold text-gold-300 hover:bg-gold-500/20 transition-colors">
                    <Upload className="h-3.5 w-3.5" />
                    <span>{uploadingBanner ? "Uploading..." : "Upload Banner Image"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingBanner}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleBannerUpload(file, false);
                      }}
                    />
                  </label>

                  {createForm.bannerImage && (
                    <button
                      type="button"
                      onClick={() => setCreateForm((prev) => ({ ...prev, bannerImage: "" }))}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-luxury-700 bg-luxury-950 px-2.5 py-1.5 text-xs text-luxury-300 hover:text-red-400 hover:border-red-500/40 transition-colors"
                      title="Remove banner image"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Remove Banner</span>
                    </button>
                  )}
                </div>
                {bannerUploadError && (
                  <p className="text-[11px] text-red-400">{bannerUploadError}</p>
                )}
              </div>

              {/* Tag Curated Cakes */}
              {cakesList.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-xs font-semibold text-cream-200">
                        Tag Pure Veg Cakes ({createForm.selectedCakeIds.length} Selected)
                      </label>
                      <p className="text-[10px] text-luxury-400">
                        Select at least 1 cake so this occasion card displays on the customer menu.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setCreateForm({
                            ...createForm,
                            selectedCakeIds: cakesList.map((c) => c.id),
                          })
                        }
                        className="rounded-lg border border-gold-500/30 bg-gold-500/10 px-2.5 py-1 text-[10px] font-semibold text-gold-300 hover:bg-gold-500/20 transition-colors"
                      >
                        Select All ({cakesList.length})
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setCreateForm({
                            ...createForm,
                            selectedCakeIds: [],
                          })
                        }
                        className="rounded-lg border border-luxury-700 bg-luxury-900 px-2.5 py-1 text-[10px] font-medium text-luxury-400 hover:text-cream-200 transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  {/* Quick Search Filter */}
                  <input
                    type="text"
                    placeholder="Search cakes by name or category..."
                    value={createCakeSearch}
                    onChange={(e) => setCreateCakeSearch(e.target.value)}
                    className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3.5 py-2 text-xs text-cream-100 placeholder:text-luxury-500 focus:border-gold-500 focus:outline-none"
                  />

                  <div className="max-h-56 overflow-y-auto space-y-1 rounded-xl border border-luxury-800 bg-luxury-950/80 p-2">
                    {cakesList
                      .filter(
                        (cake) =>
                          cake.name.toLowerCase().includes(createCakeSearch.toLowerCase()) ||
                          (cake.category?.name &&
                            cake.category.name.toLowerCase().includes(createCakeSearch.toLowerCase()))
                      )
                      .map((cake) => {
                        const isChecked = createForm.selectedCakeIds.includes(cake.id);
                        return (
                          <label
                            key={cake.id}
                            className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition-colors ${
                              isChecked
                                ? "bg-gold-500/15 text-gold-300 border border-gold-500/30"
                                : "hover:bg-luxury-900 text-cream-200 border border-transparent"
                            }`}
                          >
                            <div className="flex items-center space-x-2.5 min-w-0">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setCreateForm({
                                      ...createForm,
                                      selectedCakeIds: [...createForm.selectedCakeIds, cake.id],
                                    });
                                  } else {
                                    setCreateForm({
                                      ...createForm,
                                      selectedCakeIds: createForm.selectedCakeIds.filter(
                                        (id) => id !== cake.id
                                      ),
                                    });
                                  }
                                }}
                                className="h-4 w-4 rounded accent-gold-500 shrink-0"
                              />
                              {cake.coverImage && (
                                <img
                                  src={cake.coverImage}
                                  alt={cake.name}
                                  className="h-7 w-7 rounded-lg object-cover shrink-0"
                                />
                              )}
                              <span className="truncate font-medium">{cake.name}</span>
                            </div>
                            {cake.category?.name && (
                              <span className="text-[10px] text-luxury-400 bg-luxury-900 px-2 py-0.5 rounded-md shrink-0 ml-2 border border-luxury-800">
                                {cake.category.name}
                              </span>
                            )}
                          </label>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-luxury-800">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="w-full py-2.5 rounded-xl border border-luxury-700 text-xs font-semibold text-luxury-300 hover:text-cream-100 hover:bg-luxury-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="w-full py-2.5 rounded-xl bg-gold-gradient text-xs font-bold text-luxury-950 shadow-gold-sm hover:opacity-95 disabled:opacity-50 transition-opacity"
                >
                  {creating ? "Creating..." : "Create Occasion"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
}

