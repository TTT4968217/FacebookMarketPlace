"use client";

import { useState, useSyncExternalStore } from "react";
import { sendMessage } from "@/actions/messages";
import { readBuyerEmail, rememberBuyerEmail } from "@/lib/seller";

function subscribe() {
  return () => {};
}

function emptySnapshot() {
  return "";
}

const inputClass =
  "w-full rounded-lg border border-[#ccd0d5] bg-white px-3 py-2.5 text-[15px] outline-none placeholder:text-[#8a8d91] focus:border-[#0866ff] focus:ring-2 focus:ring-[#0866ff]/20";

export function MessageSellerForm({ listingId }: { listingId: string }) {
  const savedEmail = useSyncExternalStore(subscribe, readBuyerEmail, emptySnapshot);
  const [email, setEmail] = useState<string | null>(null);
  const buyerEmail = email ?? savedEmail;
  const [message, setMessage] = useState("I'm interested in your item!");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<"saved" | "emailed" | "email-failed" | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError("");

    try {
      const response = await sendMessage({ listingId, buyerEmail, message });
      if ("error" in response) {
        setError(response.error);
        return;
      }
      rememberBuyerEmail(buyerEmail);
      if (response.emailed) setResult("emailed");
      else if (response.emailError) setResult("email-failed");
      else setResult("saved");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not send the message.");
    } finally {
      setPending(false);
    }
  }

  if (result) {
    const copy =
      result === "emailed"
        ? "Message sent successfully! The seller will receive an email notification."
        : result === "email-failed"
          ? "Your message was saved, but the email to the seller could not be sent."
          : "Message sent successfully! It was saved for the seller.";

    return (
      <div
        className={`rounded-lg border px-4 py-3 text-sm leading-6 ${
          result === "email-failed"
            ? "border-amber-200 bg-amber-50 text-amber-950"
            : "border-green-200 bg-green-50 text-green-800"
        }`}
        role="status"
      >
        {copy}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="buyer-email" className="mb-1.5 block text-sm font-medium">
        Your Email
      </label>
      <input
        id="buyer-email"
        type="email"
        autoComplete="email"
        required
        value={buyerEmail}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="your@email.com"
        className={inputClass}
      />

      <label htmlFor="buyer-message" className="mt-3 mb-1.5 block text-sm font-medium">
        Message
      </label>
      <textarea
        id="buyer-message"
        required
        rows={4}
        maxLength={2000}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        className={`${inputClass} resize-y`}
      />

      {error ? (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-3 h-10 w-full cursor-pointer rounded-lg bg-[#0866ff] text-sm font-semibold text-white hover:bg-[#0756d6] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
