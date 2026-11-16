import { cache } from "react";
import { getSupabaseServer } from "@/lib/supabase/server";
import { toListing, type Listing } from "@/lib/types";
import { friendlySupabaseError } from "@/lib/validation";

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function searchWords(query: string): string[] {
  return query
    .trim()
    .split(/\s+/)
    .map((word) => word.replace(/[%_,().\\]/g, "").slice(0, 40))
    .filter((word) => word.length > 0)
    .slice(0, 5);
}

export const getListings = cache(async function getListings(
  category: string,
  query: string,
): Promise<{ listings: Listing[]; error: string | null }> {
  const supabase = getSupabaseServer();
  if (!supabase) return { listings: [], error: null };

  let request = supabase
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (category) request = request.eq("category", category);

  for (const word of searchWords(query)) {
    request = request.or(
      `title.ilike.%${word}%,description.ilike.%${word}%,location.ilike.%${word}%`,
    );
  }

  const { data, error } = await request;
  if (error) {
    return { listings: [], error: friendlySupabaseError(error.message) };
  }

  return {
    listings: (data ?? []).map((row) => toListing(row)),
    error: null,
  };
});

export const getListing = cache(async function getListing(
  id: string,
): Promise<{ listing: Listing | null; error: string | null }> {
  if (!UUID.test(id)) return { listing: null, error: null };

  const supabase = getSupabaseServer();
  if (!supabase) return { listing: null, error: null };

  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return { listing: null, error: friendlySupabaseError(error.message) };
  }

  return { listing: data ? toListing(data) : null, error: null };
});

export async function getListingsByEmail(
  email: string,
): Promise<{ listings: Listing[]; error: string | null }> {
  const supabase = getSupabaseServer();
  if (!supabase) return { listings: [], error: null };

  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("contact_email", email.trim().toLowerCase())
    .order("created_at", { ascending: false });

  if (error) {
    return { listings: [], error: friendlySupabaseError(error.message) };
  }

  return {
    listings: (data ?? []).map((row) => toListing(row)),
    error: null,
  };
}
