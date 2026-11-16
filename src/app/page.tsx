import { Suspense } from "react";
import { BrowseShell } from "@/components/BrowseShell";
import { ListingGrid } from "@/components/ListingCard";
import { EmptyListings, ErrorNote, SetupNotice } from "@/components/Notices";
import { SearchForm } from "@/components/SearchForm";
import { isCategory } from "@/lib/categories";
import { getListings } from "@/lib/listings";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<HomeFallback />}>
      <HomeFeed searchParams={searchParams} />
    </Suspense>
  );
}

async function HomeFeed({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const rawCategory = first(params.category);
  const category = isCategory(rawCategory) ? rawCategory : undefined;
  const query = first(params.q)?.trim() ?? "";
  const configured = isSupabaseConfigured();
  const result = configured ? await getListings(category ?? "", query) : null;
  const heading = category || (query ? `Results for “${query}”` : "Today's picks");

  return (
    <BrowseShell activeCategory={category} query={query}>
      <h1 className="mb-1 text-[24px] font-bold tracking-tight">{heading}</h1>
      {category && query ? (
        <p className="mb-3 text-sm text-[#65676b]">Matching “{query}”</p>
      ) : (
        <div className="mb-3" />
      )}
      <SearchForm category={category} query={query} />
      {!configured ? <SetupNotice /> : null}
      {result?.error ? <ErrorNote message={result.error} /> : null}
      {result && !result.error && result.listings.length === 0 ? (
        <EmptyListings category={category} query={query || undefined} />
      ) : null}
      {result && result.listings.length > 0 ? <ListingGrid listings={result.listings} /> : null}
    </BrowseShell>
  );
}

function HomeFallback() {
  return (
    <BrowseShell>
      <div className="mb-4 h-8 w-48 animate-pulse rounded bg-white" />
      <div className="mb-4 h-10 animate-pulse rounded-lg bg-white" />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(210px,250px))] gap-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-xl bg-white">
            <div className="aspect-[4/3] animate-pulse bg-neutral-200" />
            <div className="space-y-2 p-3">
              <div className="h-4 w-16 animate-pulse rounded bg-neutral-200" />
              <div className="h-3 w-32 animate-pulse rounded bg-neutral-200" />
              <div className="h-3 w-24 animate-pulse rounded bg-neutral-200" />
            </div>
          </div>
        ))}
      </div>
    </BrowseShell>
  );
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
