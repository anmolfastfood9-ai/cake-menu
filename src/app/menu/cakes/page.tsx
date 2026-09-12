import { redirect } from "next/navigation";

export default function AllCakesPage({
  searchParams,
}: {
  searchParams?: { category?: string };
}) {
  if (searchParams?.category && searchParams.category !== "all") {
    redirect(`/menu?category=${encodeURIComponent(searchParams.category)}`);
  }
  redirect("/menu");
}
