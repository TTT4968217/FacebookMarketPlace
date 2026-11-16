"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { readSellerEmail } from "@/lib/seller";

export function SellerEmailForm({ initialEmail }: { initialEmail: string }) {
  const router = useRouter();
  const redirected = useRef(false);

  useEffect(() => {
    if (redirected.current || initialEmail) return;
    const saved = readSellerEmail();
    if (!saved) return;
    redirected.current = true;
    router.replace(`/listings?email=${encodeURIComponent(saved)}`);
  }, [initialEmail, router]);

  return (
    <form action="/listings" method="get" className="mb-5 flex flex-col gap-2 sm:flex-row">
      <label className="sr-only" htmlFor="seller-email">
        Contact email
      </label>
      <input
        id="seller-email"
        name="email"
        type="email"
        required
        key={initialEmail}
        defaultValue={initialEmail}
        placeholder="your@email.com"
        className="h-10 w-full rounded-lg border border-[#ccd0d5] bg-white px-3 text-[15px] outline-none focus:border-[#0866ff] sm:max-w-sm"
      />
      <button
        type="submit"
        className="h-10 cursor-pointer rounded-lg bg-[#0866ff] px-4 text-sm font-semibold text-white hover:bg-[#0756d6]"
      >
        Show listings
      </button>
    </form>
  );
}
