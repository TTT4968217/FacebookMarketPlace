import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MessageSellerForm } from "@/components/MessageSellerForm";
import { ErrorNote, SetupNotice } from "@/components/Notices";
import { formatListed, formatPrice } from "@/lib/format";
import { getListing } from "@/lib/listings";
import { isSupabaseConfigured } from "@/lib/supabase/env";

type ItemRouteProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: ItemRouteProps): Promise<Metadata> {
  const { id } = await params;
  if (!isSupabaseConfigured()) return { title: "Listing" };
  const { listing } = await getListing(id);
  if (!listing) return { title: "Listing" };
  return {
    title: listing.title,
    description: listing.description.slice(0, 160),
  };
}

export default function ItemPage({ params }: ItemRouteProps) {
  return (
    <Suspense fallback={<ItemFallback />}>
      <ItemDetails params={params} />
    </Suspense>
  );
}

async function ItemDetails({ params }: ItemRouteProps) {
  const { id } = await params;

  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6">
        <BackLink />
        <SetupNotice />
      </div>
    );
  }

  const { listing, error } = await getListing(id);
  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6">
        <BackLink />
        <ErrorNote message={error} />
      </div>
    );
  }
  if (!listing) notFound();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-4">
      <BackLink />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,380px)]">
        <div className="overflow-hidden rounded-xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={listing.image_url}
            alt={listing.title}
            className="max-h-[760px] w-full bg-neutral-100 object-contain"
          />
        </div>
        <div className="min-w-0">
          <h1 className="text-[28px] font-bold leading-tight tracking-tight">{listing.title}</h1>
          <p className="mt-1 text-[28px] font-bold leading-tight">{formatPrice(listing.price)}</p>
          <p className="mt-3 text-sm leading-5 text-[#65676b]">
            {formatListed(listing.created_at)}
            {listing.location ? (
              <>
                <br />
                in {listing.location}
              </>
            ) : null}
          </p>
          <p className="mt-3 text-sm text-[#65676b]">Category: {listing.category}</p>
          <h2 className="mt-5 text-[15px] font-bold">Description</h2>
          <p className="mt-1 text-[15px] leading-6 whitespace-pre-wrap">{listing.description}</p>
          <h2 className="mt-5 text-[15px] font-bold">Seller Information</h2>
          <a href={`mailto:${listing.contact_email}`} className="mt-1 block text-[15px] break-all hover:underline">
            {listing.contact_email}
          </a>
          <h2 className="mt-5 mb-2 text-[15px] font-bold">Message Seller</h2>
          <MessageSellerForm listingId={listing.id} />
        </div>
      </div>
    </div>
  );
}

function BackLink() {
  return (
    <Link href="/" className="mb-4 inline-flex items-center gap-1 text-[15px] font-medium text-[#0866ff] hover:underline">
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M15 6 9 12l6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Back to Marketplace
    </Link>
  );
}

function ItemFallback() {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,380px)]">
      <div className="aspect-[4/3] animate-pulse rounded-xl bg-white" />
      <div className="space-y-3">
        <div className="h-8 w-2/3 animate-pulse rounded bg-white" />
        <div className="h-8 w-24 animate-pulse rounded bg-white" />
        <div className="h-24 animate-pulse rounded-xl bg-white" />
      </div>
    </div>
  );
}
