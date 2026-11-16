export const LISTING_BUCKET = "listing-images";

export function supabaseUrl(): string {
  return (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim().replace(/\/$/, "");
}

export function supabaseAnonKey(): string {
  return (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();
}

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl() && supabaseAnonKey());
}

export function isListingImageUrl(url: string): boolean {
  const base = supabaseUrl();
  if (!base) return false;
  const prefix = `${base}/storage/v1/object/public/${LISTING_BUCKET}/`;
  if (!url.startsWith(prefix)) return false;
  const path = url.slice(prefix.length).split("?")[0];
  return /^[0-9a-f-]{36}\.(jpg|png|webp)$/i.test(path);
}
