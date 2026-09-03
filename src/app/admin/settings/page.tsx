import prisma from "@/lib/db";
import SettingsClient from "@/components/admin/SettingsClient";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await prisma.websiteSetting.findUnique({
    where: { id: "default" },
  });

  return <SettingsClient initialSettings={settings || undefined} />;
}
