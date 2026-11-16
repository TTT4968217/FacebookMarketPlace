import { LISTING_BUCKET } from "@/lib/supabase/env";
import { getSupabaseBrowser } from "@/lib/supabase/browser";
import { friendlySupabaseError } from "@/lib/validation";

const MAX_BYTES = 5 * 1024 * 1024;

export function photoError(file: File): string | null {
  const extension = extensionFor(file);
  if (!extension) return "Use a JPEG, PNG, or WebP photo.";
  if (file.size > MAX_BYTES) return "Photo must be 5MB or smaller.";
  if (file.size === 0) return "That photo file is empty.";
  return null;
}

export async function uploadListingPhoto(
  file: File,
): Promise<{ imageUrl: string; imagePath: string } | { error: string }> {
  const invalid = photoError(file);
  if (invalid) return { error: invalid };

  const supabase = getSupabaseBrowser();
  if (!supabase) {
    return {
      error: "Supabase is not configured. Add the project URL and anon key to .env.local.",
    };
  }

  const extension = extensionFor(file)!;
  const imagePath = `${crypto.randomUUID()}.${extension}`;
  const contentType =
    extension === "png" ? "image/png" : extension === "webp" ? "image/webp" : "image/jpeg";

  const { error } = await supabase.storage.from(LISTING_BUCKET).upload(imagePath, file, {
    contentType,
    cacheControl: "3600",
    upsert: false,
  });

  if (error) return { error: friendlySupabaseError(error.message) };

  const { data } = supabase.storage.from(LISTING_BUCKET).getPublicUrl(imagePath);
  return { imageUrl: data.publicUrl, imagePath };
}

function extensionFor(file: File): "jpg" | "png" | "webp" | null {
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  if (file.type === "image/jpeg" || file.type === "image/jpg") return "jpg";

  const name = file.name.toLowerCase();
  if (name.endsWith(".png")) return "png";
  if (name.endsWith(".webp")) return "webp";
  if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "jpg";
  return null;
}
