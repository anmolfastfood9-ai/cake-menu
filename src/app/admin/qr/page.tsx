import prisma from "@/lib/db";
import QrGeneratorClient from "@/components/admin/QrGeneratorClient";

export const dynamic = "force-dynamic";

export default async function AdminQrPage() {
  const [settings, whatsappSetting] = await Promise.all([
    prisma.websiteSetting.findUnique({ where: { id: "default" } }),
    prisma.whatsAppSetting.findUnique({ where: { id: "default" } }),
  ]);

  return (
    <QrGeneratorClient
      settings={settings || undefined}
      whatsappSetting={whatsappSetting || undefined}
    />
  );
}
