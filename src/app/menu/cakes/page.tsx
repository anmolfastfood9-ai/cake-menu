import AllCakesClient from "@/components/customer/AllCakesClient";
import {
  getCachedCategories,
  getCachedAllCakes,
  getCachedWebsiteSettings,
  getCachedWhatsAppSetting,
} from "@/lib/cache";

export const revalidate = 60; // Instant Static + Stale-While-Revalidate

export default async function AllCakesPage({
  searchParams,
}: {
  searchParams?: { category?: string };
}) {
  const [categories, cakes, settings, whatsappSetting] = await Promise.all([
    getCachedCategories(),
    getCachedAllCakes(),
    getCachedWebsiteSettings(),
    getCachedWhatsAppSetting(),
  ]);

  return (
    <AllCakesClient
      initialCategories={categories}
      initialCakes={cakes}
      settings={settings}
      whatsappSetting={whatsappSetting}
      selectedCategorySlug={searchParams?.category || "all"}
    />
  );
}
