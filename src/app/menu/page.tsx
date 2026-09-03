import MenuClient from "@/components/customer/MenuClient";
import { getActiveOccasion } from "@/lib/festivals/occasionEngine";
import {
  getCachedCategories,
  getCachedFeaturedCakes,
  getCachedWebsiteSettings,
  getCachedWhatsAppSetting,
} from "@/lib/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MenuPage() {
  // Fetch from in-memory cache in parallel (0ms DB delay)
  const [categories, cakes, settings, whatsappSetting, activeOccasion] = await Promise.all([
    getCachedCategories(),
    getCachedFeaturedCakes(),
    getCachedWebsiteSettings(),
    getCachedWhatsAppSetting(),
    getActiveOccasion(),
  ]);

  return (
    <MenuClient
      initialCategories={categories}
      initialCakes={cakes}
      settings={settings || undefined}
      whatsappSetting={whatsappSetting || undefined}
      activeOccasion={activeOccasion || undefined}
    />
  );
}
