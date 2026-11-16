import { Suspense } from "react";
import { BrowseShell } from "@/components/BrowseShell";
import { ListingGrid } from "@/components/ListingCard";
import { ErrorNote, SetupNotice } from "@/components/Notices";
import { SellerEmailForm } from "@/components/SellerEmailForm";
import { getListingsByEmail } from "@/lib/listings";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata = {
  title: "Your listings",
};

export default function YourListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string | string[] }>;
}) {
  return (
    <Suspense fallback={<BrowseShell><div className="h-40 animate-pulse rounded-xl bg-white" /></BrowseShell>}>
      <YourListings searchParams={searchParams} />
    </Suspense>
  );
}

async function YourListings({
  searchParams,
}: {
  searchParams: Promise<{ email?: string | string[] }>;
}) {
  const params = await searchParams;
  const raw = Array.isArray(params.email) ? params.email[0] : params.email;
  const email = raw?.trim().toLowerCase() ?? "";
  const configured = isSupabaseConfigured();
  const result = configured && email ? await getListingsByEmail(email) : null;

  return (
    <BrowseShell>
      <h1 className="mb-2 text-[24px] font-bold tracking-tight">Your listings</h1>
      <p className="mb-4 max-w-xl text-sm leading-6 text-[#65676b]">
        There is no account. Listings are matched to the contact email you entered when you created them.
      </p>
      {!configured ? <SetupNotice /> : null}
      <SellerEmailForm initialEmail={email} />
      {result?.error ? <ErrorNote message={result.error} /> : null}
      {result && !result.error && result.listings.length === 0 ? (
        <div className="rounded-xl bg-white px-6 py-10 text-center shadow-sm">
          <p className="font-semibold">No listings for {email}.</p>
          <LinkCreate />
        </div>
      ) : null}
      {result && result.listings.length > 0 ? <ListingGrid listings={result.listings} /> : null}
      {configured && !email ? (
        <p className="text-sm text-[#65676b]">Enter the email you used on your listings.</p>
      ) : null}
    </BrowseShell>
  );
}

function LinkCreate() {
  return (
    <a href="/create" className="mt-3 inline-block font-semibold text-[#0866ff]">
      Create a listing
    </a>
  );
}
