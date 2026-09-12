import MenuClient from "@/components/customer/MenuClient";

import { getActiveOccasion } from "@/lib/festivals/occasionEngine";

import {
  getCachedCategories,
  getCachedAllCakes,
  getCachedWebsiteSettings,
  getCachedWhatsAppSetting,
  warmActiveOccasion,
} from "@/lib/cache";

export const revalidate = 60;

export default async function MenuPage({
  searchParams,
}: {
  searchParams?: { category?: string };
}) {
  const [
    categories,
    cakes,
    settings,
    whatsappSetting,
    activeOccasion,
  ] = await Promise.all([
    getCachedCategories(),
    getCachedAllCakes(),
    getCachedWebsiteSettings(),
    getCachedWhatsAppSetting(),
    getActiveOccasion(),
  ]);

  // Pre-warm occasion detail pages in background for instant navigation
  if (activeOccasion?.isMerged && activeOccasion?.mergedOccasions) {
    for (const occ of activeOccasion.mergedOccasions) {
      if (occ.slug) warmActiveOccasion(occ.slug);
    }
  } else if (activeOccasion?.occasion?.slug) {
    warmActiveOccasion(activeOccasion.occasion.slug);
  }

  return (
    <MenuClient
      initialCategories={categories || []}
      initialCakes={cakes || []}
      settings={settings || undefined}
      whatsappSetting={whatsappSetting || undefined}
      activeOccasion={activeOccasion || undefined}
      initialSelectedCategory={searchParams?.category || "all"}
    />
  );
}