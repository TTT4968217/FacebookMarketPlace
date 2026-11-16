import Link from "next/link";
import { formatListed, formatPrice } from "@/lib/format";
import type { Listing } from "@/lib/types";

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      href={`/item/${listing.id}`}
      className="block overflow-hidden rounded-xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.1),0_2px_8px_rgba(0,0,0,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
    >
      <div className="aspect-[4/3] bg-neutral-100">
        {/* Photos are served from this project's Supabase storage host. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={listing.image_url} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="px-3 py-3">
        <p className="text-[17px] font-bold leading-tight">{formatPrice(listing.price)}</p>
        <p className="mt-0.5 line-clamp-2 text-[15px] leading-snug text-[#050505]">{listing.title}</p>
        <p className="mt-1 text-[13px] leading-snug text-[#65676b]">{formatListed(listing.created_at)}</p>
        {listing.location ? (
          <p className="truncate text-[13px] leading-snug text-[#65676b]">{listing.location}</p>
        ) : null}
      </div>
    </Link>
  );
}

export function ListingGrid({ listings }: { listings: Listing[] }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(210px,250px))] gap-3">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
