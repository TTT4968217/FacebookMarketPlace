"use client";

import Link from "next/link";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-[#65676b]">The page could not be loaded. Try again.</p>
      <div className="mt-4 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="cursor-pointer rounded-lg bg-[#0866ff] px-4 py-2 text-sm font-semibold text-white"
        >
          Try again
        </button>
        <Link href="/" className="text-sm font-semibold text-[#0866ff]">
          Back to Marketplace
        </Link>
      </div>
    </div>
  );
}
