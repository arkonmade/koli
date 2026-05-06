// src/app/browse/page.tsx

import { getInfluencers } from "@/lib/supabase";
import BrowseClient from "@/components/BrowseClient";
import Nav from "@/components/Nav";
import MobileShell from "@/components/MobileShell";

export const revalidate = 60;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  const q = searchParams.q || "All";
  const category = searchParams.category || "All";

  const title =
    category !== "All"
      ? `${category} Influencers in Rwanda | KOLI`
      : `Find Influencers in Rwanda | KOLI`;

  const description =
    category !== "All"
      ? `Discover top ${category.toLowerCase()} influencers in Kigali and Rwanda.`
      : `Browse top influencers in Rwanda across fashion, food, sports, lifestyle, tech and more.`;

  return { title, description };
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  let influencers: any[] = [];

  try {
    influencers = await getInfluencers({
      search: searchParams.q,
      category: searchParams.category,
    });
  } catch {
    influencers = [];
  }

  return (
    <>
      <Nav />
      <MobileShell>
        <BrowseClient
          influencers={influencers}
          initialQ={searchParams.q ?? ""}
          initialCat={searchParams.category ?? "All"}
        />
      </MobileShell>
    </>
  );
}