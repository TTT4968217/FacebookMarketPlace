"use server";

import { revalidatePath } from "next/cache";
import { getListing } from "@/lib/listings";
import { getSupabaseServer } from "@/lib/supabase/server";
import { friendlySupabaseError, validateMessageFields } from "@/lib/validation";

export async function sendMessage(input: {
  listingId: string;
  buyerEmail: string;
  message: string;
}): Promise<{ emailed: boolean; emailError?: string } | { error: string }> {
  const fieldError = validateMessageFields(input);
  if (fieldError) return { error: fieldError };

  const supabase = getSupabaseServer();
  if (!supabase) {
    return {
      error: "Supabase is not configured. Add the project URL and anon key to .env.local.",
    };
  }

  const { listing, error: listingError } = await getListing(input.listingId);
  if (listingError) return { error: listingError };
  if (!listing) return { error: "This listing is no longer available." };

  const buyerEmail = input.buyerEmail.trim().toLowerCase();
  const message = input.message.trim();

  const { error } = await supabase.from("messages").insert({
    listing_id: listing.id,
    buyer_email: buyerEmail,
    message,
  });

  if (error) return { error: friendlySupabaseError(error.message) };

  const emailResult = await notifySeller({
    sellerEmail: listing.contact_email,
    buyerEmail,
    title: listing.title,
    price: listing.price,
    listingId: listing.id,
    message,
  });

  revalidatePath(`/item/${listing.id}`);
  return emailResult;
}

async function notifySeller(input: {
  sellerEmail: string;
  buyerEmail: string;
  title: string;
  price: number;
  listingId: string;
  message: string;
}): Promise<{ emailed: boolean; emailError?: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim();
  if (!apiKey || !from) return { emailed: false };

  const site = siteUrl();
  const link = site ? `${site}/item/${input.listingId}` : "";
  const dollars = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(input.price);

  const text = [
    `You have a new message about "${input.title}" (${dollars}).`,
    "",
    `From: ${input.buyerEmail}`,
    "",
    input.message,
    link ? `View the listing: ${link}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [input.sellerEmail],
        reply_to: input.buyerEmail,
        subject: `New message about "${input.title}"`,
        text,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("Seller email failed", response.status, detail.slice(0, 500));
      return {
        emailed: false,
        emailError: "Your message was saved, but the email to the seller could not be sent.",
      };
    }

    return { emailed: true };
  } catch (error) {
    console.error("Seller email failed", error);
    return {
      emailed: false,
      emailError: "Your message was saved, but the email to the seller could not be sent.",
    };
  }
}

function siteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (configured) return configured;
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel}`;
  return "";
}
