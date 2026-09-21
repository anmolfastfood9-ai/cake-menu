import { NextRequest, NextResponse } from "next/server";
import { invalidateAppCache } from "@/lib/cache";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    invalidateAppCache();
    
    // Explicitly revalidate active customer category and core paths
    const categorySlugs = [
      "classic-cakes",
      "chocolate-cakes",
      "fruit-jelly-fresh-cream",
      "red-velvet-premium",
      "heart-doll-designer",
      "photo-theme-cakes",
      "mini-bento-cakes",
      "fusion-indian-flavours",
      "large-celebration-cakes"
    ];
    
    revalidatePath("/");
    revalidatePath("/menu");
    revalidatePath("/menu/cakes");
    for (const slug of categorySlugs) {
      revalidatePath(`/menu/category/${slug}`);
    }

    return NextResponse.json({
      success: true,
      message: "Cache invalidated and all relevant paths revalidated",
      revalidatedPaths: [
        "/",
        "/menu",
        "/menu/cakes",
        ...categorySlugs.map((s) => `/menu/category/${s}`)
      ]
    });
  } catch (err: any) {
    console.error("Revalidation error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
