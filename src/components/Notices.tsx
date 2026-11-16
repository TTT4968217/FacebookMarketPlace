import Link from "next/link";

export function SetupNotice() {
  return (
    <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
      <p className="font-semibold">Connect Supabase to save listings.</p>
      <p className="mt-1">
        Copy <code className="rounded bg-white px-1">env.example</code> to{" "}
        <code className="rounded bg-white px-1">.env.local</code>, add your project URL and anon
        key, then run <code className="rounded bg-white px-1">supabase/schema.sql</code> in the
        Supabase SQL editor.
      </p>
    </div>
  );
}

export function ErrorNote({ message }: { message: string }) {
  return (
    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
      {message}
    </div>
  );
}

export function EmptyListings({
  category,
  query,
}: {
  category?: string;
  query?: string;
}) {
  if (query) {
    return (
      <div className="rounded-xl bg-white px-6 py-10 text-center shadow-sm">
        <p className="text-lg font-semibold">No listings match “{query}”.</p>
        <Link href={category ? `/?category=${encodeURIComponent(category)}` : "/"} className="mt-3 inline-block text-[#0866ff]">
          Clear search
        </Link>
      </div>
    );
  }

  if (category) {
    return (
      <div className="rounded-xl bg-white px-6 py-10 text-center shadow-sm">
        <p className="text-lg font-semibold">No listings in {category}.</p>
        <Link href="/" className="mt-3 inline-block text-[#0866ff]">
          Show all listings
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white px-6 py-10 text-center shadow-sm">
      <p className="text-lg font-semibold">Nothing is listed yet.</p>
      <p className="mt-1 text-sm text-[#65676b]">Be the first to post something for sale.</p>
      <Link
        href="/create"
        className="mt-4 inline-flex h-10 items-center rounded-lg bg-[#0866ff] px-4 text-sm font-semibold text-white"
      >
        Create a listing
      </Link>
    </div>
  );
}
