import Link from "next/link";

export default function ListingNotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">Listing not found</h1>
      <p className="mt-2 text-[#65676b]">That listing may have been removed.</p>
      <Link href="/" className="mt-4 inline-block font-semibold text-[#0866ff]">
        Back to Marketplace
      </Link>
    </div>
  );
}
