import { Suspense } from "react";
import { CreateListingForm } from "@/components/CreateListingForm";
import { normalizeListingType } from "@/lib/listing-types";

export default function CreateItemPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string | string[] }>;
}) {
  return (
    <Suspense fallback={<CreateFallback />}>
      <CreateItem searchParams={searchParams} />
    </Suspense>
  );
}

async function CreateItem({
  searchParams,
}: {
  searchParams: Promise<{ type?: string | string[] }>;
}) {
  const params = await searchParams;
  const raw = Array.isArray(params.type) ? params.type[0] : params.type;
  return <CreateListingForm listingType={normalizeListingType(raw)} />;
}

function CreateFallback() {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-6 lg:grid-cols-[minmax(300px,420px)_minmax(0,1fr)]">
      <div className="h-[640px] animate-pulse rounded-xl bg-white" />
      <div className="h-[640px] animate-pulse rounded-xl bg-white" />
    </div>
  );
}
