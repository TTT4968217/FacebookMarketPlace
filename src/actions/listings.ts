"use server";

import { revalidatePath } from "next/cache";
import { isListingImageUrl, supabaseUrl } from "@/lib/supabase/env";
import { getSupabaseServer } from "@/lib/supabase/server";
import type { ListingType } from "@/lib/types";
import {
  friendlySupabaseError,
  parsePrice,
  validateListingFields,
} from "@/lib/validation";

export type CreateListingInput = {
  title: string;
  description: string;
  price: string;
  category: string;
  location: string;
  contactEmail: string;
  imageUrl: string;
  imagePath: string;
  listingType: ListingType;
};

export async function createListing(
  input: CreateListingInput,
): Promise<{ id: string } | { error: string }> {
  const fieldError = validateListingFields(input);
  if (fieldError) return { error: fieldError };

  if (!isListingImageUrl(input.imageUrl)) {
    return { error: "Upload a JPEG, PNG, or WebP photo before creating the listing." };
  }

  const imagePath = input.imageUrl
    .slice(`${supabaseUrl()}/storage/v1/object/public/listing-images/`.length)
    .split("?")[0];

  if (imagePath !== input.imagePath) {
    return { error: "Photo upload did not finish. Try the photo again." };
  }

  const supabase = getSupabaseServer();
  if (!supabase) {
    return {
      error: "Supabase is not configured. Add the project URL and anon key to .env.local.",
    };
  }

  const price = parsePrice(input.price);
  if (price === null) return { error: "Enter a valid price." };

  const listingType: ListingType =
    input.listingType === "multiple" ||
    input.listingType === "vehicle" ||
    input.listingType === "home"
      ? input.listingType
      : "item";

  const { data, error } = await supabase
    .from("listings")
    .insert({
      title: input.title.trim(),
      description: input.description.trim(),
      price,
      category: input.category,
      location: input.location.trim(),
      contact_email: input.contactEmail.trim().toLowerCase(),
      image_url: input.imageUrl,
      image_path: imagePath,
      listing_type: listingType,
    })
    .select("id")
    .single();

  if (error || !data) {
    return {
      error: friendlySupabaseError(error?.message ?? "Could not save the listing."),
    };
  }

  revalidatePath("/");
  revalidatePath("/listings");
  return { id: data.id as string };
}
