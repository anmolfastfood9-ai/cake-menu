import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

interface CacheStore {
  categories: { data: any; timestamp: number } | null;
  cakes: { data: any; timestamp: number } | null;
  featuredCakes: { data: any; timestamp: number } | null;
  settings: { data: any; timestamp: number } | null;
  whatsappSetting: { data: any; timestamp: number } | null;
  cakeBySlug: Map<string, { data: any; timestamp: number }>;
  occasionBySlug: Map<string, { data: any; timestamp: number }>;
}

const memoryStore: CacheStore = {
  categories: null,
  cakes: null,
  featuredCakes: null,
  settings: null,
  whatsappSetting: null,
  cakeBySlug: new Map(),
  occasionBySlug: new Map(),
};

const DEFAULT_TTL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Purges all cached server data immediately and triggers Next.js revalidation
 */
export function invalidateAppCache() {
  memoryStore.categories = null;
  memoryStore.cakes = null;
  memoryStore.featuredCakes = null;
  memoryStore.settings = null;
  memoryStore.whatsappSetting = null;
  memoryStore.cakeBySlug.clear();
  memoryStore.occasionBySlug.clear();

  try {
    revalidatePath("/menu");
    revalidatePath("/menu/cakes");
    revalidatePath("/menu/cake/[slug]", "page");
    revalidatePath("/menu/occasion/[slug]", "page");
    revalidatePath("/admin");
  } catch (e) {
    // Ignore outside request context
  }
}

/**
 * Superfast in-memory cached categories
 */
export async function getCachedCategories() {
  const now = Date.now();
  if (memoryStore.categories && now - memoryStore.categories.timestamp < DEFAULT_TTL_MS) {
    return memoryStore.categories.data;
  }
  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { displayOrder: "asc" },
  });
  memoryStore.categories = { data: categories, timestamp: now };
  return categories;
}

/**
 * Superfast in-memory cached top featured cakes (for homepage)
 */
export async function getCachedFeaturedCakes() {
  const now = Date.now();
  if (memoryStore.featuredCakes && now - memoryStore.featuredCakes.timestamp < DEFAULT_TTL_MS) {
    return memoryStore.featuredCakes.data;
  }
  const cakes = await prisma.cake.findMany({
    where: { available: true },
    include: {
      category: true,
      prices: {
        orderBy: { price: "asc" },
      },
    },
    orderBy: [{ featured: "desc" }, { bestseller: "desc" }, { createdAt: "desc" }],
    take: 6,
  });
  memoryStore.featuredCakes = { data: cakes, timestamp: now };
  return cakes;
}

/**
 * Superfast in-memory cached all available cakes
 */
export async function getCachedAllCakes() {
  const now = Date.now();
  if (memoryStore.cakes && now - memoryStore.cakes.timestamp < DEFAULT_TTL_MS) {
    return memoryStore.cakes.data;
  }
  const cakes = await prisma.cake.findMany({
    where: { available: true },
    include: {
      category: true,
      prices: {
        orderBy: { price: "asc" },
      },
    },
    orderBy: [{ featured: "desc" }, { bestseller: "desc" }, { createdAt: "desc" }],
  });
  memoryStore.cakes = { data: cakes, timestamp: now };
  return cakes;
}

/**
 * Superfast in-memory cached website settings
 */
export async function getCachedWebsiteSettings() {
  const now = Date.now();
  if (memoryStore.settings && now - memoryStore.settings.timestamp < DEFAULT_TTL_MS) {
    return memoryStore.settings.data;
  }
  const settings = await prisma.websiteSetting.findUnique({
    where: { id: "default" },
  });
  memoryStore.settings = { data: settings, timestamp: now };
  return settings;
}

/**
 * Superfast in-memory cached whatsapp settings
 */
export async function getCachedWhatsAppSetting() {
  const now = Date.now();
  if (memoryStore.whatsappSetting && now - memoryStore.whatsappSetting.timestamp < DEFAULT_TTL_MS) {
    return memoryStore.whatsappSetting.data;
  }
  const whatsappSetting = await prisma.whatsAppSetting.findUnique({
    where: { id: "default" },
  });
  memoryStore.whatsappSetting = { data: whatsappSetting, timestamp: now };
  return whatsappSetting;
}

/**
 * Superfast in-memory cached single cake by slug or ID
 */
export async function getCachedCake(slugOrId: string) {
  const now = Date.now();
  const cached = memoryStore.cakeBySlug.get(slugOrId);
  if (cached && now - cached.timestamp < DEFAULT_TTL_MS) {
    return cached.data;
  }
  const cake = await prisma.cake.findFirst({
    where: { OR: [{ slug: slugOrId }, { id: slugOrId }] },
    include: {
      category: true,
      prices: { orderBy: { price: "asc" } },
    },
  });
  if (cake) {
    memoryStore.cakeBySlug.set(cake.slug, { data: cake, timestamp: now });
    memoryStore.cakeBySlug.set(cake.id, { data: cake, timestamp: now });
  }
  return cake;
}

/**
 * Superfast in-memory cached occasion by slug
 */
export async function getCachedOccasion(slug: string) {
  const now = Date.now();
  const cached = memoryStore.occasionBySlug.get(slug);
  if (cached && now - cached.timestamp < DEFAULT_TTL_MS) {
    return cached.data;
  }
  const occasion = await prisma.occasion.findFirst({
    where: {
      slug,
      active: true,
    },
    include: {
      cakes: {
        where: {
          cake: { available: true },
        },
        include: {
          cake: {
            include: {
              category: true,
              prices: {
                orderBy: { price: "asc" },
              },
            },
          },
        },
      },
    },
  });
  if (occasion) {
    memoryStore.occasionBySlug.set(slug, { data: occasion, timestamp: now });
  }
  return occasion;
}
