import prisma from "@/lib/db";
import WhatsAppSettingsClient from "@/components/admin/WhatsAppSettingsClient";

export const dynamic = "force-dynamic";

export default async function AdminWhatsAppPage() {
  const [whatsappSetting, websiteSetting] = await Promise.all([
    prisma.whatsAppSetting.findUnique({ where: { id: "default" } }),
    prisma.websiteSetting.findUnique({ where: { id: "default" } }),
  ]);

  return (
    <WhatsAppSettingsClient
      initialSetting={whatsappSetting || undefined}
      restaurantName={websiteSetting?.restaurantName || "Raman Sweet Cake"}
    />
  );
}
